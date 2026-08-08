import { AMOUNT_MASK, useCountUp } from "../lib/ui";

function SummaryCard({
  label,
  amount,
  hideAmounts,
  accent,
}: {
  label: string;
  amount: number;
  hideAmounts: boolean;
  accent: "emerald" | "rose" | "indigo";
}) {
  const animated = useCountUp(amount);

  const styles = {
    emerald: {
      wrap: "border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 hover:shadow-emerald-200/60",
      label: "text-emerald-700/70",
      value: "text-emerald-700",
      dot: "bg-emerald-400",
    },
    rose: {
      wrap: "border-rose-200 bg-gradient-to-br from-rose-100 via-rose-50 to-orange-100 hover:shadow-rose-200/60",
      label: "text-rose-700/70",
      value: "text-rose-700",
      dot: "bg-rose-400",
    },
    indigo: {
      wrap: "border-indigo-200 bg-gradient-to-br from-indigo-100 via-indigo-50 to-sky-100 hover:shadow-indigo-200/60",
      label: "text-indigo-700/70",
      value: "text-indigo-700",
      dot: "bg-indigo-400",
    },
  }[accent];

  return (
    <div
      className={`group relative flex flex-col gap-1 overflow-hidden rounded-2xl border px-6 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${styles.wrap}`}
    >
      <span
        className={`absolute -top-6 -right-6 h-16 w-16 rounded-full opacity-30 blur-2xl transition-transform duration-500 group-hover:scale-150 ${styles.dot}`}
      />
      <span className={`text-xs font-semibold tracking-wider uppercase ${styles.label}`}>{label}</span>
      <span className={`text-2xl font-extrabold tabular-nums ${styles.value}`}>
        ₹{hideAmounts ? AMOUNT_MASK : animated.toFixed(2)}
      </span>
    </div>
  );
}

export function SummaryCards({
  income,
  expense,
  savings,
  hideAmounts,
}: {
  income: number;
  expense: number;
  savings: number;
  hideAmounts: boolean;
}) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryCard label="Income (this month)" amount={income} hideAmounts={hideAmounts} accent="emerald" />
      <SummaryCard label="Expense (this month)" amount={expense} hideAmounts={hideAmounts} accent="rose" />
      <SummaryCard
        label="Savings (this month)"
        amount={savings}
        hideAmounts={hideAmounts}
        accent={savings >= 0 ? "indigo" : "rose"}
      />
    </section>
  );
}
