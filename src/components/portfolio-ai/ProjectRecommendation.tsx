import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ProjectCard } from "@/lib/portfolioAssistantTypes";
import { scrollToSection } from "@/lib/scroll";

export function ProjectRecommendation({
  card,
  onNavigate,
}: {
  card: ProjectCard;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  return (
    <article className="mt-3 rounded-xl border border-line bg-black/20 p-3">
      <p className="font-mono text-[13px] leading-5 tracking-[0.16em] text-muted uppercase">Prototype</p>
      <h3 className="mt-1 text-[15px] leading-6 font-medium tracking-[0.04em] uppercase">{card.name}</h3>
      <p className="mt-1.5 text-[15px] leading-6 text-muted">{card.summary}</p>
      <ul className="mt-2 space-y-1 text-[13px] leading-5 text-muted">
        {card.points.map((point) => (
          <li key={point} className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <Link
        href={card.href}
        className="mt-3 inline-flex min-h-11 items-center rounded-full border border-line px-3.5 text-[15px] leading-6 transition-colors duration-200 hover:bg-white/[0.04]"
        onClick={(event) => {
          onNavigate();
          if (pathname === "/") scrollToSection(event, card.href);
        }}
      >
        {card.actionLabel}
      </Link>
    </article>
  );
}
