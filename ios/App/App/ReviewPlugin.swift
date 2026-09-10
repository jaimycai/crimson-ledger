import Foundation
import Capacitor
import StoreKit

// Vraagt om een App Store-beoordeling via SKStoreReviewController. Apple bepaalt zelf
// of en wanneer het venster verschijnt (hooguit drie keer per jaar). Vanuit JS:
// Capacitor.Plugins.InAppReview.requestReview() (zie App.maybeAskReview).
@objc(ReviewPlugin)
public class ReviewPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ReviewPlugin"
    public let jsName = "InAppReview"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestReview", returnType: CAPPluginReturnPromise)
    ]

    @objc func requestReview(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if let scene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene {
                SKStoreReviewController.requestReview(in: scene)
            }
            call.resolve()
        }
    }
}
