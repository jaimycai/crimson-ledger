package nl.crimsonledger.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;

/** Asks for a Play Store rating with Google's in-app review flow. Google decides whether the sheet shows. */
@CapacitorPlugin(name = "InAppReview")
public class ReviewPlugin extends Plugin {
    @PluginMethod
    public void requestReview(PluginCall call) {
        ReviewManager manager = ReviewManagerFactory.create(getContext());
        manager.requestReviewFlow().addOnCompleteListener(task -> {
            if (!task.isSuccessful()) { call.resolve(); return; }
            manager.launchReviewFlow(getActivity(), task.getResult()).addOnCompleteListener(done -> call.resolve());
        });
    }
}
