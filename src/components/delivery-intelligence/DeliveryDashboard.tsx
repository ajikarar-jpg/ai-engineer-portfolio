"use client";

import { Clock3, LayoutDashboard, MapPin, Route, Truck, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AddressSelector } from "@/components/delivery-intelligence/AddressSelector";
import { DeliveryCharts } from "@/components/delivery-intelligence/DeliveryCharts";
import { DeliveryHistory } from "@/components/delivery-intelligence/DeliveryHistory";
import { DeliveryWindow } from "@/components/delivery-intelligence/DeliveryWindow";
import { DriverInsights } from "@/components/delivery-intelligence/DriverInsights";
import { NeighborInsights } from "@/components/delivery-intelligence/NeighborInsights";
import { PredictionCard } from "@/components/delivery-intelligence/PredictionCard";
import { PredictionFactors } from "@/components/delivery-intelligence/PredictionFactors";
import { sampleDeliveries } from "@/data/sampleDeliveries";
import {
  addressStats,
  addressesIn,
  allAddressStats,
  attemptBreakdown,
  fleetKpis,
  forAddress,
  formatCount,
  formatRate,
  successByDay,
  successByHour,
} from "@/lib/deliveryAnalytics";
import { meanPredictedScore, scoreAddress } from "@/lib/deliveryScoring";
import { cn } from "@/lib/cn";
import { neighborStats } from "@/lib/neighborAnalysis";
import { bestWindow, windowStats } from "@/lib/timeWindowAnalysis";

type View = "overview" | "addresses" | "predictions" | "neighbors" | "insights" | "history";

const views = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "predictions", label: "Predictions", icon: Route },
  { id: "neighbors", label: "Neighbors", icon: Users },
  { id: "insights", label: "Driver Insights", icon: Truck },
  { id: "history", label: "History", icon: Clock3 },
] as const;

export function DeliveryDashboard() {
  const [view, setView] = useState<View>("overview");
  const records = sampleDeliveries;
  const [query, setQuery] = useState("");
  const [address, setAddress] = useState<string | null>("22 Main Road");
  const [analysis, setAnalysis] = useState<"idle" | "running" | "done">("done");
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);
  const token = useRef(0);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const selectedRows = useMemo(() => (address ? forAddress(records, address) : []), [records, address]);
  const stats = address ? addressStats(records, address) : null;
  const windows = windowStats(selectedRows);
  const best = bestWindow(selectedRows);
  const neighbors = neighborStats(selectedRows);
  const prediction = analysis === "done" ? scoreAddress(selectedRows) : null;
  const kpis = records.length > 0 ? fleetKpis(records, meanPredictedScore(records)) : null;
  const directory = allAddressStats(records);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  function resetAnalysis() {
    token.current += 1;
    clearTimers();
    setAnalysis("idle");
    setStep(0);
  }

  function selectAddress(next: string) {
    if (next === address) return;
    resetAnalysis();
    setAddress(next);
  }

  function analyze() {
    if (!address || selectedRows.length === 0 || analysis === "running") return;
    const current = token.current + 1;
    token.current = current;
    clearTimers();
    setAnalysis("running");
    setStep(0);
    [350, 700, 1050, 1400].forEach((delay, index) => {
      const id = window.setTimeout(() => {
        if (token.current === current) setStep(index + 1);
      }, delay);
      timers.current.push(id);
    });
    const done = window.setTimeout(() => {
      if (token.current === current) setAnalysis("done");
    }, 1800);
    timers.current.push(done);
  }

  const cards = [
    {
      label: "Delivery success rate",
      value: kpis ? formatRate(kpis.successRate) : "—",
      detail: kpis ? `${formatCount(kpis.deliveries)} attempts in the sample` : "Waiting for data",
    },
    {
      label: "First attempt success",
      value: kpis?.firstAttemptRate === null || kpis?.firstAttemptRate === undefined ? "—" : formatRate(kpis.firstAttemptRate),
      detail: kpis ? "First stop, or the first stop after a success" : "Waiting for data",
    },
    {
      label: "Predicted success",
      value: kpis?.predictedSuccess === null || kpis?.predictedSuccess === undefined ? "—" : formatRate(kpis.predictedSuccess),
      detail: kpis ? "Mean local score across addresses" : "Waiting for data",
    },
    {
      label: "Known addresses",
      value: kpis ? formatCount(kpis.knownAddresses) : "—",
      detail: kpis ? "Distinct addresses in the sample" : "Waiting for data",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#0d1016]">
      <div className="grid lg:grid-cols-[13.5rem_minmax(0,1fr)]">
        <nav
          className="flex gap-1 overflow-x-auto border-b border-line p-2 lg:flex-col lg:border-r lg:border-b-0 lg:p-3"
          aria-label="Dashboard sections"
        >
          {views.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors duration-200 lg:w-full",
                  active ? "bg-white/[0.06] text-foreground" : "text-muted hover:bg-white/[0.03] hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 p-4 md:p-6">
          <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Prototype / Simulated Data</p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">Delivery Intelligence</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Predict the next delivery outcome using historical patterns.
              </p>
            </div>
          </header>

          <p className="mt-5 text-sm leading-relaxed text-muted">
            {`Sample dataset loaded. ${formatCount(records.length)} fictional attempts, read in this browser.`}
          </p>
          {records.length > 0 ? (
            <label className="mt-4 block max-w-sm text-xs text-muted">
              Selected address
              <select
                value={address ?? ""}
                onChange={(event) => selectAddress(event.target.value)}
                className="mt-2 h-11 w-full border border-line bg-[#0d1016] px-3 text-sm text-foreground"
              >
                {addressesIn(records).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="mt-6 space-y-6">
            {records.length === 0 ? null : view === "overview" || view === "predictions" ? (
              <PredictionCard
                status={analysis}
                step={step}
                disabled={!address}
                prediction={prediction}
                stats={stats}
                onAnalyze={analyze}
              />
            ) : null}

            {view === "addresses" ? (
              <AddressSelector
                addresses={addressesIn(records)}
                query={query}
                selected={address}
                stats={stats}
                onQuery={setQuery}
                onSelect={selectAddress}
              />
            ) : null}

            {view === "addresses" && directory.length > 0 ? (
              <div className="border border-line">
                <ul className="divide-y divide-line md:hidden">
                  {directory.map((row) => (
                    <li key={row.address}>
                      <button
                        type="button"
                        onClick={() => selectAddress(row.address)}
                        className={cn("w-full px-4 py-3 text-left", row.address === address && "bg-white/[0.04]")}
                      >
                        <span className="text-sm">{row.address}</span>
                        <span className="mt-1 block font-mono text-xs text-muted">
                          {row.successful} delivered · {row.failed} failed · {formatRate(row.successRate)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[36rem] text-left text-sm">
                    <thead className="text-xs text-muted">
                      <tr className="border-b border-line">
                        {["Address", "Attempts", "Delivered", "Failed", "Success"].map((column) => (
                          <th key={column} className="px-4 py-3 font-medium">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {directory.map((row) => (
                        <tr key={row.address} className={cn("border-b border-line last:border-b-0", row.address === address && "bg-white/[0.04]")}>
                          <td className="px-4 py-3">
                            <button type="button" onClick={() => selectAddress(row.address)} className="text-left hover:text-white">
                              {row.address}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-mono tabular-nums">{row.total}</td>
                          <td className="px-4 py-3 font-mono tabular-nums">{row.successful}</td>
                          <td className="px-4 py-3 font-mono tabular-nums">{row.failed}</td>
                          <td className="px-4 py-3 font-mono tabular-nums">{formatRate(row.successRate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {records.length > 0 && (view === "overview" || view === "predictions") ? (
              <DeliveryWindow windows={windows} bestLabel={best?.label ?? null} />
            ) : null}

            {records.length > 0 && (view === "overview" || view === "predictions" || view === "insights") ? (
              <PredictionFactors visible={analysis === "done"} factors={prediction?.factors ?? []} score={prediction?.score ?? 0} />
            ) : null}

            {view === "neighbors" ? (
              <NeighborInsights
                neighbors={neighbors}
                empty={
                  records.length === 0
                    ? "Load the sample to rank neighbor receivers."
                    : "This address has no successful neighbor receipts in the sample."
                }
              />
            ) : null}

            {records.length > 0 && (view === "overview" || view === "insights") ? (
              <DriverInsights visible={analysis === "done"} insights={prediction?.insights ?? []} />
            ) : null}

            {records.length > 0 && (view === "overview" || view === "history") ? <DeliveryHistory records={selectedRows} /> : null}

            {view === "history" ? (
              <DeliveryCharts
                byHour={successByHour(records)}
                byDay={successByDay(records)}
                attempts={records.length > 0 ? attemptBreakdown(records) : null}
                neighbors={neighborStats(records)}
              />
            ) : null}

            {view === "overview" && kpis ? (
              <section>
                <h3 className="text-base font-medium tracking-tight">Sample network</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  These figures describe the whole fictional dataset. The address score above is separate.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
                  {cards.map((card) => (
                    <div key={card.label} className="bg-[#0d1016] px-4 py-4">
                      <p className="text-xs text-muted">{card.label}</p>
                      <p className="mt-3 font-mono text-2xl tracking-tight tabular-nums">{card.value}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{card.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
