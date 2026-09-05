export type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
  failed?: boolean;
  streaming?: boolean;
};

export const WELCOME_MESSAGE: ChatMessage = {
  id: 1,
  role: "bot",
  text: "Hi, I'm WiseBot — your SpendWise assistant. Pick a quick question below, or type your own.",
};

export const SUGGESTIONS = [
  { label: "This month's spend", prompt: "How much did I spend this month?" },
  { label: "Top category", prompt: "Which category am I spending the most on?" },
  { label: "Savings tip", prompt: "Give me one tip to save more this month." },
  { label: "Budget check", prompt: "Am I on track with my budget?" },
] as const;

export const FOLLOW_UPS = [
  { label: "Compare to income", prompt: "How does my spending compare to my income this month?" },
  { label: "Biggest expense", prompt: "What was my single biggest expense recently?" },
  { label: "Savings left", prompt: "How much have I saved this month so far?" },
  { label: "Cut one habit", prompt: "Based on my categories, where can I cut spending first?" },
] as const;

export const THINKING_LABELS = [
  "Reading your transactions…",
  "Crunching totals…",
  "Finding patterns…",
  "Almost ready…",
] as const;
