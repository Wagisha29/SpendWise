import { supabase } from "./lib/supabaseClient";
import type { Expense, ExpenseInput, ExpenseListResponse, Income, IncomeInput, Summary } from "./types";

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
    const detail = body?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: { msg?: string }) => d.msg ?? JSON.stringify(d)).join("; ")
          : `Request failed with status ${response.status}`;
    throw new Error(message);
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
  listExpenses: (page = 1, pageSize = 10) =>
    request<ExpenseListResponse>(
      `/api/expenses?page=${page}&page_size=${pageSize}&op=listExpenses`,
    ),
  getSummary: () => request<Summary>("/api/summary?op=getSummary"),
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
  askWiseBot: (message: string) =>
    request<{ reply: string }>("/api/wisebot/chat?op=askWiseBot", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  askWiseBotStream: async (
    message: string,
    onDelta: (delta: string) => void,
  ): Promise<void> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch(`${API_BASE_URL}/api/wisebot/chat/stream?op=askWiseBotStream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const detail = body?.detail;
      const errMessage =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((d: { msg?: string }) => d.msg ?? JSON.stringify(d)).join("; ")
            : `Request failed with status ${response.status}`;
      throw new Error(errMessage);
    }

    if (!response.body) {
      throw new Error("Streaming is not supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n\n");
      buffer = frames.pop() ?? "";

      for (const frame of frames) {
        const dataLine = frame
          .split("\n")
          .map((line) => line.trimEnd())
          .find((line) => line.startsWith("data:"));
        if (!dataLine) continue;

        const raw = dataLine.replace(/^data:\s?/, "");
        if (!raw || raw === "[DONE]") continue;

        let payload: { delta?: string; done?: boolean; error?: string };
        try {
          payload = JSON.parse(raw) as { delta?: string; done?: boolean; error?: string };
        } catch {
          continue;
        }

        if (payload.error) {
          throw new Error(payload.error);
        }
        if (payload.delta) {
          onDelta(payload.delta);
        }
      }
    }
  },
};
