export function EyeIcon({ open, size = 18 }: { open: boolean; size?: number }) {
  if (open) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 3.5l17 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.7 5.18A10.6 10.6 0 0 1 12 5c7 0 10.5 7 10.5 7a13.9 13.9 0 0 1-3.13 3.94M6.6 6.6C3.42 8.6 1.5 12 1.5 12s3.5 7 10.5 7c1.36 0 2.6-.26 3.7-.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 10.1a3.25 3.25 0 0 0 4.6 4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
