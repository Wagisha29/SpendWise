import { STRINGS } from "../constants/strings";
import type { AppTab } from "./Header";

const TABS: { id: AppTab; label: string; icon: string }[] = [
  { id: "dashboard", label: STRINGS.nav.dashboard, icon: "🏠" },
  { id: "analytics", label: STRINGS.nav.analytics, icon: "📈" },
];

/**
 * App-style bottom tab bar, shown only on small screens (the top `nav`
 * in `Header` takes over on sm+ layouts). Fixed to the viewport bottom
 * with safe-area padding so it sits above the iOS home indicator when
 * the PWA is installed in standalone mode.
 */
export function BottomNav({
  activeTab,
  onTabChange,
  onAddClick,
}: {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  /** Opens the mobile "add transaction" sheet (raised center FAB). */
  onAddClick: () => void;
}) {
  const [firstTab, secondTab] = TABS;

  return (
    <nav
      aria-label="Primary"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 flex items-start border-t border-[#eceafb] bg-white/90 pt-1.5 backdrop-blur-lg sm:hidden"
      style={{ boxShadow: "0 -8px 24px -16px rgba(40, 20, 120, 0.25)" }}
    >
      <TabButton tab={firstTab} active={activeTab === firstTab.id} onClick={() => onTabChange(firstTab.id)} />

      <div className="flex w-20 shrink-0 justify-center">
        <button
          type="button"
          onClick={onAddClick}
          aria-label={STRINGS.bottomNav.addLabel}
          title={STRINGS.bottomNav.addLabel}
          className="relative -top-5 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-4 border-[#f6f5fc] bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-2xl font-semibold text-white shadow-[0_10px_24px_-6px_rgba(129,80,240,0.7)] transition-transform duration-200 active:scale-90"
        >
          +
        </button>
      </div>

      <TabButton tab={secondTab} active={activeTab === secondTab.id} onClick={() => onTabChange(secondTab.id)} />
    </nav>
  );
}

function TabButton({
  tab,
  active,
  onClick,
}: {
  tab: { id: AppTab; label: string; icon: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-xl border-none bg-transparent px-2 py-1.5 transition-colors duration-200"
    >
      <span
        className={`flex h-8 w-14 items-center justify-center rounded-full text-base transition-all duration-200 ${
          active ? "bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-[0_6px_16px_-8px_rgba(129,80,240,0.7)]" : "text-[#a39cc0]"
        }`}
        aria-hidden="true"
      >
        {tab.icon}
      </span>
      <span
        className={`text-[0.66rem] font-semibold tracking-wide transition-colors duration-200 ${
          active ? "text-indigo-600" : "text-[#9a93b0]"
        }`}
      >
        {tab.label}
      </span>
    </button>
  );
}
