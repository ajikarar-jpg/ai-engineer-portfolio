"use client";

import Link from "next/link";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { useSettings } from "@/components/settings/settings-provider";
import { customerSummary, dashboardStats, salesByCategory } from "@/lib/data";
import { formatMoney, formatNumber } from "@/lib/format";

const leader = [...salesByCategory].sort((a, b) => b.revenue - a.revenue)[0];

export function InsightsView() {
  const { settings } = useSettings();
  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <AIInsights />
      <aside className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold">Included in the analysis</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <Item label="Revenue" value={formatMoney(dashboardStats.revenue, settings.currency)} />
          <Item label="Customers" value={formatNumber(dashboardStats.customers)} />
          <Item label="Orders" value={formatNumber(dashboardStats.orders)} />
          <Item label="Conversion" value={`${dashboardStats.conversionRate}%`} />
          <Item label="Leading category" value={leader.category} />
          <Item
            label="Customer mix"
            value={`${customerSummary.active} active · ${customerSummary.vip} VIP · ${customerSummary.pending} pending · ${customerSummary.churned} churned`}
          />
        </ul>
        <p className="mt-4 text-sm leading-6 text-muted">
          The request also includes the 12-month series and category totals. Focus and detail come from{" "}
          <Link href="/settings" className="font-medium text-foreground underline-offset-2 hover:underline">
            Settings
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </li>
  );
}
