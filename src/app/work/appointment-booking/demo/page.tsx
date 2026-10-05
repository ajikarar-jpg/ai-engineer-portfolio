import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingDemo } from "@/components/booking/BookingDemo";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Appointment Booking Platform Demo",
  description:
    "An interactive portfolio demo of scheduling, availability, customer records, and admin analytics. Bookings are simulated.",
};

const productionStack = ["TypeScript", "React", "Next.js", "Availability", "Customer records", "Admin analytics"] as const;

export default function BookingDemoPage() {
  return (
    <article className="pb-24 pt-28 md:pb-32 md:pt-36">
      <Container>
        <Link
          href="/work/appointment-booking"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Appointment Booking Platform
        </Link>
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">LIVE DEMO</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">LOCAL DEMO</p>
            <p className="inline-flex rounded-full border border-line px-3 py-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">SIMULATED BOOKING</p>
          </div>
          <h1 className="mt-5 text-4xl font-medium tracking-tight text-balance md:text-6xl">Appointment Booking Platform</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Modern appointment scheduling platform with online booking, availability management, customer records and
            business analytics.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Confirmation is a simulated booking. The customers are fictional, and no payment is taken.
          </p>
        </header>
        <div className="mt-10">
          <BookingDemo />
        </div>
        <section className="mt-20 max-w-3xl">
          <h2 className="font-mono text-[13px] leading-5 tracking-[0.18em] text-muted uppercase">Production architecture</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            This demo keeps services, staff, and appointments in the browser. A production scheduler could keep this
            interface and move availability, customers, and reminders into a database.
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
