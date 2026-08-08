import { useEffect, useRef, useState } from "react";

export const CARD =
  "bg-white border border-[#eceafb] rounded-2xl shadow-[0_2px_10px_-4px_rgba(76,60,180,0.08)] transition-all duration-300";

export const AMOUNT_MASK = "•••••";

export function formatAmount(amount: number, hideAmounts: boolean): string {
  return hideAmounts ? AMOUNT_MASK : amount.toFixed(2);
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
