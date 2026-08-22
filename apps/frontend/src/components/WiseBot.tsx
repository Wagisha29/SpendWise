import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../api";
import { WiseBotLogo } from "./WiseBotLogo";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const WELCOME_MESSAGE: ChatMessage = {
  id: 1,
  role: "bot",
  text: "Hi, I'm WiseBot — your SpendWise assistant. Pick a quick question below, or type your own.",
};

const SUGGESTIONS = [
  { label: "This month's spend", prompt: "How much did I spend this month?" },
  { label: "Top category", prompt: "Which category am I spending the most on?" },
  { label: "Savings tip", prompt: "Give me one tip to save more this month." },
  { label: "Budget check", prompt: "Am I on track with my budget?" },
] as const;

function TypingIndicator() {
  return (
    <div className="animate-chat-bubble flex justify-start">
      <span className="mt-0.5 mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <WiseBotLogo size={24} />
      </span>
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[#eceafb] bg-white px-3.5 py-3"
        aria-label="WiseBot is typing"
      >
        <span className="wisebot-typing-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
        <span className="wisebot-typing-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
        <span className="wisebot-typing-dot h-1.5 w-1.5 rounded-full bg-indigo-400" />
      </div>
    </div>
  );
}

export function WiseBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  const nextId = useRef(2);

  openRef.current = open;

  useEffect(() => {
    if (!open) return;
    setUnread(false);
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 180);
    return () => clearTimeout(focusTimer);
  }, [messages, open, isTyping]);

  async function sendMessage(raw: string) {
    const text = raw.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const { reply } = await api.askWiseBot(text);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: "bot", text: reply },
      ]);
      if (!openRef.current) setUnread(true);
    } catch (err) {
      const detail =
        err instanceof Error ? err.message : "Something went wrong talking to WiseBot.";
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "bot",
          text: `Sorry — I couldn't answer that right now. ${detail}`,
        },
      ]);
      if (!openRef.current) setUnread(true);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  const canSend = input.trim().length > 0 && !isTyping;
  const showSuggestions = messages.length <= 1 && !isTyping;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <section
          className="animate-pop-in flex h-[min(32rem,74vh)] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#eceafb] bg-white shadow-[0_20px_50px_-20px_rgba(40,20,120,0.35)]"
          aria-label="WiseBot chat"
        >
          <header className="flex items-center gap-3 border-b border-[#eceafb] bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-white">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <WiseBotLogo size={32} className="text-white" />
              <span
                className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-indigo-500 ${
                  isTyping ? "animate-pulse bg-amber-300" : "bg-emerald-300"
                }`}
                aria-hidden
              />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="m-0 text-sm font-bold tracking-tight">WiseBot</h2>
              <p className="m-0 text-[0.7rem] text-white/85">
                {isTyping ? "Thinking…" : "Online · ready to help"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg border-none bg-white/15 px-2.5 py-1.5 text-sm text-white transition hover:bg-white/25 active:scale-95"
              aria-label="Close WiseBot"
            >
              ✕
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-2.5 overflow-y-auto bg-[#faf9ff] px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`animate-chat-bubble flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "bot" && (
                  <span className="mt-0.5 mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <WiseBotLogo size={24} />
                  </span>
                )}
                {message.role === "user" ? (
                  <p className="m-0 max-w-[85%] rounded-2xl rounded-br-md bg-indigo-500 px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap text-white shadow-sm">
                    {message.text}
                  </p>
                ) : (
                  <div className="wisebot-md m-0 max-w-[85%] rounded-2xl rounded-bl-md border border-[#eceafb] bg-white px-3 py-2 text-sm leading-relaxed text-[#3f3b52] shadow-sm">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}

            {isTyping && <TypingIndicator />}

            {showSuggestions && (
              <div className="animate-chat-bubble pt-1 pl-9">
                <p className="mb-2 text-[0.7rem] font-medium tracking-wide text-[#8b86a3] uppercase">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => void sendMessage(item.prompt)}
                      className="cursor-pointer rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-[#eceafb] bg-white p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isTyping ? "WiseBot is thinking…" : "Ask about spending, savings…"}
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-xl border border-[#ece9f4] bg-[#faf9ff] px-3 py-2.5 text-sm text-[#3f3b52] outline-none transition focus:border-indigo-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] disabled:cursor-wait disabled:opacity-70"
              aria-label="Message WiseBot"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="cursor-pointer rounded-xl border-none bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:active:scale-100"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-indigo-500 to-violet-500 text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(99,102,241,0.8)] active:translate-y-0 active:scale-95 ${
          open ? "shadow-[0_10px_30px_-8px_rgba(99,102,241,0.7)]" : "animate-wisebot-fab"
        }`}
        aria-label={open ? "Close WiseBot" : "Open WiseBot"}
        aria-expanded={open}
      >
        {open ? (
          <span className="text-lg font-semibold leading-none">✕</span>
        ) : (
          <WiseBotLogo size={40} className="text-white" />
        )}
        {!open && unread && (
          <span className="absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-rose-400" />
        )}
      </button>
    </div>
  );
}
