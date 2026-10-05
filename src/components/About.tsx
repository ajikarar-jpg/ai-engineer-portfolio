import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { about, skills } from "@/lib/content";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">About</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted md:text-lg">
              {about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="font-mono text-[11px] tracking-[0.18em] text-muted">SKILLS</h3>
            <ul className="mt-4 grid grid-cols-2 gap-px bg-line">
              {skills.map((skill) => (
                <li key={skill} className="bg-background px-4 py-3.5 text-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
