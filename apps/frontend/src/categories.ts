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
  "Others",
] as const;

export const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Food: { icon: "🍔", color: "#f59e0b" },
  Grocery: { icon: "🛒", color: "#84cc16" },
  Travel: { icon: "✈️", color: "#38bdf8" },
  Shopping: { icon: "🛍️", color: "#ec4899" },
  Bills: { icon: "🧾", color: "#facc15" },
  Entertainment: { icon: "🎬", color: "#f472b6" },
  Subscription: { icon: "🔁", color: "#8b5cf6" },
  Investment: { icon: "📈", color: "#22c55e" },
  Medical: { icon: "💊", color: "#ef4444" },
  Rent: { icon: "🏠", color: "#a78bfa" },
  Fitness: { icon: "🏋️", color: "#14b8a6" },
  Social: { icon: "🍻", color: "#fb923c" },
  Others: { icon: "📦", color: "#94a3b8" },
};

export function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META.Others;
}
