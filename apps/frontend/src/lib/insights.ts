import { getCategoryMeta } from "../categories";
import type { Expense } from "../types";

export function monthKeyFromDate(date: Date = new Date()): string {
  return date.toISOString().slice(0, 7);
}

export function previousMonthKey(from: Date = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth() - 1, 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function sumExpensesForMonth(expenses: Expense[], monthKey: string): number {
  return expenses
    .filter((expense) => expense.date.slice(0, 7) === monthKey)
    .reduce((sum, expense) => sum + expense.amount, 0);
}

/** Positive = spent more than last month; negative = spent less. */
export function monthOverMonthDeltaPercent(
  thisMonthTotal: number,
  lastMonthTotal: number,
): number | null {
  if (lastMonthTotal <= 0) return null;
  return ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
}

export function averageDailySpend(monthExpenseTotal: number, dayOfMonth: number = new Date().getDate()): number {
  const day = Math.max(dayOfMonth, 1);
  return monthExpenseTotal / day;
}

export function topSpendingCategory(expenses: Expense[]): {
  category: string;
  amount: number;
  percent: number;
  icon: string;
} | null {
  if (expenses.length === 0) return null;

  const totals = new Map<string, number>();
  let total = 0;
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
    total += expense.amount;
  }
  if (total <= 0) return null;

  let topCategory = "";
  let topAmount = 0;
  for (const [category, amount] of totals) {
    if (amount > topAmount) {
      topCategory = category;
      topAmount = amount;
    }
  }

  const meta = getCategoryMeta(topCategory);
  return {
    category: topCategory,
    amount: topAmount,
    percent: (topAmount / total) * 100,
    icon: meta.icon,
  };
}
