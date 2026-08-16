export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export type ExpenseInput = Omit<Expense, "id"> & { quantity?: number };

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
