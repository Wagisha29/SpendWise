import { EyeIcon } from "./EyeIcon";
import { InstallAppButton } from "./InstallAppButton";
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
    <header className="pt-safe sticky top-0 z-30 -mx-4 mb-4 bg-[#f6f5fc]/85 px-4 pb-3 backdrop-blur-md sm:static sm:mx-0 sm:mb-6 sm:bg-transparent sm:px-0 sm:pb-0 sm:backdrop-blur-none">
      <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 sm:mb-5 sm:gap-4 sm:py-0">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-white shadow-[0_8px_20px_-6px_rgba(129,80,240,0.55)] transition-transform duration-300 hover:scale-105 hover:rotate-6 sm:h-[42px] sm:w-[42px]">
            <Logo size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="m-0 truncate text-lg font-extrabold tracking-tight text-[#28223f] sm:text-2xl">
              SpendWise
            </h1>
            <p
              className="m-0 mt-0.5 hidden truncate text-[0.8rem] text-[#8c86a3] sm:block"
              title={userEmail}
            >
              {displayName}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3.5">
          <InstallAppButton
            iconOnly
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-md active:translate-y-0 sm:hidden"
          />
          <InstallAppButton className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-[0.8rem] font-semibold text-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-md active:translate-y-0 sm:inline-flex" />
          <button
            type="button"
            onClick={onTogglePrivacy}
            aria-pressed={privacyMode}
            aria-label={privacyMode ? "Show amounts" : "Hide amounts"}
            title={privacyMode ? "Show amounts" : "Hide amounts"}
            className={`relative flex h-7 w-[46px] shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-300 sm:h-[30px] sm:w-[54px] ${
              privacyMode
                ? "border-slate-300 bg-slate-200"
                : "border-indigo-300 bg-gradient-to-r from-indigo-400 to-fuchsia-400"
            }`}
          >
            <span
              className={`absolute top-[3px] left-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[#6d5fdb] shadow-md transition-transform duration-300 ease-out sm:h-[22px] sm:w-[22px] ${
                privacyMode ? "translate-x-0" : "translate-x-[18px] sm:translate-x-[24px]"
              }`}
            >
              <EyeIcon open={!privacyMode} size={11} />
            </span>
          </button>
          <div
            className="flex h-8 w-8 shrink-0 cursor-default items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-[0.8rem] font-bold text-white shadow-[0_4px_14px_-4px_rgba(129,80,240,0.6)] transition-transform duration-300 hover:scale-110 sm:h-[34px] sm:w-[34px] sm:text-[0.85rem]"
            title={displayName}
          >
            {initial}
          </div>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#ece9f4] bg-white text-[#7a7590] transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-500 hover:shadow-md active:translate-y-0 sm:h-auto sm:w-auto sm:px-3.5 sm:py-2"
            onClick={onSignOut}
          >
            <span className="sm:hidden" aria-hidden="true">
              ⎋
            </span>
            <span className="hidden text-[0.8rem] font-medium sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      <nav
        className="hidden items-center gap-1 rounded-xl border border-[#eceafb] bg-white/80 p-1 shadow-sm sm:inline-flex"
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
