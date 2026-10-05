"use client";

import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatRate, type AttemptBreakdown, type RatePoint } from "@/lib/deliveryAnalytics";
import type { NeighborStat } from "@/lib/neighborAnalysis";

const axisTick = { fill: "#b0aa9f", fontSize: 11 };
const grid = "rgba(244, 241, 234, 0.08)";

function Tip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: unknown }>;
  label?: string | number;
}) {
  const raw = payload?.[0]?.value;
  const value = typeof raw === "number" ? raw : null;
  if (!active || value === null) return null;
  return (
    <div className="border border-line bg-[#11151d] px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-sm tabular-nums">{formatRate(value)}</p>
    </div>
  );
}

function ChartCard({ title, children, empty }: { title: string; children: ReactNode; empty: boolean }) {
  return (
    <section className="border border-line bg-[#0d1016] p-4 md:p-5">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-4 h-56 w-full">
        {empty ? <p className="flex h-full items-center text-sm text-muted">Load a dataset to draw this chart.</p> : children}
      </div>
    </section>
  );
}

type DeliveryChartsProps = {
  byHour: RatePoint[];
  byDay: RatePoint[];
  attempts: AttemptBreakdown | null;
  neighbors: NeighborStat[];
};

export function DeliveryCharts({ byHour, byDay, attempts, neighbors }: DeliveryChartsProps) {
  const attemptBars = attempts
    ? [
        { label: "First delivered", value: attempts.firstDelivered },
        { label: "First failed", value: attempts.firstFailed },
        { label: "Later delivered", value: attempts.repeatDelivered },
        { label: "Later failed", value: attempts.repeatFailed },
      ]
    : [];
  const neighborBars = neighbors.slice(0, 5).map((neighbor) => ({
    label: neighbor.address,
    value: neighbor.receipts,
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard title="Delivery success by hour" empty={byHour.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byHour} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={grid} />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} interval={0} angle={-35} height={48} textAnchor="end" />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={36} unit="%" />
            <Tooltip content={(props) => <Tip {...props} />} cursor={{ fill: "rgba(244,241,234,0.04)" }} />
            <Bar dataKey="rate" fill="#35D07F" maxBarSize={18} radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Delivery success by day" empty={byDay.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={grid} />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={36} unit="%" />
            <Tooltip content={(props) => <Tip {...props} />} cursor={{ fill: "rgba(244,241,234,0.04)" }} />
            <Bar dataKey="rate" fill="#35D07F" maxBarSize={22} radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="First attempt vs later attempt" empty={attemptBars.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attemptBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={grid} />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} interval={0} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <Tooltip
              content={(props) => {
                const raw = props.payload?.[0]?.value;
                const value = typeof raw === "number" ? raw : null;
                if (!props.active || value === null) return null;
                return (
                  <div className="border border-line bg-[#11151d] px-3 py-2">
                    <p className="text-xs text-muted">{props.label}</p>
                    <p className="mt-1 font-mono text-sm tabular-nums">{value}</p>
                  </div>
                );
              }}
              cursor={{ fill: "rgba(244,241,234,0.04)" }}
            />
            <Bar dataKey="value" fill="rgba(235,230,220,0.75)" maxBarSize={28} radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Neighbor receiver frequency" empty={neighborBars.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={neighborBars} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="label" width={132} tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip
              content={(props) => {
                const raw = props.payload?.[0]?.value;
                const value = typeof raw === "number" ? raw : null;
                if (!props.active || value === null) return null;
                return (
                  <div className="border border-line bg-[#11151d] px-3 py-2">
                    <p className="text-xs text-muted">{props.label}</p>
                    <p className="mt-1 font-mono text-sm tabular-nums">{value} receipts</p>
                  </div>
                );
              }}
              cursor={{ fill: "rgba(244,241,234,0.04)" }}
            />
            <Bar dataKey="value" fill="#35D07F" barSize={14} radius={[0, 2, 2, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
