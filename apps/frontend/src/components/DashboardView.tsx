import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
import {
  countActiveFilters,
  TransactionFilters,
  type TransactionFilterValues,
} from "./TransactionFilters";
import { TransactionsList } from "./TransactionsList";
import type { Expense, Income, Transaction } from "../types";

interface DashboardViewProps {
  hideAmounts: boolean;
  loading: boolean;

  incomeSource: string;
  incomeAmount: string;
  incomeDate: string;
  incomeSubmitting: boolean;
  incomeError: string | null;
  editingIncomeId: number | null;
  onIncomeSourceChange: (value: string) => void;
  onIncomeAmountChange: (value: string) => void;
  onIncomeDateChange: (value: string) => void;
  onIncomeSubmit: (e: React.FormEvent) => void;
  onIncomeCancel: () => void;

  title: string;
  amount: string;
  quantity: string;
  category: string;
  date: string;
  submitting: boolean;
  error: string | null;
  editingId: number | null;
  onTitleChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onExpenseSubmit: (e: React.FormEvent) => void;
  onExpenseCancel: () => void;

  filters: TransactionFilterValues;
  onFiltersChange: (next: TransactionFilterValues) => void;
  onFiltersClear: () => void;

  transactions: Transaction[];
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onEditIncome: (entry: Income) => void;
  onDeleteIncome: (id: number) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export function DashboardView({
  hideAmounts,
  loading,
  incomeSource,
  incomeAmount,
  incomeDate,
  incomeSubmitting,
  incomeError,
  editingIncomeId,
  onIncomeSourceChange,
  onIncomeAmountChange,
  onIncomeDateChange,
  onIncomeSubmit,
  onIncomeCancel,
  title,
  amount,
  quantity,
  category,
  date,
  submitting,
  error,
  editingId,
  onTitleChange,
  onAmountChange,
  onQuantityChange,
  onCategoryChange,
  onDateChange,
  onExpenseSubmit,
  onExpenseCancel,
  filters,
  onFiltersChange,
  onFiltersClear,
  transactions,
  page,
  totalPages,
  total,
  onPageChange,
  onEditIncome,
  onDeleteIncome,
  onEditExpense,
  onDeleteExpense,
}: DashboardViewProps) {
  const activeFilterCount = countActiveFilters(filters);

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch">
        <div id="income-section" className="flex flex-col">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Income
          </h2>
          <IncomeForm
            source={incomeSource}
            amount={incomeAmount}
            date={incomeDate}
            onSourceChange={onIncomeSourceChange}
            onAmountChange={onIncomeAmountChange}
            onDateChange={onIncomeDateChange}
            onSubmit={onIncomeSubmit}
            onCancel={onIncomeCancel}
            submitting={incomeSubmitting}
            isEditing={editingIncomeId !== null}
          />
          {incomeError && <p className="mt-2 text-sm text-red-500">{incomeError}</p>}
        </div>

        <div id="expense-section" className="flex flex-col">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Expenses
          </h2>
          <ExpenseForm
            title={title}
            amount={amount}
            quantity={quantity}
            category={category}
            date={date}
            onTitleChange={onTitleChange}
            onAmountChange={onAmountChange}
            onQuantityChange={onQuantityChange}
            onCategoryChange={onCategoryChange}
            onDateChange={onDateChange}
            onSubmit={onExpenseSubmit}
            onCancel={onExpenseCancel}
            submitting={submitting}
            isEditing={editingId !== null}
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <h2 className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Transactions
        {activeFilterCount > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-indigo-600 normal-case"
            title={`${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}`}
          >
            Filtered · {activeFilterCount}
          </span>
        )}
      </h2>
      <TransactionFilters
        value={filters}
        onChange={onFiltersChange}
        onClear={onFiltersClear}
      />
      <TransactionsList
        transactions={transactions}
        loading={loading}
        hideAmounts={hideAmounts}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={onPageChange}
        onEditIncome={onEditIncome}
        onDeleteIncome={onDeleteIncome}
        onEditExpense={onEditExpense}
        onDeleteExpense={onDeleteExpense}
      />
    </>
  );
}
