import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { LinkButton } from "@/components/LinkButton";
import { SystemVisual } from "@/components/SystemVisual";

export function Hero() {
  return (
    <section id="home" className="relative scroll-mt-24 overflow-hidden pt-20 pb-12 md:pt-32 md:pb-20">
      <HeroBackdrop />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-xl">
            <p className="rise flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.16em] text-muted">
              <span>AI ENGINEER · SOFTWARE · AUTOMATION</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em]">
                <span className="status-pulse inline-block h-1.5 w-1.5 rounded-full bg-success" />
                SYSTEM ONLINE
              </span>
            </p>
            <h1 className="rise rise-1 mt-4 text-[2.75rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[3.05rem] md:mt-5 md:text-[clamp(3rem,6vw,5.5rem)] md:leading-[0.98]">
              <span className="block">Building AI systems</span>
              <span className="block">that solve real</span>
              <span className="block">business problems.</span>
            </h1>
            <p className="rise rise-2 mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg md:mt-5">
              I build AI applications, automation systems, dashboards, and custom software for modern businesses.
            </p>
            <div className="rise rise-3 mt-6 flex flex-col gap-3 sm:flex-row md:mt-7">
              <LinkButton href="/#projects" className="w-full tracking-[0.08em] uppercase sm:w-auto">
                <ArrowUpRight className="h-4 w-4" aria-hidden />
                View Work
              </LinkButton>
              <LinkButton href="/#contact" variant="secondary" className="w-full tracking-[0.08em] uppercase sm:w-auto">
                Let&apos;s Talk
              </LinkButton>
            </div>
            <p className="rise rise-4 mt-4 font-mono text-[10px] tracking-[0.12em] text-muted">
              SYSTEM_STATUS: ONLINE · AI_ENGINE: READY · MODELS: LOCAL
            </p>
          </div>
          <SystemVisual />
        </div>
      </Container>
    </section>
  );
}
