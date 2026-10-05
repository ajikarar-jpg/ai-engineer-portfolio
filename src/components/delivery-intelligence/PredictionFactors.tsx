import type { ScoreFactor } from "@/lib/deliveryScoring";

type PredictionFactorsProps = {
  visible: boolean;
  factors: readonly ScoreFactor[];
  score: number;
};

function formatPoints(points: number) {
  if (points > 0) return `+${points}`;
  if (points === 0) return "0";
  return String(points);
}

export function PredictionFactors({ visible, factors, score }: PredictionFactorsProps) {
  const total = factors.reduce((sum, factor) => sum + factor.points, 0);

  return (
    <section className="border border-line p-4 md:p-6">
      <h3 className="text-base font-medium tracking-tight">Why this prediction?</h3>
      {!visible ? (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          The contribution of each historical signal appears after the address is analyzed.
        </p>
      ) : (
        <>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Each line is drawn from the attempts for this address. Added together, they are the delivery success
            probability.
          </p>
          <ul className="mt-5 divide-y divide-line border border-line">
            {factors.map((factor) => (
              <li key={factor.id} className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm">
                <span>{factor.label}</span>
                <span className="font-mono text-base tabular-nums">{formatPoints(factor.points)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 bg-white/[0.03] px-4 py-3.5 text-sm">
              <span className="font-medium">Final score</span>
              <span className="font-mono text-base tabular-nums">{total === score ? score : total} / 100</span>
            </li>
          </ul>
        </>
      )}
    </section>
  );
}
