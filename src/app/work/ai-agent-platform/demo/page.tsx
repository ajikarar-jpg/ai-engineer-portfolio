import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AgentDemo } from "@/components/ai-agent/AgentDemo";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "AI Agent Platform Demo",
  description:
    "A local portfolio demo of a conversational agent with history, context, and structured replies. No external model is called.",
};

const productionStack = ["TypeScript", "React", "Next.js", "Conversation state", "Intent scoring", "Local AI simulation"] as const;

export default function AgentDemoPage() {
  return (
    <article className="pb-24 pt-28 md:pb-32 md:pt-36">
      <Container>
        <Link
          href="/work/ai-agent-platform"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          AI Agent Platform
        </Link>
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">LIVE DEMO</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">LOCAL DEMO</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">SIMULATED AI</p>
          </div>
          <h1 className="mt-5 text-4xl font-medium tracking-tight text-balance md:text-6xl">AI Agent Platform</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            AI-powered conversational agent platform designed to understand requests, maintain context and assist users
            through intelligent workflows.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Portfolio Demo · Simulated AI. Replies are local rules. This page does not call an external model.
          </p>
        </header>
        <div className="mt-10">
          <AgentDemo />
        </div>
        <section className="mt-20 max-w-3xl">
          <h2 className="font-mono text-[13px] leading-5 tracking-[0.18em] text-muted uppercase">Production architecture</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            This demo keeps conversations in the browser and answers with deterministic rules. A production agent could
            keep the same interface and replace the local reply step with a model, while a person still reviews actions
            that leave the product.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {productionStack.map((item) => (
              <li key={item} className="border border-line px-3 py-2 font-mono text-[13px] leading-5 tracking-wide text-muted">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </article>
  );
}
