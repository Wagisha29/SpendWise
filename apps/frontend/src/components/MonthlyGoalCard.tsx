import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { STRINGS } from "../constants/strings";
import { AMOUNT_MASK, formatAmount } from "../lib/ui";
import { currentMonthKey } from "../lib/dates";
import { api } from "../api";
import {
  formatMonthLabel,
  getGoalStatus,
  projectedMonthEndSpend,
  type GoalStatus,
} from "../lib/monthlyGoal";

const STATUS_STYLES: Record<
  GoalStatus,
  { wrap: string; label: string; value: string; sub: string; dot: string; bar: string; badge: string }
> = {
  "on-track": {
    wrap: "border-emerald-200 bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 hover:shadow-emerald-200/60 dark:border-emerald-800/50 dark:from-emerald-500/15 dark:via-emerald-500/5 dark:to-teal-500/10 dark:hover:shadow-emerald-900/40",
    label: "text-emerald-700/70 dark:text-emerald-300/80",
    value: "text-emerald-700 dark:text-emerald-300",
    sub: "text-emerald-700/60 dark:text-emerald-300/70",
    dot: "bg-emerald-400",
    bar: "from-emerald-400 to-teal-400",
    badge: "bg-emerald-600/90 text-white",
  },
  close: {
    wrap: "border-amber-200 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 hover:shadow-amber-200/60 dark:border-amber-800/50 dark:from-amber-500/15 dark:via-amber-500/5 dark:to-orange-500/10 dark:hover:shadow-amber-900/40",
    label: "text-amber-700/70 dark:text-amber-300/80",
    value: "text-amber-700 dark:text-amber-300",
    sub: "text-amber-700/60 dark:text-amber-300/70",
    dot: "bg-amber-400",
    bar: "from-amber-400 to-orange-400",
    badge: "bg-amber-600/90 text-white",
  },
  over: {
    wrap: "border-rose-200 bg-gradient-to-br from-rose-100 via-rose-50 to-orange-100 hover:shadow-rose-200/60 dark:border-rose-800/50 dark:from-rose-500/15 dark:via-rose-500/5 dark:to-orange-500/10 dark:hover:shadow-rose-900/40",
    label: "text-rose-700/70 dark:text-rose-300/80",
    value: "text-rose-700 dark:text-rose-300",
    sub: "text-rose-700/60 dark:text-rose-300/70",
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
 * Goal is persisted server-side via GET/PUT /api/goals/{month} — see
 * src/api.ts and apps/backend/app/routers/goal.py.
 */
export function MonthlyGoalCard({
  monthlyExpenseTotal,
  dailyAverage,
  hideAmounts,
}: MonthlyGoalCardProps) {
  const monthKey = currentMonthKey();
  const [goal, setGoal] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getGoal(monthKey)
      .then((result) => {
        if (!cancelled) setGoal(result?.amount ?? null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : STRINGS.errors.loadGoal);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [monthKey]);

  const monthLabel = formatMonthLabel(monthKey);

  function openModal() {
    setError(null);
    setGoalInput(goal !== null ? String(goal) : "");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(goalInput);
    if (!parsed || parsed <= 0) return;

    setSaving(true);
    setError(null);
    try {
      const saved = await api.upsertGoal(monthKey, parsed);
      setGoal(saved.amount);
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : STRINGS.errors.saveGoal);
    } finally {
      setSaving(false);
    }
  }

  if (goal === null) {
    return (
      <>
        <div className="group relative flex h-[92px] flex-col gap-0.5 overflow-hidden rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-100 via-indigo-50/60 to-fuchsia-100/50 px-3.5 pt-3 pb-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[110px] sm:px-5 sm:pt-3.5 sm:pb-3.5 dark:border-indigo-700/60 dark:from-indigo-500/15 dark:via-indigo-500/5 dark:to-fuchsia-500/10">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[0.65rem] font-semibold tracking-wider text-indigo-700/70 uppercase sm:text-xs dark:text-indigo-300/80">
              🎯 {STRINGS.goal.label}
            </span>
            <button
              type="button"
              onClick={openModal}
              className="shrink-0 rounded-full bg-indigo-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm transition-opacity duration-200 opacity-70 hover:opacity-100"
            >
              {STRINGS.goal.setGoal}
            </button>
          </div>
          <p className="m-0 truncate text-sm font-extrabold text-[var(--tx-strong)] sm:text-base">
            {STRINGS.goal.noGoalSet}
          </p>
          <p className="m-0 truncate text-[0.68rem] text-[var(--tx-muted)] sm:text-xs">
            {STRINGS.goal.capSpendingFor(monthLabel)}
          </p>
        </div>
        <GoalModal
          open={modalOpen}
          value={goalInput}
          onChange={setGoalInput}
          onSubmit={handleSave}
          onClose={() => setModalOpen(false)}
          monthLabel={monthLabel}
          saving={saving}
          error={error}
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
      ? STRINGS.goal.pace(formatAmount(projected, false))
      : undefined;

  return (
    <>
      <div
        className={`group relative flex h-[92px] flex-col gap-0.5 overflow-hidden rounded-2xl border px-3.5 pt-3 pb-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[110px] sm:px-5 sm:pt-3.5 sm:pb-3.5 ${styles.wrap}`}
      >
        <span
          className={`absolute -top-6 -right-6 h-14 w-14 rounded-full opacity-30 blur-2xl transition-transform duration-500 group-hover:scale-150 ${styles.dot}`}
        />
        <div className="flex items-center justify-between gap-2">
          <span className={`truncate text-[0.65rem] font-semibold tracking-wider uppercase sm:text-xs ${styles.label}`}>
            🎯 {STRINGS.goal.label}
          </span>
          <button
            type="button"
            onClick={openModal}
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm transition-opacity duration-200 opacity-70 hover:opacity-100 ${styles.badge}`}
          >
            {STRINGS.goal.edit}
          </button>
        </div>

        <span className={`truncate text-base font-extrabold tabular-nums sm:text-xl ${styles.value}`}>
          ₹{hideAmounts ? AMOUNT_MASK : formatAmount(Math.abs(remaining), false)}
          <span className="ml-1 text-[0.65rem] font-semibold opacity-70 sm:text-xs">
            {status === "over" ? STRINGS.goal.over : STRINGS.goal.left}
          </span>
        </span>
        <p className={`m-0 truncate text-[0.68rem] font-medium sm:text-xs ${styles.sub}`}>
          {STRINGS.goal.ofGoal(`₹${hideAmounts ? AMOUNT_MASK : formatAmount(goal, false)}`)}
        </p>

        <div className="absolute right-2.5 bottom-2 left-3.5 flex items-center justify-end gap-2 sm:right-3 sm:left-5">
          <div className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-white/50 sm:block dark:bg-black/25">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${styles.bar}`}
              style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
            />
          </div>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums shadow-sm transition-transform duration-300 group-hover:scale-105 sm:px-2 sm:text-[11px] ${styles.badge}`}
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
        saving={saving}
        error={error}
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
  saving,
  error,
}: {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  monthLabel: string;
  saving: boolean;
  error: string | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title={STRINGS.goal.modalTitle(monthLabel)} accent="indigo">
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <label className="text-sm font-medium text-[var(--tx-muted)]">{STRINGS.goal.modalQuestion}</label>
        <input
          className="w-full rounded-[9px] border border-[var(--bd-subtle)] bg-[var(--surf-tint)] px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition-all duration-200 focus:border-indigo-300 focus:bg-[var(--surf-card)] focus:shadow-[0_0_0_3px_rgba(129,80,240,0.15)] focus:outline-none"
          type="number"
          placeholder={STRINGS.goal.amountPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="1"
          step="1"
          autoFocus
          required
        />
        {error && <p className="m-0 text-sm font-medium text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-indigo-400 to-fuchsia-400 px-[1.15rem] py-[0.65rem] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(129,80,240,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(129,80,240,0.6)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? STRINGS.goal.saving : STRINGS.goal.save}
        </button>
      </form>
    </Modal>
  );
}
