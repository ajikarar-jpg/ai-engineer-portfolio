import { formatNumber, formatSignedPercent } from "@/lib/format";
import type { AIInsight, AnalysisSnapshot, RevenueData, SalesData } from "@/lib/types";

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function money(value: number) {
  return euro.format(value);
}

export function parseInsight(value: unknown): AIInsight | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const findings = stringList(record.findings);
  const recommendations = stringList(record.recommendations);

  if (
    typeof record.summary !== "string" ||
    typeof record.risk !== "string" ||
    !findings ||
    findings.length < 3 ||
    !recommendations ||
    recommendations.length < 3
  ) {
    return null;
  }

  return {
    summary: record.summary.trim(),
    findings: findings.slice(0, 5),
    recommendations: recommendations.slice(0, 3),
    risk: record.risk.trim(),
  };
}

function stringList(value: unknown) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return null;
  }
  const cleaned = value.map((item) => item.trim()).filter(Boolean);
  return cleaned.length ? cleaned : null;
}

function largestDip(months: RevenueData[]) {
  let dip: { month: string; previous: string; change: number; revenue: number } | null =
    null;

  for (let index = 1; index < months.length; index += 1) {
    const previous = months[index - 1];
    const current = months[index];
    const change = (current.revenue - previous.revenue) / previous.revenue;
    if (change < 0 && (!dip || change < dip.change)) {
      dip = {
        month: current.month,
        previous: previous.month,
        change,
        revenue: current.revenue,
      };
    }
  }

  return dip;
}

function rankedCategories(categories: SalesData[]) {
  return [...categories].sort((a, b) => b.revenue - a.revenue);
}

export function buildFallbackInsight(input: AnalysisSnapshot): AIInsight {
  const months = input.monthlyRevenue;
  const first = months[0];
  const last = months[months.length - 1];
  const categories = rankedCategories(input.salesByCategory);
  const best = categories[0];
  const second = categories[1];
  const categoryTotal = input.salesByCategory.reduce((sum, item) => sum + item.revenue, 0);
  const share = Math.round((best.revenue / categoryTotal) * 100);
  const growth = Math.round(((last.revenue - first.revenue) / first.revenue) * 100);
  const yearTotal = months.reduce((sum, month) => sum + month.revenue, 0);
  const dip = largestDip(months);
  const mismatch = input.stats.revenue > last.revenue * 2;
  const focus = input.preferences?.focus ?? "balanced";

  const findings = [
    `Monthly revenue moved from ${money(first.revenue)} in ${first.month} to ${money(last.revenue)} in ${last.month}, a ${growth}% rise. The twelve months sum to ${money(yearTotal)}.`,
    `${best.category} leads category sales at ${money(best.revenue)}, about ${share}% of the mix. ${second.category} is next at ${money(second.revenue)}.`,
    `The current snapshot is ${money(input.stats.revenue)} revenue (${formatSignedPercent(input.stats.revenueChange)}), ${formatNumber(input.stats.customers)} customers (${formatSignedPercent(input.stats.customersChange)}), ${formatNumber(input.stats.orders)} orders (${formatSignedPercent(input.stats.ordersChange)}), and ${input.stats.conversionRate}% conversion (${formatSignedPercent(input.stats.conversionChange)}).`,
    `Customers on the monthly series grew from ${formatNumber(first.customers)} in ${first.month} to ${formatNumber(last.customers)} in ${last.month}. Orders in ${last.month} were ${formatNumber(last.orders)}.`,
  ];

  if (dip) {
    findings.push(
      `${dip.month} was the sharpest pullback, down ${Math.abs(dip.change * 100).toFixed(1)}% from ${dip.previous} to ${money(dip.revenue)}, before the series recovered.`,
    );
  }

  if (focus === "customers") {
    const customerFinding = findings[3];
    findings.splice(3, 1);
    findings.unshift(customerFinding);
  }

  const recommendations = [
    mismatch
      ? `Reconcile the ${money(input.stats.revenue)} headline with the monthly series, which peaks at ${money(last.revenue)} in ${last.month}, before either number is used in a forecast.`
      : `Plan the next quarter from the ${last.month} monthly result of ${money(last.revenue)} rather than from a single strong week.`,
    `Pair the ${best.category.toLowerCase()} lead with a specific ${second.category.toLowerCase()} offer so one category is not carrying the year.`,
  ];

  if (focus === "retention") {
    recommendations.push(
      `Follow up with ${input.customerSummary.churned} churned accounts and ${input.customerSummary.pending} pending customers before adding acquisition spend.`,
    );
  } else if (dip) {
    recommendations.push(
      `Treat ${dip.month} as a review item — stock, campaign timing, and failed payments — and test one change aimed at moving conversion from ${input.stats.conversionRate}% toward 5.5%.`,
    );
  } else {
    recommendations.push(
      `Conversion is ${input.stats.conversionRate}%. Test one checkout or inquiry change before running a broader discount.`,
    );
  }

  const risk = mismatch
    ? `Headline revenue of ${money(input.stats.revenue)} sits far above the latest monthly point of ${money(last.revenue)}. If those figures use different definitions, a plan based on either series will be off.`
    : `${best.category} is ${share}% of category revenue. A pricing, supply, or demand problem there would move the whole result.`;

  const summary = [
    `Nexora closed the monthly series at ${money(last.revenue)}, up ${growth}% from ${first.month}, with ${best.category.toLowerCase()} as the strongest category and conversion at ${input.stats.conversionRate}%.`,
    input.preferences?.detail === "detailed"
      ? `Customer count on that series ended at ${formatNumber(last.customers)}, ${last.month} orders were ${formatNumber(last.orders)}, and the current headline revenue is ${money(input.stats.revenue)}.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    summary,
    findings: findings.slice(0, 5),
    recommendations: recommendations.slice(0, 3),
    risk,
  };
}

export function isAnalysisSnapshot(value: unknown): value is AnalysisSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as AnalysisSnapshot;
  return (
    isStats(snapshot.stats) &&
    Array.isArray(snapshot.monthlyRevenue) &&
    snapshot.monthlyRevenue.length > 1 &&
    snapshot.monthlyRevenue.every(isRevenueRow) &&
    Array.isArray(snapshot.salesByCategory) &&
    snapshot.salesByCategory.length > 0 &&
    snapshot.salesByCategory.every(isSalesRow) &&
    isCustomerSummary(snapshot.customerSummary)
  );
}

function isStats(value: DashboardLike): value is AnalysisSnapshot["stats"] {
  if (!value || typeof value !== "object") return false;
  const stats = value as AnalysisSnapshot["stats"];
  return [
    stats.revenue,
    stats.revenueChange,
    stats.customers,
    stats.customersChange,
    stats.orders,
    stats.ordersChange,
    stats.conversionRate,
    stats.conversionChange,
  ].every((item) => typeof item === "number" && Number.isFinite(item));
}

type DashboardLike = AnalysisSnapshot["stats"] | undefined;

function isRevenueRow(value: unknown): value is RevenueData {
  if (!value || typeof value !== "object") return false;
  const row = value as RevenueData;
  return (
    typeof row.month === "string" &&
    typeof row.revenue === "number" &&
    Number.isFinite(row.revenue) &&
    typeof row.orders === "number" &&
    typeof row.customers === "number" &&
    typeof row.conversion === "number"
  );
}

function isSalesRow(value: unknown): value is SalesData {
  if (!value || typeof value !== "object") return false;
  const row = value as SalesData;
  return (
    typeof row.category === "string" &&
    typeof row.revenue === "number" &&
    Number.isFinite(row.revenue)
  );
}

function isCustomerSummary(value: unknown): value is AnalysisSnapshot["customerSummary"] {
  if (!value || typeof value !== "object") return false;
  const summary = value as AnalysisSnapshot["customerSummary"];
  return [summary.active, summary.vip, summary.pending, summary.churned].every(
    (item) => typeof item === "number" && Number.isFinite(item),
  );
}
