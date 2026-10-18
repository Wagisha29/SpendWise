import { useEffect, useState } from "react";

/**
 * Chrome/Edge/Android fire `beforeinstallprompt` when the site meets PWA
 * install criteria (valid manifest + registered service worker). The event
 * is NOT part of the standard DOM lib yet, so we type it ourselves.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isRunningStandalone() {
  const isIosStandalone = (window.navigator as Navigator & { standalone?: boolean })
    .standalone;
  return window.matchMedia("(display-mode: standalone)").matches || isIosStandalone === true;
}

/**
 * Exposes whether the app can currently be installed, and a function to
 * trigger the native install prompt (must be called from a user gesture,
 * e.g. a button's onClick).
 *
 * Note: Safari (desktop + iOS) never fires `beforeinstallprompt` — there,
 * `canInstall` will simply stay false and users rely on
 * Share -> "Add to Home Screen" instead.
 */
export function useInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(isRunningStandalone);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      // Stop the browser's default mini-infobar so we fully control the UI.
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setInstalled(true);
      setDeferredEvent(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!deferredEvent) return;

    await deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;

    if (outcome === "accepted") {
      setInstalled(true);
    }
    // The prompt can only be used once; clear it either way.
    setDeferredEvent(null);
  }

  return {
    canInstall: deferredEvent !== null && !installed,
    promptInstall,
  };
}
