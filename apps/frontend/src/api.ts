import { supabase } from "./lib/supabaseClient";
import type { Expense, ExpenseInput, Income, IncomeInput } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// The "?op=" query param is purely cosmetic: it makes each call show up with
// a readable name (e.g. "6?op=updateExpense") in the browser's Network tab,
// since Chrome names requests after the last URL segment + query string.
// The backend ignores unknown query params, so this has no effect on behavior.
export const api = {
  listExpenses: () => request<Expense[]>("/api/expenses?op=listExpenses"),
  createExpense: (expense: ExpenseInput) =>
    request<Expense>("/api/expenses?op=createExpense", {
      method: "POST",
      body: JSON.stringify(expense),
    }),
  deleteExpense: (id: number) =>
    request<void>(`/api/expenses/${id}?op=deleteExpense`, { method: "DELETE" }),
  updateExpense: (id: number, expense: ExpenseInput) =>
    request<Expense>(`/api/expenses/${id}?op=updateExpense`, {
      method: "PATCH",
      body: JSON.stringify(expense),
    }),
  listIncome: () => request<Income[]>("/api/income?op=listIncome"),
  createIncome: (income: IncomeInput) =>
    request<Income>("/api/income?op=createIncome", {
      method: "POST",
      body: JSON.stringify(income),
    }),
  deleteIncome: (id: number) =>
    request<void>(`/api/income/${id}?op=deleteIncome`, { method: "DELETE" }),
  updateIncome: (id: number, income: IncomeInput) =>
    request<Income>(`/api/income/${id}?op=updateIncome`, {
      method: "PATCH",
      body: JSON.stringify(income),
    }),
};
