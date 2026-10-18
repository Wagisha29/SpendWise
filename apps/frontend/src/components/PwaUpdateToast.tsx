import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Registers the PWA service worker and shows a small toast when:
 *  - the app has just become available for offline use (first install), or
 *  - a new version was found and the page should reload to pick it up.
 *
 * Rendered once near the root of the app (see App.tsx).
 */
export function PwaUpdateToast() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl) {
      console.log("SpendWise service worker registered:", swUrl);
    },
    onRegisterError(error) {
      console.error("SpendWise service worker registration failed:", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm shadow-lg">
      <span className="text-[#282342]">
        {needRefresh
          ? "A new version of SpendWise is available."
          : "SpendWise is ready to work offline."}
      </span>
      {needRefresh && (
        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="rounded-lg bg-indigo-600 px-3 py-1 font-medium text-white hover:bg-indigo-700"
        >
          Reload
        </button>
      )}
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss"
        className="text-[#8b86a3] hover:text-[#282342]"
      >
        ✕
      </button>
    </div>
  );
}
