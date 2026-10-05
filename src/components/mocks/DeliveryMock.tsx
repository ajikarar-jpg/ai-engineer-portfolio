import { MockFrame } from "@/components/mocks/MockFrame";
import { cn } from "@/lib/cn";

const stops = [
  {
    address: "14 King Street",
    window: "09:00–11:00",
    level: "High",
    reason: "Repeated successful attempts in the sample.",
  },
  {
    address: "8B Quay Apartments",
    window: "13:00–15:00",
    level: "Low",
    reason: "Past failures have no entry code.",
  },
  {
    address: "22 Mill Road",
    window: "11:00–13:00",
    level: "Medium",
    reason: "A neighbor signed twice in the sample.",
  },
] as const;

type DeliveryMockProps = {
  compact?: boolean;
  decorative?: boolean;
};

export function DeliveryMock({ compact = false, decorative = false }: DeliveryMockProps) {
  return (
    <MockFrame label="ROUTE DESK" decorative={decorative}>
      <ul className="divide-y divide-line border border-line md:hidden">
        {stops.map((stop) => (
          <li key={stop.address} className="px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{stop.address}</p>
              <p className="font-mono text-[10px] tracking-[0.12em] text-muted">{stop.level.toUpperCase()}</p>
            </div>
            <p className="mt-1 text-xs text-muted">{stop.window}</p>
            {compact ? null : <p className="mt-2 text-sm leading-relaxed text-muted">{stop.reason}</p>}
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Sample delivery stops and probabilities from the case study history</caption>
          <thead className="font-mono text-[10px] tracking-[0.14em] text-muted">
            <tr className="border-b border-line">
              <th scope="col" className="px-3 py-2 font-normal">
                Stop
              </th>
              <th scope="col" className="px-3 py-2 font-normal">
                Window
              </th>
              <th scope="col" className="px-3 py-2 font-normal">
                Probability
              </th>
              {compact ? null : (
                <th scope="col" className="px-3 py-2 font-normal">
                  From sample history
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {stops.map((stop) => (
              <tr key={stop.address} className="border-b border-line last:border-0">
                <td className="px-3 py-3 font-medium">{stop.address}</td>
                <td className="px-3 py-3 text-muted">{stop.window}</td>
                <td className="px-3 py-3">
                  <span className={cn("font-mono text-[11px] tracking-[0.12em]", stop.level === "Low" ? "text-muted" : "text-foreground")}>
                    {stop.level.toUpperCase()}
                  </span>
                </td>
                {compact ? null : <td className="px-3 py-3 text-muted">{stop.reason}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {compact ? null : (
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Probabilities describe this sample history. They are not a measured result from a live delivery network.
        </p>
      )}
    </MockFrame>
  );
}
