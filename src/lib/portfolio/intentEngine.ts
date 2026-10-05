import { portfolioKnowledge } from "@/data/portfolioKnowledge";
import type { AssistantLanguage, PortfolioIntent } from "@/lib/portfolioAssistantTypes";
import { correctTypos, tokenClose } from "@/lib/portfolio/fuzzyMatch";
import { detectLanguage, looksLikeQuestion, normalizeQuestion, tokenize } from "@/lib/portfolio/languageDetector";

export type IntentScore = { intent: PortfolioIntent; score: number };

export type IntentResult = {
  intent: PortfolioIntent;
  scores: IntentScore[];
  language: AssistantLanguage;
  projectSlug: string | null;
  serviceId: string | null;
  followUp: boolean;
  facet: "process" | "openai" | null;
  need: boolean;
  asking: boolean;
};

const phrases: Partial<Record<PortfolioIntent, readonly string[]>> = {
  GREETING: ["hello", "hi", "hey", "hallo", "guten tag", "servus", "مرحبا", "اهلا", "السلام عليكم", "السلام"],
  SERVICES: [
    "what services",
    "your services",
    "services do you",
    "what do you offer",
    "welche leistungen",
    "was bietest",
    "leistungen",
    "ما هي الخدمات",
    "الخدمات",
    "شو بتقدم",
  ],
  PROJECTS: [
    "show me your projects",
    "your projects",
    "what projects",
    "projects have you",
    "what have you built",
    "welche projekte",
    "deine projekte",
    "شو المشاريع",
    "ما هي المشاريع",
    "المشاريع",
  ],
  PROJECT_DETAILS: ["tell me about", "more about", "what is", "erzahl mir", "erzähl mir", "was ist", "احكي عن", "حدثني عن"],
  CAPABILITY: [
    "what can you build",
    "what can you do",
    "your capabilities",
    "capabilities",
    "was kannst du",
    "was koennt ihr",
    "was konnt ihr",
    "was koennen sie",
    "was konnt ihr bauen",
    "ماذا تستطيع",
    "ماذا تبني",
    "شو بتقدر",
    "ايش بتقدر",
    "شو فيك",
    "قدراتك",
  ],
  TECHNOLOGY: [
    "what technologies",
    "technologies do you",
    "tech stack",
    "what do you use",
    "welche technologien",
    "technologien",
    "ما هي التقنيات",
    "تقنيات",
    "التقنيات",
  ],
  CONTACT: [
    "how can i contact",
    "contact you",
    "get in touch",
    "your email",
    "email you",
    "wie erreiche",
    "kontakt",
    "كيف اتواصل",
    "كيف أتواصل",
    "تواصل معك",
    "البريد",
  ],
  ABOUT: ["who are you", "about you", "uber dich", "über dich", "من انت", "من أنت", "عنك"],
  PRICING: [
    "how much",
    "pricing",
    "price list",
    "do you charge",
    "what do you charge",
    "your rate",
    "kosten",
    "preis",
    "was kostet",
    "كم السعر",
    "بكم",
    "الاسعار",
    "الأسعار",
  ],
  DASHBOARD: ["custom dashboard", "build a dashboard", "build dashboards", "dashboard bauen", "لوحة تحكم", "لوحات"],
  AI: [
    "ai systems",
    "ai system",
    "artificial intelligence",
    "custom ai",
    "machine learning",
    "ki system",
    "ki systeme",
    "انظمة ذكاء",
    "أنظمة ذكاء",
    "ذكاء اصطناعي",
    "نظام ذكاء",
  ],
  AUTOMATION: [
    "process automation",
    "automate my",
    "automate business",
    "business workflow",
    "workflow automation",
    "business processes",
    "automatisieren",
    "geschaftsprozesse",
    "geschaftsprozess",
    "اتمته",
    "نظام اتمته",
  ],
  SUPPORT: [
    "customer support",
    "support system",
    "support platform",
    "helpdesk",
    "help desk",
    "support ticket",
    "kundenservice",
    "kundendienst",
    "نظام دعم",
    "دعم العملاء",
    "خدمه العملاء",
    "تذاكر الدعم",
  ],
  BOOKING: [
    "booking website",
    "booking system",
    "appointment scheduling",
    "appointment booking",
    "book appointments",
    "terminbuchung",
    "termin buchung",
    "buchungssystem",
    "نظام مواعيد",
    "نظام حجز",
    "حجز مواعيد",
  ],
  CUSTOM_SOFTWARE: ["custom software", "individuelle software", "برمجيات مخصصة", "برمجيات مخصصه"],
  START_PROJECT: [
    "i want to build",
    "i would like to build",
    "id like to build",
    "i want to hire",
    "hire you",
    "i have a project",
    "start a project",
    "how do i start",
    "work together",
    "lets work",
    "let us work",
    "ich moechte bauen",
    "ich will bauen",
    "projekt starten",
    "ابدا مشروع",
    "ابدا مشروعا",
    "dich beauftragen",
    "بدي اعمل",
    "بدي نظام",
    "اريد بناء",
    "أريد بناء",
    "ابغى ابني",
  ],
  UNLISTED: ["havent listed", "have not listed", "not listed", "something you havent", "nicht aufgefuehrt", "غير مذكور", "مو مذكور"],
  CONTEXT: ["what is this", "whats this", "explain this page", "was ist das", "شو هذا", "شو هاد", "ما هذا"],
};

const priority: PortfolioIntent[] = [
  "UNLISTED",
  "PRICING",
  "ECOMMERCE",
  "SAAS",
  "MOBILE",
  "AGENTS",
  "BOOKING",
  "SUPPORT",
  "PROJECT_SIMILARITY",
  "START_PROJECT",
  "PROJECT_DETAILS",
  "DASHBOARD",
  "AUTOMATION",
  "AI",
  "CUSTOM_SOFTWARE",
  "TECHNOLOGY",
  "CONTACT",
  "ABOUT",
  "SERVICES",
  "PROJECTS",
  "CAPABILITY",
  "CONTEXT",
  "GREETING",
  "UNKNOWN",
];

const similarityPhrases = [
  "something like",
  "similar to",
  "like your",
  "like the",
  "same as your",
  "ähnlich",
  "aehnlich",
  "wie euer",
  "مشابه",
  "زي مشروع",
  "مثل مشروع",
];

const followUpPattern =
  /^(what about|how about|and for|and what|what if|und was|und fur|was ist mit|شو عن|طب |وماذا عن|وماذا|بس ل)/;

const shortTokens = new Set(["hi", "hey", "kpi", "crm", "csv", "api"]);

function wordsClose(text: string, tokens: Set<string>, phrase: string) {
  if (text.includes(phrase)) return true;
  const parts = phrase.split(" ").filter(Boolean);
  if (parts.length < 2) return false;
  return parts.every((part) => tokens.has(part) || [...tokens].some((token) => tokenClose(token, part)));
}

function scorePhrase(text: string, tokens: Set<string>, phrase: string) {
  const normalized = correctTypos(normalizeQuestion(phrase));
  if (!normalized) return 0;
  if (normalized.includes(" ")) {
    return wordsClose(text, tokens, normalized) ? Math.min(0.96, 0.74 + normalized.length / 120) : 0;
  }
  if (normalized.length < 3 && !shortTokens.has(normalized)) return 0;
  const hit = tokens.has(normalized) || [...tokens].some((token) => tokenClose(token, normalized));
  return hit ? Math.min(0.9, 0.58 + Math.max(normalized.length, 3) / 40) : 0;
}

function bestPhrase(text: string, tokens: Set<string>, list: readonly string[]) {
  let best = 0;
  for (const phrase of list) best = Math.max(best, scorePhrase(text, tokens, phrase));
  return best;
}

function priorityIndex(intent: PortfolioIntent) {
  const index = priority.indexOf(intent);
  return index === -1 ? priority.length : index;
}

export function projectFromPath(pathname: string) {
  const match = pathname.match(/^\/work\/([^/]+)/);
  return match?.[1] ?? null;
}

export function scoreIntent(question: string): IntentResult {
  const normalized = normalizeQuestion(question);
  const language = detectLanguage(question, normalized);
  const text = correctTypos(normalized);
  const tokens = tokenize(text);
  const scores = new Map<PortfolioIntent, number>();

  const bump = (intent: PortfolioIntent, score: number) => {
    if (score <= 0) return;
    scores.set(intent, Math.max(scores.get(intent) ?? 0, score));
  };

  for (const [intent, list] of Object.entries(phrases) as [PortfolioIntent, readonly string[]][]) {
    bump(intent, bestPhrase(text, tokens, list));
  }

  let projectSlug: string | null = null;
  let projectScore = 0;
  for (const project of portfolioKnowledge.projects) {
    for (const alias of project.aliases) {
      const score = scorePhrase(text, tokens, alias);
      if (score > projectScore) {
        projectScore = score;
        projectSlug = project.slug;
      }
    }
  }
  if (projectSlug && projectScore > 0) bump("PROJECT_DETAILS", projectScore);

  let serviceId: string | null = null;
  let serviceScore = 0;
  for (const service of portfolioKnowledge.services) {
    for (const alias of service.aliases) {
      const score = scorePhrase(text, tokens, alias);
      if (score > serviceScore) {
        serviceScore = score;
        serviceId = service.id;
      }
    }
  }
  if (serviceId === "customer-support") bump("SUPPORT", serviceScore);
  if (serviceId === "ai-automation") bump("AUTOMATION", serviceScore);
  if (serviceId === "ai-applications" || serviceId === "ai-agents") bump("AGENTS", serviceScore);
  if (serviceId === "ai-applications") bump("AI", Math.max(0, serviceScore - 0.08));
  if (serviceId === "appointment-booking") bump("BOOKING", serviceScore);
  if (serviceId === "custom-software") bump("CUSTOM_SOFTWARE", serviceScore);
  if (text.includes("termin") || text.includes("buchung") || text.includes("appointment") || text.includes("booking") || text.includes("مواعيد") || text.includes("حجز")) {
    bump("BOOKING", 0.84);
  }
  if (text.includes("chatgpt") || text.includes("chat gpt")) bump("AGENTS", 0.9);

  for (const item of portfolioKnowledge.capabilities.supported) {
    bump(item.intent as PortfolioIntent, bestPhrase(text, tokens, item.aliases));
  }

  for (const item of portfolioKnowledge.capabilities.notListed) {
    bump(item.intent as PortfolioIntent, bestPhrase(text, tokens, item.aliases));
  }

  for (const entry of portfolioKnowledge.faq) {
    if (entry.kind === "unknown") bump("UNKNOWN", bestPhrase(text, tokens, entry.aliases) > 0 ? 0.7 : 0);
  }

  const similarity = bestPhrase(text, tokens, similarityPhrases);
  const need =
    /\b(i need|i want|we need|looking for|ich brauche|wir brauchen|ich suche)\b/.test(text) ||
    text.includes("احتاج") ||
    text.includes("بدي") ||
    text.includes("ابغى");

  if (similarity > 0 && projectSlug) {
    scores.set("PROJECT_SIMILARITY", 0.91);
    scores.set("PROJECT_DETAILS", 0.72);
    if (need) scores.set("SERVICES", Math.max(scores.get("SERVICES") ?? 0, 0.41));
  } else if (similarity > 0) {
    bump("PROJECT_SIMILARITY", similarity);
  }

  if (tokens.has("github")) bump("CONTACT", 0.8);
  if (tokens.has("email") || tokens.has("e mail")) bump("CONTACT", 0.78);

  const facet = /\b(how do you work|your process|wie arbeitest|طريقة العمل|كيف تعمل)\b/.test(text)
    ? "process"
    : tokens.has("openai")
      ? "openai"
      : null;
  if (facet === "process") bump("ABOUT", 0.84);
  if (facet === "openai") bump("TECHNOLOGY", 0.86);

  const followUp =
    followUpPattern.test(text) || text.includes("what about") || text.includes("how about") || text.includes("und was");

  const ranked = [...scores.entries()]
    .map(([intent, score]) => ({ intent, score }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || priorityIndex(a.intent) - priorityIndex(b.intent));

  let best = ranked[0] ?? { intent: "UNKNOWN" as PortfolioIntent, score: 0 };
  if (best.intent === "GREETING") {
    const other = ranked.find((item) => item.intent !== "GREETING");
    if (other && other.score >= best.score) best = other;
  }

  const asking = looksLikeQuestion(text, question);
  if (best.intent === "START_PROJECT" && asking) {
    const alternative = ranked.find(
      (item) => item.intent !== "START_PROJECT" && item.intent !== "GREETING" && item.score >= 0.7,
    );
    if (alternative && alternative.score + 0.04 >= best.score) best = alternative;
  }

  const startScore = scores.get("START_PROJECT") ?? 0;
  const specificBuild = Math.max(
    scores.get("ECOMMERCE") ?? 0,
    scores.get("AUTOMATION") ?? 0,
    scores.get("DASHBOARD") ?? 0,
    scores.get("BOOKING") ?? 0,
    scores.get("AGENTS") ?? 0,
    scores.get("SUPPORT") ?? 0,
  );
  if (!asking && startScore >= 0.7 && startScore + 0.12 >= best.score && specificBuild < 0.7) {
    best = { intent: "START_PROJECT", score: startScore };
  }

  const decline = ranked.find(
    (item) =>
      (item.intent === "ECOMMERCE" ||
        item.intent === "AUTOMATION" ||
        item.intent === "BOOKING" ||
        item.intent === "SAAS" ||
        item.intent === "MOBILE" ||
        item.intent === "AGENTS" ||
        item.intent === "SUPPORT") &&
      item.score >= 0.7,
  );
  if (decline && best.intent === "START_PROJECT" && decline.score + 0.05 >= startScore) best = decline;

  if (best.intent === "UNKNOWN" && best.score > 0 && best.score < 0.62) {
    const alternative = ranked.find((item) => item.intent !== "UNKNOWN" && item.score >= 0.62);
    if (alternative) best = alternative;
    else best = { intent: "UNKNOWN", score: 0 };
  }

  const pricingScore = scores.get("PRICING") ?? 0;
  if (pricingScore >= 0.7 && (best.intent === "ECOMMERCE" || best.intent === "AUTOMATION" || best.intent === "BOOKING" || best.intent === "AGENTS" || best.intent === "SUPPORT")) {
    best = { intent: "PRICING", score: pricingScore };
  }
  const chatgpt = text.includes("chatgpt") || text.includes("chat gpt");
  if (chatgpt && asking && !need) best = { intent: "AGENTS", score: Math.max(best.score, 0.92) };

  if (best.score < 0.5 && best.intent !== "UNKNOWN") {
    const strong = ranked.find((item) => item.score >= 0.5);
    best = strong ?? { intent: "UNKNOWN", score: 0 };
  }

  if (!serviceId && projectSlug === "ai-customer-support") serviceId = "customer-support";
  if (!serviceId && projectSlug === "ai-agent-platform") serviceId = "ai-agents";
  if (!serviceId && projectSlug === "delivery-intelligence") serviceId = "ai-applications";
  if (!serviceId && projectSlug === "appointment-booking") serviceId = "appointment-booking";
  if (!serviceId && best.intent === "SUPPORT") serviceId = "customer-support";
  if (!serviceId && best.intent === "AI") serviceId = "ai-applications";
  if (!serviceId && best.intent === "AGENTS") serviceId = "ai-agents";
  if (!serviceId && best.intent === "AUTOMATION") serviceId = "ai-automation";
  if (!serviceId && best.intent === "BOOKING") serviceId = "appointment-booking";
  if (!serviceId && best.intent === "CUSTOM_SOFTWARE") serviceId = "custom-software";

  return {
    intent: best.intent,
    scores: ranked,
    language,
    projectSlug,
    serviceId,
    followUp,
    facet,
    need,
    asking,
  };
}
