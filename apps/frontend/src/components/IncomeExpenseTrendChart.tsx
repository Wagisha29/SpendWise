import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS } from "../categories";
import { AMOUNT_MASK, CARD, formatAmount } from "../lib/ui";
import type { IncomeExpensePoint } from "../lib/analyticsAggregates";

interface IncomeExpenseTrendChartProps {
  data: IncomeExpensePoint[];
  hideAmounts: boolean;
}

export function IncomeExpenseTrendChart({ data, hideAmounts }: IncomeExpenseTrendChartProps) {
  const hasData = data.some((point) => point.income > 0 || point.expense > 0);

  if (!hasData) {
    return (
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#8c86a3]`}>
        <p className="m-0 text-sm">No income or expenses in this range yet.</p>
      </div>
    );
  }

  return (
    <div className={`${CARD} p-5 hover:shadow-md`}>
      <div className="h-[280px] w-full sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ece9f4" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#8c86a3", fontSize: 12 }}
              axisLine={{ stroke: "#ece9f4" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8c86a3", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) =>
                hideAmounts ? "••" : value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
              }
              width={48}
            />
            <Tooltip
              formatter={(value, name) => [
                hideAmounts ? `₹${AMOUNT_MASK}` : `₹${formatAmount(Number(value), false)}`,
                name === "income" ? "Income" : "Expense",
              ]}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #ece9f4",
                fontSize: "0.85rem",
                boxShadow: "0 8px 24px -8px rgba(99,60,220,0.25)",
              }}
            />
            <Legend
              formatter={(value) => (value === "income" ? "Income" : "Expense")}
              wrapperStyle={{ fontSize: "0.8rem", color: "#6f6888" }}
            />
            <Bar
              dataKey="income"
              fill={CHART_COLORS.income}
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
            <Bar
              dataKey="expense"
              fill={CHART_COLORS.expense}
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {!hideAmounts && (
        <p className="mt-3 mb-0 text-center text-xs text-[#8c86a3]">
          Totals shown in ₹ · Y-axis may use k for thousands
        </p>
      )}
    </div>
  );
}
