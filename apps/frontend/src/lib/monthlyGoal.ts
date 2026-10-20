/**
 * Pure display/calculation helpers for the monthly goal card.
 * Goal persistence itself lives server-side — see src/api.ts (getGoal /
 * upsertGoal) and the backend's apps/backend/app/routers/goal.py.
 */

export type GoalStatus = "on-track" | "close" | "over";

/** Under 70% of goal = on-track, 70-99% = close, 100%+ = over. */
export function getGoalStatus(spent: number, goal: number): GoalStatus {
  if (goal <= 0) return "on-track";
  const ratio = spent / goal;
  if (ratio >= 1) return "over";
  if (ratio >= 0.7) return "close";
  return "on-track";
}

export function daysInMonth(monthKey: string): number {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

/** Naive month-end projection: today's daily average x days in month. */
export function projectedMonthEndSpend(dailyAverage: number, monthKey: string): number {
  return dailyAverage * daysInMonth(monthKey);
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
