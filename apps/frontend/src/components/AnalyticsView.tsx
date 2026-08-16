import { useMemo, useState } from "react";

import {
  buildCategoryMonthlySeries,
  buildCategoryYearlySeries,
  buildMonthlySeries,
  buildYearlySeries,
  collectYears,
  type AnalyticsMode,
} from "../lib/analyticsAggregates";
import { formatAmount } from "../lib/ui";
import type { Expense, Income } from "../types";
import { CategoryPieChart } from "./CategoryPieChart";
import { CategoryTrendChart } from "./CategoryTrendChart";
import { IncomeExpenseTrendChart } from "./IncomeExpenseTrendChart";
import { InsightCards } from "./InsightCards";

interface AnalyticsViewProps {
  expenses: Expense[];
  income: Income[];
  monthlyExpenses: Expense[];
  topExpenses: Expense[];
  hideAmounts: boolean;
  dailyAverage: number;
  topCategory: {
    category: string;
    amount: number;
    percent: number;
    icon: string;
  } | null;
}

export function AnalyticsView({
  expenses,
  income,
  monthlyExpenses,
  topExpenses,
  hideAmounts,
  dailyAverage,
  topCategory,
}: AnalyticsViewProps) {
  const years = useMemo(() => collectYears(income, expenses), [income, expenses]);
  const [year, setYear] = useState(() => years[0] ?? new Date().getFullYear());
  const [mode, setMode] = useState<AnalyticsMode>("monthly");

  const selectedYear = years.includes(year) ? year : (years[0] ?? new Date().getFullYear());

  const incomeExpenseData = useMemo(() => {
    if (mode === "yearly") return buildYearlySeries(income, expenses);
    return buildMonthlySeries(income, expenses, selectedYear);
  }, [mode, income, expenses, selectedYear]);

  const categorySeries = useMemo(() => {
    if (mode === "yearly") return buildCategoryYearlySeries(expenses);
    return buildCategoryMonthlySeries(expenses, selectedYear);
  }, [mode, expenses, selectedYear]);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="m-0 text-xl font-extrabold tracking-tight text-[#28223f]">
            Analytics & Financial Insights
          </h2>
          <p className="mt-1 mb-0 text-sm text-[#8c86a3]">
            {mode === "monthly"
              ? `Monthly trends for ${selectedYear}.`
              : "Year-over-year income, expense, and category shifts."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {mode === "monthly" && (
            <label className="flex items-center gap-2 text-sm text-[#6f6888]">
              <span className="font-medium">Year</span>
              <select
                className="cursor-pointer rounded-[9px] border border-[#ece9f4] bg-white px-3 py-2 text-sm text-[#3f3b52] outline-none focus:border-indigo-300 focus:shadow-[0_0_0_3px_rgba(129,140,248,0.2)]"
                value={selectedYear}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="inline-flex rounded-[10px] border border-[#ece9f4] bg-white p-0.5">
            <ModeButton active={mode === "monthly"} onClick={() => setMode("monthly")}>
              Monthly
            </ModeButton>
            <ModeButton active={mode === "yearly"} onClick={() => setMode("yearly")}>
              Yearly
            </ModeButton>
          </div>
        </div>
      </div>

      <InsightCards
        dailyAverage={dailyAverage}
        topCategory={topCategory}
        hideAmounts={hideAmounts}
      />

      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Income vs Expense Trend
      </h3>
      <IncomeExpenseTrendChart data={incomeExpenseData} hideAmounts={hideAmounts} />

      <h3 className="mt-8 mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Category Spending Shift
      </h3>
      <CategoryTrendChart
        data={categorySeries.data}
        activeCategories={categorySeries.activeCategories}
        hideAmounts={hideAmounts}
      />

      <div className="mt-10 mb-5 border-t border-[#eceafb] pt-8">
        <h2 className="m-0 text-lg font-extrabold tracking-tight text-[#28223f]">This month</h2>
        <p className="mt-1 mb-0 text-sm text-[#8c86a3]">
          Current month spending patterns and top expenses.
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

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-[8px] border-none px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-indigo-500 text-white shadow-sm"
          : "bg-transparent text-[#7a7590] hover:text-[#3f3b52]"
      }`}
    >
      {children}
    </button>
  );
}
