"use client";

import { cn } from "@/lib/cn";
import type { DateRange } from "@/lib/types";

const options: Array<{ id: DateRange; label: string }> = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "12m", label: "Last 12 months" },
];

export function DateRangeSelector({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (value: DateRange) => void;
}) {
  return (
    <div
      className="flex w-full flex-wrap rounded-xl border border-border bg-surface p-1 sm:w-auto"
      role="group"
      aria-label="Date range"
    >
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "h-8 flex-1 rounded-lg px-3 text-sm transition-colors sm:flex-none",
              selected
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
