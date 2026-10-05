"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { useSettings } from "@/components/settings/settings-provider";
import {
  formatCompactMoney,
  formatCompactNumber,
  formatMoney,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import type { AnalyticsPoint } from "@/lib/types";

const axisTick = { fill: "var(--muted)", fontSize: 12 };

export function MetricChart({
  title,
  description,
  data,
  dataKey,
  kind,
  format,
  color,
}: {
  title: string;
  description?: string;
  data: AnalyticsPoint[];
  dataKey: "revenue" | "orders" | "customers" | "conversion";
  kind: "line" | "bar" | "area";
  format: "currency" | "number" | "percent";
  color: string;
}) {
  const { settings } = useSettings();
  const formatValue = (value: number) => {
    if (format === "currency") return formatMoney(value, settings.currency);
    if (format === "percent") return formatPercent(value);
    return formatNumber(value);
  };
  const formatAxis = (value: number) => {
    if (format === "currency") return formatCompactMoney(value, settings.currency);
    if (format === "percent") return `${value}%`;
    return formatCompactNumber(value);
  };

  const interval = data.length > 8 ? Math.ceil(data.length / 6) - 1 : 0;
  const chart = (
    <>
      <CartesianGrid stroke="var(--border)" vertical={false} />
      <XAxis
        dataKey="label"
        tick={axisTick}
        axisLine={false}
        tickLine={false}
        interval={interval}
        minTickGap={12}
        dy={8}
      />
      <YAxis
        tick={axisTick}
        axisLine={false}
        tickLine={false}
        width={format === "currency" ? 64 : 48}
        tickFormatter={formatAxis}
        domain={format === "percent" ? ["auto", "auto"] : [0, "auto"]}
      />
      <Tooltip
        cursor={kind === "bar" ? { fill: "var(--surface-muted)" } : { stroke: "var(--border)" }}
        content={(props) => (
          <ChartTooltip
            active={props.active}
            payload={props.payload}
            label={props.label}
            formatValue={formatValue}
          />
        )}
      />
    </>
  );

  return (
    <ChartCard title={title} description={description}>
      <div className="h-[240px] w-full sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 280 }}>
          {kind === "bar" ? (
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              {chart}
              <Bar dataKey={dataKey} fill={color} radius={[5, 5, 0, 0]} maxBarSize={28} isAnimationActive={false} />
            </BarChart>
          ) : kind === "area" ? (
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              {chart}
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={color}
                fillOpacity={0.16}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              {chart}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2.25}
                dot={false}
                activeDot={{ r: 4, fill: color }}
                isAnimationActive={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
