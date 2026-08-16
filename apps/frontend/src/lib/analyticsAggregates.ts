import { CATEGORIES } from "../categories";
import type { Expense, Income } from "../types";

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type AnalyticsMode = "monthly" | "yearly";

export interface IncomeExpensePoint {
  label: string;
  income: number;
  expense: number;
}

export type CategoryMonthPoint = { label: string } & Record<string, number | string>;

function yearOf(dateStr: string): number {
  return Number(dateStr.slice(0, 4));
}

function monthIndex(dateStr: string): number {
  return Number(dateStr.slice(5, 7)) - 1;
}

export function collectYears(income: Income[], expenses: Expense[]): number[] {
  const years = new Set<number>();
  const current = new Date().getFullYear();
  years.add(current);
  for (const entry of income) years.add(yearOf(entry.date));
  for (const expense of expenses) years.add(yearOf(expense.date));
  return Array.from(years).sort((a, b) => b - a);
}

export function buildMonthlySeries(
  income: Income[],
  expenses: Expense[],
  year: number,
): IncomeExpensePoint[] {
  const points: IncomeExpensePoint[] = MONTH_LABELS.map((label) => ({
    label,
    income: 0,
    expense: 0,
  }));

  for (const entry of income) {
    if (yearOf(entry.date) !== year) continue;
    points[monthIndex(entry.date)].income += entry.amount;
  }
  for (const expense of expenses) {
    if (yearOf(expense.date) !== year) continue;
    points[monthIndex(expense.date)].expense += expense.amount;
  }

  return points;
}

export function buildYearlySeries(
  income: Income[],
  expenses: Expense[],
): IncomeExpensePoint[] {
  const byYear = new Map<number, { income: number; expense: number }>();

  for (const entry of income) {
    const y = yearOf(entry.date);
    const row = byYear.get(y) ?? { income: 0, expense: 0 };
    row.income += entry.amount;
    byYear.set(y, row);
  }
  for (const expense of expenses) {
    const y = yearOf(expense.date);
    const row = byYear.get(y) ?? { income: 0, expense: 0 };
    row.expense += expense.amount;
    byYear.set(y, row);
  }

  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  if (years.length === 0) {
    return [{ label: String(new Date().getFullYear()), income: 0, expense: 0 }];
  }

  return years.map((y) => {
    const row = byYear.get(y)!;
    return { label: String(y), income: row.income, expense: row.expense };
  });
}

export function buildCategoryMonthlySeries(
  expenses: Expense[],
  year: number,
): { data: CategoryMonthPoint[]; activeCategories: string[] } {
  const data: CategoryMonthPoint[] = MONTH_LABELS.map((label) => {
    const point: CategoryMonthPoint = { label };
    for (const category of CATEGORIES) {
      point[category] = 0;
    }
    return point;
  });

  const used = new Set<string>();
  for (const expense of expenses) {
    if (yearOf(expense.date) !== year) continue;
    const category = CATEGORIES.includes(expense.category as (typeof CATEGORIES)[number])
      ? expense.category
      : "Others";
    const point = data[monthIndex(expense.date)];
    point[category] = Number(point[category] ?? 0) + expense.amount;
    used.add(category);
  }

  const activeCategories = CATEGORIES.filter((c) => used.has(c));
  return { data, activeCategories };
}

export function buildCategoryYearlySeries(
  expenses: Expense[],
): { data: CategoryMonthPoint[]; activeCategories: string[] } {
  const byYear = new Map<number, Record<string, number>>();

  for (const expense of expenses) {
    const y = yearOf(expense.date);
    const category = CATEGORIES.includes(expense.category as (typeof CATEGORIES)[number])
      ? expense.category
      : "Others";
    const row = byYear.get(y) ?? {};
    row[category] = (row[category] ?? 0) + expense.amount;
    byYear.set(y, row);
  }

  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  const used = new Set<string>();
  const data: CategoryMonthPoint[] = years.map((y) => {
    const row = byYear.get(y) ?? {};
    const point: CategoryMonthPoint = { label: String(y) };
    for (const category of CATEGORIES) {
      const value = row[category] ?? 0;
      point[category] = value;
      if (value > 0) used.add(category);
    }
    return point;
  });

  if (data.length === 0) {
    const empty: CategoryMonthPoint = { label: String(new Date().getFullYear()) };
    for (const category of CATEGORIES) empty[category] = 0;
    return { data: [empty], activeCategories: [] };
  }

  return { data, activeCategories: CATEGORIES.filter((c) => used.has(c)) };
}
