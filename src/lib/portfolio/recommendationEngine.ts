import { portfolioKnowledge, type KnowledgeProject } from "@/data/portfolioKnowledge";
import type { AssistantLanguage, ProjectCard } from "@/lib/portfolioAssistantTypes";
import { correctTypos } from "@/lib/portfolio/fuzzyMatch";
import { normalizeQuestion, tokenize } from "@/lib/portfolio/languageDetector";

export type ProjectMatch = {
  project: KnowledgeProject;
  score: number;
};

const serviceForProject: Record<string, string> = {
  "ai-agent-platform": "ai-agents",
  "ai-customer-support": "customer-support",
  "delivery-intelligence": "ai-applications",
  "ecommerce-platform": "ecommerce",
  "appointment-booking": "appointment-booking",
};

export function serviceIdForProject(slug: string) {
  return serviceForProject[slug] ?? null;
}

export function rankProjects(question: string): ProjectMatch[] {
  const text = correctTypos(normalizeQuestion(question));
  const tokens = tokenize(text);
  return portfolioKnowledge.projects
    .map((project) => {
      let score = 0;
      for (const term of project.matchTerms) {
        const normalized = normalizeQuestion(term);
        if (!normalized) continue;
        if (normalized.includes(" ")) {
          if (text.includes(normalized)) score += 0.56;
        } else if (tokens.has(normalized)) {
          score += 0.48;
        }
      }
      for (const alias of project.aliases) {
        const normalized = normalizeQuestion(alias);
        if (normalized && text.includes(normalized)) score += 0.4;
      }
      return { project, score: Math.min(1, score) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function topProject(question: string) {
  return rankProjects(question)[0] ?? null;
}

export function projectBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return portfolioKnowledge.projects.find((project) => project.slug === slug) ?? null;
}

export function recommendationWhy(project: KnowledgeProject, language: AssistantLanguage) {
  return project.why[language];
}

export function cardFor(project: KnowledgeProject, language: AssistantLanguage): ProjectCard {
  return {
    slug: project.slug,
    name: project.name,
    summary: project.cardSummary[language],
    points: project.features.slice(0, 4),
    href: project.href,
    actionLabel: language === "de" ? "Projekt ansehen" : language === "ar" ? "عرض المشروع" : "View project",
  };
}
