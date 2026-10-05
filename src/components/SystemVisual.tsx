"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const stages = [
  { label: "Input", items: ["Website form", "CRM", "Email"] },
  { label: "AI Engine", items: ["Analyze", "Classify", "Generate", "Predict"] },
  { label: "Automation", items: ["Workflow", "Action", "Notification"] },
  { label: "Result", items: ["Faster operations", "Better decisions", "Less manual work"] },
] as const;

export function SystemVisual() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % stages.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div aria-hidden>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(155,124,255,0.08)]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted">SYSTEM</p>
          <p className="font-mono text-[11px] text-muted">0{index + 1} / 04</p>
        </div>
        <ol className="relative px-4 py-2">
          {stages.map((stage, stageIndex) => {
            const active = index === stageIndex;
            const last = stageIndex === stages.length - 1;
            return (
              <li key={stage.label} className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 py-3">
                {!last ? (
                  <span className="absolute top-7 bottom-0 left-[0.3rem] w-px bg-accent/35" aria-hidden />
                ) : null}
                <span
                  className={cn(
                    "relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full border transition-colors duration-300",
                    active ? "status-pulse border-accent bg-accent shadow-[0_0_10px_rgba(124,92,255,0.75)]" : "border-line bg-surface-2",
                  )}
                />
                <div
                  className={cn(
                    "rounded-lg border px-3 py-2.5 transition-colors duration-300",
                    active ? "border-accent/40 bg-accent/[0.06]" : "border-transparent",
                  )}
                >
                  <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{stage.label}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {stage.items.map((item) => (
                      <li
                        key={item}
                        className={cn(
                          "rounded-md border px-2 py-1 text-xs transition-colors duration-300",
                          active ? "border-line text-foreground" : "border-line/70 text-muted",
                        )}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] tracking-[0.16em] text-muted">
        ILLUSTRATIVE SYSTEM VIEW
      </p>
    </div>
  );
}
