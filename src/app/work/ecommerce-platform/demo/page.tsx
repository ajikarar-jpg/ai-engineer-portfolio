import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { StoreDemo } from "@/components/ecommerce/StoreDemo";

export const metadata: Metadata = {
  title: "E-commerce Platform Demo",
  description:
    "An interactive portfolio demo of a storefront, cart, demo checkout, customer account, and admin. No payment is processed.",
};

const productionStack = ["TypeScript", "React", "Next.js", "Product catalog", "Cart state", "Admin UI"] as const;

export default function EcommerceDemoPage() {
  return (
    <article className="pb-24 pt-28 md:pb-32 md:pt-36">
      <Container>
        <Link
          href="/work/ecommerce-platform"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          E-commerce Platform
        </Link>
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">LIVE DEMO</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">LOCAL DEMO</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">SIMULATED DATA</p>
          </div>
          <h1 className="mt-5 text-4xl font-medium tracking-tight text-balance md:text-6xl">E-commerce Platform</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Modern e-commerce platform with product management, shopping cart, checkout flows, customer accounts, order
            management and business analytics.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Checkout is a demo. It does not collect payment details and it does not place a real order.
          </p>
        </header>
        <div className="mt-10">
          <StoreDemo />
        </div>
        <section className="mt-20 max-w-3xl">
          <h2 className="font-mono text-[13px] leading-5 tracking-[0.18em] text-muted uppercase">Production architecture</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            This demo keeps the catalog, cart, and orders in the browser. A production store could keep this interface
            and move products, customers, and orders into a database, with a real payment provider added only when the
            business is ready.
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
