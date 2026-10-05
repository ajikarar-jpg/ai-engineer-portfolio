import { formatRate, type AddressStats } from "@/lib/deliveryAnalytics";
import type { AddressPrediction } from "@/lib/deliveryScoring";

const steps = [
  "Analyzing delivery history...",
  "Checking time patterns...",
  "Evaluating recipient availability...",
  "Analyzing neighbor patterns...",
  "Calculating prediction...",
] as const;

type PredictionCardProps = {
  status: "idle" | "running" | "done";
  step: number;
  disabled: boolean;
  prediction: AddressPrediction | null;
  stats: AddressStats | null;
  onAnalyze: () => void;
};

export function PredictionCard({ status, step, disabled, prediction, stats, onAnalyze }: PredictionCardProps) {
  const running = status === "running";
  const score = prediction?.score ?? 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="border border-line p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Address analysis</p>
          <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">
            {stats?.address ?? "Select an address"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {stats
              ? `${stats.customer}. The score below uses only this address history.`
              : "Load the sample, choose an address, then analyze its history."}
          </p>
        </div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={disabled || running}
          className="cta-primary inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg px-5 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {running ? "Analyzing..." : "Analyze Address"}
        </button>
      </div>

      {stats ? (
        <div className="mt-6">
          <h4 className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Historical delivery attempts</h4>
          <dl className="mt-3 grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
            {[
              ["Attempts", String(stats.total)],
              ["Delivered", String(stats.successful)],
              ["Failed", String(stats.failed)],
              ["Success rate", formatRate(stats.successRate)],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#0d1016] px-3 py-4">
                <dt className="text-[11px] text-muted">{label}</dt>
                <dd className="mt-2 font-mono text-xl tabular-nums md:text-2xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {running ? (
        <ol className="mt-6 space-y-2" aria-live="polite">
          {steps.slice(0, step + 1).map((label, index) => (
            <li key={label} className="flex items-center gap-2 text-sm text-muted">
              <span
                className={`h-1.5 w-1.5 rounded-full bg-foreground/70 ${index === step ? "animate-pulse" : ""}`}
                aria-hidden
              />
              {label}
            </li>
          ))}
        </ol>
      ) : null}

      {status === "idle" && stats ? (
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Analyze this address to turn the attempts above into a delivery probability, a time window, and a recommended
          day.
        </p>
      ) : null}

      {status === "done" && prediction ? (
        <div className="mt-8 border-t border-line pt-8">
          <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-center font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                Delivery success probability
              </p>
              <div className="relative mx-auto mt-3 h-40 w-40">
                <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden>
                  <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(244,241,234,0.1)" strokeWidth="8" />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="#35D07F"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - score / 100)}
                    transform="rotate(-90 70 70)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-mono text-4xl tabular-nums">{score}%</p>
                </div>
              </div>
              <p className="mt-3 text-center font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                {prediction.confidence} confidence
              </p>
            </div>
            <dl className="grid gap-px bg-line sm:grid-cols-3">
              {[
                ["Recipient home probability", formatRate(prediction.homeProbability), "Share of attempts with the recipient home"],
                ["Best delivery window", prediction.bestWindowLabel ?? "—", "Highest success rate with at least two attempts"],
                ["Recommended attempt", prediction.recommendedDay ?? "—", "Weekday with the highest success rate"],
              ].map(([label, value, detail]) => (
                <div key={label} className="bg-[#0d1016] px-4 py-4">
                  <dt className="text-[11px] leading-relaxed text-muted">{label}</dt>
                  <dd className="mt-3 font-mono text-xl tabular-nums tracking-tight whitespace-nowrap">{value}</dd>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">{detail}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ) : null}
    </section>
  );
}
