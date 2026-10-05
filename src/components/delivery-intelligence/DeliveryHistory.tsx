import type { DeliveryRecord } from "@/lib/deliveryAnalytics";

type DeliveryHistoryProps = {
  records: DeliveryRecord[];
};

export function DeliveryHistory({ records }: DeliveryHistoryProps) {
  const rows = [...records].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  return (
    <section className="border border-line">
      <div className="border-b border-line px-4 py-4 md:px-6 md:py-5">
        <h3 className="text-base font-medium tracking-tight">Attempt record</h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {rows.length === 0
            ? "Attempts appear after the sample is loaded."
            : "Fictional attempts for the selected address, newest first. The prediction is calculated from these rows."}
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-8 text-sm text-muted md:px-5">No attempts yet.</p>
      ) : (
        <>
          <ul className="divide-y divide-line md:hidden">
            {rows.map((row) => (
              <li key={row.id} className="px-4 py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p>{row.address}</p>
                  <p className="text-muted">{row.outcome}</p>
                </div>
                <p className="mt-1 text-muted">{row.date} · {row.time}</p>
                <p className="mt-1 text-xs text-muted">
                  Home {row.recipientHome ? "Yes" : "No"} · Neighbor {row.neighborReceiver ?? "—"} · {row.driver}
                </p>
              </li>
            ))}
          </ul>
          <div className="hidden max-h-[28rem] overflow-auto md:block">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="sticky top-0 bg-[#0d1016] text-xs text-muted">
                <tr className="border-b border-line">
                  {["Date", "Time", "Address", "Outcome", "Recipient home", "Neighbor", "Driver"].map((column) => (
                    <th key={column} className="px-4 py-3 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3 font-mono text-xs text-muted">{row.date}</td>
                    <td className="px-4 py-3 font-mono text-xs">{row.time}</td>
                    <td className="px-4 py-3">{row.address}</td>
                    <td className="px-4 py-3 text-muted">{row.outcome}</td>
                    <td className="px-4 py-3 text-muted">{row.recipientHome ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-muted">{row.neighborReceiver ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{row.driver}</td>
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
