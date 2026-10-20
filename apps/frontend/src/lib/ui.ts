import { useEffect, useRef, useState } from "react";

export const CARD =
  "bg-[var(--surf-card)] border border-[var(--bd-subtle)] rounded-2xl shadow-[0_2px_10px_-4px_rgba(76,60,180,0.08)] dark:shadow-[0_2px_10px_-4px_rgba(0,0,0,0.4)] transition-all duration-300";

export const AMOUNT_MASK = "•••••";

/**
 * Point-in-time check for whether we're on a small (mobile) viewport,
 * matching Tailwind's `sm` breakpoint (640px). Used for one-off decisions
 * made inside event handlers (e.g. "should this edit action open the
 * mobile bottom-sheet or scroll to the inline desktop form?") rather than
 * reactive rendering, so a plain matchMedia check is enough — no resize
 * listener needed.
 */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 639px)").matches;
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats amounts with Indian grouping, e.g. 33000 → 33,000.00 */
export function formatAmount(amount: number, hideAmounts: boolean): string {
  return hideAmounts ? AMOUNT_MASK : inrFormatter.format(amount);
}

export function useCountUp(target: number, durationMs = 700): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return;

    const start = performance.now();
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutQuint(progress);
      setValue(from + (to - from) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}
