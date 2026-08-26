export const CATEGORIES = [
  "Food",
  "Grocery",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Subscription",
  "Investment",
  "Medical",
  "Rent",
  "Fitness",
  "Social",
  "Happiness",
  "Others",
] as const;

/** Shared chart palette — matches Income (emerald) / Expense (rose) summary cards. */
export const CHART_COLORS = {
  income: "#34d399", // emerald-400
  expense: "#fb7185", // rose-400
} as const;

export const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Food: { icon: "🍔", color: "#F59E0B" },
  Grocery: { icon: "🛒", color: "#84CC16" },
  Travel: { icon: "✈️", color: "#38BDF8" },
  Shopping: { icon: "🛍️", color: "#EC4899" },
  Bills: { icon: "🧾", color: "#FACC15" },
  Entertainment: { icon: "🎬", color: "#F472B6" },
  Subscription: { icon: "🔁", color: "#8B5CF6" },
  Investment: { icon: "📈", color: "#22C55E" },
  Medical: { icon: "💊", color: "#EF4444" },
  Rent: { icon: "🏠", color: "#9980FA" },
  Fitness: { icon: "🏋️", color: "#14B8A6" },
  Social: { icon: "🍻", color: "#FB923C" },
  Happiness: { icon: "😊", color: "#FBBF24" },
  Others: { icon: "📦", color: "#94A3B8" },
};

export function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META.Others;
}

export function getCategoryColor(category: string): string {
  return getCategoryMeta(category).color;
}
