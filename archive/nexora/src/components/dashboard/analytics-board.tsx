"use client";

import { useMemo, useState } from "react";
import { DateRangeSelector } from "@/components/dashboard/date-range-selector";
import { MetricChart } from "@/components/dashboard/metric-chart";
import { useSettings } from "@/components/settings/settings-provider";
import { getAnalyticsSeries } from "@/lib/data";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import type { DateRange } from "@/lib/types";

export function AnalyticsBoard() {
  const [range, setRange] = useState<DateRange>("30d");
  const { settings } = useSettings();
  const series = useMemo(() => getAnalyticsSeries(range), [range]);
  const revenue = series.reduce((sum, point) => sum + point.revenue, 0);
  const orders = series.reduce((sum, point) => sum + point.orders, 0);
  const customers = series.at(-1)?.customers ?? 0;
  const conversion = series.length
    ? series.reduce((sum, point) => sum + point.conversion, 0) / series.length
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {formatMoney(revenue, settings.currency)} revenue · {formatNumber(orders)} orders ·{" "}
          {formatNumber(customers)} customers · {formatPercent(conversion)} conversion
        </p>
        <DateRangeSelector value={range} onChange={setRange} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <MetricChart
          title="Revenue"
          description="Total for the selected range"
          data={series}
          dataKey="revenue"
          kind="line"
          format="currency"
          color="var(--chart-1)"
        />
        <MetricChart
          title="Orders"
          description="Order volume for the selected range"
          data={series}
          dataKey="orders"
          kind="bar"
          format="number"
          color="var(--chart-3)"
        />
        <MetricChart
          title="Customer growth"
          description="Customers at the end of each point"
          data={series}
          dataKey="customers"
          kind="area"
          format="number"
          color="var(--chart-1)"
        />
        <MetricChart
          title="Conversion rate"
          description="Average conversion in the range"
          data={series}
          dataKey="conversion"
          kind="line"
          format="percent"
          color="var(--chart-2)"
        />
      </div>
    </div>
  );
}
