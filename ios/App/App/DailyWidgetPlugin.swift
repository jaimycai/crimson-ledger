import Foundation
import UIKit
import Capacitor
import WidgetKit

// The app's side of the widget "Zaak van vandaag" (ios/App/CrimsonLiveActivity/DailyCaseWidget.swift):
//
// 1. A tap on the widget opens crimsonledger://daily (CFBundleURLTypes in Info.plist). SceneDelegate hands every URL to
//    ApplicationDelegateProxy; this plugin passes ours to the game as the event "open" (App.bindWidget in app.js). The
//    event is kept until the game listens, so a cold start from the widget opens the daily case as well: then the URL
//    arrived before the bridge existed and only ApplicationDelegateProxy.lastURL still has it.
// 2. The streak, whether today's case is solved, and the language picked in the app go to the widget through the
//    shared keychain item (WidgetSharedState). The game already mirrors every crimson-* key into Capacitor Preferences
//    (App.storageSet → UserDefaults "CapacitorStorage.<key>"), so this reads them natively and the JavaScript needs no
//    extra call. Written when the app starts and whenever it leaves the foreground; the widget is asked to reload only
//    when something changed (reloads from an app in the foreground do not count against the widget's budget).
@objc(DailyWidgetPlugin)
public class DailyWidgetPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "DailyWidgetPlugin"
    public let jsName = "DailyWidget"
    public let pluginMethods: [CAPPluginMethod] = []   // only the event "open" (addListener comes with every plugin)

    override public func load() {
        let center = NotificationCenter.default
        center.addObserver(self, selector: #selector(didOpenURL(_:)), name: .capacitorOpenURL, object: nil)
        center.addObserver(self, selector: #selector(sync), name: UIApplication.willResignActiveNotification, object: nil)
        center.addObserver(self, selector: #selector(sync), name: UIApplication.didEnterBackgroundNotification, object: nil)
        if let url = ApplicationDelegateProxy.shared.lastURL { open(url) }
        sync()
    }

    deinit { NotificationCenter.default.removeObserver(self) }

    @objc private func didOpenURL(_ note: Notification) {
        guard let object = note.object as? [String: Any], let url = object["url"] as? URL else { return }
        open(url)
    }

    private func open(_ url: URL) {
        let ours = WidgetSharedState.openURL
        guard url.scheme == ours.scheme, url.host == ours.host else { return }
        notifyListeners("open", data: ["route": "daily"], retainUntilConsumed: true)
    }

    @objc private func sync() {
        let state = Self.currentState()
        if state == WidgetSharedState.read() { return }
        if state.write() { WidgetCenter.shared.reloadTimelines(ofKind: WidgetSharedState.widgetKind) }
    }

    // The values the game wrote with App.storageSet: crimson-streak ({"count":12,"lastDate":"Sun Nov 15 2026"}),
    // crimson-freezes ("1"), crimson-board-daily-done ("Sun Nov 15 2026") and crimson-lang ("de").
    static func currentState(_ defaults: UserDefaults = .standard) -> WidgetSharedState {
        let get = { (key: String) in defaults.string(forKey: "CapacitorStorage." + key) }
        var state = WidgetSharedState()
        if let json = get("crimson-streak")?.data(using: .utf8),
           let streak = (try? JSONSerialization.jsonObject(with: json)) as? [String: Any] {
            state.streak = max(0, (streak["count"] as? NSNumber)?.intValue ?? 0)
            state.last = DayKey.fromJS(streak["lastDate"] as? String)
        }
        state.freezes = max(0, Int(get("crimson-freezes") ?? "") ?? 0)
        state.done = DayKey.fromJS(get("crimson-board-daily-done"))
        state.lang = get("crimson-lang")
        return state
    }
}
