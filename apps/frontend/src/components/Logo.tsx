export function Logo({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Coin — money */}
      <circle cx="16" cy="17" r="11.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="17" r="8.4" stroke="currentColor" strokeWidth="1.35" opacity="0.4" />

      {/* Stylized S — SpendWise */}
      <path
        d="M19.9 13.4c-.5-1-1.65-1.6-3.15-1.6-1.9 0-3.15.95-3.15 2.25 0 1.2.85 1.85 2.75 2.3l.95.22c2.1.5 3.25 1.4 3.25 3.05 0 1.95-1.75 3.3-4.2 3.3-1.85 0-3.35-.8-4-2.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Wisdom spark */}
      <path
        d="M24.5 5.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z"
        fill="currentColor"
      />
    </svg>
  );
}
