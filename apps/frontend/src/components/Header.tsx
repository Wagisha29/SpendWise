import { EyeIcon } from "./EyeIcon";

export function Header({
  userName,
  userEmail,
  privacyMode,
  onTogglePrivacy,
  onSignOut,
}: {
  userName: string | undefined;
  userEmail: string | undefined;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onSignOut: () => Promise<void>;
}) {
  const displayName = userName || "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-violet-200 to-fuchsia-200 text-xl shadow-[0_8px_24px_-8px_rgba(167,139,250,0.5)]">
          💸
        </div>
        <div>
          <h1 className="m-0 text-2xl font-semibold tracking-tight text-[#3f3b52]">Expense Tracker</h1>
          <p className="m-0 mt-0.5 text-[0.8rem] text-[#8c86a3]" title={userEmail}>
            {displayName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-[#ece9f4] bg-transparent text-[#7a7590] transition hover:border-violet-300 hover:text-violet-500"
          onClick={onTogglePrivacy}
          aria-pressed={privacyMode}
          aria-label={privacyMode ? "Show amounts" : "Hide amounts"}
          title={privacyMode ? "Show amounts" : "Hide amounts"}
        >
          <EyeIcon open={!privacyMode} />
        </button>
        <div
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-violet-200 to-fuchsia-200 text-[0.85rem] font-bold text-violet-800"
          title={displayName}
        >
          {initial}
        </div>
        <button
          className="cursor-pointer rounded-lg border border-[#ece9f4] bg-transparent px-3.5 py-2 text-[0.8rem] text-[#7a7590] transition hover:border-rose-300 hover:text-rose-500"
          onClick={onSignOut}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
