import UIKit
import Capacitor

// UIScene-levenscyclus. Apps die met de iOS 27 SDK zijn gebouwd, starten op iOS 27 niet zonder
// (crash in _UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption, App Review 1.1 (6)).
// Het venster komt uit Main.storyboard via UISceneStoryboardFile in Info.plist.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        if let url = connectionOptions.urlContexts.first?.url {
            _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: url, options: [:])
        }
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        for context in URLContexts {
            _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: context.url, options: [:])
        }
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
    }
}
