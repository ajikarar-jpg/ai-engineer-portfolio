import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { FlowDiagram } from "@/components/FlowDiagram";
import { LinkButton } from "@/components/LinkButton";
import { ProjectMock } from "@/components/ProjectMock";
import { Reveal } from "@/components/Reveal";
import { demoHref, type Project } from "@/lib/projects";
import { emailHref } from "@/lib/site";

type CaseStudyProps = {
  project: Project;
};

export function CaseStudy({ project }: CaseStudyProps) {
  return (
    <article className="pb-24 pt-28 md:pb-32 md:pt-36">
      <Container>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Work
        </Link>
        <Reveal className="mt-8 max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted">
            {project.index} · ENGINEERING CASE STUDY · PROTOTYPE
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight text-balance md:text-6xl">{project.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{project.description}</p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            This is an engineering prototype and case study. It is not a deployed commercial product, and it does not
            report results from a live customer.
          </p>
          {demoHref(project.slug) ? (
            <div className="mt-6">
              <LinkButton href={demoHref(project.slug) ?? `/work/${project.slug}`}>Open live demo</LinkButton>
            </div>
          ) : null}
        </Reveal>

        <div className="mt-14 space-y-12 md:mt-16 md:space-y-14">
          <Reveal>
            <section>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">The problem</h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed md:text-xl">{project.problem}</p>
            </section>
          </Reveal>
          {project.solution ? (
            <Reveal>
              <section>
                <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">The solution</h2>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">{project.solution}</p>
              </section>
            </Reveal>
          ) : null}
          <Reveal>
            <section>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">The approach</h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">{project.approach}</p>
            </section>
          </Reveal>
          <Reveal>
            <section>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">How it works</h2>
              <FlowDiagram steps={project.flow} />
            </section>
          </Reveal>
          <Reveal>
            <section>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Technology</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <li key={item} className="border border-line px-3 py-2 font-mono text-xs tracking-wide text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
          <Reveal>
            <section>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Key features</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {project.features.map((feature) => (
                  <li key={feature} className="border border-line px-5 py-6 text-sm font-medium">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
          <Reveal>
            <section>
              <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Interface</h2>
              <div className="mt-6">
                <ProjectMock slug={project.slug} />
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                Illustrative interface built for this case study. Names, scores, and figures are sample content, not
                measured business results.
              </p>
            </section>
          </Reveal>
        </div>

        <div className="mt-20 border-t border-line pt-12">
          <p className="max-w-xl text-lg leading-relaxed">
            If this kind of system is close to a process you want to change, I can design one around the way the work
            actually happens.
          </p>
          <div className="mt-6">
            <LinkButton href={emailHref}>Start a Conversation</LinkButton>
          </div>
        </div>
      </Container>
    </article>
  );
}
