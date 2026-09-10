import UIKit
import Capacitor

// Eigen view controller zodat de lokale plugins (ReviewPlugin) bij de bridge worden aangemeld.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(ReviewPlugin())
    }
}
