import { formatRate, type AddressStats } from "@/lib/deliveryAnalytics";

type AddressSelectorProps = {
  addresses: readonly string[];
  query: string;
  selected: string | null;
  stats: AddressStats | null;
  onQuery: (value: string) => void;
  onSelect: (address: string) => void;
};

export function AddressSelector({ addresses, query, selected, stats, onQuery, onSelect }: AddressSelectorProps) {
  const filtered = addresses.filter((address) => address.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <section className="border border-line p-4 md:p-6">
      <h3 className="text-base font-medium tracking-tight">Address intelligence</h3>
      <label className="mt-4 block text-xs text-muted" htmlFor="address-search">
        Search or select an address
      </label>
      <input
        id="address-search"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="22 Main Road"
        className="mt-2 h-10 w-full border border-line bg-transparent px-3 text-sm outline-none placeholder:text-muted/70"
      />
      <ul className="mt-3 max-h-40 space-y-1 overflow-auto">
        {filtered.length === 0 ? (
          <li className="px-1 py-2 text-sm text-muted">No address matches that search.</li>
        ) : (
          filtered.map((address) => (
            <li key={address}>
              <button
                type="button"
                onClick={() => onSelect(address)}
                aria-pressed={address === selected}
                className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-200 ${
                  address === selected ? "bg-white/[0.06] text-foreground" : "text-muted hover:bg-white/[0.03] hover:text-foreground"
                }`}
              >
                {address}
              </button>
            </li>
          ))
        )}
      </ul>
      {stats ? (
        <dl className="mt-4 grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
          {[
            ["Address", stats.address],
            ["Customer", stats.customer],
            ["Historical deliveries", String(stats.total)],
            ["Successful deliveries", String(stats.successful)],
            ["Failed attempts", String(stats.failed)],
            ["Success rate", formatRate(stats.successRate)],
          ].map(([label, value]) => (
            <div key={label} className="bg-[#0d1016] px-3 py-3">
              <dt className="text-[11px] text-muted">{label}</dt>
              <dd className="mt-1 text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 text-sm text-muted">Load the sample, then choose an address.</p>
      )}
    </section>
  );
}
