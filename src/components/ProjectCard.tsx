import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectMock } from "@/components/ProjectMock";
import { demoHref, type Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
};

const projectAccents: Record<string, string> = {
  "ai-agent-platform": "#7C5CFF",
  "ai-customer-support": "#7C8CFF",
  "delivery-intelligence": "#35D07F",
  "ecommerce-platform": "#FFB84D",
  "appointment-booking": "#E08CFF",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const href = `/work/${project.slug}`;
  const accent = projectAccents[project.slug] ?? "#7C5CFF";

  return (
    <article className="grid gap-8 border-t border-line py-10 md:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
      <div className="flex flex-col">
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted">
          <span style={{ color: accent }}>{project.index}</span>
          {` / ${project.category.toUpperCase()} · PROTOTYPE`}
        </p>
        <h3 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
          <Link href={href} className="transition-colors duration-200 hover:text-white">
            {project.name}
          </Link>
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.features.map((feature) => (
            <li key={feature} className="rounded-md border border-line bg-surface/70 px-2.5 py-1 text-xs text-muted">
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-[11px] tracking-wide text-muted">{project.tech.join("  ·  ")}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {demoHref(project.slug) ? (
            <Link
              href={demoHref(project.slug) ?? href}
              className="cta-primary inline-flex h-10 items-center gap-2 rounded-lg px-4 text-[13px] font-medium tracking-[0.08em] uppercase transition duration-200"
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden />
              Live Demo
            </Link>
          ) : null}
          <Link
            href={href}
            className="cta-secondary inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition duration-200"
          >
            View Case Study
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <ProjectMock slug={project.slug} compact decorative />
    </article>
  );
}
