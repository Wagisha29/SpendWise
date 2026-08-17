import { useEffect, useRef, useState } from "react";
import { WiseBotLogo } from "./WiseBotLogo";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const WELCOME_MESSAGE: ChatMessage = {
  id: 1,
  role: "bot",
  text: "Hi, I'm WiseBot — your SpendWise assistant. Ask me about your spending, savings, or budgets. (Chat is UI-only for now.)",
};

export function WiseBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      text,
    };
    const botReply: ChatMessage = {
      id: nextId.current++,
      role: "bot",
      text: "Thanks for your message! WiseBot answers will be connected soon.",
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput("");
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <section
          className="animate-pop-in flex h-[min(28rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#eceafb] bg-white shadow-[0_20px_50px_-20px_rgba(40,20,120,0.35)]"
          aria-label="WiseBot chat"
        >
          <header className="flex items-center gap-3 border-b border-[#eceafb] bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <WiseBotLogo size={32} className="text-white" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="m-0 text-sm font-bold tracking-tight">WiseBot</h2>
              <p className="m-0 text-[0.7rem] text-white/80">Finance tips & insights</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg border-none bg-white/15 px-2 py-1 text-sm text-white transition hover:bg-white/25"
              aria-label="Close WiseBot"
            >
              ✕
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-2.5 overflow-y-auto bg-[#faf9ff] px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "bot" && (
                  <span className="mt-0.5 mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <WiseBotLogo size={24} />
                  </span>
                )}
                <p
                  className={`m-0 max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-indigo-500 text-white"
                      : "rounded-bl-md border border-[#eceafb] bg-white text-[#3f3b52]"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-[#eceafb] bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask WiseBot…"
              className="min-w-0 flex-1 rounded-xl border border-[#ece9f4] bg-[#faf9ff] px-3 py-2 text-sm text-[#3f3b52] outline-none transition focus:border-indigo-300 focus:bg-white"
              aria-label="Message WiseBot"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-xl border-none bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-[0.97]"
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_10px_30px_-8px_rgba(99,102,241,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(99,102,241,0.8)] active:translate-y-0 active:scale-95"
        aria-label={open ? "Close WiseBot" : "Open WiseBot"}
        aria-expanded={open}
      >
        {open ? (
          <span className="text-lg font-semibold leading-none">✕</span>
        ) : (
          <WiseBotLogo size={40} className="text-white" />
        )}
      </button>
    </div>
  );
}
