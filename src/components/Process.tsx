import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { processSteps } from "@/lib/content";

export function Process() {
  return (
    <section className="border-y border-line py-16 md:py-24" aria-labelledby="process-title">
      <Container>
        <Reveal>
          <h2 id="process-title" className="text-3xl font-medium tracking-tight md:text-4xl">
            From Problem to Production
          </h2>
        </Reveal>
        <ol className="mt-8 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <li key={step.index}>
              <Reveal className="flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-5 transition duration-200 hover:border-accent/30 md:p-6" delay={index * 0.06}>
                <p className="font-mono text-[11px] tracking-[0.16em] text-muted">{step.index}</p>
                <h3 className="mt-4 text-lg font-medium tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
