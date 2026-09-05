import { CARD } from "../lib/ui";
import { LoadingSpinner } from "./LoadingSpinner";
import { ExpenseTransactionRow } from "./transactions/ExpenseTransactionRow";
import { IncomeTransactionRow } from "./transactions/IncomeTransactionRow";
import { TransactionPagination } from "./transactions/TransactionPagination";
import type { Expense, Income, Transaction } from "../types";

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
  hideAmounts: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onEditIncome: (entry: Income) => void;
  onDeleteIncome: (id: number) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export function TransactionsList({
  transactions,
  loading,
  hideAmounts,
  page,
  totalPages,
  total,
  onPageChange,
  onEditIncome,
  onDeleteIncome,
  onEditExpense,
  onDeleteExpense,
}: TransactionsListProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (transactions.length === 0 && total === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#8c86a3]`}>
        <div className="text-[2.25rem]">🧾</div>
        <p>No transactions yet. Add income or an expense above.</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#8c86a3]`}>
        <p>No results match these filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {transactions.map((item, index) => {
          const delay = Math.min(index, 6) * 40;
          if (item.kind === "income") {
            return (
              <IncomeTransactionRow
                key={`income-${item.data.id}`}
                entry={item.data}
                hideAmounts={hideAmounts}
                animationDelayMs={delay}
                onEdit={onEditIncome}
                onDelete={onDeleteIncome}
              />
            );
          }
          return (
            <ExpenseTransactionRow
              key={`expense-${item.data.id}`}
              expense={item.data}
              hideAmounts={hideAmounts}
              animationDelayMs={delay}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          );
        })}
      </ul>

      <TransactionPagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
