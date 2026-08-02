import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { CATEGORIES } from "./categories";
import { ExpenseForm } from "./components/ExpenseForm";
import { Header } from "./components/Header";
import { IncomeForm } from "./components/IncomeForm";
import { LoginScreen } from "./components/LoginScreen";
import { SummaryCards } from "./components/SummaryCards";
import { TransactionsList } from "./components/TransactionsList";
import { useAuth } from "./context/AuthContext";
import type { Expense, Income, Transaction } from "./types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonthKey() {
  return todayISO().slice(0, 7);
}

function isCurrentMonth(dateStr: string) {
  return dateStr.slice(0, 7) === currentMonthKey();
}

function App() {
  const { session, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#ece9f4] border-t-violet-300" />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onSignIn={signInWithGoogle} />;
  }

  return <ExpenseTracker userEmail={session.user.email} onSignOut={signOut} />;
}

function ExpenseTracker({
  userEmail,
  onSignOut,
}: {
  userEmail: string | undefined;
  onSignOut: () => Promise<void>;
}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [date, setDate] = useState(todayISO());
  const [editingId, setEditingId] = useState<number | null>(null);

  const [income, setIncome] = useState<Income[]>([]);
  const [incomeLoading, setIncomeLoading] = useState(true);
  const [incomeError, setIncomeError] = useState<string | null>(null);
  const [incomeSubmitting, setIncomeSubmitting] = useState(false);

  const [incomeSource, setIncomeSource] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDate, setIncomeDate] = useState(todayISO());
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);

  useEffect(() => {
    loadExpenses();
    loadIncome();
  }, []);

  function handleEditClick(expense: Expense) {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
  }

  async function loadExpenses() {
    setLoading(true);
    setError(null);
    try {
      setExpenses(await api.listExpenses());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }
  function resetForm() {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setCategory(CATEGORIES[0]);
    setDate(todayISO());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!title.trim() || !parsedAmount || parsedAmount <= 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = { title: title.trim(), amount: parsedAmount, category, date };

      if(editingId !== null){
        const updated = await api.updateExpense(editingId, payload);
        setExpenses((prev) =>
          prev.map((expense) => (expense.id === editingId ? updated : expense)),
        );
      } else {
        const created = await api.createExpense(payload);
        setExpenses((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editingId !== null
            ? "Failed to update expense"
            : "Failed to add expense",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense");
    }
  }

  function handleIncomeEditClick(incomeEntry: Income) {
    setEditingIncomeId(incomeEntry.id);
    setIncomeSource(incomeEntry.source);
    setIncomeAmount(String(incomeEntry.amount));
    setIncomeDate(incomeEntry.date);
  }

  async function loadIncome() {
    setIncomeLoading(true);
    setIncomeError(null);
    try {
      setIncome(await api.listIncome());
    } catch (err) {
      setIncomeError(err instanceof Error ? err.message : "Failed to load income");
    } finally {
      setIncomeLoading(false);
    }
  }

  function resetIncomeForm() {
    setEditingIncomeId(null);
    setIncomeSource("");
    setIncomeAmount("");
    setIncomeDate(todayISO());
  }

  async function handleIncomeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(incomeAmount);
    if (!incomeSource.trim() || !parsedAmount || parsedAmount <= 0) return;

    setIncomeSubmitting(true);
    setIncomeError(null);
    try {
      const payload = { source: incomeSource.trim(), amount: parsedAmount, date: incomeDate };

      if (editingIncomeId !== null) {
        const updated = await api.updateIncome(editingIncomeId, payload);
        setIncome((prev) =>
          prev.map((entry) => (entry.id === editingIncomeId ? updated : entry)),
        );
      } else {
        const created = await api.createIncome(payload);
        setIncome((prev) => [created, ...prev]);
      }
      resetIncomeForm();
    } catch (err) {
      setIncomeError(
        err instanceof Error
          ? err.message
          : editingIncomeId !== null
            ? "Failed to update income"
            : "Failed to add income",
      );
    } finally {
      setIncomeSubmitting(false);
    }
  }

  async function handleIncomeDelete(id: number) {
    try {
      await api.deleteIncome(id);
      setIncome((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      setIncomeError(err instanceof Error ? err.message : "Failed to delete income");
    }
  }

  const monthlyExpenseTotal = useMemo(
    () =>
      expenses
        .filter((expense) => isCurrentMonth(expense.date))
        .reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const monthlyIncomeTotal = useMemo(
    () =>
      income
        .filter((entry) => isCurrentMonth(entry.date))
        .reduce((sum, entry) => sum + entry.amount, 0),
    [income],
  );

  const savings = monthlyIncomeTotal - monthlyExpenseTotal;

  const transactions = useMemo<Transaction[]>(() => {
    const items: Transaction[] = [
      ...income.map((entry) => ({ kind: "income" as const, data: entry })),
      ...expenses.map((entry) => ({ kind: "expense" as const, data: entry })),
    ];
    return items.sort((a, b) => {
      if (a.data.date !== b.data.date) return a.data.date < b.data.date ? 1 : -1;
      return b.data.id - a.data.id;
    });
  }, [income, expenses]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-16 lg:px-12">
      <Header userEmail={userEmail} onSignOut={onSignOut} />

      <SummaryCards income={monthlyIncomeTotal} expense={monthlyExpenseTotal} savings={savings} />

      <div className="mb-2 grid grid-cols-1 gap-x-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">Income</h2>
          <IncomeForm
            source={incomeSource}
            amount={incomeAmount}
            date={incomeDate}
            onSourceChange={setIncomeSource}
            onAmountChange={setIncomeAmount}
            onDateChange={setIncomeDate}
            onSubmit={handleIncomeSubmit}
            onCancel={resetIncomeForm}
            submitting={incomeSubmitting}
            isEditing={editingIncomeId !== null}
          />
          {incomeError && <p className="mb-4 text-sm text-red-500">{incomeError}</p>}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">Expenses</h2>
          <ExpenseForm
            title={title}
            amount={amount}
            category={category}
            date={date}
            onTitleChange={setTitle}
            onAmountChange={setAmount}
            onCategoryChange={setCategory}
            onDateChange={setDate}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            submitting={submitting}
            isEditing={editingId !== null}
          />
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold tracking-wide text-[#8c86a3] uppercase">Transactions</h2>
      <TransactionsList
        transactions={transactions}
        loading={loading || incomeLoading}
        onEditIncome={handleIncomeEditClick}
        onDeleteIncome={handleIncomeDelete}
        onEditExpense={handleEditClick}
        onDeleteExpense={handleDelete}
      />
    </div>
  );
}

export default App;
