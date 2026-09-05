import ReactMarkdown from "react-markdown";
import { WiseBotLogo } from "../WiseBotLogo";
import type { ChatMessage } from "./constants";

export function WiseBotMessage({
  message,
  lastPrompt,
  isTyping,
  onRetry,
}: {
  message: ChatMessage;
  lastPrompt: string;
  isTyping: boolean;
  onRetry: (prompt: string) => void;
}) {
  if (message.role === "bot" && message.streaming && !message.text) {
    return null;
  }

  return (
    <div
      className={`animate-chat-bubble group flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role === "bot" && (
        <span className="mt-0.5 mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition group-hover:scale-105">
          <WiseBotLogo size={24} />
        </span>
      )}
      {message.role === "user" ? (
        <p className="m-0 max-w-[85%] rounded-2xl rounded-br-md bg-indigo-500 px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap text-white shadow-sm transition hover:shadow-md">
          {message.text}
        </p>
      ) : (
        <div className="max-w-[85%]">
          <div
            className={`wisebot-md m-0 rounded-2xl rounded-bl-md border px-3 py-2 text-sm leading-relaxed shadow-sm transition hover:shadow-md ${
              message.failed
                ? "border-rose-200 bg-rose-50 text-[#5c3145]"
                : "border-[#eceafb] bg-white text-[#3f3b52]"
            }`}
          >
            <ReactMarkdown>{message.text}</ReactMarkdown>
            {message.streaming && (
              <span className="wisebot-stream-caret" aria-hidden>
                |
              </span>
            )}
          </div>
          {!message.streaming && message.failed && lastPrompt && (
            <div className="mt-1 ml-0.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRetry(lastPrompt)}
                disabled={isTyping}
                className="cursor-pointer rounded-md border-none bg-transparent px-1.5 py-0.5 text-[0.65rem] font-medium text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
