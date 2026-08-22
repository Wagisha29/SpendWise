/** WiseBot mark — chat orb + neural nodes for an AI assistant feel. */
export function WiseBotLogo({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Soft glow */}
      <circle cx="20" cy="19" r="18" fill="currentColor" opacity="0.14" />

      {/* Chat orb — fills most of the mark */}
      <circle cx="20" cy="18.5" r="13.5" stroke="currentColor" strokeWidth="2.4" />

      {/* Neural nodes */}
      <circle cx="14.2" cy="16.5" r="2.6" fill="currentColor" />
      <circle cx="25.8" cy="16.5" r="2.6" fill="currentColor" />
      <circle cx="20" cy="24.8" r="2.6" fill="currentColor" />

      {/* Links between nodes */}
      <path
        d="M16.2 17.8L18.4 22.6M23.8 17.8L21.6 22.6M16.8 16.5H23.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Antenna / signal */}
      <path
        d="M20 5.5V3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="20" cy="2.2" r="1.4" fill="currentColor" />

      {/* Intelligence spark */}
      <path
        d="M33.2 8l.85 2.2 2.2.85-2.2.85-.85 2.2-.85-2.2-2.2-.85 2.2-.85.85-2.2z"
        fill="currentColor"
      />

      {/* Chat tail */}
      <path
        d="M13 28.8c-1.3 2.4-3.5 4.1-6 4.8 1.8-.2 3.9-1 5.3-2.4.7-.7 1.2-1.5 1.5-2.4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
