export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export type ExpenseInput = Omit<Expense, "id"> & { quantity?: number };

export interface ExpenseListResponse {
  items: Expense[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface Summary {
  income: number;
  expense: number;
  savings: number;
}

export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string;
}

export type IncomeInput = Omit<Income, "id">;

export type Transaction =
  | { kind: "income"; data: Income }
  | { kind: "expense"; data: Expense };

export interface FilterListResponse {
  items: Transaction[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export type TransactionFilterParams = {
  type?: "all" | "income" | "expense";
  category?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: string;
  max_amount?: string;
  q?: string;
  page?: number;
  page_size?: number;
};
