import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../api";
import { createWordStreamPacer } from "../lib/wordStreamPacer";
import { WiseBotLogo } from "./WiseBotLogo";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
  failed?: boolean;
  streaming?: boolean;
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

const FOLLOW_UPS = [
  { label: "Compare to income", prompt: "How does my spending compare to my income this month?" },
  { label: "Biggest expense", prompt: "What was my single biggest expense recently?" },
  { label: "Savings left", prompt: "How much have I saved this month so far?" },
  { label: "Cut one habit", prompt: "Based on my categories, where can I cut spending first?" },
] as const;

const THINKING_LABELS = [
  "Reading your transactions…",
  "Crunching totals…",
  "Finding patterns…",
  "Almost ready…",
] as const;

function TypingIndicator({ label }: { label: string }) {
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

function SendIcon({ spinning }: { spinning?: boolean }) {
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

export function WiseBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(false);
  const [thinkingIdx, setThinkingIdx] = useState(0);
  const [showNudge, setShowNudge] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  const nextId = useRef(2);
  const lastPromptRef = useRef("");

  openRef.current = open;

  useEffect(() => {
    if (!open) return;
    setUnread(false);
    setShowNudge(false);
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 180);
    return () => clearTimeout(focusTimer);
  }, [messages, open, isTyping]);

  useEffect(() => {
    if (!isTyping) {
      setThinkingIdx(0);
      return;
    }
    const timer = window.setInterval(() => {
      setThinkingIdx((i) => (i + 1) % THINKING_LABELS.length);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [isTyping]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function sendMessage(raw: string) {
    const text = raw.trim();
    if (!text || isTyping) return;

    lastPromptRef.current = text;
    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      text,
    };
    const botId = nextId.current++;

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: botId, role: "bot", text: "", streaming: true },
    ]);
    setInput("");
    setIsTyping(true);

    let gotDelta = false;
    const pacer = createWordStreamPacer((word) => {
      gotDelta = true;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === botId
            ? { ...message, text: message.text + word, streaming: true }
            : message,
        ),
      );
    }, 48);

    try {
      await api.askWiseBotStream(text, (delta) => {
        pacer.push(delta);
      });
      await pacer.finish();

      setMessages((prev) =>
        prev.map((message) =>
          message.id === botId
            ? {
                ...message,
                text: message.text.trim() || "I didn't get a reply that time — try again.",
                streaming: false,
                failed: !message.text.trim(),
              }
            : message,
        ),
      );
      if (!openRef.current) setUnread(true);
    } catch (err) {
      await pacer.finish().catch(() => undefined);
      const detail =
        err instanceof Error ? err.message : "Something went wrong talking to WiseBot.";
      setMessages((prev) =>
        prev.map((message) =>
          message.id === botId
            ? {
                ...message,
                text: gotDelta
                  ? `${message.text}\n\n_(interrupted: ${detail})_`
                  : `Sorry — I couldn't answer that right now. ${detail}`,
                streaming: false,
                failed: true,
              }
            : message,
        ),
      );
      if (!openRef.current) setUnread(true);
    } finally {
      setIsTyping(false);
    }
  }

  function resetChat() {
    if (isTyping) return;
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    nextId.current = 2;
    lastPromptRef.current = "";
    inputRef.current?.focus();
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  const canSend = input.trim().length > 0 && !isTyping;
  const hasConversation = messages.length > 1;
  const streamingMessage = messages.find((message) => message.streaming);
  const showTypingWait = isTyping && !streamingMessage?.text;
  const showStarterChips = !hasConversation && !isTyping;
  const showFollowUps =
    hasConversation &&
    !isTyping &&
    messages[messages.length - 1]?.role === "bot" &&
    !messages[messages.length - 1]?.failed &&
    !messages[messages.length - 1]?.streaming;
  const lastFailed = messages[messages.length - 1]?.failed;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <section
          className="animate-pop-in flex h-[min(34rem,78vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#eceafb] bg-white shadow-[0_20px_50px_-20px_rgba(40,20,120,0.35)]"
          aria-label="WiseBot chat"
        >
          <header className="flex items-center gap-3 border-b border-[#eceafb] bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-white">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 hover:scale-105">
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
              <p className="m-0 text-[0.7rem] text-white/85 transition-opacity">
                {isTyping ? THINKING_LABELS[thinkingIdx] : "Online · ask about your money"}
              </p>
            </div>
            <button
              type="button"
              onClick={resetChat}
              disabled={isTyping || !hasConversation}
              className="cursor-pointer rounded-lg border-none bg-white/15 px-2 py-1.5 text-[0.7rem] font-semibold text-white transition hover:bg-white/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Start a new chat"
              title="New chat"
            >
              New
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg border-none bg-white/15 px-2.5 py-1.5 text-sm text-white transition hover:bg-white/25 active:scale-95"
              aria-label="Close WiseBot"
              title="Close (Esc)"
            >
              ✕
            </button>
          </header>

          <div ref={listRef} className="relative flex-1 space-y-3 overflow-y-auto bg-[#faf9ff] px-3 py-3">
            {messages.map((message) => {
              if (message.role === "bot" && message.streaming && !message.text) {
                return null;
              }

              return (
              <div
                key={message.id}
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
                    {!message.streaming && message.failed && lastPromptRef.current && (
                      <div className="mt-1 ml-0.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void sendMessage(lastPromptRef.current)}
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
            })}

            {showTypingWait && <TypingIndicator label={THINKING_LABELS[thinkingIdx]} />}

            {showStarterChips && (
              <div className="animate-chat-bubble pt-1 pl-9">
                <p className="mb-2 text-[0.7rem] font-medium tracking-wide text-[#8b86a3] uppercase">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => void sendMessage(item.prompt)}
                      style={{ animationDelay: `${index * 60}ms` }}
                      className="animate-chat-bubble cursor-pointer rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showFollowUps && (
              <div className="animate-chat-bubble pl-9">
                <p className="mb-2 text-[0.7rem] font-medium tracking-wide text-[#8b86a3] uppercase">
                  Ask next
                </p>
                <div className="flex flex-wrap gap-2">
                  {FOLLOW_UPS.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => void sendMessage(item.prompt)}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-chat-bubble cursor-pointer rounded-full border border-[#e4e0f4] bg-[#f6f4ff] px-3 py-1.5 text-xs font-medium text-[#5b5480] transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-sm active:scale-[0.98]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lastFailed && !isTyping && (
              <div className="animate-chat-bubble flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => void sendMessage(lastPromptRef.current)}
                  className="cursor-pointer rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  Retry last question
                </button>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-[#eceafb] bg-white p-3"
          >
            <div className="flex gap-2">
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
                disabled={!canSend && !isTyping}
                className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-xl border-none bg-indigo-500 text-white transition hover:bg-indigo-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:active:scale-100"
                aria-label={isTyping ? "Waiting for reply" : "Send message"}
              >
                <SendIcon spinning={isTyping} />
              </button>
            </div>
            <p className="m-0 mt-1.5 text-[0.65rem] text-[#a39eb8]">
              Esc to close · answers use your SpendWise data
            </p>
          </form>
        </section>
      )}

      <div className="relative flex items-center gap-2">
        {!open && showNudge && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="animate-chat-bubble hidden cursor-pointer rounded-2xl rounded-br-md border border-[#eceafb] bg-white px-3 py-2 text-left text-xs font-medium text-[#3f3b52] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:block"
          >
            Ask WiseBot about your spend
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setOpen((prev) => !prev);
            setShowNudge(false);
          }}
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
            <span className="absolute top-1 right-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-rose-400" />
          )}
        </button>
      </div>
    </div>
  );
}
