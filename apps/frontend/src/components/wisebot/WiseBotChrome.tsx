import { WiseBotLogo } from "../WiseBotLogo";

export function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="animate-chat-bubble flex justify-start">
      <span className="mt-0.5 mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <WiseBotLogo size={24} />
      </span>
      <div className="rounded-2xl rounded-bl-md border border-[#eceafb] bg-white px-3.5 py-2.5 shadow-sm">
        <div className="mb-1.5 flex items-center gap-1" aria-hidden>
          <span className="wisebot-typing-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <span className="wisebot-typing-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <span className="wisebot-typing-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </div>
        <p className="m-0 text-[0.7rem] text-[#8b86a3]">{label}</p>
      </div>
    </div>
  );
}

export function SendIcon({ spinning }: { spinning?: boolean }) {
  if (spinning) {
    return (
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        aria-hidden
      />
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.5 8h9M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
