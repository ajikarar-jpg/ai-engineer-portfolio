import { MockFrame } from "@/components/mocks/MockFrame";

export function AgentMock({ decorative = false }: { compact?: boolean; decorative?: boolean }) {
  return (
    <MockFrame label="AI AGENT" decorative={decorative}>
      <div className="grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-lg border border-line p-3">
          <p className="text-sm">New chat</p>
          <p className="mt-3 text-xs text-muted">Store concept</p>
          <p className="mt-2 text-xs text-muted">Dashboard plan</p>
        </div>
        <div className="rounded-lg border border-line p-3">
          <p className="text-xs text-muted">Portfolio Demo · Simulated AI</p>
          <p className="mt-3 text-sm">What type of products will you sell?</p>
          <p className="mt-3 rounded-lg bg-white/[0.04] px-3 py-2 text-sm">Clothing.</p>
        </div>
      </div>
    </MockFrame>
  );
}
