export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonthKey(): string {
  return todayISO().slice(0, 7);
}

export function isCurrentMonth(dateStr: string): boolean {
  return dateStr.slice(0, 7) === currentMonthKey();
}
