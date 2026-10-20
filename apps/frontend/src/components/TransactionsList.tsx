import { STRINGS } from "../constants/strings";
import { CARD } from "../lib/ui";
import { LoadingSpinner } from "./LoadingSpinner";
import { ExpenseTransactionCard } from "./transactions/ExpenseTransactionCard";
import { ExpenseTransactionRow } from "./transactions/ExpenseTransactionRow";
import { IncomeTransactionCard } from "./transactions/IncomeTransactionCard";
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
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[var(--tx-muted)]`}>
        <div className="text-[2.25rem]">🧾</div>
        <p>{STRINGS.transactions.emptyNoData}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[var(--tx-muted)]`}>
        <p>{STRINGS.transactions.emptyNoResults}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Mobile: compact card list (no horizontal scrolling needed). */}
      <ul className="m-0 flex list-none flex-col gap-2 p-0 sm:hidden">
        {transactions.map((item, index) => {
          const delay = Math.min(index, 6) * 40;
          if (item.kind === "income") {
            return (
              <IncomeTransactionCard
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
            <ExpenseTransactionCard
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

      {/* sm and up: full table. */}
      <div className={`${CARD} hidden overflow-x-auto sm:block`}>
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--bd-subtle)] text-[0.68rem] font-semibold tracking-wide text-[var(--tx-muted)] uppercase">
              <th className="px-4 py-2.5">{STRINGS.transactions.columnTitle}</th>
              <th className="px-4 py-2.5">{STRINGS.transactions.columnCategory}</th>
              <th className="px-4 py-2.5">{STRINGS.transactions.columnDate}</th>
              <th className="px-4 py-2.5 text-right">{STRINGS.transactions.columnAmount}</th>
              <th className="px-4 py-2.5 text-right">{STRINGS.transactions.columnActions}</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </div>

      <TransactionPagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
