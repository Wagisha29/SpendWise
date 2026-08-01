export const CATEGORIES = ["Food", "Transport", "Housing", "Utilities", "Entertainment", "Other"] as const;

export const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Food: { icon: "🍔", color: "#f59e0b" },
  Transport: { icon: "🚗", color: "#38bdf8" },
  Housing: { icon: "🏠", color: "#a78bfa" },
  Utilities: { icon: "💡", color: "#facc15" },
  Entertainment: { icon: "🎬", color: "#f472b6" },
  Other: { icon: "📦", color: "#94a3b8" },
};

export function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META.Other;
}
