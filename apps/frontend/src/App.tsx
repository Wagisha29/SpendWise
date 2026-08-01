import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import type { Expense } from "./types";

const CATEGORIES = ["Food", "Transport", "Housing", "Utilities", "Entertainment", "Other"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const { session, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="app">
        <p>Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="app login-screen">
        <h1>Expense Tracker</h1>
        <p>Sign in to track your expenses.</p>
        <button className="google-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      </div>
    );
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
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    loadExpenses();
  }, []);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!title.trim() || !parsedAmount || parsedAmount <= 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await api.createExpense({
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
      });
      setExpenses((prev) => [created, ...prev]);
      setTitle("");
      setAmount("");
      setCategory(CATEGORIES[0]);
      setDate(todayISO());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
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

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Expense Tracker</h1>
          <p className="user-email">{userEmail}</p>
        </div>
        <div className="header-right">
          <p className="total">
            Total spent: <strong>${total.toFixed(2)}</strong>
          </p>
          <button className="signout-btn" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add Expense"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading expenses…</p>
      ) : expenses.length === 0 ? (
        <p>No expenses yet. Add your first one above.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <div className="expense-info">
                <span className="expense-title">{expense.title}</span>
                <span className="expense-meta">
                  {expense.category} · {expense.date}
                </span>
              </div>
              <div className="expense-actions">
                <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                <button className="delete-btn" onClick={() => handleDelete(expense.id)}>
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
