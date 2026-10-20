import { useEffect } from "react";
import { createPortal } from "react-dom";
import { STRINGS } from "../constants/strings";

export function Modal({
  open,
  onClose,
  title,
  accent = "indigo",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  accent?: "indigo" | "rose" | "emerald";
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const dot = {
    indigo: "bg-indigo-400",
    rose: "bg-rose-400",
    emerald: "bg-emerald-400",
  }[accent];

  return createPortal(
    <div
      className="animate-fade-in-up fixed inset-0 z-50 flex items-end justify-center bg-[var(--overlay)] backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="animate-sheet-in pb-safe w-full max-w-[440px] rounded-t-2xl border border-[var(--bd-subtle)] bg-[var(--surf-card)] p-6 shadow-[0_30px_70px_-20px_rgba(40,20,120,0.35)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] sm:rounded-2xl sm:pb-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[var(--bd-subtle)] sm:hidden" aria-hidden="true" />
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-[var(--tx-strong)]">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={STRINGS.common.close}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--tx-muted)] transition-all duration-200 hover:bg-[var(--surf-tint)] hover:text-[var(--accent-tx)]"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
