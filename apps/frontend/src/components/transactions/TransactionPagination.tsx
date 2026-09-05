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
        className="cursor-pointer rounded-full border border-[#ece9f4] bg-white px-4 py-1.5 text-sm font-medium text-[#6b6485] transition-all duration-200 hover:border-indigo-200 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Prev
      </button>
      <span className="text-sm font-medium text-[#8c86a3] tabular-nums">
        Page {page} of {totalPages}
        <span className="text-[#b0a9c4]"> · {total} results</span>
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="cursor-pointer rounded-full border border-[#ece9f4] bg-white px-4 py-1.5 text-sm font-medium text-[#6b6485] transition-all duration-200 hover:border-indigo-200 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
}
