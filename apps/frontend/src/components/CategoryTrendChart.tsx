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

import { getCategoryMeta } from "../categories";
import { AMOUNT_MASK, CARD } from "../lib/ui";
import type { CategoryMonthPoint } from "../lib/analyticsAggregates";

interface CategoryTrendChartProps {
  data: CategoryMonthPoint[];
  activeCategories: string[];
  hideAmounts: boolean;
}

export function CategoryTrendChart({
  data,
  activeCategories,
  hideAmounts,
}: CategoryTrendChartProps) {
  if (activeCategories.length === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#8c86a3]`}>
        <p className="m-0 text-sm">No category spending in this range yet.</p>
      </div>
    );
  }

  return (
    <div className={`${CARD} p-5 hover:shadow-md`}>
      <p className="mt-0 mb-4 text-sm text-[#8c86a3]">
        Each bar is one period. Colors show how much went to each category.
      </p>
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
                hideAmounts ? `₹${AMOUNT_MASK}` : `₹${Number(value).toFixed(2)}`,
                String(name),
              ]}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #ece9f4",
                fontSize: "0.85rem",
                boxShadow: "0 8px 24px -8px rgba(99,60,220,0.25)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "#6f6888" }} />
            {activeCategories.map((category) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="spend"
                fill={getCategoryMeta(category).color}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
