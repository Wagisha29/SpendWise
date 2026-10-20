import { getCategoryMeta } from "../../categories";
import { STRINGS } from "../../constants/strings";
import { CARD, formatAmount } from "../../lib/ui";
import type { Expense } from "../../types";

/** Compact card row used on mobile instead of the desktop table. */
export function ExpenseTransactionCard({
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
      className={`${CARD} animate-fade-in-up flex items-center gap-3 p-3`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base"
        style={{ background: `${meta.color}26`, color: meta.color }}
        aria-hidden="true"
      >
        {meta.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate text-sm font-semibold text-[var(--tx-strong)]">{expense.title}</p>
        <p className="m-0 mt-0.5 truncate text-[0.72rem] text-[var(--tx-muted)]">
          {expense.category} · {expense.date}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-bold whitespace-nowrap text-rose-600 tabular-nums">
          - ₹{formatAmount(expense.amount, hideAmounts)}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="cursor-pointer rounded-md border-none bg-transparent p-1 text-sm leading-none text-[var(--tx-muted)] transition-all duration-200 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-500/15 dark:hover:text-amber-300"
            onClick={() => onEdit(expense)}
            aria-label={STRINGS.transactions.editExpense}
          >
            ✎
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md border-none bg-transparent p-1 text-sm leading-none text-[var(--tx-muted)] transition-all duration-200 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
            onClick={() => onDelete(expense.id)}
            aria-label={STRINGS.transactions.deleteExpense}
          >
            ✕
          </button>
        </div>
      </div>
    </li>
  );
}
