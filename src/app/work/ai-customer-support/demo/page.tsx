import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { SupportDemo } from "@/components/support/SupportDemo";

export const metadata: Metadata = {
  title: "AI Customer Support Platform Demo",
  description:
    "An interactive portfolio demo of a support inbox, knowledge base, tickets, and local reply suggestions. Sample data only. No external AI API is called.",
};

const productionStack = ["TypeScript", "React", "Next.js", "Knowledge base", "Ticket workflow", "Local reply rules"] as const;

export default function CustomerSupportDemoPage() {
  return (
    <article className="pb-24 pt-28 md:pb-32 md:pt-36">
      <Container>
        <Link
          href="/work/ai-customer-support"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          AI Customer Support Platform
        </Link>
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">LIVE DEMO</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">LOCAL DEMO</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">SIMULATED AI</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">SIMULATED DATA</p>
          </div>
          <h1 className="mt-5 text-4xl font-medium tracking-tight text-balance md:text-6xl">AI Customer Support Platform</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            AI-powered customer support platform for handling conversations, knowledge, tickets, and support operations.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            The people, orders, and tickets are fictional. Suggested replies come from local rules in the browser. This demo does not call an external AI API.
          </p>
        </header>
        <div className="mt-10">
          <SupportDemo />
        </div>
        <section className="mt-20 max-w-3xl">
          <h2 className="font-mono text-[13px] leading-5 tracking-[0.18em] text-muted uppercase">Production architecture</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            This demo keeps conversations, articles, and tickets in the browser. A production inbox could keep the same screens and store customers, articles, and tickets in a database. A reviewed model could draft the reply, with a person still approving the send and any handoff to an agent on shift.
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
