export const CARD = "bg-white border border-[#ece9f4] rounded-[14px] shadow-sm";

export const AMOUNT_MASK = "•••••";

export function formatAmount(amount: number, hideAmounts: boolean): string {
  return hideAmounts ? AMOUNT_MASK : amount.toFixed(2);
}
