import UIKit
import Capacitor

// Eigen view controller zodat de lokale plugins (ReviewPlugin, StorePlugin) bij de bridge worden aangemeld.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(ReviewPlugin())
        bridge?.registerPluginInstance(StorePlugin())
    }

    // In de simulator krijgt de webview een merkje in de user agent. meting.js stuurt dan niets,
    // zodat testruns niet als nieuwe spelers meetellen.
    override open func instanceDescriptor() -> InstanceDescriptor {
        let descriptor = super.instanceDescriptor()
        #if targetEnvironment(simulator)
        descriptor.appendedUserAgentString = [descriptor.appendedUserAgentString, "CrimsonSimulator"].compactMap { $0 }.joined(separator: " ")
        #endif
        return descriptor
    }
}
