import { CARD, formatAmount } from "../../lib/ui";
import type { Income } from "../../types";

export function IncomeTransactionRow({
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
      className={`${CARD} animate-fade-in-up group flex items-center gap-3.5 px-[1.1rem] py-[0.85rem] hover:translate-x-1 hover:border-emerald-200 hover:shadow-md`}
    >
      <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-[10px] bg-emerald-100 text-lg text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        💰
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="truncate font-semibold text-[#3f3b52]">{entry.source}</span>
        <span className="text-[0.8rem] text-[#8c86a3]">Income · {entry.date}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold whitespace-nowrap text-emerald-600 tabular-nums">
          + ₹{formatAmount(entry.amount, hideAmounts)}
        </span>
        <button
          className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-emerald-100 hover:text-emerald-600"
          onClick={() => onEdit(entry)}
          aria-label="Edit income"
        >
          ✎
        </button>
        <button
          className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-rose-100 hover:text-rose-500"
          onClick={() => onDelete(entry.id)}
          aria-label="Delete income"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
