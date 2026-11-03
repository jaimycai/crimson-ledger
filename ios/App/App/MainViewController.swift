import UIKit
import Capacitor

// Eigen view controller zodat de lokale plugins (ReviewPlugin, StorePlugin, LiveActivityPlugin) bij de bridge worden aangemeld.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(ReviewPlugin())
        bridge?.registerPluginInstance(StorePlugin())
        bridge?.registerPluginInstance(LiveActivityPlugin())
    }

    // In de simulator krijgt de webview een merkje in de user agent. meting.js stuurt dan niets,
    // zodat testruns niet als nieuwe spelers meetellen. Sinds 1.6 ook op TestFlight en bij App Review: die hebben een
    // sandbox-bon (sandboxReceipt) en telden als Engelse nieuwe spelers (docs/onderzoek/EERSTE-MINUUT-EN-2026-11.md).
    override open func instanceDescriptor() -> InstanceDescriptor {
        let descriptor = super.instanceDescriptor()
        #if targetEnvironment(simulator)
        descriptor.appendedUserAgentString = [descriptor.appendedUserAgentString, "CrimsonSimulator"].compactMap { $0 }.joined(separator: " ")
        #else
        if Bundle.main.appStoreReceiptURL?.lastPathComponent == "sandboxReceipt" {
            descriptor.appendedUserAgentString = [descriptor.appendedUserAgentString, "CrimsonSandbox"].compactMap { $0 }.joined(separator: " ")
        }
        #endif
        return descriptor
    }
}
