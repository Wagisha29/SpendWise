const KEEP_ALIVE_MS = 14 * 60 * 1000; // under Render's ~15 min idle sleep

/**
 * Pings GET /api/health on an interval so a free Render web service
 * does not spin down from inactivity while this tab is open.
 */
export function startApiKeepAlive(): () => void {
  const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  const healthUrl = `${baseUrl.replace(/\/$/, "")}/api/health`;

  const ping = () => {
    void fetch(healthUrl, { method: "GET", cache: "no-store" }).catch(() => {
      // Ignore network errors — next interval will retry.
    });
  };

  ping();
  const timerId = window.setInterval(ping, KEEP_ALIVE_MS);

  return () => {
    window.clearInterval(timerId);
  };
}
