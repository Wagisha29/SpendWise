import { useEffect } from "react";

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

  return (
    <div
      className="animate-fade-in-up fixed inset-0 z-50 flex items-center justify-center bg-[#1a1730]/50 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="animate-pop-in w-full max-w-[440px] rounded-2xl border border-[#eceafb] bg-white p-6 shadow-[0_30px_70px_-20px_rgba(40,20,120,0.35)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-[#28223f]">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#a39cc0] transition-all duration-200 hover:bg-[#f4f2ff] hover:text-[#6d5fdb]"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
