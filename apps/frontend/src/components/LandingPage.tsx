import { STRINGS } from "../constants/strings";
import { DashboardPreview } from "./DashboardPreview";
import { GoogleIcon } from "./GoogleIcon";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { WiseBotLogo } from "./WiseBotLogo";

const FEATURES = [
  {
    title: "Quick Logging",
    body: "Seamlessly log income and expenses in seconds with custom categories.",
    accent: "from-amber-300 to-orange-300",
    Icon: BoltIcon,
  },
  {
    title: "Visual Breakdown",
    body: "Dynamic breakdown of spending habits across categories like Food, Rent, and Bills.",
    accent: "from-indigo-300 to-sky-300",
    Icon: ChartIcon,
  },
  {
    title: "Secure & Private",
    body: "Cloud-synced transactions tied to your Google Account.",
    accent: "from-emerald-300 to-teal-300",
    Icon: LockIcon,
  },
  {
    title: STRINGS.landing.wisebotFeatureTitle,
    body: STRINGS.landing.wisebotFeatureBody,
    accent: "from-fuchsia-300 to-violet-300",
    Icon: WiseBotFeatureIcon,
  },
] as const;

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2 4 14h7l-1 8 10-14h-7l0-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 16V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 16V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 16v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WiseBotFeatureIcon() {
  return <WiseBotLogo size={22} />;
}

export function LandingPage({ onSignIn }: { onSignIn: () => Promise<void> }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(99,102,241,0.16), transparent 42%), radial-gradient(circle at 88% 18%, rgba(236,72,153,0.12), transparent 40%), radial-gradient(circle at 50% 100%, rgba(34,211,238,0.1), transparent 42%), var(--page-bg)",
      }}
    >
      <div className="pt-safe absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      {/* Hero — one composition: brand, headline, support, CTA, preview */}
      <section className="relative mx-auto grid min-h-screen max-w-[1440px] items-center gap-10 px-6 pt-10 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12 lg:pt-8 lg:pb-12">
        <div className="animate-fade-in-up z-10 max-w-xl">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-white shadow-[0_10px_26px_-8px_rgba(129,80,240,0.55)]">
              <Logo size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[var(--tx-strong)]">
              {STRINGS.app.name}
            </span>
          </div>

          <h1 className="m-0 text-[2.15rem] leading-[1.15] font-extrabold tracking-tight text-[var(--tx-strong)] sm:text-[2.65rem]">
            {STRINGS.landing.headline}
          </h1>
          <p className="mt-4 mb-8 max-w-md text-[1.02rem] leading-relaxed text-[var(--tx-muted)]">
            {STRINGS.landing.subhead}
          </p>

          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-transparent bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-7 py-3.5 text-[0.95rem] font-bold text-white shadow-[0_12px_28px_-10px_rgba(129,80,240,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(129,80,240,0.75)] active:scale-[0.98] active:translate-y-0"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
              <GoogleIcon size={14} />
            </span>
            {STRINGS.landing.cta}
          </button>
        </div>

        <div
          className="animate-fade-in-up relative mx-auto w-full max-w-[480px] lg:mx-0 lg:max-w-none"
          style={{ animationDelay: "120ms" }}
        >
          <div className="absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br from-indigo-300/25 via-fuchsia-300/15 to-cyan-300/20 blur-2xl" />
          <DashboardPreview />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1440px] px-6 pb-20 lg:px-12">
        <div className="mb-8 max-w-lg">
          <h2 className="m-0 text-2xl font-extrabold tracking-tight text-[var(--tx-strong)]">
            {STRINGS.landing.featuresHeading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--tx-muted)]">
            {STRINGS.landing.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className="animate-fade-in-up group rounded-2xl border border-[var(--bd-subtle)] bg-[var(--surf-card)]/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-slate-900/80 ${feature.accent} transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.Icon />
              </div>
              <h3 className="m-0 text-base font-bold text-[var(--tx-strong)]">{feature.title}</h3>
              <p className="mt-2 mb-0 text-sm leading-relaxed text-[var(--tx-muted)]">{feature.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-[var(--bd-subtle)] pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-sm text-[var(--tx-muted)]">{STRINGS.landing.closingCta}</p>
          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[var(--google-border)] bg-[var(--surf-card)] px-6 py-3 text-sm font-semibold text-[var(--google-text)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.25)] active:scale-[0.98] active:translate-y-0"
          >
            <GoogleIcon size={18} />
            {STRINGS.landing.cta}
          </button>
        </div>
      </section>
    </div>
  );
}
