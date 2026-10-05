import { formatRate } from "@/lib/deliveryAnalytics";
import type { NeighborStat } from "@/lib/neighborAnalysis";

type NeighborInsightsProps = {
  neighbors: NeighborStat[];
  empty?: string;
};

export function NeighborInsights({
  neighbors,
  empty = "This address has no successful neighbor receipts in the sample.",
}: NeighborInsightsProps) {
  return (
    <section className="border border-line">
      <div className="border-b border-line px-4 py-4 md:px-5">
        <h3 className="text-sm font-medium">Likely neighbor receivers</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Successful handoffs for the selected address, where the recipient was not the person who received the parcel.
        </p>
      </div>
      {neighbors.length === 0 ? (
        <p className="px-4 py-8 text-sm text-muted md:px-5">{empty}</p>
      ) : (
        <>
          <ul className="divide-y divide-line md:hidden">
            {neighbors.map((neighbor, index) => (
              <li key={neighbor.address} className="px-4 py-3">
                <p className="text-sm">
                  {index + 1}. {neighbor.address}
                </p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {formatRate(neighbor.share)} · {neighbor.receipts} {neighbor.receipts === 1 ? "delivery" : "deliveries"}
                </p>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr className="border-b border-line">
                  <th className="px-5 py-3 font-medium">Likely receiver</th>
                  <th className="px-5 py-3 font-medium">Confidence</th>
                  <th className="px-5 py-3 font-medium">Successful receipts</th>
                </tr>
              </thead>
              <tbody>
                {neighbors.map((neighbor) => (
                  <tr key={neighbor.address} className="border-b border-line last:border-b-0">
                    <td className="px-5 py-3">{neighbor.address}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">{formatRate(neighbor.share)}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">{neighbor.receipts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
