import { STRINGS } from "../../constants/strings";
import { formatAmount } from "../../lib/ui";
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
    <tr
      style={{ animationDelay: `${animationDelayMs}ms` }}
      className="animate-fade-in-up group border-b border-[#f3f1fa] text-sm last:border-b-0 hover:bg-emerald-50/40"
    >
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 min-w-7 items-center justify-center rounded-[8px] bg-emerald-100 text-sm text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            💰
          </span>
          <span className="truncate font-semibold text-[#3f3b52]">{entry.source}</span>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[0.75rem] font-medium text-emerald-600">
          {STRINGS.transactions.incomeBadge}
        </span>
      </td>
      <td className="px-4 py-2.5 whitespace-nowrap text-[#8c86a3]">{entry.date}</td>
      <td className="px-4 py-2.5 text-right">
        <span className="font-bold whitespace-nowrap text-emerald-600 tabular-nums">
          + ₹{formatAmount(entry.amount, hideAmounts)}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center justify-end gap-1.5">
          <button
            className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-emerald-100 hover:text-emerald-600"
            onClick={() => onEdit(entry)}
            aria-label={STRINGS.transactions.editIncome}
          >
            ✎
          </button>
          <button
            className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-rose-100 hover:text-rose-500"
            onClick={() => onDelete(entry.id)}
            aria-label={STRINGS.transactions.deleteIncome}
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}
