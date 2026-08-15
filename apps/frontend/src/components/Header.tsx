import { EyeIcon } from "./EyeIcon";
import { Logo } from "./Logo";

export type AppTab = "dashboard" | "analytics";

export function Header({
  userName,
  userEmail,
  privacyMode,
  activeTab,
  onTabChange,
  onTogglePrivacy,
  onSignOut,
}: {
  userName: string | undefined;
  userEmail: string | undefined;
  privacyMode: boolean;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onTogglePrivacy: () => void;
  onSignOut: () => Promise<void>;
}) {
  const displayName = userName || "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <header className="mb-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-white shadow-[0_8px_20px_-6px_rgba(129,80,240,0.55)] transition-transform duration-300 hover:scale-105 hover:rotate-6">
            <Logo size={24} />
          </div>
          <div>
            <h1 className="m-0 text-2xl font-extrabold tracking-tight text-[#28223f]">SpendWise</h1>
            <p className="m-0 mt-0.5 text-[0.8rem] text-[#8c86a3]" title={userEmail}>
              {displayName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onTogglePrivacy}
            aria-pressed={privacyMode}
            aria-label={privacyMode ? "Show amounts" : "Hide amounts"}
            title={privacyMode ? "Show amounts" : "Hide amounts"}
            className={`relative flex h-[30px] w-[54px] cursor-pointer items-center rounded-full border transition-colors duration-300 ${
              privacyMode
                ? "border-slate-300 bg-slate-200"
                : "border-indigo-300 bg-gradient-to-r from-indigo-400 to-fuchsia-400"
            }`}
          >
            <span
              className={`absolute top-[3px] left-[3px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white text-[#6d5fdb] shadow-md transition-transform duration-300 ease-out ${
                privacyMode ? "translate-x-0" : "translate-x-[24px]"
              }`}
            >
              <EyeIcon open={!privacyMode} size={13} />
            </span>
          </button>
          <div
            className="flex h-[34px] w-[34px] cursor-default items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-[0.85rem] font-bold text-white shadow-[0_4px_14px_-4px_rgba(129,80,240,0.6)] transition-transform duration-300 hover:scale-110"
            title={displayName}
          >
            {initial}
          </div>
          <button
            className="cursor-pointer rounded-lg border border-[#ece9f4] bg-white px-3.5 py-2 text-[0.8rem] font-medium text-[#7a7590] transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-500 hover:shadow-md active:translate-y-0"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </div>

      <nav
        className="inline-flex items-center gap-1 rounded-xl border border-[#eceafb] bg-white/80 p-1 shadow-sm"
        aria-label="Primary"
      >
        <TabButton active={activeTab === "dashboard"} onClick={() => onTabChange("dashboard")}>
          Dashboard
        </TabButton>
        <TabButton active={activeTab === "analytics"} onClick={() => onTabChange("analytics")}>
          Detailed Analytics
          <span aria-hidden="true" className="ml-1">
            📈
          </span>
        </TabButton>
      </nav>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`cursor-pointer rounded-lg px-3.5 py-2 text-[0.82rem] font-semibold transition-all duration-200 ${
        active
          ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-[0_6px_16px_-8px_rgba(129,80,240,0.7)]"
          : "bg-transparent text-[#7a7590] hover:bg-[#f4f2ff] hover:text-[#5b53a0]"
      }`}
    >
      {children}
    </button>
  );
}
