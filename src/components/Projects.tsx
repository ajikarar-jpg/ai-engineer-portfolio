import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/lib/projects";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted">WORK</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">Selected projects</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Five working prototypes built around practical business problems.
            </p>
          </div>
        </Reveal>
        <div className="mt-6 border-b border-line">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
