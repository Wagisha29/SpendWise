import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api";
import { CATEGORIES } from "../categories";
import { AnalyticsView } from "./AnalyticsView";
import { DashboardView } from "./DashboardView";
import { Header, type AppTab } from "./Header";
import { SummaryCards } from "./SummaryCards";
import {
  EMPTY_TRANSACTION_FILTERS,
  type TransactionFilterValues,
} from "./TransactionFilters";
import { WiseBot } from "./WiseBot";
import { todayISO, isCurrentMonth } from "../lib/dates";
import { toFilterParams } from "../lib/filterParams";
import {
  averageDailySpend,
  monthOverMonthDeltaPercent,
  previousMonthKey,
  sumExpensesForMonth,
  topSpendingCategory,
} from "../lib/insights";
import type { Expense, Income, Summary, Transaction } from "../types";

export function SpendWiseApp({
  userName,
  userEmail,
  onSignOut,
}: {
  userName: string | undefined;
  userEmail: string | undefined;
  onSignOut: () => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilterValues>(EMPTY_TRANSACTION_FILTERS);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(0);
  const [txTotal, setTxTotal] = useState(0);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
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

  const [privacyMode, setPrivacyMode] = useState(
    () => localStorage.getItem("privacyMode") === "true",
  );

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
    void loadSummary();
    void loadIncome();
  }, []);

  useEffect(() => {
    const delayMs = filters.query.trim() ? 300 : 0;
    const timer = window.setTimeout(() => {
      void loadTransactions(1, filters);
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [filters]);

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
      document
        .getElementById("expense-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  async function loadTransactions(page: number, filterValues = filtersRef.current) {
    setLoading(true);
    setError(null);
    try {
      const result = await api.listFilters(toFilterParams(filterValues, page));
      setTransactions(result.items);
      setTxPage(result.page);
      setTxTotalPages(result.total_pages);
      setTxTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  async function refreshDashboard(page = txPage) {
    const tasks: Promise<unknown>[] = [loadTransactions(page), loadSummary(), loadIncome()];
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
        await refreshDashboard(txPage);
      } else {
        await api.createExpense(payload);
        await refreshDashboard(1);
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
      const expenseCountOnPage = transactions.filter((item) => item.kind === "expense").length;
      const nextPage = expenseCountOnPage <= 1 && txPage > 1 ? txPage - 1 : txPage;
      await refreshDashboard(nextPage);
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
      document
        .getElementById("income-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        await api.updateIncome(editingIncomeId, payload);
        await refreshDashboard(txPage);
      } else {
        await api.createIncome(payload);
        await refreshDashboard(1);
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
      const incomeCountOnPage = transactions.filter((item) => item.kind === "income").length;
      const nextPage = incomeCountOnPage <= 1 && txPage > 1 ? txPage - 1 : txPage;
      await refreshDashboard(nextPage);
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

  return (
    <>
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
            filters={filters}
            onFiltersChange={setFilters}
            onFiltersClear={() => setFilters(EMPTY_TRANSACTION_FILTERS)}
            transactions={transactions}
            page={txPage}
            totalPages={txTotalPages}
            total={txTotal}
            onPageChange={(page) => void loadTransactions(page)}
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

      <WiseBot />
    </>
  );
}
