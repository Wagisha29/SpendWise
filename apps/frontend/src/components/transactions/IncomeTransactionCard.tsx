import { CARD, formatAmount } from "../../lib/ui";
import type { Income } from "../../types";

/** Compact card row used on mobile instead of the desktop table. */
export function IncomeTransactionCard({
  entry,
  hideAmounts,
  animationDelayMs,
  onEdit,
  onDelete,
}: {
  entry: Income;
  hideAmounts: boolean;
  animationDelayMs: number;
  onEdit: (entry: Income) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <li
      style={{ animationDelay: `${animationDelayMs}ms` }}
      className={`${CARD} animate-fade-in-up flex items-center gap-3 p-3`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-base text-emerald-600"
        aria-hidden="true"
      >
        💰
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate text-sm font-semibold text-[#3f3b52]">{entry.source}</p>
        <p className="m-0 mt-0.5 truncate text-[0.72rem] text-[#8c86a3]">Income · {entry.date}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-bold whitespace-nowrap text-emerald-600 tabular-nums">
          + ₹{formatAmount(entry.amount, hideAmounts)}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="cursor-pointer rounded-md border-none bg-transparent p-1 text-sm leading-none text-[#a39cc0] transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-600"
            onClick={() => onEdit(entry)}
            aria-label="Edit income"
          >
            ✎
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md border-none bg-transparent p-1 text-sm leading-none text-[#a39cc0] transition-all duration-200 hover:bg-rose-100 hover:text-rose-500"
            onClick={() => onDelete(entry.id)}
            aria-label="Delete income"
          >
            ✕
          </button>
        </div>
      </div>
    </li>
  );
}
