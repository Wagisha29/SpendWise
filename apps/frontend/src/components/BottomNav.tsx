import type { AppTab } from "./Header";

const TABS: { id: AppTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "analytics", label: "Analytics", icon: "📈" },
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
}: {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}) {
  return (
    <nav
      aria-label="Primary"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 flex border-t border-[#eceafb] bg-white/90 pt-1.5 backdrop-blur-lg sm:hidden"
      style={{ boxShadow: "0 -8px 24px -16px rgba(40, 20, 120, 0.25)" }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
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
      })}
    </nav>
  );
}
