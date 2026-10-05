"use client";

import { ChartCard } from "@/components/dashboard/chart-card";
import { Pill } from "@/components/ui/pill";
import { useSettings } from "@/components/settings/settings-provider";
import { recentActivity } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const tones: Record<OrderStatus, "positive" | "warning" | "neutral" | "negative"> = {
  paid: "positive",
  pending: "warning",
  refunded: "neutral",
  failed: "negative",
};

const labels: Record<OrderStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
  failed: "Failed",
};

export function CustomerActivity() {
  const { settings } = useSettings();

  return (
    <ChartCard title="Recent activity" description="Latest orders across the workspace">
      <ul className="divide-y divide-border">
        {recentActivity.map((item) => (
          <li key={item.id} className="grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="truncate text-xs text-muted">{item.email}</p>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm">{item.order}</p>
              <p className="text-xs text-muted sm:hidden">{formatDate(item.date)}</p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="font-mono text-sm tabular-nums">
                {formatMoney(item.amount, settings.currency)}
              </p>
              <Pill tone={tones[item.status]}>{labels[item.status]}</Pill>
              <p className="hidden w-24 text-right text-xs text-muted sm:block">
                {formatDate(item.date)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
