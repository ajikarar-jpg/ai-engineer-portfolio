"use client";

import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { useSettings } from "@/components/settings/settings-provider";
import { monthlyRevenue } from "@/lib/data";
import { formatMoney, formatNumber, formatPercent, formatSignedPercent } from "@/lib/format";
import { cn } from "@/lib/cn";

export function RevenueView() {
  const { settings } = useSettings();
  const total = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const average = Math.round(total / monthlyRevenue.length);
  const best = monthlyRevenue.reduce((leader, month) =>
    month.revenue > leader.revenue ? month : leader,
  );

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryTile label="Year total" value={formatMoney(total, settings.currency)} hint="Sum of monthly revenue" />
        <SummaryTile label="Best month" value={best.month} hint={formatMoney(best.revenue, settings.currency)} />
        <SummaryTile label="Average month" value={formatMoney(average, settings.currency)} hint="Across 12 months" />
      </section>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RevenueChart description="Reported year, January to December" />
        </div>
        <div className="min-w-0">
          <SalesChart />
        </div>
      </div>
      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Monthly breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Month</th>
                <th className="px-5 py-3 font-medium">Revenue</th>
                <th className="px-5 py-3 font-medium">Change</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Customers</th>
                <th className="px-5 py-3 font-medium">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRevenue.map((month, index) => {
                const previous = monthlyRevenue[index - 1];
                const change = previous
                  ? ((month.revenue - previous.revenue) / previous.revenue) * 100
                  : null;
                return (
                  <tr key={month.month} className="border-t border-border">
                    <td className="px-5 py-3 font-medium">{month.month}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">
                      {formatMoney(month.revenue, settings.currency)}
                    </td>
                    <td
                      className={cn(
                        "px-5 py-3 font-mono tabular-nums",
                        change === null ? "text-muted" : change >= 0 ? "text-positive" : "text-negative",
                      )}
                    >
                      {change === null ? "—" : formatSignedPercent(change)}
                    </td>
                    <td className="px-5 py-3 font-mono tabular-nums">{formatNumber(month.orders)}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">{formatNumber(month.customers)}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">{formatPercent(month.conversion)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-mono text-2xl tracking-tight tabular-nums">{value}</p>
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </article>
  );
}
