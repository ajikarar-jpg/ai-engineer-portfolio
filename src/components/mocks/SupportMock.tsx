import { MockFrame } from "@/components/mocks/MockFrame";

const threads = [
  { name: "Nora Ellison", subject: "Order NL-1042", meta: "Order · Medium" },
  { name: "Jonah Peck", subject: "Refund", meta: "Refund · High" },
  { name: "Amina Darwish", subject: "Late parcel", meta: "Delivery · Medium" },
] as const;

export function SupportMock({ decorative = false }: { compact?: boolean; decorative?: boolean }) {
  return (
    <MockFrame label="INBOX" decorative={decorative}>
      <ul className="space-y-2">
        {threads.map((thread) => (
          <li key={thread.name} className="rounded-lg border border-line px-3 py-2">
            <p className="text-sm">{thread.name}</p>
            <p className="text-xs text-muted">
              {thread.subject} · {thread.meta}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Suggested reply from a local article match. Sample customers.</p>
    </MockFrame>
  );
}
