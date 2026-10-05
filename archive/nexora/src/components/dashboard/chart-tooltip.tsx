"use client";

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (Array.isArray(value)) return toNumber(value[0]);
  return Number.NaN;
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: unknown }>;
  label?: string | number;
  formatValue: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const numeric = toNumber(payload[0]?.value);
  if (!Number.isFinite(numeric)) return null;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-sm">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-sm tabular-nums">{formatValue(numeric)}</p>
    </div>
  );
}
