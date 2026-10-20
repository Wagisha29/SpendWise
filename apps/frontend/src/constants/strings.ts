/**
 * Centralized, i18n-style UI copy for SpendWise.
 *
 * All user-facing static text (labels, button text, placeholders, empty
 * states, error fallbacks, etc.) lives here instead of being scattered as
 * string literals across components. The nested structure mirrors the
 * app's feature areas — the same idea as i18next namespaces / resource
 * bundles — so if the app ever needs real localization, this object can
 * be swapped for `t("goal.setGoal")`-style lookups with minimal churn.
 *
 * Copy that needs a value baked in is exposed as a small function instead
 * of a plain string, e.g. `STRINGS.pagination.pageOf(2, 5)`.
 *
 * Data that happens to be text but is really *domain data* (expense
 * categories + icons, WiseBot's canned suggestion prompts, chart colors)
 * stays where it already lived — `categories.ts` and
 * `components/wisebot/constants.ts` — rather than being duplicated here.
 */

export const STRINGS = {
  app: {
    name: "SpendWise",
  },

  common: {
    cancel: "Cancel",
    clear: "Clear",
    close: "Close",
    noExpensesThisMonth: "No expenses this month yet.",
  },

  header: {
    signOut: "Sign out",
  },

  nav: {
    dashboard: "Dashboard",
    analytics: "Analytics",
    analyticsFull: "Detailed Analytics",
  },

  bottomNav: {
    addLabel: "Add income or expense",
  },

  privacy: {
    show: "Show amounts",
    hide: "Hide amounts",
  },

  install: {
    title: "Install SpendWise as an app",
    cta: "Install app",
  },

  summary: {
    incomeLabel: "Income (this month)",
    expenseLabel: "Expense (this month)",
    savingsLabel: "Savings (this month)",
    vsLastMonth: "vs last month",
    vsLastMonthShort: "vs last mo",
    percentOfIncomeSpent: "% of income spent",
    percentOfIncomeSaved: "% of income saved",
    maskedPercent: "••%",
  },

  goal: {
    label: "Goal",
    setGoal: "Set Goal",
    edit: "Edit",
    noGoalSet: "No goal set",
    capSpendingFor: (month: string) => `Cap spending for ${month}.`,
    over: "over",
    left: "left",
    ofGoal: (goal: string) => `of ${goal} goal`,
    modalTitle: (month: string) => `Set Goal for ${month}`,
    modalQuestion: "How much do you want to spend this month?",
    amountPlaceholder: "e.g. 25000",
    save: "Save Goal",
    saving: "Saving…",
    pace: (projected: string) => `At this pace: ~₹${projected} by month end`,
  },

  expenseForm: {
    titlePlaceholder: "Title",
    unitPricePlaceholder: "Unit price",
    qtyPlaceholder: "Qty",
    total: "Total",
    adding: "Adding…",
    saving: "Saving…",
    saveChanges: "Save Changes",
    add: "Add Expense",
  },

  incomeForm: {
    sourcePlaceholder: "Source (e.g. Salary)",
    amountPlaceholder: "Amount",
    adding: "Adding…",
    saving: "Saving…",
    saveChanges: "Save Changes",
    add: "Add Income",
  },

  addSheet: {
    addTitle: "Add Transaction",
    editIncomeTitle: "Edit Income",
    editExpenseTitle: "Edit Expense",
    expenseTab: "Expense",
    incomeTab: "Income",
  },

  dashboard: {
    incomeSection: "Income",
    expenseSection: "Expenses",
    transactionsSection: "Transactions",
    filteredBadge: (count: number) => `Filtered · ${count}`,
    filteredTitle: (count: number) => `${count} active filter${count === 1 ? "" : "s"}`,
  },

  transactions: {
    emptyNoData: "No transactions yet. Add income or an expense above.",
    emptyNoResults: "No results match these filters.",
    columnTitle: "Title",
    columnCategory: "Category",
    columnDate: "Date",
    columnAmount: "Amount",
    columnActions: "Actions",
    incomeBadge: "Income",
    editExpense: "Edit expense",
    deleteExpense: "Delete expense",
    editIncome: "Edit income",
    deleteIncome: "Delete income",
  },

  pagination: {
    prev: "← Prev",
    next: "Next →",
    pageOf: (page: number, totalPages: number) => `Page ${page} of ${totalPages}`,
    results: (total: number) => `· ${total} results`,
  },

  filters: {
    searchLabel: "Search",
    searchPlaceholder: "Title or source…",
    searchPlaceholderMobile: "Search title or source…",
    typeLabel: "Type",
    categoryLabel: "Category",
    fromLabel: "From",
    toLabel: "To",
    minLabel: "Min ₹",
    maxLabel: "Max ₹",
    all: "All",
    income: "Income",
    expense: "Expense",
    toggle: "Filters",
  },

  analytics: {
    heading: "Analytics & Financial Insights",
    monthlySubtitle: (year: number) => `Jan–Dec bars for ${year}.`,
    yearlySubtitle: "Yearly totals across the last 5 years.",
    yearLabel: "Year",
    monthly: "Monthly",
    yearly: "Yearly",
    incomeExpenseTrend: "Income vs Expense Trend",
    incomeExpenseTrendMonthly: (year: number) => `12 months in ${year} (Jan–Dec).`,
    incomeExpenseTrendYearly: "One bar group per year for the last 5 years.",
    categoryShift: "Category Spending Shift",
    categoryShiftMonthly: (year: number) => `Category mix by month in ${year}.`,
    categoryShiftYearly: "Category mix by year for the last 5 years.",
    thisMonthHeading: "This month",
    thisMonthSubtitle: "Current month spending patterns and top expenses.",
    spendingByCategory: "Spending by Category",
    topExpenses: "Top Expenses",
  },

  insights: {
    averageDailySpend: "Average daily spend",
    perDay: "/ day",
    averageDailyFootnote: "This month's expenses ÷ day of month so far",
    topSpendingCategory: "Top spending category",
    makesUp: "Makes up",
    ofThisMonthsSpending: "of this month's spending",
  },

  charts: {
    pieEmpty: "No expenses this month yet. Add one to see the category breakdown.",
    trendEmpty: "No category spending in this range yet.",
    trendHint: "Each bar is one period. Colors show how much went to each category.",
    incomeExpenseEmpty: "No income or expenses in this range yet.",
    incomeExpenseFootnote: "Totals shown in ₹ · Y-axis may use k for thousands",
  },

  wisebot: {
    name: "WiseBot",
    chatLabel: "WiseBot chat",
    online: "Online · ask about your money",
    newChat: "New",
    newChatAriaLabel: "Start a new chat",
    newChatTitle: "New chat",
    close: "Close WiseBot",
    closeTitle: "Close (Esc)",
    open: "Open WiseBot",
    tryAsking: "Try asking",
    askNext: "Ask next",
    inputThinking: "WiseBot is thinking…",
    inputPlaceholder: "Ask about spending, savings…",
    inputLabel: "Message WiseBot",
    waitingForReply: "Waiting for reply",
    sendMessage: "Send message",
    footer: "Esc to close · answers use your SpendWise data",
    retryLastQuestion: "Retry last question",
    retry: "Retry",
    nudge: "Ask WiseBot about your spend",
    noReply: "I didn't get a reply that time — try again.",
    genericError: "Something went wrong talking to WiseBot.",
    answerFailedPrefix: "Sorry — I couldn't answer that right now. ",
    interruptedSuffix: (detail: string) => `\n\n_(interrupted: ${detail})_`,
  },

  landing: {
    headline: "Take Control of Your Personal Finances with SpendWise.",
    subhead:
      "Track daily expenses, split income vs. savings, and visualize your spending habits effortlessly.",
    cta: "Continue with Google",
    featuresHeading: "Everything you need to spend wiser",
    featuresSubtitle: "Built for everyday money tracking — clear, fast, and private.",
    closingCta: "Ready to see where your money goes?",
  },

  pwaToast: {
    updateAvailable: "A new version of SpendWise is available.",
    readyOffline: "SpendWise is ready to work offline.",
    reload: "Reload",
    dismiss: "Dismiss",
  },

  errors: {
    loadSummary: "Failed to load summary",
    loadExpenses: "Failed to load expenses",
    loadTransactions: "Failed to load transactions",
    updateExpense: "Failed to update expense",
    addExpense: "Failed to add expense",
    deleteExpense: "Failed to delete expense",
    loadIncome: "Failed to load income",
    updateIncome: "Failed to update income",
    addIncome: "Failed to add income",
    deleteIncome: "Failed to delete income",
    loadGoal: "Failed to load goal",
    saveGoal: "Failed to save goal",
  },
} as const;
