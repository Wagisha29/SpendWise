import { CARD } from "../lib/ui";

interface IncomeFormProps {
  source: string;
  amount: string;
  date: string;
  onSourceChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting: boolean;
  isEditing: boolean;
  bare?: boolean;
}

const INPUT_CLASS =
  "rounded-[9px] border border-[#ece9f4] bg-[#faf9ff] px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition-all duration-200 focus:border-emerald-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(52,211,153,0.15)] focus:outline-none";

export function IncomeForm({
  source,
  amount,
  date,
  onSourceChange,
  onAmountChange,
  onDateChange,
  onSubmit,
  onCancel,
  submitting,
  isEditing,
  bare = false,
}: IncomeFormProps) {
  return (
    <form
      className={
        bare
          ? "flex flex-col gap-3"
          : `${CARD} mb-4 grid grid-cols-2 gap-2.5 p-[1.1rem] hover:shadow-md md:grid-cols-[2fr_1fr_1fr_auto_auto]`
      }
      onSubmit={onSubmit}
    >
      <input
        className={INPUT_CLASS}
        type="text"
        placeholder="Source (e.g. Salary)"
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        required
      />
      <input
        className={INPUT_CLASS}
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        min="0.01"
        step="0.01"
        required
      />
      <input
        className={INPUT_CLASS}
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        required
      />
      <button
        type="submit"
        className={`cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-emerald-300 to-teal-300 px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-emerald-900 shadow-[0_4px_14px_-4px_rgba(52,211,153,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(52,211,153,0.6)] active:scale-[0.97] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${bare ? "w-full" : ""}`}
        disabled={submitting}
      >
        {submitting ? (isEditing ? "Saving…" : "Adding…") : isEditing ? "Save Changes" : "Add Income"}
      </button>
      {(isEditing || bare) && (
        <button
          type="button"
          className={`cursor-pointer rounded-[9px] border border-[#ece9f4] bg-transparent px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-[#7a7590] transition-all duration-200 hover:border-rose-300 hover:text-rose-500 ${bare ? "w-full" : ""}`}
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
