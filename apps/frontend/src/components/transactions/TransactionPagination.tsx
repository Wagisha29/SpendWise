import { STRINGS } from "../../constants/strings";

export function TransactionPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="cursor-pointer rounded-full border border-[var(--bd-subtle)] bg-[var(--surf-card)] px-4 py-1.5 text-sm font-medium text-[var(--tx-muted)] transition-all duration-200 hover:border-indigo-200 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {STRINGS.pagination.prev}
      </button>
      <span className="text-sm font-medium text-[var(--tx-muted)] tabular-nums">
        {STRINGS.pagination.pageOf(page, totalPages)}
        <span className="text-[var(--tx-muted)]"> {STRINGS.pagination.results(total)}</span>
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="cursor-pointer rounded-full border border-[var(--bd-subtle)] bg-[var(--surf-card)] px-4 py-1.5 text-sm font-medium text-[var(--tx-muted)] transition-all duration-200 hover:border-indigo-200 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {STRINGS.pagination.next}
      </button>
    </div>
  );
}
