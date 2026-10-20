import { AMOUNT_MASK, formatAmount, useCountUp } from "../lib/ui";

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
      className={`group relative flex h-[92px] flex-col gap-0.5 overflow-hidden rounded-2xl border px-3.5 pt-3 pb-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[110px] sm:px-5 sm:pt-3.5 sm:pb-3.5 ${styles.wrap}`}
    >
      <span
        className={`absolute -top-6 -right-6 h-14 w-14 rounded-full opacity-30 blur-2xl transition-transform duration-500 group-hover:scale-150 ${styles.dot}`}
      />
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className={`truncate text-[0.65rem] font-semibold tracking-wider uppercase sm:text-xs ${styles.label}`}>
          {label}
        </span>
        {hasMom && (
          <span
            className={`hidden rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums shadow-sm sm:inline-block ${
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
      <span className={`truncate text-base font-extrabold tabular-nums sm:text-xl ${styles.value}`}>
        ₹{hideAmounts ? AMOUNT_MASK : formatAmount(animated, false)}
      </span>
      {hasMom && (
        <span
          className={`text-[9px] font-bold tabular-nums sm:hidden ${momDown ? "text-emerald-700" : "text-rose-700"}`}
        >
          {hideAmounts ? "••% vs last mo" : `${momDown ? "↓" : "↑"} ${Math.abs(momDelta).toFixed(0)}% vs last mo`}
        </span>
      )}
      {hasPercent && (
        <span
          className={`absolute right-2.5 bottom-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums shadow-sm transition-transform duration-300 group-hover:scale-105 sm:right-3 sm:px-2 sm:text-[11px] ${styles.badge}`}
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
    <>
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
    </>
  );
}
