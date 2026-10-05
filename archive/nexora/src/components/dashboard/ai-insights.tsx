"use client";

import { useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { useSettings } from "@/components/settings/settings-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { createAnalysisSnapshot } from "@/lib/data";
import type { AIInsight, AnalysisResponse } from "@/lib/types";

export function AIInsights({ className }: { className?: string }) {
  const { settings } = useSettings();
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [source, setSource] = useState<AnalysisResponse["source"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createAnalysisSnapshot(settings.ai)),
      });
      const payload = (await response.json()) as AnalysisResponse & { error?: string };
      if (!response.ok || !payload.insight) {
        throw new Error(payload.error || "The analysis could not be completed.");
      }
      setInsight(payload.insight);
      setSource(payload.source);
      setStatus("ready");
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "The analysis could not be completed.");
    }
  }

  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(23,33,28,0.04)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">AI Business Analyst</h2>
            <p className="mt-1 max-w-md text-sm text-muted">
              Reads revenue, customers, orders, conversion, and category mix.
            </p>
          </div>
        </div>
        <Button onClick={analyze} disabled={status === "loading"}>
          {status === "loading" ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {status === "ready" ? "Run again" : "Analyze my business"}
        </Button>
      </div>

      <div className="mt-5 flex-1" aria-live="polite">
        {status === "loading" ? (
          <p className="text-sm text-muted">Analyzing your business data...</p>
        ) : null}

        {status === "error" ? (
          <div className="rounded-xl border border-negative/30 bg-negative-soft px-4 py-3">
            <p className="text-sm text-negative">{error}</p>
            <Button variant="secondary" className="mt-3" onClick={analyze}>
              Try again
            </Button>
          </div>
        ) : null}

        {status === "idle" ? (
          <p className="text-sm leading-6 text-muted">
            Run an analysis to get a short summary, the main findings, three recommendations, and one risk based on the current Nexora data.
          </p>
        ) : null}

        {status === "ready" && insight ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Summary</h3>
              <p className="mt-2 text-sm leading-6">{insight.summary}</p>
            </div>
            <InsightList title="Key findings" items={insight.findings} />
            <InsightList title="Recommendations" items={insight.recommendations} ordered />
            <div className="rounded-xl border border-warning/30 bg-warning-soft px-4 py-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-warning">Risk</h3>
              <p className="mt-2 text-sm leading-6">{insight.risk}</p>
            </div>
            <p className="text-xs text-muted">
              {source === "fallback"
                ? "Local analysis. Add OPENAI_API_KEY to use the live model. Figures are discussed in euros."
                : "Generated with OpenAI from the euro figures in this workspace."}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function InsightList({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted">{title}</h3>
      <List className={cn("mt-2 space-y-2 text-sm leading-6", ordered && "list-decimal pl-5")}>
        {items.map((item) => (
          <li key={item} className={cn(!ordered && "relative pl-4 before:absolute before:left-0 before:top-2 before:size-1.5 before:rounded-full before:bg-accent")}>
            {item}
          </li>
        ))}
      </List>
    </div>
  );
}
