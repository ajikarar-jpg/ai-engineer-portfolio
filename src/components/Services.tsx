import Link from "next/link";
import { AppWindow, Bot, Boxes, CalendarDays, Cpu, Headset, ShoppingBag, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { services, type ServiceIcon } from "@/lib/content";

const icons: Record<ServiceIcon, LucideIcon> = {
  cpu: Cpu,
  bot: Bot,
  workflow: Workflow,
  support: Headset,
  software: AppWindow,
  saas: Boxes,
  store: ShoppingBag,
  calendar: CalendarDays,
};

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 border-t border-line py-16 md:py-24">
      <Container>
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">What I Build</h2>
        </Reveal>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = icons[service.icon];
            return (
              <li key={service.title}>
                <Reveal delay={index * 0.04}>
                  <Link
                    href={service.href}
                    className="flex h-full flex-col rounded-2xl border border-line bg-surface/80 p-4 transition duration-200 hover:border-accent/35 hover:bg-surface-2"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line">
                        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="font-mono text-[13px] leading-5 tracking-[0.16em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-medium tracking-tight">{service.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.description}</p>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
