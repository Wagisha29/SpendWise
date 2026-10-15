import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { AMOUNT_MASK, formatAmount } from "../lib/ui";
import { currentMonthKey } from "../lib/dates";
import {
  formatMonthLabel,
  getGoalStatus,
  getMonthlyGoal,
  projectedMonthEndSpend,
  setMonthlyGoal,
  type GoalStatus,
} from "../lib/monthlyGoal";

const STATUS_STYLES: Record<
  GoalStatus,
  { wrap: string; label: string; value: string; sub: string; dot: string; bar: string; badge: string }
> = {
  "on-track": {
    wrap: "border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 hover:shadow-emerald-200/60",
    label: "text-emerald-700/70",
    value: "text-emerald-700",
    sub: "text-emerald-700/60",
    dot: "bg-emerald-400",
    bar: "from-emerald-400 to-teal-400",
    badge: "bg-emerald-600/90 text-white",
  },
  close: {
    wrap: "border-amber-200 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 hover:shadow-amber-200/60",
    label: "text-amber-700/70",
    value: "text-amber-700",
    sub: "text-amber-700/60",
    dot: "bg-amber-400",
    bar: "from-amber-400 to-orange-400",
    badge: "bg-amber-600/90 text-white",
  },
  over: {
    wrap: "border-rose-200 bg-gradient-to-br from-rose-100 via-rose-50 to-orange-100 hover:shadow-rose-200/60",
    label: "text-rose-700/70",
    value: "text-rose-700",
    sub: "text-rose-700/60",
    dot: "bg-rose-400",
    bar: "from-rose-500 to-rose-600",
    badge: "bg-rose-600/90 text-white",
  },
};

interface MonthlyGoalCardProps {
  monthlyExpenseTotal: number;
  dailyAverage: number;
  hideAmounts: boolean;
}

/**
 * Renders as the 4th card alongside Income / Expense / Savings.
 * Goal is stored client-side per month for now (see lib/monthlyGoal.ts);
 * swap for a real API call once the backend goals endpoint exists.
 */
export function MonthlyGoalCard({
  monthlyExpenseTotal,
  dailyAverage,
  hideAmounts,
}: MonthlyGoalCardProps) {
  const monthKey = currentMonthKey();
  const [goal, setGoal] = useState<number | null>(() => getMonthlyGoal(monthKey));
  const [modalOpen, setModalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  useEffect(() => {
    setGoal(getMonthlyGoal(monthKey));
  }, [monthKey]);

  const monthLabel = formatMonthLabel(monthKey);

  function openModal() {
    setGoalInput(goal !== null ? String(goal) : "");
    setModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(goalInput);
    if (!parsed || parsed <= 0) return;
    // TODO: call backend API to persist the goal once it exists.
    setMonthlyGoal(monthKey, parsed);
    setGoal(parsed);
    setModalOpen(false);
  }

  if (goal === null) {
    return (
      <>
        <div className="group relative flex h-[110px] flex-col gap-0.5 overflow-hidden rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-100 via-indigo-50/60 to-fuchsia-100/50 px-5 pt-3.5 pb-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold tracking-wider text-indigo-700/70 uppercase">
              🎯 Monthly Goal
            </span>
            <button
              type="button"
              onClick={openModal}
              className="rounded-full bg-indigo-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm transition-opacity duration-200 opacity-70 hover:opacity-100"
            >
              Set Goal
            </button>
          </div>
          <p className="m-0 text-base font-extrabold text-[#3f3b52]">No goal set</p>
          <p className="m-0 text-xs text-[#8c86a3]">Cap your spending for {monthLabel}.</p>
        </div>
        <GoalModal
          open={modalOpen}
          value={goalInput}
          onChange={setGoalInput}
          onSubmit={handleSave}
          onClose={() => setModalOpen(false)}
          monthLabel={monthLabel}
        />
      </>
    );
  }

  const status = getGoalStatus(monthlyExpenseTotal, goal);
  const percent = (monthlyExpenseTotal / goal) * 100;
  const remaining = goal - monthlyExpenseTotal;
  const projected = projectedMonthEndSpend(dailyAverage, monthKey);
  const styles = STATUS_STYLES[status];

  const paceTitle =
    status !== "over" && dailyAverage > 0
      ? `At this pace: ~₹${formatAmount(projected, false)} by month end`
      : undefined;

  return (
    <>
      <div
        className={`group relative flex h-[110px] flex-col gap-0.5 overflow-hidden rounded-2xl border px-5 pt-3.5 pb-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${styles.wrap}`}
      >
        <span
          className={`absolute -top-6 -right-6 h-14 w-14 rounded-full opacity-30 blur-2xl transition-transform duration-500 group-hover:scale-150 ${styles.dot}`}
        />
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-semibold tracking-wider uppercase ${styles.label}`}>
            🎯 Monthly Goal
          </span>
          <button
            type="button"
            onClick={openModal}
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm transition-opacity duration-200 opacity-70 hover:opacity-100 ${styles.badge}`}
          >
            Edit
          </button>
        </div>

        <span className={`text-xl font-extrabold tabular-nums ${styles.value}`}>
          ₹{hideAmounts ? AMOUNT_MASK : formatAmount(Math.abs(remaining), false)}
          <span className="ml-1 text-xs font-semibold opacity-70">
            {status === "over" ? "over" : "left"}
          </span>
        </span>
        <p className={`m-0 text-xs font-medium ${styles.sub}`}>
          of ₹{hideAmounts ? AMOUNT_MASK : formatAmount(goal, false)} goal
        </p>

        <div className="absolute right-3 bottom-2 left-5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/50">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${styles.bar}`}
              style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
            />
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums shadow-sm transition-transform duration-300 group-hover:scale-105 ${styles.badge}`}
            title={paceTitle}
          >
            {hideAmounts ? "••%" : `${percent.toFixed(0)}%`}
          </span>
        </div>
      </div>

      <GoalModal
        open={modalOpen}
        value={goalInput}
        onChange={setGoalInput}
        onSubmit={handleSave}
        onClose={() => setModalOpen(false)}
        monthLabel={monthLabel}
      />
    </>
  );
}

function GoalModal({
  open,
  value,
  onChange,
  onSubmit,
  onClose,
  monthLabel,
}: {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  monthLabel: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={`Set Goal for ${monthLabel}`} accent="indigo">
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <label className="text-sm font-medium text-[#6f6888]">
          How much do you want to spend this month?
        </label>
        <input
          className="w-full rounded-[9px] border border-[#ece9f4] bg-[#faf9ff] px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition-all duration-200 focus:border-indigo-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(129,80,240,0.15)] focus:outline-none"
          type="number"
          placeholder="e.g. 25000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="1"
          step="1"
          autoFocus
          required
        />
        <button
          type="submit"
          className="w-full cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-indigo-400 to-fuchsia-400 px-[1.15rem] py-[0.65rem] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(129,80,240,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(129,80,240,0.6)] active:scale-[0.97]"
        >
          Save Goal
        </button>
      </form>
    </Modal>
  );
}
