import type { AgentIntent } from "@/lib/ai-agent/intentEngine";
import type { AssistantLanguage } from "@/lib/portfolioAssistantTypes";

export type AgentMemory = {
  awaiting: "product_type" | null;
  topic: AgentIntent | null;
  productType: string | null;
  language: AssistantLanguage | null;
};

export function emptyMemory(): AgentMemory {
  return { awaiting: null, topic: null, productType: null, language: null };
}

const interruptIntents = new Set<AgentIntent>([
  "coding",
  "dashboard",
  "automation",
  "appointment_booking",
  "general_ai",
  "portfolio",
  "greeting",
]);

export function continueProductAnswer(text: string, intent: AgentIntent) {
  if (interruptIntents.has(intent) && text.split(" ").filter(Boolean).length > 2) return false;
  if (intent === "ecommerce" && (text.includes("online store") || text.includes("online shop") || text.includes("متجر"))) {
    return text.split(" ").length <= 4;
  }
  return true;
}

export function productLabel(message: string) {
  return message.replace(/[.?!؟]+$/g, "").trim().toLowerCase();
}
