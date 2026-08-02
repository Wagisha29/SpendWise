import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { CATEGORIES, getCategoryMeta } from "./categories";
import { GoogleIcon } from "./components/GoogleIcon";
import { useAuth } from "./context/AuthContext";
import type { Expense, Income } from "./types";

type Transaction =
  | { kind: "income"; data: Income }
  | { kind: "expense"; data: Expense };

const CARD = "bg-gradient-to-b from-white to-[#fdf8f2] border border-[#ecdfcd] rounded-[14px] shadow-sm";

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
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#ecdfcd] border-t-amber-500" />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onSignIn={signInWithGoogle} />;
  }

  return <ExpenseTracker userEmail={session.user.email} onSignOut={signOut} />;
}

function LoginScreen({ onSignIn }: { onSignIn: () => Promise<void> }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(217,119,6,0.10), transparent 45%), #fbf3ea",
      }}
    >
      <div className="flex w-full max-w-[380px] flex-col items-center gap-2 rounded-[20px] border border-[#ecdfcd] bg-gradient-to-b from-white to-[#fdf8f2] px-10 py-12 text-center shadow-[0_20px_60px_-20px_rgba(120,80,40,0.18)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-[0_8px_24px_-8px_rgba(217,119,6,0.4)]">
          💸
        </div>
        <h1 className="mt-4 mb-1 text-2xl font-bold">Expense Tracker</h1>
        <p className="mb-7 text-sm leading-relaxed text-[#8a7561]">
          Track where your money goes, one expense at a time.
        </p>
        <button
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border border-[#dadce0] bg-white px-6 py-3 text-sm font-semibold text-[#3c4043] transition hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          onClick={onSignIn}
        >
          <GoogleIcon size={18} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
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

  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <div className="mx-auto max-w-[680px] px-6 pt-10 pb-16">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-xl shadow-[0_8px_24px_-8px_rgba(217,119,6,0.4)]">
            💸
          </div>
          <div>
            <h1 className="m-0 text-2xl font-semibold tracking-tight">Expense Tracker</h1>
            <p className="m-0 mt-0.5 text-[0.8rem] text-[#8a7561]">{userEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-[0.85rem] font-bold text-white"
            title={userEmail}
          >
            {initial}
          </div>
          <button
            className="cursor-pointer rounded-lg border border-[#ecdfcd] bg-transparent px-3.5 py-2 text-[0.8rem] text-[#7a6754] transition hover:border-red-400 hover:text-red-500"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 px-6 py-5 shadow-[0_12px_30px_-12px_rgba(5,150,105,0.45)]">
          <span className="text-xs tracking-wider text-white/75 uppercase">Income (this month)</span>
          <span className="text-2xl font-bold text-white">₹{monthlyIncomeTotal.toFixed(2)}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-5 shadow-[0_12px_30px_-12px_rgba(217,119,6,0.45)]">
          <span className="text-xs tracking-wider text-white/75 uppercase">Expense (this month)</span>
          <span className="text-2xl font-bold text-white">₹{monthlyExpenseTotal.toFixed(2)}</span>
        </div>
        <div
          className={`flex flex-col gap-1 rounded-2xl px-6 py-5 text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)] ${
            savings >= 0
              ? "bg-gradient-to-br from-sky-500 to-blue-600"
              : "bg-gradient-to-br from-rose-500 to-red-600"
          }`}
        >
          <span className="text-xs tracking-wider text-white/75 uppercase">Savings (this month)</span>
          <span className="text-2xl font-bold text-white">₹{savings.toFixed(2)}</span>
        </div>
      </section>

      <h2 className="mb-3 text-sm font-semibold tracking-wide text-[#8a7561] uppercase">Income</h2>

      <form
        className={`${CARD} mb-4 grid grid-cols-2 gap-2.5 p-[1.1rem] md:grid-cols-[2fr_1fr_1fr_auto_auto]`}
        onSubmit={handleIncomeSubmit}
      >
        <input
          className="rounded-[9px] border border-[#ecdfcd] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-emerald-500 focus:outline-none"
          type="text"
          placeholder="Source (e.g. Salary)"
          value={incomeSource}
          onChange={(e) => setIncomeSource(e.target.value)}
          required
        />
        <input
          className="rounded-[9px] border border-[#ecdfcd] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-emerald-500 focus:outline-none"
          type="number"
          placeholder="Amount"
          value={incomeAmount}
          onChange={(e) => setIncomeAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
        <input
          className="rounded-[9px] border border-[#ecdfcd] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-emerald-500 focus:outline-none"
          type="date"
          value={incomeDate}
          onChange={(e) => setIncomeDate(e.target.value)}
          required
        />
        <button
          type="submit"
          className="cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-emerald-500 to-green-600 px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={incomeSubmitting}
        >
          {incomeSubmitting
            ? editingIncomeId !== null ? "Saving…" : "Adding…"
            : editingIncomeId !== null ? "Save Changes" : "Add Income"}
        </button>
        {editingIncomeId !== null && (
          <button
            type="button"
            className="cursor-pointer rounded-[9px] border border-[#ecdfcd] bg-transparent px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-[#7a6754] transition hover:border-red-400 hover:text-red-500"
            onClick={resetIncomeForm}
          >
            Cancel
          </button>
        )}
      </form>

      {incomeError && <p className="mb-4 text-sm text-red-500">{incomeError}</p>}

      <h2 className="mb-3 text-sm font-semibold tracking-wide text-[#8a7561] uppercase">Expenses</h2>

      <form
        className={`${CARD} mb-6 grid grid-cols-2 gap-2.5 p-[1.1rem] md:grid-cols-[2fr_1fr_1fr_1fr_auto]`}
        onSubmit={handleSubmit}
      >
        <input
          className="rounded-[9px] border border-[#ecdfcd] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-amber-500 focus:outline-none"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="rounded-[9px] border border-[#ecdfcd] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-amber-500 focus:outline-none"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
        <select
          className="rounded-[9px] border border-[#ecdfcd] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-amber-500 focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {getCategoryMeta(c).icon} {c}
            </option>
          ))}
        </select>
        <input
          className="rounded-[9px] border border-[#ecdfcd] bg-white px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-amber-500 focus:outline-none"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button
          type="submit"
          className="cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-amber-500 to-orange-600 px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting
            ? editingId !== null ? "Saving…" : "Adding…"
            : editingId !== null ? "Save Changes" : "Add Expense"}
        </button>
        {editingId !== null && (
        <button
          type="button"
          className="cursor-pointer rounded-[9px] border border-[#ecdfcd] bg-transparent px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-[#7a6754] transition hover:border-red-400 hover:text-red-500"
          onClick={resetForm}
        >
          Cancel
        </button>
        )}
      </form>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <h2 className="mb-3 text-sm font-semibold tracking-wide text-[#8a7561] uppercase">Transactions</h2>

      {loading || incomeLoading ? (
        <div className="flex min-h-32 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#ecdfcd] border-t-amber-500" />
        </div>
      ) : transactions.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#8a7561]`}>
          <div className="text-[2.25rem]">🧾</div>
          <p>No transactions yet. Add income or an expense above.</p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {transactions.map((item) => {
            if (item.kind === "income") {
              const entry = item.data;
              return (
                <li
                  key={`income-${entry.id}`}
                  className={`${CARD} flex items-center gap-3.5 px-[1.1rem] py-[0.85rem] transition hover:border-[#c8e6d5]`}
                >
                  <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-[10px] bg-emerald-500/15 text-lg text-emerald-600">
                    💰
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                    <span className="truncate font-semibold">{entry.source}</span>
                    <span className="text-[0.8rem] text-[#8a7561]">Income · {entry.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold whitespace-nowrap text-emerald-600">
                      + ₹{entry.amount.toFixed(2)}
                    </span>
                    <button
                      className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a8927a] transition hover:bg-emerald-400/10 hover:text-emerald-600"
                      onClick={() => handleIncomeEditClick(entry)}
                      aria-label="Edit income"
                    >
                      ✎
                    </button>
                    <button
                      className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a8927a] transition hover:bg-red-400/10 hover:text-red-500"
                      onClick={() => handleIncomeDelete(entry.id)}
                      aria-label="Delete income"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            }

            const expense = item.data;
            const meta = getCategoryMeta(expense.category);
            return (
              <li
                key={`expense-${expense.id}`}
                className={`${CARD} flex items-center gap-3.5 px-[1.1rem] py-[0.85rem] transition hover:border-[#e0cfb0]`}
              >
                <div
                  className="flex h-10 w-10 min-w-10 items-center justify-center rounded-[10px] text-lg"
                  style={{ background: `${meta.color}26`, color: meta.color }}
                >
                  {meta.icon}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                  <span className="truncate font-semibold">{expense.title}</span>
                  <span className="text-[0.8rem] text-[#8a7561]">
                    {expense.category} · {expense.date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold whitespace-nowrap text-red-600">
                    - ₹{expense.amount.toFixed(2)}
                  </span>
                  <button
                    className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a8927a] transition hover:bg-amber-400/10 hover:text-amber-600"
                    onClick={() => handleEditClick(expense)}
                    aria-label="Edit expense"
                  >
                    ✎
                  </button>
                  <button
                    className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#a8927a] transition hover:bg-red-400/10 hover:text-red-500"
                    onClick={() => handleDelete(expense.id)}
                    aria-label="Delete expense"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
