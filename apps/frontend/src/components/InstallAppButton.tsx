import { STRINGS } from "../constants/strings";
import { useInstallPrompt } from "../lib/useInstallPrompt";

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Renders nothing until the browser has decided this site is installable
 * (see `useInstallPrompt`). Clicking it triggers the native "Install app?"
 * confirmation — we can't skip that dialog, only trigger it on demand.
 */
export function InstallAppButton({
  className,
  iconOnly = false,
}: {
  className?: string;
  /** Renders just the icon (for compact mobile headers) with an a11y label instead of visible text. */
  iconOnly?: boolean;
}) {
  const { canInstall, promptInstall } = useInstallPrompt();

  if (!canInstall) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={promptInstall}
      title={STRINGS.install.title}
      aria-label={iconOnly ? STRINGS.install.title : undefined}
      className={
        className ??
        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-[0.8rem] font-semibold text-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-md active:translate-y-0 dark:border-indigo-800/60 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25"
      }
    >
      <DownloadIcon />
      {!iconOnly && STRINGS.install.cta}
    </button>
  );
}
