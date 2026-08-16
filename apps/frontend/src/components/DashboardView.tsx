import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
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

  transactions: Transaction[];
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
  transactions,
  onEditIncome,
  onDeleteIncome,
  onEditExpense,
  onDeleteExpense,
}: DashboardViewProps) {
  return (
    <>
      <div id="income-section">
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
        {incomeError && <p className="mb-4 text-sm text-red-500">{incomeError}</p>}
      </div>

      <div id="expense-section">
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
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Transactions
      </h2>
      <TransactionsList
        transactions={transactions}
        loading={loading}
        hideAmounts={hideAmounts}
        onEditIncome={onEditIncome}
        onDeleteIncome={onDeleteIncome}
        onEditExpense={onEditExpense}
        onDeleteExpense={onDeleteExpense}
      />
    </>
  );
}
