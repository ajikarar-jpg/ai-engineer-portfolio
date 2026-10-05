"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useSettings } from "@/components/settings/settings-provider";
import { cn } from "@/lib/cn";
import { formatMoney, formatNumber, formatPercent, formatSignedPercent } from "@/lib/format";

export function StatCard({
  label,
  value,
  format,
  change,
  series,
  icon: Icon,
  hint = "vs previous period",
}: {
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  change?: number;
  series?: number[];
  icon: LucideIcon;
  hint?: string;
}) {
  const { settings } = useSettings();
  const display =
    format === "currency"
      ? formatMoney(value, settings.currency)
      : format === "percent"
        ? formatPercent(value)
        : formatNumber(value);
  const positive = (change ?? 0) >= 0;

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(23,33,28,0.04)] transition-colors hover:border-accent/30">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
          <Icon className="size-4" />
        </span>
        {change !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              positive ? "bg-accent-soft text-positive" : "bg-negative-soft text-negative",
            )}
          >
            {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {formatSignedPercent(change)}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-medium tracking-tight tabular-nums">{display}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-xs text-muted">{hint}</p>
        {series && series.length > 1 ? <Sparkline values={series} /> : null}
      </div>
    </article>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const width = 96;
  const height = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const path = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-24 text-accent" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
