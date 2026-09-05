export function LoadingSpinner({ className = "min-h-32" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`.trim()}>
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#ece9f4] border-t-indigo-400" />
    </div>
  );
}
