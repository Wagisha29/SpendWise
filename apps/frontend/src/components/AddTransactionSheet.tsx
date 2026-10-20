import { ExpenseForm, type ExpenseFormProps } from "./ExpenseForm";
import { IncomeForm, type IncomeFormProps } from "./IncomeForm";
import { Modal } from "./Modal";

export type TransactionSheetType = "income" | "expense";

interface AddTransactionSheetProps {
  open: boolean;
  activeType: TransactionSheetType;
  onTypeChange: (type: TransactionSheetType) => void;
  onClose: () => void;
  incomeProps: Omit<IncomeFormProps, "bare">;
  incomeError: string | null;
  expenseProps: Omit<ExpenseFormProps, "bare">;
  expenseError: string | null;
}

/**
 * Mobile-only "add transaction" bottom sheet. Replaces the two
 * always-visible Income/Expense form cards on small screens with a single
 * on-demand sheet (opened via the bottom-nav FAB, or automatically when
 * editing a row) so the dashboard starts with just the summary +
 * transaction list — much less scrolling before you reach your data.
 */
export function AddTransactionSheet({
  open,
  activeType,
  onTypeChange,
  onClose,
  incomeProps,
  incomeError,
  expenseProps,
  expenseError,
}: AddTransactionSheetProps) {
  const isEditing = activeType === "income" ? incomeProps.isEditing : expenseProps.isEditing;
  const title = isEditing
    ? activeType === "income"
      ? "Edit Income"
      : "Edit Expense"
    : "Add Transaction";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      accent={activeType === "income" ? "emerald" : "rose"}
    >
      <div className="mb-4 flex rounded-xl border border-[#ece9f4] bg-[#faf9ff] p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeType === "expense"}
          onClick={() => onTypeChange("expense")}
          className={`flex-1 cursor-pointer rounded-lg border-none py-2 text-sm font-semibold transition-all duration-200 ${
            activeType === "expense"
              ? "bg-gradient-to-br from-rose-300 to-orange-300 text-rose-900 shadow-sm"
              : "bg-transparent text-[#7a7590]"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeType === "income"}
          onClick={() => onTypeChange("income")}
          className={`flex-1 cursor-pointer rounded-lg border-none py-2 text-sm font-semibold transition-all duration-200 ${
            activeType === "income"
              ? "bg-gradient-to-br from-emerald-300 to-teal-300 text-emerald-900 shadow-sm"
              : "bg-transparent text-[#7a7590]"
          }`}
        >
          Income
        </button>
      </div>

      {activeType === "expense" ? (
        <>
          <ExpenseForm {...expenseProps} bare />
          {expenseError && <p className="mt-2 text-sm text-red-500">{expenseError}</p>}
        </>
      ) : (
        <>
          <IncomeForm {...incomeProps} bare />
          {incomeError && <p className="mt-2 text-sm text-red-500">{incomeError}</p>}
        </>
      )}
    </Modal>
  );
}
