import { continueProductAnswer, emptyMemory, productLabel, type AgentMemory } from "@/lib/ai-agent/conversationEngine";
import { asksForProductType, scoreAgentIntent } from "@/lib/ai-agent/intentEngine";
import { composeReply, productQuestion, type ComposedReply } from "@/lib/ai-agent/responseEngine";
import { correctTypos } from "@/lib/portfolio/fuzzyMatch";
import { detectLanguage, normalizeQuestion } from "@/lib/portfolio/languageDetector";

export type AgentResult = ComposedReply & { memory: AgentMemory };

export function runAgent(message: string, memory: AgentMemory = emptyMemory()): AgentResult {
  const normalized = normalizeQuestion(message);
  const text = correctTypos(normalized);
  const detected = detectLanguage(message, normalized);
  const shortReply = text.split(" ").filter(Boolean).length <= 3 && detected === "en" && memory.language;
  const language = shortReply ? memory.language ?? detected : detected;
  const intent = scoreAgentIntent(text);

  if (memory.awaiting === "product_type" && continueProductAnswer(text, intent)) {
    const reply = composeReply({ language, intent: "ecommerce", product: productLabel(message) || "products" });
    return { ...reply, memory: { awaiting: reply.awaiting, topic: reply.topic, productType: reply.productType, language } };
  }

  const reply = asksForProductType(text) && intent === "ecommerce" ? productQuestion(language) : composeReply({ language, intent });
  return {
    ...reply,
    memory: { awaiting: reply.awaiting, topic: reply.topic, productType: reply.productType, language },
  };
}

export { suggestedPrompts } from "@/lib/ai-agent/knowledge";
export { emptyMemory } from "@/lib/ai-agent/conversationEngine";
