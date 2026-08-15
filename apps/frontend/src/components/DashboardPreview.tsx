/** Static mock of the SpendWise dashboard for the landing page preview. */
export function DashboardPreview() {
  return (
    <div
      className="pointer-events-none select-none overflow-hidden rounded-[20px] border border-[#eceafb] bg-white/95 p-4 shadow-[0_30px_80px_-28px_rgba(99,60,220,0.35)] sm:p-5"
      aria-hidden="true"
    >
      {/* Mini header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-[0.65rem] font-bold text-white">
            S
          </div>
          <div>
            <div className="text-[0.8rem] font-extrabold tracking-tight text-[#28223f]">SpendWise</div>
            <div className="text-[0.65rem] text-[#8c86a3]">Alex Rivera</div>
          </div>
        </div>
        <div className="h-6 w-11 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 opacity-80" />
      </div>

      {/* Summary cards */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-teal-50 px-2.5 py-2.5">
          <div className="text-[0.55rem] font-semibold tracking-wider text-emerald-700/70 uppercase">Income</div>
          <div className="mt-0.5 text-sm font-extrabold text-emerald-700 tabular-nums">₹52,400</div>
        </div>
        <div className="relative rounded-xl border border-rose-200 bg-gradient-to-br from-rose-100 to-orange-50 px-2.5 py-2.5">
          <div className="text-[0.55rem] font-semibold tracking-wider text-rose-700/70 uppercase">Expense</div>
          <div className="mt-0.5 text-sm font-extrabold text-rose-700 tabular-nums">₹31,280</div>
          <span className="absolute right-1.5 bottom-1.5 rounded-md bg-rose-600/90 px-1.5 py-px text-[0.55rem] font-bold text-white">
            60%
          </span>
        </div>
        <div className="relative rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-100 to-sky-50 px-2.5 py-2.5">
          <div className="text-[0.55rem] font-semibold tracking-wider text-indigo-700/70 uppercase">Savings</div>
          <div className="mt-0.5 text-sm font-extrabold text-indigo-700 tabular-nums">₹21,120</div>
          <span className="absolute right-1.5 bottom-1.5 rounded-md bg-indigo-600/90 px-1.5 py-px text-[0.55rem] font-bold text-white">
            40%
          </span>
        </div>
      </div>

      {/* Transactions */}
      <div className="mb-1 text-[0.65rem] font-semibold tracking-wide text-[#8c86a3] uppercase">
        Recent activity
      </div>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {[
          { icon: "💰", label: "Salary", meta: "Income · Aug 01", amount: "+ ₹48,000", tone: "text-emerald-600", bg: "bg-emerald-100" },
          { icon: "🏠", label: "Apartment Rent", meta: "Rent · Aug 02", amount: "- ₹18,500", tone: "text-rose-600", bg: "bg-violet-100" },
          { icon: "🍔", label: "Weekend brunch", meta: "Food · Aug 05", amount: "- ₹1,240", tone: "text-rose-600", bg: "bg-amber-100" },
          { icon: "🛒", label: "Groceries", meta: "Grocery · Aug 07", amount: "- ₹2,180", tone: "text-rose-600", bg: "bg-lime-100" },
        ].map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-2.5 rounded-xl border border-[#eceafb] bg-[#faf9ff] px-2.5 py-2"
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${row.bg}`}>
              {row.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[0.75rem] font-semibold text-[#3f3b52]">{row.label}</div>
              <div className="text-[0.65rem] text-[#8c86a3]">{row.meta}</div>
            </div>
            <span className={`text-[0.75rem] font-bold whitespace-nowrap tabular-nums ${row.tone}`}>{row.amount}</span>
          </li>
        ))}
      </ul>

      {/* Mini chart bar accents */}
      <div className="mt-4 flex items-end gap-1.5 px-1">
        {[40, 65, 35, 80, 55, 70, 45].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-300 to-fuchsia-300 opacity-70"
            style={{ height: `${h * 0.45}px` }}
          />
        ))}
      </div>
    </div>
  );
}
