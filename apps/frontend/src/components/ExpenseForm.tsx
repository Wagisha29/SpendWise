import { CATEGORIES, getCategoryMeta } from "../categories";
import { CARD } from "../lib/ui";

interface ExpenseFormProps {
  title: string;
  amount: string;
  category: string;
  date: string;
  onTitleChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting: boolean;
  isEditing: boolean;
}

export function ExpenseForm({
  title,
  amount,
  category,
  date,
  onTitleChange,
  onAmountChange,
  onCategoryChange,
  onDateChange,
  onSubmit,
  onCancel,
  submitting,
  isEditing,
}: ExpenseFormProps) {
  return (
    <form
      className={`${CARD} mb-6 grid grid-cols-2 gap-2.5 p-[1.1rem] md:grid-cols-[2fr_1fr_1fr_1fr_auto]`}
      onSubmit={onSubmit}
    >
      <input
        className="rounded-[9px] border border-[#ece9f4] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-rose-300 focus:outline-none"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
      />
      <input
        className="rounded-[9px] border border-[#ece9f4] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-rose-300 focus:outline-none"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        min="0.01"
        step="0.01"
        required
      />
      <select
        className="rounded-[9px] border border-[#ece9f4] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-rose-300 focus:outline-none"
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
        className="rounded-[9px] border border-[#ece9f4] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-rose-300 focus:outline-none"
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        required
      />
      <button
        type="submit"
        className="cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-rose-200 to-orange-200 px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-rose-800 transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? (isEditing ? "Saving…" : "Adding…") : isEditing ? "Save Changes" : "Add Expense"}
      </button>
      {isEditing && (
        <button
          type="button"
          className="cursor-pointer rounded-[9px] border border-[#ece9f4] bg-transparent px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-[#7a7590] transition hover:border-rose-300 hover:text-rose-500"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
