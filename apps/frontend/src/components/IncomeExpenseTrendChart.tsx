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
import { STRINGS } from "../constants/strings";
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
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[var(--tx-muted)]`}>
        <p className="m-0 text-sm">{STRINGS.charts.incomeExpenseEmpty}</p>
      </div>
    );
  }

  return (
    <div className={`${CARD} p-5 hover:shadow-md`}>
      <div className="h-[280px] w-full sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bd-subtle)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--tx-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--bd-subtle)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--tx-muted)", fontSize: 12 }}
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
                name === "income" ? STRINGS.filters.income : STRINGS.filters.expense,
              ]}
              labelFormatter={(label) => String(label)}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid var(--bd-subtle)",
                fontSize: "0.85rem",
                boxShadow: "0 8px 24px -8px rgba(99,60,220,0.25)",
              }}
            />
            <Legend
              formatter={(value) =>
                value === "income" ? STRINGS.filters.income : STRINGS.filters.expense
              }
              wrapperStyle={{ fontSize: "0.8rem", color: "var(--tx-muted)" }}
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
        <p className="mt-3 mb-0 text-center text-xs text-[var(--tx-muted)]">
          {STRINGS.charts.incomeExpenseFootnote}
        </p>
      )}
    </div>
  );
}
