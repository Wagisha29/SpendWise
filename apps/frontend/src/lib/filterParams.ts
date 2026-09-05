import type { TransactionFilterValues } from "../components/TransactionFilters";
import type { TransactionFilterParams } from "../types";

export const TRANSACTION_PAGE_SIZE = 10;

export function toFilterParams(
  filters: TransactionFilterValues,
  page: number,
  pageSize = TRANSACTION_PAGE_SIZE,
): TransactionFilterParams {
  return {
    type: filters.type,
    category:
      filters.type === "income" || !filters.category ? undefined : filters.category,
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
    min_amount: filters.minAmount || undefined,
    max_amount: filters.maxAmount || undefined,
    q: filters.query.trim() || undefined,
    page,
    page_size: pageSize,
  };
}
