import { CATEGORIES, getCategoryMeta } from "../categories";

export type TransactionFilterValues = {
  type: "all" | "income" | "expense";
  category: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  query: string;
};

export const EMPTY_TRANSACTION_FILTERS: TransactionFilterValues = {
  type: "all",
  category: "",
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
  query: "",
};

const CONTROL =
  "h-8 w-full min-w-0 rounded-lg border border-[#ebe7f5] bg-white px-2 text-[0.8rem] text-[#3f3b52] outline-none transition focus:border-indigo-300 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.12)] disabled:cursor-not-allowed disabled:opacity-45";

const LABEL =
  "mb-0.5 block text-[0.65rem] font-semibold tracking-wide text-[#9a93b0] uppercase";

type TransactionFiltersProps = {
  value: TransactionFilterValues;
  onChange: (next: TransactionFilterValues) => void;
  onClear: () => void;
};

function hasActiveFilters(value: TransactionFilterValues): boolean {
  return (
    value.type !== "all" ||
    value.category !== "" ||
    value.dateFrom !== "" ||
    value.dateTo !== "" ||
    value.minAmount !== "" ||
    value.maxAmount !== "" ||
    value.query.trim() !== ""
  );
}

export function TransactionFilters({ value, onChange, onClear }: TransactionFiltersProps) {
  const active = hasActiveFilters(value);
  const categoryDisabled = value.type === "income";

  function patch(partial: Partial<TransactionFilterValues>) {
    onChange({ ...value, ...partial });
  }

  return (
    <section className="mb-3 w-full" aria-label="Transaction filters">
      <div className="grid w-full grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)_minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_auto] lg:items-end lg:gap-1.5">
        <label className="relative col-span-2 min-w-0 sm:col-span-4 lg:col-span-1">
          <span className={LABEL}>Search</span>
          <input
            type="search"
            placeholder="Title or source…"
            className={`${CONTROL} pl-7`}
            value={value.query}
            onChange={(e) => patch({ query: e.target.value })}
          />
          <span
            className="pointer-events-none absolute bottom-2 left-2 text-[0.7rem] text-[#b0a9c4]"
            aria-hidden
          >
            ⌕
          </span>
        </label>

        <label className="min-w-0">
          <span className={LABEL}>Type</span>
          <select
            className={`${CONTROL} cursor-pointer`}
            value={value.type}
            onChange={(e) => {
              const type = e.target.value as TransactionFilterValues["type"];
              patch({
                type,
                category: type === "income" ? "" : value.category,
              });
            }}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="min-w-0">
          <span className={LABEL}>Category</span>
          <select
            className={`${CONTROL} cursor-pointer`}
            value={value.category}
            disabled={categoryDisabled}
            onChange={(e) => patch({ category: e.target.value })}
          >
            <option value="">All</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getCategoryMeta(category).icon} {category}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className={LABEL}>From</span>
          <input
            type="date"
            className={CONTROL}
            value={value.dateFrom}
            max={value.dateTo || undefined}
            onChange={(e) => patch({ dateFrom: e.target.value })}
          />
        </label>

        <label className="min-w-0">
          <span className={LABEL}>To</span>
          <input
            type="date"
            className={CONTROL}
            value={value.dateTo}
            min={value.dateFrom || undefined}
            onChange={(e) => patch({ dateTo: e.target.value })}
          />
        </label>

        <label className="min-w-0">
          <span className={LABEL}>Min ₹</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            className={CONTROL}
            value={value.minAmount}
            onChange={(e) => patch({ minAmount: e.target.value })}
          />
        </label>

        <label className="min-w-0">
          <span className={LABEL}>Max ₹</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Any"
            className={CONTROL}
            value={value.maxAmount}
            onChange={(e) => patch({ maxAmount: e.target.value })}
          />
        </label>

        {active ? (
          <div className="col-span-2 flex items-end justify-end sm:col-span-4 lg:col-span-1">
            <button
              type="button"
              onClick={onClear}
              className="h-8 cursor-pointer rounded-lg border-none bg-transparent px-1.5 text-[0.75rem] font-medium text-[#9a93b0] transition hover:text-indigo-600"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="hidden lg:block" aria-hidden />
        )}
      </div>
    </section>
  );
}
