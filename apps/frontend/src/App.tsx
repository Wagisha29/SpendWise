import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { CATEGORIES } from "./categories";
import { AnalyticsView } from "./components/AnalyticsView";
import { DashboardView } from "./components/DashboardView";
import { Header, type AppTab } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { SummaryCards } from "./components/SummaryCards";
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
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#ece9f4] border-t-indigo-400" />
      </div>
    );
  }

  if (!session) {
    return <LandingPage onSignIn={signInWithGoogle} />;
  }

  const userName = session.user.user_metadata?.full_name ?? session.user.user_metadata?.name;

  return (
    <SpendWiseApp userName={userName} userEmail={session.user.email} onSignOut={signOut} />
  );
}

function SpendWiseApp({
  userName,
  userEmail,
  onSignOut,
}: {
  userName: string | undefined;
  userEmail: string | undefined;
  onSignOut: () => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [date, setDate] = useState(todayISO());
  const [editingId, setEditingId] = useState<number | null>(null);

  const [privacyMode, setPrivacyMode] = useState(() => localStorage.getItem("privacyMode") === "true");

  useEffect(() => {
    localStorage.setItem("privacyMode", String(privacyMode));
  }, [privacyMode]);

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
    setActiveTab("dashboard");
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
    requestAnimationFrame(() => {
      document.getElementById("expense-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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

      if (editingId !== null) {
        const updated = await api.updateExpense(editingId, payload);
        setExpenses((prev) => prev.map((expense) => (expense.id === editingId ? updated : expense)));
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
    setActiveTab("dashboard");
    setEditingIncomeId(incomeEntry.id);
    setIncomeSource(incomeEntry.source);
    setIncomeAmount(String(incomeEntry.amount));
    setIncomeDate(incomeEntry.date);
    requestAnimationFrame(() => {
      document.getElementById("income-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
        setIncome((prev) => prev.map((entry) => (entry.id === editingIncomeId ? updated : entry)));
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

  const monthlyExpenses = useMemo(
    () => expenses.filter((expense) => isCurrentMonth(expense.date)),
    [expenses],
  );

  const topExpenses = useMemo(
    () => [...monthlyExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5),
    [monthlyExpenses],
  );

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
    <div className="animate-fade-in-up mx-auto max-w-[1200px] px-6 pt-10 pb-16 lg:px-12">
      <Header
        userName={userName}
        userEmail={userEmail}
        privacyMode={privacyMode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTogglePrivacy={() => setPrivacyMode((prev) => !prev)}
        onSignOut={onSignOut}
      />

      <SummaryCards
        income={monthlyIncomeTotal}
        expense={monthlyExpenseTotal}
        savings={savings}
        hideAmounts={privacyMode}
      />

      {activeTab === "dashboard" && (
        <DashboardView
          hideAmounts={privacyMode}
          loading={loading || incomeLoading}
          incomeSource={incomeSource}
          incomeAmount={incomeAmount}
          incomeDate={incomeDate}
          incomeSubmitting={incomeSubmitting}
          incomeError={incomeError}
          editingIncomeId={editingIncomeId}
          onIncomeSourceChange={setIncomeSource}
          onIncomeAmountChange={setIncomeAmount}
          onIncomeDateChange={setIncomeDate}
          onIncomeSubmit={handleIncomeSubmit}
          onIncomeCancel={resetIncomeForm}
          title={title}
          amount={amount}
          category={category}
          date={date}
          submitting={submitting}
          error={error}
          editingId={editingId}
          onTitleChange={setTitle}
          onAmountChange={setAmount}
          onCategoryChange={setCategory}
          onDateChange={setDate}
          onExpenseSubmit={handleSubmit}
          onExpenseCancel={resetForm}
          transactions={transactions}
          onEditIncome={handleIncomeEditClick}
          onDeleteIncome={handleIncomeDelete}
          onEditExpense={handleEditClick}
          onDeleteExpense={handleDelete}
        />
      )}

      {activeTab === "analytics" && (
        <AnalyticsView
          monthlyExpenses={monthlyExpenses}
          topExpenses={topExpenses}
          hideAmounts={privacyMode}
        />
      )}
    </div>
  );
}

export default App;
