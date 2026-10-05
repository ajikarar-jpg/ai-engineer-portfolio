import { Container } from "@/components/Container";
import { LinkButton } from "@/components/LinkButton";
import { Reveal } from "@/components/Reveal";
import { emailHref, site } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 pb-16 md:pb-24">
      <Container>
        <Reveal>
          <div className="rounded-3xl border border-line bg-surface px-6 py-12 sm:px-10 md:px-12 md:py-14">
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted">CONTACT</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-medium tracking-tight text-balance md:text-4xl">
              Have a process that could be automated?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Tell me what you&apos;re trying to improve. I&apos;ll help turn the idea into a working system.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={emailHref} className="w-full sm:w-auto">
                Start a Conversation
              </LinkButton>
              <LinkButton href={site.github} variant="secondary" className="w-full sm:w-auto">
                View GitHub
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
