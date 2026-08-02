import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { CATEGORIES, getCategoryMeta } from "./categories";
import { GoogleIcon } from "./components/GoogleIcon";
import { useAuth } from "./context/AuthContext";
import type { Expense } from "./types";

const CARD = "bg-gradient-to-b from-[#1a1a1f] to-[#16161a] border border-[#2a2a30] rounded-[14px] shadow-sm";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const { session, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#2a2a30] border-t-indigo-500" />
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
          "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(139,92,246,0.14), transparent 45%), #0f0f12",
      }}
    >
      <div className="flex w-full max-w-[380px] flex-col items-center gap-2 rounded-[20px] border border-[#2a2a30] bg-gradient-to-b from-[#1a1a1f] to-[#151518] px-10 py-12 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)]">
          💸
        </div>
        <h1 className="mt-4 mb-1 text-2xl font-bold">Expense Tracker</h1>
        <p className="mb-7 text-sm leading-relaxed text-[#9a9a9a]">
          Track where your money goes, one expense at a time.
        </p>
        <button
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border border-[#dadce0] bg-white px-6 py-3 text-sm font-semibold text-[#3c4043] transition hover:shadow-[0_4px_14px_rgba(0,0,0,0.35)] active:scale-[0.98]"
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

  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <div className="mx-auto max-w-[680px] px-6 pt-10 pb-16">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)]">
            💸
          </div>
          <div>
            <h1 className="m-0 text-2xl font-semibold tracking-tight">Expense Tracker</h1>
            <p className="m-0 mt-0.5 text-[0.8rem] text-[#8a8a8a]">{userEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[0.85rem] font-bold text-white"
            title={userEmail}
          >
            {initial}
          </div>
          <button
            className="cursor-pointer rounded-lg border border-[#2f2f36] bg-transparent px-3.5 py-2 text-[0.8rem] text-[#c4c4c4] transition hover:border-red-400 hover:text-red-400"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mb-6 flex flex-col gap-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 px-7 py-6 shadow-[0_12px_30px_-12px_rgba(99,102,241,0.55)]">
        <span className="text-xs tracking-wider text-white/75 uppercase">Total spent</span>
        <span className="text-4xl font-bold text-white">₹{total.toFixed(2)}</span>
        <span className="text-sm text-white/75">
          {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
        </span>
      </section>

      <form
        className={`${CARD} mb-6 grid grid-cols-2 gap-2.5 p-[1.1rem] md:grid-cols-[2fr_1fr_1fr_1fr_auto]`}
        onSubmit={handleSubmit}
      >
        <input
          className="rounded-[9px] border border-[#2f2f36] bg-[#101013] px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-indigo-500 focus:outline-none"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="rounded-[9px] border border-[#2f2f36] bg-[#101013] px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-indigo-500 focus:outline-none"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
        <select
          className="rounded-[9px] border border-[#2f2f36] bg-[#101013] px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-indigo-500 focus:outline-none"
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
          className="rounded-[9px] border border-[#2f2f36] bg-[#101013] px-[0.7rem] py-[0.6rem] text-[0.9rem] text-inherit transition focus:border-indigo-500 focus:outline-none"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button
          type="submit"
          className="cursor-pointer rounded-[9px] border-none bg-gradient-to-br from-indigo-500 to-violet-500 px-[1.15rem] py-[0.6rem] font-semibold whitespace-nowrap text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Adding…" : "Add Expense"}
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="flex min-h-32 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#2a2a30] border-t-indigo-500" />
        </div>
      ) : expenses.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center gap-2 px-6 py-12 text-center text-[#9a9a9a]`}>
          <div className="text-[2.25rem]">🧾</div>
          <p>No expenses yet. Add your first one above.</p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {expenses.map((expense) => {
            const meta = getCategoryMeta(expense.category);
            return (
              <li
                key={expense.id}
                className={`${CARD} flex items-center gap-3.5 px-[1.1rem] py-[0.85rem] transition hover:border-[#3a3a42]`}
              >
                <div
                  className="flex h-10 w-10 min-w-10 items-center justify-center rounded-[10px] text-lg"
                  style={{ background: `${meta.color}26`, color: meta.color }}
                >
                  {meta.icon}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                  <span className="truncate font-semibold">{expense.title}</span>
                  <span className="text-[0.8rem] text-[#8a8a8a]">
                    {expense.category} · {expense.date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold whitespace-nowrap text-red-400">
                    ₹{expense.amount.toFixed(2)}
                  </span>
                  <button
                    className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-base leading-none text-[#6a6a6a] transition hover:bg-red-400/10 hover:text-red-400"
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
