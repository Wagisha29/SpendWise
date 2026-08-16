import { AMOUNT_MASK, useCountUp } from "../lib/ui";

function SummaryCard({
  label,
  amount,
  hideAmounts,
  accent,
  percent,
  percentLabel,
  momDelta,
}: {
  label: string;
  amount: number;
  hideAmounts: boolean;
  accent: "emerald" | "rose" | "indigo";
  percent?: number | null;
  percentLabel?: string;
  momDelta?: number | null;
}) {
  const animated = useCountUp(amount);

  const styles = {
    emerald: {
      wrap: "border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 hover:shadow-emerald-200/60",
      label: "text-emerald-700/70",
      value: "text-emerald-700",
      dot: "bg-emerald-400",
      badge: "bg-emerald-600/90 text-white",
    },
    rose: {
      wrap: "border-rose-200 bg-gradient-to-br from-rose-100 via-rose-50 to-orange-100 hover:shadow-rose-200/60",
      label: "text-rose-700/70",
      value: "text-rose-700",
      dot: "bg-rose-400",
      badge: "bg-rose-600/90 text-white",
    },
    indigo: {
      wrap: "border-indigo-200 bg-gradient-to-br from-indigo-100 via-indigo-50 to-sky-100 hover:shadow-indigo-200/60",
      label: "text-indigo-700/70",
      value: "text-indigo-700",
      dot: "bg-indigo-400",
      badge: "bg-indigo-600/90 text-white",
    },
  }[accent];

  const hasPercent = percent !== undefined && percent !== null;
  const hasMom = momDelta !== undefined && momDelta !== null;
  const momDown = hasMom && momDelta <= 0;

  return (
    <div
      className={`group relative flex flex-col gap-1 overflow-hidden rounded-2xl border px-6 pt-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        hasPercent ? "pb-9" : "pb-5"
      } ${styles.wrap}`}
    >
      <span
        className={`absolute -top-6 -right-6 h-16 w-16 rounded-full opacity-30 blur-2xl transition-transform duration-500 group-hover:scale-150 ${styles.dot}`}
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-semibold tracking-wider uppercase ${styles.label}`}>{label}</span>
        {hasMom && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums shadow-sm ${
              momDown
                ? "bg-emerald-600/90 text-white"
                : "bg-rose-700/90 text-white"
            }`}
            title="Change vs last month"
          >
            {hideAmounts
              ? "••% vs last month"
              : `${momDown ? "↓" : "↑"} ${Math.abs(momDelta).toFixed(0)}% vs last month`}
          </span>
        )}
      </div>
      <span className={`text-2xl font-extrabold tabular-nums ${styles.value}`}>
        ₹{hideAmounts ? AMOUNT_MASK : animated.toFixed(2)}
      </span>
      {hasPercent && (
        <span
          className={`absolute right-3 bottom-3 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums shadow-sm transition-transform duration-300 group-hover:scale-105 ${styles.badge}`}
          title={percentLabel}
        >
          {hideAmounts ? "••%" : `${percent > 0 ? "" : percent < 0 ? "-" : ""}${Math.abs(percent).toFixed(0)}%`}
        </span>
      )}
    </div>
  );
}

export function SummaryCards({
  income,
  expense,
  savings,
  hideAmounts,
  expenseMomDelta = null,
}: {
  income: number;
  expense: number;
  savings: number;
  hideAmounts: boolean;
  expenseMomDelta?: number | null;
}) {
  const expensePercent = income > 0 ? (expense / income) * 100 : null;
  const savingsPercent = income > 0 ? (savings / income) * 100 : null;

  return (
    <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryCard label="Income (this month)" amount={income} hideAmounts={hideAmounts} accent="emerald" />
      <SummaryCard
        label="Expense (this month)"
        amount={expense}
        hideAmounts={hideAmounts}
        accent="rose"
        percent={expensePercent}
        percentLabel="% of income spent"
        momDelta={expenseMomDelta}
      />
      <SummaryCard
        label="Savings (this month)"
        amount={savings}
        hideAmounts={hideAmounts}
        accent={savings >= 0 ? "indigo" : "rose"}
        percent={savingsPercent}
        percentLabel="% of income saved"
      />
    </section>
  );
}
