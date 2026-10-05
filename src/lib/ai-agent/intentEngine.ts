export type AgentIntent =
  | "greeting"
  | "general_ai"
  | "coding"
  | "business"
  | "ecommerce"
  | "dashboard"
  | "automation"
  | "appointment_booking"
  | "portfolio"
  | "project_questions"
  | "capabilities"
  | "unknown";

const phrases: Record<Exclude<AgentIntent, "unknown">, readonly string[]> = {
  coding: [
    "javascript function",
    "cart total",
    "calculates a cart",
    "write a function",
    "code example",
    "funktion",
  ],
  ecommerce: [
    "online store",
    "online shop",
    "ecommerce",
    "e commerce",
    "onlineshop",
    "webshop",
    "online selling",
    "متجر",
    "كتروني",
  ],
  dashboard: ["dashboard", "dashboards", "kpis", "sales dashboard", "لوحة", "kennzahl"],
  automation: [
    "automate",
    "automation",
    "workflow",
    "automatisieren",
    "geschaftsprozess",
    "اتمته",
    "lead management",
  ],
  appointment_booking: [
    "appointment",
    "appointments",
    "booking",
    "schedule",
    "scheduling",
    "termin",
    "buchung",
    "حجز",
    "مواعيد",
    "موعد",
  ],
  general_ai: ["ai product", "plan an ai", "artificial intelligence", "conversational", "ذكاء اصطناعي", "منتج ذكاء"],
  capabilities: ["what can you do", "your capabilities", "was kannst du", "شو بتقدر"],
  portfolio: ["your projects", "what have you built", "this portfolio", "المشاريع"],
  project_questions: ["which project", "tell me about your project", "about this project"],
  greeting: ["hello", "hi", "hey", "hallo", "مرحبا", "اهلا"],
  business: ["my business", "my company", "for my company", "شركتي"],
};

const order: Exclude<AgentIntent, "unknown">[] = [
  "coding",
  "ecommerce",
  "dashboard",
  "appointment_booking",
  "automation",
  "general_ai",
  "project_questions",
  "portfolio",
  "capabilities",
  "greeting",
  "business",
];

export function scoreAgentIntent(text: string): AgentIntent {
  let best: AgentIntent = "unknown";
  let bestScore = 0;
  for (const intent of order) {
    for (const phrase of phrases[intent]) {
      if (!text.includes(phrase)) continue;
      const score = 0.7 + Math.min(phrase.length, 24) / 80;
      if (score > bestScore) {
        best = intent;
        bestScore = score;
      }
    }
  }
  return best;
}

export function asksForProductType(text: string) {
  const build =
    text.includes("want to build") ||
    text.includes("would like to build") ||
    text.includes("bau mir") ||
    text.includes("ich will") ||
    text.includes("اريد") ||
    text.includes("بدي ابني");
  const direct =
    text.includes("i need") ||
    text.includes("help me") ||
    text.includes("concept") ||
    text.includes("ساعدني") ||
    text.includes("architektur") ||
    text.includes("architecture");
  return build && !direct;
}
