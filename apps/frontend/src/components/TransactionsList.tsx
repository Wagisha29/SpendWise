import { getCategoryMeta } from "../categories";
import { CARD, formatAmount } from "../lib/ui";
import type { Expense, Income, Transaction } from "../types";

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  hideAmounts: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onEditIncome: (entry: Income) => void;
  onDeleteIncome: (id: number) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export function TransactionsList({
  transactions,
  loading,
  hideAmounts,
  page,
  totalPages,
  total,
  onPageChange,
  onEditIncome,
  onDeleteIncome,
  onEditExpense,
  onDeleteExpense,
}: TransactionsListProps) {
  if (loading) {
    return (
      <div className="flex min-h-32 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#ece9f4] border-t-indigo-400" />
      </div>
    );
  }

  if (transactions.length === 0 && total === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#8c86a3]`}>
        <div className="text-[2.25rem]">🧾</div>
        <p>No transactions yet. Add income or an expense above.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {transactions.map((item, index) => {
          if (item.kind === "income") {
            const entry = item.data;
            return (
              <li
                key={`income-${entry.id}`}
                style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
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
                    onClick={() => onEditIncome(entry)}
                    aria-label="Edit income"
                  >
                    ✎
                  </button>
                  <button
                    className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-rose-100 hover:text-rose-500"
                    onClick={() => onDeleteIncome(entry.id)}
                    aria-label="Delete income"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          }

          const expense = item.data;
          const meta = getCategoryMeta(expense.category);
          return (
            <li
              key={`expense-${expense.id}`}
              style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
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
                  onClick={() => onEditExpense(expense)}
                  aria-label="Edit expense"
                >
                  ✎
                </button>
                <button
                  className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition-all duration-200 hover:scale-110 hover:bg-rose-100 hover:text-rose-500"
                  onClick={() => onDeleteExpense(expense.id)}
                  aria-label="Delete expense"
                >
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="cursor-pointer rounded-full border border-[#ece9f4] bg-white px-4 py-1.5 text-sm font-medium text-[#6b6485] transition-all duration-200 hover:border-indigo-200 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm font-medium text-[#8c86a3] tabular-nums">
            Page {page} of {totalPages}
            <span className="text-[#b0a9c4]"> · {total} expenses</span>
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="cursor-pointer rounded-full border border-[#ece9f4] bg-white px-4 py-1.5 text-sm font-medium text-[#6b6485] transition-all duration-200 hover:border-indigo-200 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
