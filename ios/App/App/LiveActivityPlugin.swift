import Foundation
import UIKit
import Capacitor
import ActivityKit

// Live Activity for an open case (1.6, "Dynamic Island: dossier open"). From JS: Capacitor.Plugins.LiveActivity
// (see App.liveCase in app.js). Fully local: no push, no server. The clock is a Text(timerInterval:) in the widget
// extension that runs by itself, so the app only sends something when a case starts, when a suspect is placed or
// removed, and when the case ends.
//
// ActivityKit only starts an activity while the app is in the foreground, so it is requested when the case starts.
// iOS does not show an app's own activity in the Dynamic Island while that app is open: the player sees it once the
// app goes to the background or the screen locks. If that never happened during the case, the activity ends without
// a final state, so a case solved in one sitting does not leave a "Zaak gesloten" card behind.
// The extension needs iOS 16.1; the calls here need iOS 16.2 (ActivityContent). The app itself stays on iOS 15.
@objc(LiveActivityPlugin)
public class LiveActivityPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "LiveActivityPlugin"
    public let jsName = "LiveActivity"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "end", returnType: CAPPluginReturnPromise)
    ]

    static let maxLifetime: TimeInterval = 8 * 3600        // Apple: at most 8 hours active
    static let closedLingers: TimeInterval = 20 * 60       // Apple: 15 to 30 minutes after the end

    private var seen = false   // the app was in the background while the current case was open

    override public func load() {
        NotificationCenter.default.addObserver(self, selector: #selector(didEnterBackground),
                                               name: UIApplication.didEnterBackgroundNotification, object: nil)
        // A fresh start of the app opens on the menu, never inside a case: an activity left over from a session that
        // iOS or the player closed would keep a clock running for nothing.
        if #available(iOS 16.2, *) {
            Task { await Self.endAll(.immediate) }
        }
    }

    deinit { NotificationCenter.default.removeObserver(self) }

    @objc private func didEnterBackground() {
        if #available(iOS 16.2, *), !Activity<CaseActivityAttributes>.activities.isEmpty { seen = true }
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        if #available(iOS 16.2, *) {
            call.resolve(["available": true, "enabled": ActivityAuthorizationInfo().areActivitiesEnabled])
        } else {
            call.resolve(["available": false, "enabled": false])
        }
    }

    @objc func start(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else { call.resolve(["started": false, "reason": "ios"]); return }
        guard ActivityAuthorizationInfo().areActivitiesEnabled else { call.resolve(["started": false, "reason": "disabled"]); return }
        guard let id = call.getString("id"), !id.isEmpty else { call.reject("id ontbreekt"); return }
        let attributes = CaseActivityAttributes(
            caseId: id, kind: call.getString("kind") ?? "campaign", label: call.getString("label") ?? "",
            title: call.getString("title") ?? "", world: call.getString("world") ?? "", icon: call.getString("icon") ?? "",
            tapText: call.getString("tapText") ?? "", closedText: call.getString("closedText") ?? "")
        let state = Self.state(from: call, base: nil)
        Task { @MainActor in
            await Self.endAll(.immediate)   // one case at a time
            do {
                _ = try Activity.request(attributes: attributes, content: Self.content(state), pushType: nil)
                self.seen = UIApplication.shared.applicationState == .background
                call.resolve(["started": true])
            } catch {
                call.resolve(["started": false, "reason": error.localizedDescription])
            }
        }
    }

    // A suspect placed or removed, or the clock restarted after the briefing: no alert, the island stays as it is.
    @objc func update(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *), let activity = Activity<CaseActivityAttributes>.activities.last else {
            call.resolve(["updated": false]); return
        }
        let state = Self.state(from: call, base: activity.content.state)
        Task {
            await activity.update(Self.content(state))
            call.resolve(["updated": true])
        }
    }

    // solved: true shows "Zaak gesloten" with the time for 20 minutes (only if the player saw the activity);
    // otherwise (leaving the case, the setting turned off) it disappears at once.
    @objc func end(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else { call.resolve(["ended": false]); return }
        let solved = call.getBool("solved") ?? false
        let showFinal = solved && seen
        seen = false
        Task {
            for activity in Activity<CaseActivityAttributes>.activities {
                if showFinal {
                    var final = activity.content.state
                    final.phase = .closed
                    final.placed = final.total
                    final.timeText = call.getString("timeText") ?? ""
                    final.resultText = call.getString("resultText") ?? ""
                    await activity.end(ActivityContent(state: final, staleDate: nil),
                                       dismissalPolicy: .after(Date().addingTimeInterval(Self.closedLingers)))
                } else {
                    await activity.end(nil, dismissalPolicy: .immediate)
                }
            }
            call.resolve(["ended": true, "final": showFinal])
        }
    }

    @available(iOS 16.2, *)
    private static func endAll(_ policy: ActivityUIDismissalPolicy) async {
        for activity in Activity<CaseActivityAttributes>.activities { await activity.end(nil, dismissalPolicy: policy) }
    }

    @available(iOS 16.2, *)
    private static func content(_ state: CaseActivityAttributes.ContentState) -> ActivityContent<CaseActivityAttributes.ContentState> {
        ActivityContent(state: state, staleDate: Date().addingTimeInterval(maxLifetime))
    }

    // Reads the changing part from JS; what JS leaves out keeps its current value.
    @available(iOS 16.2, *)
    private static func state(from call: CAPPluginCall, base: CaseActivityAttributes.ContentState?) -> CaseActivityAttributes.ContentState {
        var s = base ?? CaseActivityAttributes.ContentState(phase: .open, placed: 0, total: 0, progressText: "",
                                                            startedAt: Date(), showClock: true, timeText: "", resultText: "")
        if let v = call.getInt("placed") { s.placed = max(0, v) }
        if let v = call.getInt("total") { s.total = max(0, v) }
        if let v = call.getString("progressText") { s.progressText = v }
        if let v = call.getDouble("startedAt"), v > 0 { s.startedAt = Date(timeIntervalSince1970: v / 1000) }
        if let v = call.getBool("showClock") { s.showClock = v }
        return s
    }
}
