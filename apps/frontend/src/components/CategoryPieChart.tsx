import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { getCategoryMeta } from "../categories";
import { CARD } from "../lib/ui";
import type { Expense } from "../types";

interface CategoryPieChartProps {
  expenses: Expense[];
}

interface CategorySlice {
  category: string;
  amount: number;
  color: string;
  icon: string;
}

export function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const data = useMemo<CategorySlice[]>(() => {
    const totals = new Map<string, number>();
    for (const expense of expenses) {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    }
    return Array.from(totals.entries())
      .map(([category, amount]) => {
        const meta = getCategoryMeta(category);
        return { category, amount, color: meta.color, icon: meta.icon };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const total = data.reduce((sum, slice) => sum + slice.amount, 0);

  if (data.length === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#8c86a3]`}>
        <div className="text-[2.25rem]">📊</div>
        <p>No expenses this month yet. Add one to see the category breakdown.</p>
      </div>
    );
  }

  return (
    <div className={`${CARD} flex flex-col gap-6 p-5 sm:flex-row sm:items-center`}>
      <div className="mx-auto h-[240px] w-full max-w-[260px] sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((slice) => (
                <Cell key={slice.category} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, entry) => [
                `₹${Number(value).toFixed(2)}`,
                String(entry.payload?.category ?? ""),
              ]}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #ece9f4",
                fontSize: "0.85rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="m-0 flex flex-1 list-none flex-col gap-2 p-0">
        {data.map((slice) => {
          const percent = total > 0 ? (slice.amount / total) * 100 : 0;
          return (
            <li key={slice.category} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="flex-1 truncate text-sm text-[#3f3b52]">
                {slice.icon} {slice.category}
              </span>
              <span className="text-sm font-semibold text-[#3f3b52]">
                ₹{slice.amount.toFixed(2)}
              </span>
              <span className="w-12 text-right text-xs text-[#8c86a3]">
                {percent.toFixed(0)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
