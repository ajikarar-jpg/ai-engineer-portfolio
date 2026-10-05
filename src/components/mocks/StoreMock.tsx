import { MockFrame } from "@/components/mocks/MockFrame";

const products = [
  ["Aura Headphones", "Electronics", "$189"],
  ["Meridian Coat", "Fashion", "$240"],
  ["Harbor Watch", "Accessories", "$210"],
] as const;

export function StoreMock({ compact = false, decorative = false }: { compact?: boolean; decorative?: boolean }) {
  return (
    <MockFrame label="STORE" decorative={decorative}>
      <div className="flex flex-wrap gap-2">
        {["All", "Electronics", "Fashion"].map((item, index) => (
          <span key={item} className={`rounded-full border px-2.5 py-1 text-[13px] leading-5 ${index === 0 ? "border-accent" : "border-line text-muted"}`}>
            {item}
          </span>
        ))}
      </div>
      <ul className={`mt-3 grid gap-2 ${compact ? "" : "sm:grid-cols-3"}`}>
        {products.slice(0, compact ? 2 : 3).map(([name, category, price]) => (
          <li key={name} className="rounded-lg border border-line px-3 py-3">
            <p className="text-[13px] leading-5 text-muted">{category}</p>
            <p className="mt-1 text-sm">{name}</p>
            <p className="mt-2 font-mono text-sm">{price}</p>
          </li>
        ))}
      </ul>
    </MockFrame>
  );
}
