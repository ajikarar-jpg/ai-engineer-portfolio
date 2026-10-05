import { formatRate } from "@/lib/deliveryAnalytics";
import type { TimeWindow } from "@/lib/timeWindowAnalysis";

type DeliveryWindowProps = {
  windows: TimeWindow[];
  bestLabel: string | null;
};

export function DeliveryWindow({ windows, bestLabel }: DeliveryWindowProps) {
  const visible = windows.filter((window) => window.attempts > 0);

  return (
    <section className="border border-line p-4 md:p-6">
      <h3 className="text-base font-medium tracking-tight">Window comparison</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Success rate by time of day for this address. The highlighted window is the one used in the prediction.
      </p>
      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Load a dataset and choose an address.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((window) => {
            const best = window.label === bestLabel;
            return (
              <li key={window.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <p>
                    {window.label}
                    {best ? <span className="ml-2 font-mono text-[10px] tracking-[0.14em] text-muted">BEST WINDOW</span> : null}
                  </p>
                  <p className="font-mono tabular-nums">{formatRate(window.rate)}</p>
                </div>
                <div className="mt-2 h-1.5 bg-white/[0.06]">
                  <div className="h-full bg-success" style={{ width: `${Math.max(0, Math.min(100, window.rate))}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  {window.successes} delivered · {window.attempts} {window.attempts === 1 ? "attempt" : "attempts"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
