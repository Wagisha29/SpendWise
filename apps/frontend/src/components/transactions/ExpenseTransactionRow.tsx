import { getCategoryMeta } from "../../categories";
import { STRINGS } from "../../constants/strings";
import { formatAmount } from "../../lib/ui";
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
    <tr
      style={{ animationDelay: `${animationDelayMs}ms` }}
      className="animate-fade-in-up group border-b border-[#f3f1fa] text-sm last:border-b-0 hover:bg-rose-50/40"
    >
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 min-w-7 items-center justify-center rounded-[8px] text-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ background: `${meta.color}26`, color: meta.color }}
          >
            {meta.icon}
          </span>
          <span className="truncate font-semibold text-[#3f3b52]">{expense.title}</span>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <span
          className="inline-block rounded-full px-2 py-0.5 text-[0.75rem] font-medium"
          style={{ background: `${meta.color}26`, color: meta.color }}
        >
          {expense.category}
        </span>
      </td>
      <td className="px-4 py-2.5 whitespace-nowrap text-[#8c86a3]">{expense.date}</td>
      <td className="px-4 py-2.5 text-right">
        <span className="font-bold whitespace-nowrap text-rose-600 tabular-nums">
          - ₹{formatAmount(expense.amount, hideAmounts)}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-amber-100 hover:text-amber-600"
            onClick={() => onEdit(expense)}
            aria-label={STRINGS.transactions.editExpense}
          >
            ✎
          </button>
          <button
            className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-rose-100 hover:text-rose-500"
            onClick={() => onDelete(expense.id)}
            aria-label={STRINGS.transactions.deleteExpense}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}
