import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function SunIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Light / dark mode switch. Built on `next-themes` (localStorage
 * persistence, cross-tab sync, system-preference detection) rather than a
 * hand-rolled context. Defaults to the OS preference (`defaultTheme:
 * "system"`, set on the provider in main.tsx) until the user picks one
 * explicitly, after which that choice sticks.
 *
 * Renders nothing meaningful until mounted — `resolvedTheme` is
 * `undefined` on first render (we can't know the OS preference or stored
 * choice before the client has run), so we keep the icon slot reserved
 * but inert to avoid a flash of the wrong icon.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        className ??
        "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--bd-subtle)] bg-[var(--surf-card)] text-amber-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 dark:text-indigo-300"
      }
    >
      {mounted && (isDark ? <MoonIcon /> : <SunIcon />)}
    </button>
  );
}
