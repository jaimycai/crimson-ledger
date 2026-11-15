import Foundation
import UIKit
import Capacitor
import GameKit

// Game Center: achievements and two leaderboards, so the game shows up in Apple's Games app and with friends there.
// From JS: Capacitor.Plugins.GameCenter (see gamecenter.js). Nothing here blocks the game: every call resolves, also
// when the player is not signed in, and a player who declines Apple's sign-in sheet hears nothing more about it.
//
// authenticate({ present }) sets GameKit's authenticateHandler once. A player who is signed in to Game Center on the
// device is signed in here too, with Apple's own "welcome back" banner. Only when GameKit offers its sign-in sheet
// does `present` matter: false keeps the sheet back (the first session, while the practice case runs), true shows it
// once. GameKit calls the handler again when the sign-in state changes later (for example after the player signs in
// through Settings); that arrives in JS as the event "auth".
@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authenticate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reportAchievement", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "submitScore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showDashboard", returnType: CAPPluginReturnPromise)
    ]

    // Only the ids that exist in App Store Connect (store/gamecenter/spec.js; tests/gamecenter.test.js checks that both
    // lists match). Anything else from the web view is refused before it reaches GameKit.
    static let achievementIDs: Set<String> = [
        "crimson.first_case", "crimson.first_three_stars", "crimson.first_part",
        "crimson.world.landhuis", "crimson.world.piraten", "crimson.world.hotel", "crimson.world.ruimte", "crimson.world.museum",
        "crimson.world.trein", "crimson.world.circus", "crimson.world.skihut", "crimson.world.hacienda", "crimson.world.opera",
        "crimson.world.opgraving", "crimson.world.casino", "crimson.world.filmstudio", "crimson.world.karavaan", "crimson.world.abdij",
        "crimson.world.vuurtoren", "crimson.world.oceaanstomer", "crimson.world.ryokan", "crimson.world.fazenda", "crimson.world.zeppelin",
        "crimson.world.poolstation", "crimson.world.winterpaleis", "crimson.world.safarilodge", "crimson.world.hanok",
        "crimson.streak_3", "crimson.streak_7", "crimson.streak_30",
        "crimson.solved_10", "crimson.solved_50", "crimson.solved_100", "crimson.solved_500",
        "crimson.first_master", "crimson.case_of_week"
    ]
    // each leaderboard with the score range declared in App Store Connect: total points, and the daily case in seconds
    static let leaderboardRanges: [String: ClosedRange<Int>] = [
        "crimson.points": 0...100_000_000,
        "crimson.daily_time": 1...86_400
    ]

    private var handlerSet = false
    private var mayPresent = false
    private var signInSheet: UIViewController?
    private var waiting: [CAPPluginCall] = []

    private func state() -> [String: Any] {
        let player = GKLocalPlayer.local
        return ["authenticated": player.isAuthenticated, "canSignIn": signInSheet != nil]
    }

    private func answerWaiting() {
        let s = state(), calls = waiting
        waiting.removeAll()
        calls.forEach { $0.resolve(s) }
    }

    private func presentSheet(_ sheet: UIViewController) {
        guard let host = bridge?.viewController, host.presentedViewController == nil else { return }
        host.present(sheet, animated: true)
    }

    @objc func authenticate(_ call: CAPPluginCall) {
        let present = call.getBool("present") ?? false
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            if GKLocalPlayer.local.isAuthenticated { call.resolve(self.state()); return }
            self.waiting.append(call)
            if present { self.mayPresent = true }
            if self.handlerSet {
                // asked again (second session): show the sheet GameKit offered earlier, or answer with what is known
                if present, let sheet = self.signInSheet { self.mayPresent = false; self.presentSheet(sheet) } else { self.answerWaiting() }
                return
            }
            self.handlerSet = true
            GKLocalPlayer.local.authenticateHandler = { [weak self] sheet, _ in
                guard let self = self else { return }
                if let sheet = sheet {
                    self.signInSheet = sheet
                    if self.mayPresent {
                        // GameKit calls the handler again when the sheet closes (signed in, or cancelled)
                        self.mayPresent = false
                        self.presentSheet(sheet)
                    } else {
                        self.answerWaiting()
                    }
                    return
                }
                // signed in, or not (declined, restricted, offline): either way no message to the player
                self.signInSheet = nil
                self.answerWaiting()
                self.notifyListeners("auth", data: self.state())
            }
        }
    }

    // reportAchievement({ id, percent = 100, banner = true }). banner false: the game shows its own medal for it.
    @objc func reportAchievement(_ call: CAPPluginCall) {
        guard let id = call.getString("id"), Self.achievementIDs.contains(id) else { call.reject("onbekende prestatie"); return }
        guard GKLocalPlayer.local.isAuthenticated else { call.resolve(["ok": false, "reason": "not-authenticated"]); return }
        let achievement = GKAchievement(identifier: id)
        let percent = call.getDouble("percent") ?? 100
        achievement.percentComplete = percent.isFinite ? min(100, max(0, percent)) : 0
        achievement.showsCompletionBanner = call.getBool("banner") ?? true
        GKAchievement.report([achievement]) { error in
            if let error = error { call.resolve(["ok": false, "reason": error.localizedDescription]) } else { call.resolve(["ok": true]) }
        }
    }

    // submitScore({ leaderboardId, value }). Game Center keeps the best score per the leaderboard's own sort order.
    // A value above the range is lowered to the top of it; one below the range is refused rather than raised, because
    // raising a too-short daily time to 1 second would post the best possible time.
    @objc func submitScore(_ call: CAPPluginCall) {
        guard let id = call.getString("leaderboardId"), let range = Self.leaderboardRanges[id] else { call.reject("onbekende ranglijst"); return }
        guard let raw = call.getDouble("value"), raw.isFinite, raw >= Double(range.lowerBound) else { call.reject("score buiten bereik"); return }
        let value = Int(min(Double(range.upperBound), raw).rounded())   // clamp as a Double first: Int(1e300) would trap
        guard GKLocalPlayer.local.isAuthenticated else { call.resolve(["ok": false, "reason": "not-authenticated"]); return }
        GKLeaderboard.submitScore(value, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [id]) { error in
            if let error = error { call.resolve(["ok": false, "reason": error.localizedDescription]) } else { call.resolve(["ok": true]) }
        }
    }

    // The Game Center dashboard (achievements, leaderboards, friends) over the game; the Settings row opens it.
    @objc func showDashboard(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard GKLocalPlayer.local.isAuthenticated else { call.resolve(["shown": false]); return }
            GKAccessPoint.shared.trigger(state: .dashboard) {}
            call.resolve(["shown": true])
        }
    }
}
