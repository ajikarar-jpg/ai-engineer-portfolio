"use client";

import {
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
import { monthlyRevenue } from "@/lib/data";
import { formatCompactMoney, formatMoney } from "@/lib/format";
import type { RevenueData } from "@/lib/types";

const axisTick = { fill: "var(--muted)", fontSize: 12 };

export function RevenueChart({
  data = monthlyRevenue,
  title = "Revenue",
  description = "Last 12 months",
}: {
  data?: RevenueData[];
  title?: string;
  description?: string;
}) {
  const { settings } = useSettings();

  return (
    <ChartCard title={title} description={description}>
      <div className="h-[260px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} dy={8} />
            <YAxis
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={(value: number) => formatCompactMoney(value, settings.currency)}
            />
            <Tooltip
              content={(props) => (
                <ChartTooltip
                  active={props.active}
                  payload={props.payload}
                  label={props.label}
                  formatValue={(value) => formatMoney(value, settings.currency)}
                />
              )}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="var(--chart-1)"
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-1)" }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
