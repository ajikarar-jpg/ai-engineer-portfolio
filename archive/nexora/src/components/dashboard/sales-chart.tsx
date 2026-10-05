"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { useSettings } from "@/components/settings/settings-provider";
import { salesByCategory } from "@/lib/data";
import { formatCompactMoney, formatMoney } from "@/lib/format";
import type { SalesData } from "@/lib/types";

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const axisTick = { fill: "var(--muted)", fontSize: 12 };

export function SalesChart({
  data = salesByCategory,
  title = "Sales by category",
  description = "Share of the reported year",
}: {
  data?: SalesData[];
  title?: string;
  description?: string;
}) {
  const { settings } = useSettings();
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  const leader = [...data].sort((a, b) => b.revenue - a.revenue)[0];
  const share = leader ? Math.round((leader.revenue / total) * 100) : 0;

  return (
    <ChartCard title={title} description={description}>
      <div className="h-[260px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 480, height: 300 }}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => formatCompactMoney(value, settings.currency)}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              width={108}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-muted)" }}
              content={(props) => (
                <ChartTooltip
                  active={props.active}
                  payload={props.payload}
                  label={props.label}
                  formatValue={(value) => formatMoney(value, settings.currency)}
                />
              )}
            />
            <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={16} isAnimationActive={false}>
              {data.map((item, index) => (
                <Cell key={item.category} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {leader ? (
        <p className="mt-3 text-sm text-muted">
          {leader.category} leads with {share}% of category revenue.
        </p>
      ) : null}
    </ChartCard>
  );
}
