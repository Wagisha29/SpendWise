import { getCategoryMeta } from "../../categories";
import { CARD, formatAmount } from "../../lib/ui";
import type { Expense } from "../../types";

export function ExpenseTransactionRow({
  expense,
  hideAmounts,
  animationDelayMs,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  hideAmounts: boolean;
  animationDelayMs: number;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}) {
  const meta = getCategoryMeta(expense.category);

  return (
    <li
      style={{ animationDelay: `${animationDelayMs}ms` }}
      className={`${CARD} animate-fade-in-up group flex items-center gap-3.5 px-[1.1rem] py-[0.85rem] hover:translate-x-1 hover:border-rose-200 hover:shadow-md`}
    >
      <div
        className="flex h-10 w-10 min-w-10 items-center justify-center rounded-[10px] text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
        style={{ background: `${meta.color}26`, color: meta.color }}
      >
        {meta.icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="truncate font-semibold text-[#3f3b52]">{expense.title}</span>
        <span className="text-[0.8rem] text-[#8c86a3]">
          {expense.category} · {expense.date}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold whitespace-nowrap text-rose-600 tabular-nums">
          - ₹{formatAmount(expense.amount, hideAmounts)}
        </span>
        <button
          className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-amber-100 hover:text-amber-600"
          onClick={() => onEdit(expense)}
          aria-label="Edit expense"
        >
          ✎
        </button>
        <button
          className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-rose-100 hover:text-rose-500"
          onClick={() => onDelete(expense.id)}
          aria-label="Delete expense"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
