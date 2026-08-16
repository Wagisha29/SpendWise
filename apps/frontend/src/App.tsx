import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { CATEGORIES } from "./categories";
import { AnalyticsView } from "./components/AnalyticsView";
import { DashboardView } from "./components/DashboardView";
import { Header, type AppTab } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { SummaryCards } from "./components/SummaryCards";
import { useAuth } from "./context/AuthContext";
import {
  averageDailySpend,
  monthOverMonthDeltaPercent,
  previousMonthKey,
  sumExpensesForMonth,
  topSpendingCategory,
} from "./lib/insights";
import type { Expense, Income, Summary, Transaction } from "./types";

const EXPENSE_PAGE_SIZE = 10;

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
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [expensePage, setExpensePage] = useState(1);
  const [expenseTotalPages, setExpenseTotalPages] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("1");
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
    void loadExpenses(1);
    void loadSummary();
    void loadIncome();
  }, []);

  // Analytics still needs history; load it only when that tab opens.
  useEffect(() => {
    if (activeTab === "analytics") {
      void loadAllExpenses();
    }
  }, [activeTab]);

  function handleEditClick(expense: Expense) {
    setActiveTab("dashboard");
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setQuantity("1");
    setCategory(expense.category);
    setDate(expense.date);
    requestAnimationFrame(() => {
      document.getElementById("expense-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function loadSummary() {
    try {
      setSummary(await api.getSummary());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load summary");
    }
  }

  async function loadAllExpenses() {
    try {
      const first = await api.listExpenses(1, 100);
      const items = [...first.items];
      for (let page = 2; page <= first.total_pages; page++) {
        const next = await api.listExpenses(page, 100);
        items.push(...next.items);
      }
      setAllExpenses(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    }
  }

  async function loadExpenses(page: number) {
    setLoading(true);
    setError(null);
    try {
      const result = await api.listExpenses(page, EXPENSE_PAGE_SIZE);
      setExpenses(result.items);
      setExpensePage(result.page);
      setExpenseTotalPages(result.total_pages);
      setExpenseTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  async function refreshExpenses(page = expensePage) {
    const tasks: Promise<unknown>[] = [loadExpenses(page), loadSummary()];
    if (activeTab === "analytics") {
      tasks.push(loadAllExpenses());
    }
    await Promise.all(tasks);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setQuantity("1");
    setCategory(CATEGORIES[0]);
    setDate(todayISO());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    const parsedQuantity = Number(quantity);
    if (!title.trim() || !parsedAmount || parsedAmount <= 0) return;
    if (!parsedQuantity || parsedQuantity <= 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        amount: parsedAmount,
        quantity: parsedQuantity,
        category,
        date,
      };

      if (editingId !== null) {
        await api.updateExpense(editingId, payload);
        await refreshExpenses(expensePage);
      } else {
        await api.createExpense(payload);
        await refreshExpenses(1);
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
      const nextPage =
        expenses.length === 1 && expensePage > 1 ? expensePage - 1 : expensePage;
      await refreshExpenses(nextPage);
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
      await loadSummary();
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
      await loadSummary();
    } catch (err) {
      setIncomeError(err instanceof Error ? err.message : "Failed to delete income");
    }
  }

  const monthlyExpenseTotal = summary?.expense ?? 0;
  const monthlyIncomeTotal = summary?.income ?? 0;
  const savings = summary?.savings ?? 0;

  const monthlyExpenses = useMemo(
    () => allExpenses.filter((expense) => isCurrentMonth(expense.date)),
    [allExpenses],
  );

  const lastMonthExpenseTotal = useMemo(
    () => sumExpensesForMonth(allExpenses, previousMonthKey()),
    [allExpenses],
  );

  const expenseMomDelta = useMemo(
    () => monthOverMonthDeltaPercent(monthlyExpenseTotal, lastMonthExpenseTotal),
    [monthlyExpenseTotal, lastMonthExpenseTotal],
  );

  const dailyAverageSpend = useMemo(
    () => averageDailySpend(monthlyExpenseTotal),
    [monthlyExpenseTotal],
  );

  const topCategoryInsight = useMemo(
    () => topSpendingCategory(monthlyExpenses),
    [monthlyExpenses],
  );

  const topExpenses = useMemo(
    () => [...monthlyExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5),
    [monthlyExpenses],
  );

  const transactions = useMemo<Transaction[]>(() => {
    // Income only on page 1 so it doesn't repeat on every expense page.
    const items: Transaction[] = [
      ...(expensePage === 1
        ? income.map((entry) => ({ kind: "income" as const, data: entry }))
        : []),
      ...expenses.map((entry) => ({ kind: "expense" as const, data: entry })),
    ];
    return items.sort((a, b) => {
      if (a.data.date !== b.data.date) return a.data.date < b.data.date ? 1 : -1;
      return b.data.id - a.data.id;
    });
  }, [income, expenses, expensePage]);

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
        expenseMomDelta={expenseMomDelta}
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
          quantity={quantity}
          category={category}
          date={date}
          submitting={submitting}
          error={error}
          editingId={editingId}
          onTitleChange={setTitle}
          onAmountChange={setAmount}
          onQuantityChange={setQuantity}
          onCategoryChange={setCategory}
          onDateChange={setDate}
          onExpenseSubmit={handleSubmit}
          onExpenseCancel={resetForm}
          transactions={transactions}
          expensePage={expensePage}
          expenseTotalPages={expenseTotalPages}
          expenseTotal={expenseTotal}
          onExpensePageChange={(page) => void loadExpenses(page)}
          onEditIncome={handleIncomeEditClick}
          onDeleteIncome={handleIncomeDelete}
          onEditExpense={handleEditClick}
          onDeleteExpense={handleDelete}
        />
      )}

      {activeTab === "analytics" && (
        <AnalyticsView
          expenses={allExpenses}
          income={income}
          monthlyExpenses={monthlyExpenses}
          topExpenses={topExpenses}
          hideAmounts={privacyMode}
          dailyAverage={dailyAverageSpend}
          topCategory={topCategoryInsight}
        />
      )}
    </div>
  );
}

export default App;
