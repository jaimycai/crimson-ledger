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

    private var updates: Task<Void, Never>?
    private var intents: Task<Void, Never>?

    // Aankopen die buiten purchase() om binnenkomen: een ingewisselde aanbiedingscode, Vragen om te kopen,
    // een aankoop op een ander toestel. Apple levert ze via Transaction.updates; zonder deze luisteraar bleven
    // ze onafgemaakt en zag de app een ingewisselde Pass pas na opnieuw openen. Meldt "transaction" aan store.js.
    override public func load() {
        updates = Task { [weak self] in
            for await result in Transaction.updates {
                guard case .verified(let tx) = result else { continue }
                await tx.finish()
                guard let self = self else { return }
                let ids = await self.currentEntitlements()
                self.notifyListeners("transaction", data: ["id": tx.productID, "revoked": tx.revocationDate != nil, "ids": ids])
            }
        }
        // 1.6: a purchase started on the App Store product page (the promoted Crimson Pass) arrives as a PurchaseIntent;
        // buy it here and report it the same way, so the app unlocks the Pass without a restart.
        if #available(iOS 16.4, *) {
            intents = Task { [weak self] in
                for await intent in PurchaseIntent.intents {
                    guard let self = self else { return }
                    if let r = try? await intent.product.purchase(), case .success(.verified(let tx)) = r {
                        await tx.finish()
                        let ids = await self.currentEntitlements()
                        self.notifyListeners("transaction", data: ["id": tx.productID, "revoked": false, "ids": ids])
                    }
                }
            }
        }
    }

    deinit { updates?.cancel(); intents?.cancel() }

    // Prijzen en namen van de producten, zoals ze in App Store Connect staan.
    @objc func products(_ call: CAPPluginCall) {
        let ids = call.getArray("ids", String.self) ?? []
        Task {
            do {
                let products = try await Product.products(for: ids)
                // value/currency/locale (1.6): the price as a number, so the shop can add up the separate worlds
                // ("22 werelden los") in the same format as displayPrice
                let list: [[String: Any]] = products.map { p in
                    ["id": p.id, "title": p.displayName, "description": p.description, "price": p.displayPrice,
                     "value": NSDecimalNumber(decimal: p.price).doubleValue,
                     "currency": p.priceFormatStyle.currencyCode,
                     "locale": p.priceFormatStyle.locale.identifier,
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
