import { supabase } from "./lib/supabaseClient";
import type { Expense, ExpenseInput } from "./types";

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

export const api = {
  listExpenses: () => request<Expense[]>("/api/expenses"),
  createExpense: (expense: ExpenseInput) =>
    request<Expense>("/api/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    }),
  deleteExpense: (id: number) =>
    request<void>(`/api/expenses/${id}`, { method: "DELETE" }),
};
