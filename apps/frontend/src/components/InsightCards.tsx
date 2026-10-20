import { STRINGS } from "../constants/strings";
import { AMOUNT_MASK, CARD, formatAmount } from "../lib/ui";

interface InsightCardsProps {
  dailyAverage: number;
  topCategory: {
    category: string;
    amount: number;
    percent: number;
    icon: string;
  } | null;
  hideAmounts: boolean;
}

export function InsightCards({ dailyAverage, topCategory, hideAmounts }: InsightCardsProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className={`${CARD} flex flex-col gap-1 px-5 py-4 hover:shadow-md`}>
        <span className="text-xs font-semibold tracking-wider text-[#8c86a3] uppercase">
          {STRINGS.insights.averageDailySpend}
        </span>
        <span className="text-xl font-extrabold tabular-nums text-[#3f3b52]">
          ₹{formatAmount(dailyAverage, hideAmounts)}
          <span className="ml-1 text-sm font-semibold text-[#8c86a3]">{STRINGS.insights.perDay}</span>
        </span>
        <p className="m-0 text-xs text-[#8c86a3]">{STRINGS.insights.averageDailyFootnote}</p>
      </div>

      <div className={`${CARD} flex flex-col gap-1 px-5 py-4 hover:shadow-md`}>
        <span className="text-xs font-semibold tracking-wider text-[#8c86a3] uppercase">
          {STRINGS.insights.topSpendingCategory}
        </span>
        {topCategory ? (
          <>
            <span className="text-xl font-extrabold text-[#3f3b52]">
              {topCategory.icon} {topCategory.category}
            </span>
            <p className="m-0 text-sm text-[#6f6888]">
              {STRINGS.insights.makesUp}{" "}
              <span className="font-bold text-rose-600 tabular-nums">
                {hideAmounts ? AMOUNT_MASK : `${topCategory.percent.toFixed(0)}%`}
              </span>{" "}
              {STRINGS.insights.ofThisMonthsSpending}
              {!hideAmounts && (
                <span className="text-[#8c86a3]">
                  {" "}
                  (₹{formatAmount(topCategory.amount, false)})
                </span>
              )}
            </p>
          </>
        ) : (
          <p className="m-0 text-sm text-[#8c86a3]">{STRINGS.common.noExpensesThisMonth}</p>
        )}
      </div>
    </section>
  );
}
