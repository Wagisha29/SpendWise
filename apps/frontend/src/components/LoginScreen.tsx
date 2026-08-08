import { GoogleIcon } from "./GoogleIcon";
import { Logo } from "./Logo";

export function LoginScreen({ onSignIn }: { onSignIn: () => Promise<void> }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at 15% 15%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(circle at 85% 25%, rgba(236,72,153,0.16), transparent 45%), radial-gradient(circle at 50% 90%, rgba(34,211,238,0.14), transparent 45%), #f6f5fc",
      }}
    >
      <div className="animate-pop-in flex w-full max-w-[380px] flex-col items-center gap-2 rounded-[24px] border border-[#eceafb] bg-white px-10 py-12 text-center shadow-[0_24px_60px_-20px_rgba(99,60,220,0.22)] transition-shadow duration-300 hover:shadow-[0_28px_70px_-16px_rgba(99,60,220,0.28)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-white shadow-[0_10px_26px_-8px_rgba(129,80,240,0.55)] transition-transform duration-500 hover:rotate-[12deg] hover:scale-110">
          <Logo size={32} />
        </div>
        <h1 className="mt-4 mb-1 text-2xl font-extrabold text-[#28223f]">SpendWise</h1>
        <p className="mb-7 text-sm leading-relaxed text-[#8c86a3]">
          Track where your money goes, one expense at a time.
        </p>
        <button
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border border-[#dadce0] bg-white px-6 py-3 text-sm font-semibold text-[#3c4043] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.25)] active:scale-[0.98] active:translate-y-0"
          onClick={onSignIn}
        >
          <GoogleIcon size={18} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
