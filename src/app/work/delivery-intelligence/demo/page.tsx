import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { DeliveryDashboard } from "@/components/delivery-intelligence/DeliveryDashboard";

export const metadata: Metadata = {
  title: "Delivery Intelligence Demo",
  description:
    "An interactive portfolio demo that estimates delivery outcomes from fictional historical attempts. No live carrier data is used.",
};

const productionStack = ["Python", "FastAPI", "PostgreSQL", "React", "Machine Learning", "Feature Engineering"] as const;

export default function DeliveryIntelligenceDemoPage() {
  return (
    <article className="pb-24 pt-28 md:pb-32 md:pt-36">
      <Container>
        <Link
          href="/work/delivery-intelligence"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Delivery Intelligence
        </Link>

        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <p className="inline-flex max-w-full rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-muted sm:text-[11px]">
              LIVE DEMO • SIMULATED ML
            </p>
            <p className="inline-flex max-w-full rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-muted sm:text-[11px]">
              Prototype / Simulated Data
            </p>
          </div>
          <h1 className="mt-5 text-4xl font-medium tracking-tight text-balance md:text-6xl">Delivery Intelligence</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Predict delivery success, understand address patterns, and help drivers make better delivery decisions.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            This portfolio demonstration uses fictional historical delivery data and local prediction logic.
          </p>
        </header>

        <div className="mt-10">
          <DeliveryDashboard />
        </div>

        <section className="mt-20 max-w-3xl">
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Production architecture</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            This demo runs in the browser. Scores, windows, and neighbor rankings are calculated from the loaded sample.
            A production version could keep this React interface, store attempt history in PostgreSQL, and use Python and
            FastAPI for feature engineering and a trained model. That model is not running on this page.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {productionStack.map((item) => (
              <li key={item} className="border border-line px-3 py-2 font-mono text-xs tracking-wide text-muted">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          <section>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">The problem</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Delivery companies lose time and money when packages require repeated delivery attempts.
            </p>
          </section>
          <section>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">The solution</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Delivery Intelligence analyzes historical outcomes to estimate successful delivery windows and identify
              reliable neighbor receivers.
            </p>
          </section>
          <section>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">The approach</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Historical delivery data is converted into address-level signals that help drivers make better delivery
              decisions.
            </p>
          </section>
        </div>
      </Container>
    </article>
  );
}
