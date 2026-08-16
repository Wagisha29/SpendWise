import { CATEGORIES, getCategoryMeta } from "../categories";
import { CARD } from "../lib/ui";

interface ExpenseFormProps {
  title: string;
  amount: string;
  quantity: string;
  category: string;
  date: string;
  onTitleChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting: boolean;
  isEditing: boolean;
  bare?: boolean;
}

const INPUT_CLASS =
  "w-full rounded-[9px] border border-[#ece9f4] bg-[#faf9ff] px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition-all duration-200 focus:border-rose-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)] focus:outline-none";

export function ExpenseForm({
  title,
  amount,
  quantity,
  category,
  date,
  onTitleChange,
  onAmountChange,
  onQuantityChange,
  onCategoryChange,
  onDateChange,
  onSubmit,
  onCancel,
  submitting,
  isEditing,
  bare = false,
}: ExpenseFormProps) {
  const unitPrice = Number(amount);
  const qty = Number(quantity);
  const total = unitPrice > 0 && qty > 0 ? (unitPrice * qty).toFixed(2) : null;

  return (
    <form
      className={
        bare
          ? "flex flex-col gap-2.5"
          : `${CARD} flex h-full flex-col gap-2.5 p-[1.1rem] hover:shadow-md`
      }
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-[2fr_1fr] gap-2.5">
        <input
          className={INPUT_CLASS}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
        <input
          className={INPUT_CLASS}
          type="number"
          placeholder="Unit price"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div className="grid grid-cols-[0.7fr_1.2fr_1fr] gap-2.5">
        <input
          className={INPUT_CLASS}
          type="number"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          min="1"
          step="1"
          required
        />
        <select
          className={`${INPUT_CLASS} cursor-pointer`}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {getCategoryMeta(c).icon} {c}
            </option>
          ))}
        </select>
        <input
          className={INPUT_CLASS}
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          required
        />
      </div>

      <div className={`mt-auto flex flex-col gap-2 ${bare ? "" : ""}`}>
        {total !== null && (
          <p className="m-0 text-sm font-medium text-[#7a7590]">
            Total <span className="font-semibold tabular-nums text-rose-700">₹{total}</span>
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full flex-1 cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-rose-300 to-orange-300 px-[1.15rem] py-[0.65rem] font-semibold whitespace-nowrap text-rose-900 shadow-[0_4px_14px_-4px_rgba(251,113,133,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(251,113,133,0.6)] active:scale-[0.97] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? (isEditing ? "Saving…" : "Adding…") : isEditing ? "Save Changes" : "Add Expense"}
          </button>
          {(isEditing || bare) && (
            <button
              type="button"
              className="cursor-pointer rounded-[9px] border border-[#ece9f4] bg-transparent px-[1.15rem] py-[0.65rem] font-semibold text-[#7a7590] transition-all duration-200 hover:border-rose-300 hover:text-rose-500"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
