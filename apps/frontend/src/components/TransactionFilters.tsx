import { useState } from "react";
import { CATEGORIES, getCategoryMeta } from "../categories";
import { STRINGS } from "../constants/strings";

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
  "h-8 w-full min-w-0 rounded-lg border border-[#ece9f4] bg-[#faf9ff] px-2 text-[0.8rem] text-[#3f3b52] outline-none transition focus:border-indigo-300 focus:bg-white focus:shadow-[0_0_0_2px_rgba(99,102,241,0.12)] disabled:cursor-not-allowed disabled:opacity-45";

const LABEL =
  "mb-0.5 block text-[0.65rem] font-semibold tracking-wide text-[#9a93b0] uppercase";

type TransactionFiltersProps = {
  value: TransactionFilterValues;
  onChange: (next: TransactionFilterValues) => void;
  onClear: () => void;
};

export function countActiveFilters(value: TransactionFilterValues): number {
  let count = 0;
  if (value.type !== "all") count += 1;
  if (value.category !== "") count += 1;
  if (value.dateFrom !== "") count += 1;
  if (value.dateTo !== "") count += 1;
  if (value.minAmount !== "") count += 1;
  if (value.maxAmount !== "") count += 1;
  if (value.query.trim() !== "") count += 1;
  return count;
}

function hasActiveFilters(value: TransactionFilterValues): boolean {
  return countActiveFilters(value) > 0;
}

export function TransactionFilters({ value, onChange, onClear }: TransactionFiltersProps) {
  const active = hasActiveFilters(value);
  const activeCount = countActiveFilters(value);
  const categoryDisabled = value.type === "income";
  const [expanded, setExpanded] = useState(false);

  function patch(partial: Partial<TransactionFilterValues>) {
    onChange({ ...value, ...partial });
  }

  return (
    <section className="mb-3 w-full" aria-label="Transaction filters">
      <div className="mb-2 flex items-center gap-2 sm:hidden">
        <label className="relative min-w-0 flex-1">
          <input
            type="search"
            placeholder={STRINGS.filters.searchPlaceholderMobile}
            className={`${CONTROL} h-9 pl-7`}
            value={value.query}
            onChange={(e) => patch({ query: e.target.value })}
          />
          <span
            className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-[0.75rem] text-[#b0a9c4]"
            aria-hidden
          >
            ⌕
          </span>
        </label>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className={`relative flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-lg border px-3 text-[0.78rem] font-semibold transition ${
            active
              ? "border-indigo-300 bg-indigo-50 text-indigo-600"
              : "border-[#ece9f4] bg-white text-[#7a7590]"
          }`}
        >
          ⚙ {STRINGS.filters.toggle}
          {activeCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[0.6rem] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div
        className={`grid w-full grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)_minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_auto] lg:items-end lg:gap-1.5 ${
          expanded ? "grid" : "hidden sm:grid"
        }`}
      >
        <label className="relative col-span-2 hidden min-w-0 sm:col-span-4 sm:block lg:col-span-1">
          <span className={LABEL}>{STRINGS.filters.searchLabel}</span>
          <input
            type="search"
            placeholder={STRINGS.filters.searchPlaceholder}
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
          <span className={LABEL}>{STRINGS.filters.typeLabel}</span>
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
            <option value="all">{STRINGS.filters.all}</option>
            <option value="income">{STRINGS.filters.income}</option>
            <option value="expense">{STRINGS.filters.expense}</option>
          </select>
        </label>

        <label className="min-w-0">
          <span className={LABEL}>{STRINGS.filters.categoryLabel}</span>
          <select
            className={`${CONTROL} cursor-pointer`}
            value={value.category}
            disabled={categoryDisabled}
            onChange={(e) => patch({ category: e.target.value })}
          >
            <option value="">{STRINGS.filters.all}</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getCategoryMeta(category).icon} {category}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className={LABEL}>{STRINGS.filters.fromLabel}</span>
          <input
            type="date"
            className={CONTROL}
            value={value.dateFrom}
            max={value.dateTo || undefined}
            onChange={(e) => patch({ dateFrom: e.target.value })}
          />
        </label>

        <label className="min-w-0">
          <span className={LABEL}>{STRINGS.filters.toLabel}</span>
          <input
            type="date"
            className={CONTROL}
            value={value.dateTo}
            min={value.dateFrom || undefined}
            onChange={(e) => patch({ dateTo: e.target.value })}
          />
        </label>

        <label className="min-w-0">
          <span className={LABEL}>{STRINGS.filters.minLabel}</span>
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
          <span className={LABEL}>{STRINGS.filters.maxLabel}</span>
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
              {STRINGS.common.clear}
            </button>
          </div>
        ) : (
          <div className="hidden lg:block" aria-hidden />
        )}
      </div>
    </section>
  );
}
