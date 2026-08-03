import { useState } from "react";

import { getCategoryMeta } from "../categories";
import { CARD } from "../lib/ui";
import type { Expense, Income, Transaction } from "../types";

const COLLAPSED_COUNT = 3;

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  onEditIncome: (entry: Income) => void;
  onDeleteIncome: (id: number) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export function TransactionsList({
  transactions,
  loading,
  onEditIncome,
  onDeleteIncome,
  onEditExpense,
  onDeleteExpense,
}: TransactionsListProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-32 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#ece9f4] border-t-violet-300" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#8c86a3]`}>
        <div className="text-[2.25rem]">🧾</div>
        <p>No transactions yet. Add income or an expense above.</p>
      </div>
    );
  }

  const visibleTransactions = expanded ? transactions : transactions.slice(0, COLLAPSED_COUNT);
  const hiddenCount = transactions.length - COLLAPSED_COUNT;

  return (
    <div className="flex flex-col gap-2.5">
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {visibleTransactions.map((item) => {
          if (item.kind === "income") {
            const entry = item.data;
            return (
              <li
                key={`income-${entry.id}`}
                className={`${CARD} flex items-center gap-3.5 px-[1.1rem] py-[0.85rem] transition hover:border-emerald-200`}
              >
                <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-[10px] bg-emerald-100 text-lg text-emerald-600">
                  💰
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                  <span className="truncate font-semibold text-[#3f3b52]">{entry.source}</span>
                  <span className="text-[0.8rem] text-[#8c86a3]">Income · {entry.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold whitespace-nowrap text-emerald-600">
                    + ₹{entry.amount.toFixed(2)}
                  </span>
                  <button
                    className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition hover:bg-emerald-100 hover:text-emerald-600"
                    onClick={() => onEditIncome(entry)}
                    aria-label="Edit income"
                  >
                    ✎
                  </button>
                  <button
                    className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition hover:bg-rose-100 hover:text-rose-500"
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
              className={`${CARD} flex items-center gap-3.5 px-[1.1rem] py-[0.85rem] transition hover:border-rose-200`}
            >
              <div
                className="flex h-10 w-10 min-w-10 items-center justify-center rounded-[10px] text-lg"
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
                <span className="font-bold whitespace-nowrap text-rose-600">
                  - ₹{expense.amount.toFixed(2)}
                </span>
                <button
                  className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition hover:bg-amber-100 hover:text-amber-600"
                  onClick={() => onEditExpense(expense)}
                  aria-label="Edit expense"
                >
                  ✎
                </button>
                <button
                  className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a39cc0] transition hover:bg-rose-100 hover:text-rose-500"
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
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="cursor-pointer self-center rounded-full border border-[#ece9f4] bg-white px-4 py-1.5 text-sm font-medium text-[#6b6485] transition hover:border-violet-200 hover:text-violet-500"
        >
          {expanded ? "Show less ▲" : `Show all ${transactions.length} ▾`}
        </button>
      )}
    </div>
  );
}
