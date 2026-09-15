import Foundation
import Capacitor
import StoreKit

// In-app-aankopen via StoreKit 2 (iOS 15+): Crimson Pass, hintpakket,
// wereldpakketten en bordthema's. Vanuit JS: Capacitor.Plugins.Store
// (zie store.js). Geen eigen server: Apple bewaart de aankopen en
// Transaction.currentEntitlements geeft ze terug, ook na herinstallatie.
@objc(StorePlugin)
public class StorePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StorePlugin"
    public let jsName = "Store"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "products", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "entitlements", returnType: CAPPluginReturnPromise)
    ]

    // Prijzen en namen van de producten, zoals ze in App Store Connect staan.
    @objc func products(_ call: CAPPluginCall) {
        let ids = call.getArray("ids", String.self) ?? []
        Task {
            do {
                let products = try await Product.products(for: ids)
                let list: [[String: Any]] = products.map { p in
                    ["id": p.id, "title": p.displayName, "description": p.description, "price": p.displayPrice,
                     "type": p.type == .consumable ? "consumable" : "nonconsumable"]
                }
                call.resolve(["products": list])
            } catch {
                call.reject("products: \(error.localizedDescription)")
            }
        }
    }

    // Eén aankoop. Geeft state: purchased | cancelled | pending.
    @objc func purchase(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else { call.reject("id ontbreekt"); return }
        Task {
            do {
                guard let product = try await Product.products(for: [id]).first else {
                    call.reject("product niet gevonden: \(id)"); return
                }
                let result = try await product.purchase()
                switch result {
                case .success(let verification):
                    switch verification {
                    case .verified(let tx):
                        await tx.finish()
                        call.resolve(["state": "purchased", "id": tx.productID])
                    case .unverified(_, let err):
                        call.reject("niet geverifieerd: \(err.localizedDescription)")
                    }
                case .userCancelled:
                    call.resolve(["state": "cancelled", "id": id])
                case .pending:
                    call.resolve(["state": "pending", "id": id])
                @unknown default:
                    call.resolve(["state": "unknown", "id": id])
                }
            } catch {
                call.reject("purchase: \(error.localizedDescription)")
            }
        }
    }

    // Aankopen herstellen (na een nieuw toestel of herinstallatie).
    @objc func restore(_ call: CAPPluginCall) {
        Task {
            do { try await AppStore.sync() } catch { /* zonder verbinding: dan de lokale lijst */ }
            call.resolve(["ids": await self.currentEntitlements()])
        }
    }

    // Wat er nu geldig is (niet-verbruikbare aankopen; hintpakketten zijn verbruikt bij aankoop).
    @objc func entitlements(_ call: CAPPluginCall) {
        Task { call.resolve(["ids": await self.currentEntitlements()]) }
    }

    private func currentEntitlements() async -> [String] {
        var ids: [String] = []
        for await result in Transaction.currentEntitlements {
            if case .verified(let tx) = result, tx.revocationDate == nil { ids.append(tx.productID) }
        }
        return ids
    }
}
