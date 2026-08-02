export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export type ExpenseInput = Omit<Expense, "id">;

export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string;
}

export type IncomeInput = Omit<Income, "id">;
