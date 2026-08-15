import { CategoryPieChart } from "./CategoryPieChart";
import { formatAmount } from "../lib/ui";
import type { Expense } from "../types";

interface AnalyticsViewProps {
  monthlyExpenses: Expense[];
  topExpenses: Expense[];
  hideAmounts: boolean;
}

export function AnalyticsView({ monthlyExpenses, topExpenses, hideAmounts }: AnalyticsViewProps) {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-5">
        <h2 className="m-0 text-xl font-extrabold tracking-tight text-[#28223f]">Detailed Analytics</h2>
        <p className="mt-1 mb-0 text-sm text-[#8c86a3]">
          This month&apos;s spending patterns and top expenses.
        </p>
      </div>

      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" /> Spending by Category
      </h3>
      <CategoryPieChart expenses={monthlyExpenses} hideAmounts={hideAmounts} />

      <h3 className="mt-8 mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Top Expenses
      </h3>
      {topExpenses.length === 0 ? (
        <p className="text-sm text-[#8c86a3]">No expenses this month yet.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {topExpenses.map((expense, index) => (
            <li
              key={expense.id}
              className="flex items-center gap-3 rounded-2xl border border-[#eceafb] bg-white px-4 py-3 shadow-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f2ff] text-sm font-bold text-[#6d5fdb]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-[#3f3b52]">{expense.title}</div>
                <div className="text-[0.8rem] text-[#8c86a3]">
                  {expense.category} · {expense.date}
                </div>
              </div>
              <span className="font-bold whitespace-nowrap text-rose-600 tabular-nums">
                ₹{formatAmount(expense.amount, hideAmounts)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
