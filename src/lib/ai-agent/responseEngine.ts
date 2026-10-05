import type { AssistantLanguage } from "@/lib/portfolioAssistantTypes";
import type { AgentMemory } from "@/lib/ai-agent/conversationEngine";
import type { AgentIntent } from "@/lib/ai-agent/intentEngine";
import {
  askProducts,
  automationReply,
  bookingCard,
  bookingReply,
  capabilities,
  cartTotalSource,
  codingReply,
  dashboardCard,
  dashboardReply,
  greeting,
  portfolioReply,
  productFollowUp,
  productPlan,
  storeCard,
  storeOverview,
  unknownReply,
  type AgentCard,
} from "@/lib/ai-agent/knowledge";

export type ComposedReply = {
  text: string;
  card?: AgentCard;
  code?: { language: string; source: string };
  awaiting: AgentMemory["awaiting"];
  topic: AgentIntent | null;
  productType: string | null;
};

export function composeReply(input: {
  language: AssistantLanguage;
  intent: AgentIntent;
  product?: string;
}): ComposedReply {
  const { language, intent } = input;
  if (input.product) {
    return {
      text: productFollowUp(language, input.product),
      card: storeCard(language),
      awaiting: null,
      topic: "ecommerce",
      productType: input.product,
    };
  }
  if (intent === "ecommerce") {
    return {
      text: storeOverview(language),
      card: storeCard(language),
      awaiting: "product_type",
      topic: "ecommerce",
      productType: null,
    };
  }
  if (intent === "dashboard") {
    return {
      text: dashboardReply(language),
      card: dashboardCard(language),
      awaiting: null,
      topic: "dashboard",
      productType: null,
    };
  }
  if (intent === "automation" || intent === "business") {
    return {
      text: automationReply(language),
      awaiting: null,
      topic: "automation",
      productType: null,
    };
  }
  if (intent === "appointment_booking") {
    return {
      text: bookingReply(language),
      card: bookingCard(language),
      awaiting: null,
      topic: "appointment_booking",
      productType: null,
    };
  }
  if (intent === "coding") {
    return {
      text: codingReply(language),
      code: { language: "javascript", source: cartTotalSource },
      awaiting: null,
      topic: "coding",
      productType: null,
    };
  }
  if (intent === "general_ai" || intent === "project_questions") {
    return {
      text: productPlan(language),
      awaiting: null,
      topic: "general_ai",
      productType: null,
    };
  }
  if (intent === "portfolio") {
    return { text: portfolioReply(language), awaiting: null, topic: "portfolio", productType: null };
  }
  if (intent === "capabilities") {
    return { text: capabilities(language), awaiting: null, topic: "capabilities", productType: null };
  }
  if (intent === "greeting") {
    return { text: greeting(language), awaiting: null, topic: "greeting", productType: null };
  }
  return { text: unknownReply(language), awaiting: null, topic: null, productType: null };
}

export function productQuestion(language: AssistantLanguage): ComposedReply {
  return {
    text: askProducts(language),
    awaiting: "product_type",
    topic: "ecommerce",
    productType: null,
  };
}
