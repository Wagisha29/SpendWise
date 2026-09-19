import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { AMOUNT_MASK, CARD, formatAmount } from "../lib/ui";
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
  { ring: string; bar: string; badge: string }
> = {
  "on-track": {
    ring: "border-emerald-200",
    bar: "from-emerald-400 to-teal-400",
    badge: "bg-emerald-600/90 text-white",
  },
  close: {
    ring: "border-amber-200",
    bar: "from-amber-400 to-orange-400",
    badge: "bg-amber-600/90 text-white",
  },
  over: {
    ring: "border-rose-300",
    bar: "from-rose-500 to-rose-600",
    badge: "bg-rose-600/90 text-white",
  },
};

interface MonthlyGoalCardProps {
  monthlyExpenseTotal: number;
  dailyAverage: number;
  hideAmounts: boolean;
}

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
        <div
          className={`${CARD} mb-6 flex flex-wrap items-center justify-between gap-3 border-dashed px-6 py-5`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
              🎯
            </span>
            <div>
              <p className="m-0 text-sm font-semibold text-[#3f3b52]">No spending goal set</p>
              <p className="m-0 text-xs text-[#8c86a3]">
                Set a monthly limit to keep {monthLabel} on track.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-indigo-400 to-fuchsia-400 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-[0_4px_14px_-4px_rgba(129,80,240,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(129,80,240,0.6)] active:scale-[0.97]"
          >
            Set Goal
          </button>
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

  const statusMessage = {
    "on-track": `✅ On track — ₹${hideAmounts ? AMOUNT_MASK : formatAmount(remaining, false)} left to spend`,
    close: `⚠️ Getting close — ₹${hideAmounts ? AMOUNT_MASK : formatAmount(remaining, false)} left`,
    over: `🚨 Over budget by ₹${hideAmounts ? AMOUNT_MASK : formatAmount(Math.abs(remaining), false)}`,
  }[status];

  return (
    <>
      <div className={`${CARD} mb-6 border px-6 py-5 ${styles.ring}`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#8c86a3] uppercase">
            🎯 Monthly Goal · {monthLabel}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums shadow-sm ${styles.badge}`}
            >
              {hideAmounts ? "••%" : `${percent.toFixed(0)}%`}
            </span>
            <button
              type="button"
              onClick={openModal}
              className="cursor-pointer rounded-full px-2 py-1 text-xs font-semibold text-[#8c86a3] transition-colors duration-200 hover:bg-[#f4f2ff] hover:text-[#6d5fdb]"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="mb-2 flex flex-wrap items-end justify-between gap-1">
          <span className="text-2xl font-extrabold tabular-nums text-[#3f3b52]">
            ₹{hideAmounts ? AMOUNT_MASK : formatAmount(monthlyExpenseTotal, false)}
          </span>
          <span className="text-sm font-medium text-[#8c86a3]">
            of ₹{hideAmounts ? AMOUNT_MASK : formatAmount(goal, false)} goal
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f1effa]">
          <div
            className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${styles.bar}`}
            style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-1 text-xs">
          <p className="m-0 font-medium text-[#6f6888]">{statusMessage}</p>
          {status !== "over" && dailyAverage > 0 && (
            <p className="m-0 text-[#8c86a3]">
              Pace: ~₹{hideAmounts ? AMOUNT_MASK : formatAmount(projected, false)} by month end
            </p>
          )}
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
