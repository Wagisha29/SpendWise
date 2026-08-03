import { formatAmount } from "../lib/ui";

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
      <div className="flex flex-col gap-1 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-teal-100 px-6 py-5">
        <span className="text-xs tracking-wider text-emerald-700/70 uppercase">Income (this month)</span>
        <span className="text-2xl font-bold text-emerald-700">₹{formatAmount(income, hideAmounts)}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-100 to-orange-100 px-6 py-5">
        <span className="text-xs tracking-wider text-rose-700/70 uppercase">Expense (this month)</span>
        <span className="text-2xl font-bold text-rose-700">₹{formatAmount(expense, hideAmounts)}</span>
      </div>
      <div
        className={`flex flex-col gap-1 rounded-2xl border px-6 py-5 ${
          savings >= 0
            ? "border-sky-200 bg-gradient-to-br from-sky-100 to-indigo-100"
            : "border-red-200 bg-gradient-to-br from-red-100 to-rose-100"
        }`}
      >
        <span
          className={`text-xs tracking-wider uppercase ${
            savings >= 0 ? "text-sky-700/70" : "text-red-700/70"
          }`}
        >
          Savings (this month)
        </span>
        <span className={`text-2xl font-bold ${savings >= 0 ? "text-sky-700" : "text-red-700"}`}>
          ₹{formatAmount(savings, hideAmounts)}
        </span>
      </div>
    </section>
  );
}
