type Chip = { label: string; prompt: string };

export function SuggestionChips({
  title,
  items,
  variant,
  onSelect,
}: {
  title: string;
  items: readonly Chip[];
  variant: "starter" | "followup";
  onSelect: (prompt: string) => void;
}) {
  const chipClass =
    variant === "starter"
      ? "animate-chat-bubble cursor-pointer rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
      : "animate-chat-bubble cursor-pointer rounded-full border border-[#e4e0f4] bg-[#f6f4ff] px-3 py-1.5 text-xs font-medium text-[#5b5480] transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-sm active:scale-[0.98]";

  return (
    <div className={`animate-chat-bubble pl-9 ${variant === "starter" ? "pt-1" : ""}`}>
      <p className="mb-2 text-[0.7rem] font-medium tracking-wide text-[#8b86a3] uppercase">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(item.prompt)}
            style={{ animationDelay: `${index * (variant === "starter" ? 60 : 50)}ms` }}
            className={chipClass}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
