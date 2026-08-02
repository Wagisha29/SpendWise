import { GoogleIcon } from "./GoogleIcon";

export function LoginScreen({ onSignIn }: { onSignIn: () => Promise<void> }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(196,181,253,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(249,168,212,0.28), transparent 45%), #faf8fc",
      }}
    >
      <div className="flex w-full max-w-[380px] flex-col items-center gap-2 rounded-[20px] border border-[#ece9f4] bg-white px-10 py-12 text-center shadow-[0_20px_60px_-20px_rgba(120,100,160,0.18)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 to-fuchsia-200 text-2xl shadow-[0_8px_24px_-8px_rgba(167,139,250,0.5)]">
          💸
        </div>
        <h1 className="mt-4 mb-1 text-2xl font-bold text-[#3f3b52]">Expense Tracker</h1>
        <p className="mb-7 text-sm leading-relaxed text-[#8c86a3]">
          Track where your money goes, one expense at a time.
        </p>
        <button
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border border-[#dadce0] bg-white px-6 py-3 text-sm font-semibold text-[#3c4043] transition hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] active:scale-[0.98]"
          onClick={onSignIn}
        >
          <GoogleIcon size={18} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
