type DriverInsightsProps = {
  visible: boolean;
  insights: readonly string[];
};

export function DriverInsights({ visible, insights }: DriverInsightsProps) {
  return (
    <section className="border border-line p-4 md:p-6">
      <h3 className="text-base font-medium tracking-tight">Driver insights</h3>
      {!visible ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">Analyze the selected address to read the patterns in its history.</p>
      ) : insights.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">This history does not support a specific driver note.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {insights.map((insight) => (
            <li key={insight} className="border border-line px-4 py-3 text-sm leading-relaxed">
              {insight}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
