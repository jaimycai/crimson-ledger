package nl.crimsonledger.app;

import androidx.annotation.NonNull;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.List;

/**
 * In-app purchases through Google Play Billing. Same JavaScript surface as the
 * iOS StorePlugin (see store.js): products, purchase, restore, entitlements.
 * No server of our own: Google keeps the purchases and returns them on request.
 */
@CapacitorPlugin(name = "Store")
public class StorePlugin extends Plugin implements PurchasesUpdatedListener {

    private static final String CONSUMABLE_SUFFIX = ".hints10";

    private BillingClient client;
    private PluginCall pendingPurchase;

    @Override
    public void load() {
        client = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .build();
    }

    /** Runs the task once the billing connection is ready; rejects the call otherwise. */
    private void whenReady(PluginCall call, Runnable task) {
        if (client.isReady()) { task.run(); return; }
        client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(@NonNull BillingResult result) {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) task.run();
                else call.reject("billing: " + result.getDebugMessage());
            }
            @Override public void onBillingServiceDisconnected() { /* reconnects on the next call */ }
        });
    }

    private void queryDetails(List<String> ids, PluginCall call, DetailsCallback done) {
        List<QueryProductDetailsParams.Product> wanted = new ArrayList<>();
        for (String id : ids) {
            wanted.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(id).setProductType(BillingClient.ProductType.INAPP).build());
        }
        if (wanted.isEmpty()) { done.onDetails(new ArrayList<>()); return; }
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder().setProductList(wanted).build();
        client.queryProductDetailsAsync(params, (result, details) -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject("products: " + result.getDebugMessage());
                return;
            }
            done.onDetails(details);
        });
    }

    private interface DetailsCallback { void onDetails(List<ProductDetails> details); }

    /** Prices and names as configured in Play Console. */
    @PluginMethod
    public void products(PluginCall call) {
        List<String> ids = new ArrayList<>();
        JSArray array = call.getArray("ids", new JSArray());
        try { for (Object o : array.toList()) ids.add(String.valueOf(o)); } catch (Exception e) { /* empty list */ }
        whenReady(call, () -> queryDetails(ids, call, details -> {
            JSArray list = new JSArray();
            for (ProductDetails p : details) {
                ProductDetails.OneTimePurchaseOfferDetails offer = p.getOneTimePurchaseOfferDetails();
                JSObject o = new JSObject();
                o.put("id", p.getProductId());
                o.put("title", p.getName());
                o.put("description", p.getDescription());
                o.put("price", offer != null ? offer.getFormattedPrice() : "");
                o.put("type", p.getProductId().endsWith(CONSUMABLE_SUFFIX) ? "consumable" : "nonconsumable");
                list.put(o);
            }
            JSObject out = new JSObject();
            out.put("products", list);
            call.resolve(out);
        }));
    }

    /** One purchase. Resolves with state: purchased | cancelled | pending. */
    @PluginMethod
    public void purchase(PluginCall call) {
        String id = call.getString("id");
        if (id == null) { call.reject("id ontbreekt"); return; }
        List<String> ids = new ArrayList<>();
        ids.add(id);
        whenReady(call, () -> queryDetails(ids, call, details -> {
            if (details.isEmpty()) { call.reject("product niet gevonden: " + id); return; }
            List<BillingFlowParams.ProductDetailsParams> items = new ArrayList<>();
            items.add(BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(details.get(0)).build());
            pendingPurchase = call;
            BillingResult started = client.launchBillingFlow(getActivity(),
                BillingFlowParams.newBuilder().setProductDetailsParamsList(items).build());
            if (started.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                pendingPurchase = null;
                call.reject("purchase: " + started.getDebugMessage());
            }
        }));
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult result, List<Purchase> purchases) {
        PluginCall call = pendingPurchase;
        pendingPurchase = null;
        if (call == null) return;
        String id = call.getString("id");
        int code = result.getResponseCode();
        if (code == BillingClient.BillingResponseCode.USER_CANCELED) { resolveState(call, "cancelled", id); return; }
        if (code != BillingClient.BillingResponseCode.OK || purchases == null) { call.reject("purchase: " + result.getDebugMessage()); return; }
        for (Purchase p : purchases) {
            if (!p.getProducts().contains(id)) continue;
            if (p.getPurchaseState() == Purchase.PurchaseState.PENDING) { resolveState(call, "pending", id); return; }
            if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) { finish(p, id, () -> resolveState(call, "purchased", id)); return; }
        }
        resolveState(call, "unknown", id);
    }

    /** Consumables are consumed so they can be bought again; the rest is acknowledged. */
    private void finish(Purchase p, String id, Runnable done) {
        if (id.endsWith(CONSUMABLE_SUFFIX)) {
            client.consumeAsync(ConsumeParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build(), (r, token) -> done.run());
        } else if (!p.isAcknowledged()) {
            client.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build(), r -> done.run());
        } else {
            done.run();
        }
    }

    private void resolveState(PluginCall call, String state, String id) {
        JSObject out = new JSObject();
        out.put("state", state);
        out.put("id", id);
        call.resolve(out);
    }

    /** Restore after a new phone or a reinstall: on Play this is the same query. */
    @PluginMethod
    public void restore(PluginCall call) { entitlements(call); }

    /** What is valid now (non-consumables; hint packs are consumed at purchase). */
    @PluginMethod
    public void entitlements(PluginCall call) {
        whenReady(call, () -> client.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
            (result, purchases) -> {
                JSArray ids = new JSArray();
                for (Purchase p : purchases) {
                    if (p.getPurchaseState() != Purchase.PurchaseState.PURCHASED) continue;
                    for (String id : p.getProducts()) {
                        if (id.endsWith(CONSUMABLE_SUFFIX)) { finish(p, id, () -> { }); continue; }
                        if (!p.isAcknowledged()) finish(p, id, () -> { });
                        ids.put(id);
                    }
                }
                JSObject out = new JSObject();
                out.put("ids", ids);
                call.resolve(out);
            }));
    }
}
