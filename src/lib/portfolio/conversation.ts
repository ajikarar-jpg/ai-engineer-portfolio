import type { AssistantContext, AssistantReply, AssistantTurn, ConversationState } from "@/lib/portfolioAssistantTypes";
import { emptyConversation } from "@/lib/portfolioAssistantTypes";
import { scoreIntent, type IntentResult } from "@/lib/portfolio/intentEngine";
import { continueDiscovery, finishIfReady, shouldContinueDiscovery, startFromUtterance } from "@/lib/portfolio/projectDiscovery";
import { rankProjects } from "@/lib/portfolio/recommendationEngine";
import { answerIntent, followUpReply, recommendationReply } from "@/lib/portfolio/responseEngine";

const redirect = new Set([
  "PRICING",
  "CONTACT",
  "GREETING",
  "ECOMMERCE",
  "SAAS",
  "MOBILE",
  "AGENTS",
  "BOOKING",
  "SUPPORT",
  "PROJECTS",
  "SERVICES",
  "TECHNOLOGY",
  "ABOUT",
  "UNLISTED",
  "CONTEXT",
]);

const openNeed = new Set([
  "UNKNOWN",
  "AI",
  "CAPABILITY",
  "CUSTOM_SOFTWARE",
  "DASHBOARD",
  "AUTOMATION",
  "PROJECT_DETAILS",
  "PROJECT_SIMILARITY",
  "SERVICES",
]);

function remember(
  state: ConversationState,
  result: IntentResult,
  reply: AssistantReply,
  meta: { suggestionKey: string | null; projectSlug: string | null; serviceId: string | null },
): AssistantTurn {
  const inFlow = state.discoveryStep != null;
  const suggestions = inFlow ? undefined : reply.suggestions;
  return {
    reply: { ...reply, suggestions },
    state: {
      ...state,
      language: result.language,
      currentIntent: result.intent,
      mentionedProject: meta.projectSlug ?? state.mentionedProject,
      mentionedService: meta.serviceId ?? state.mentionedService,
      userGoal: state.userGoal,
      conversationStage: inFlow ? state.conversationStage : "idle",
      discoveryStep: state.discoveryStep,
      brief: state.brief,
      pitched: state.pitched,
      lastSuggestionKey: meta.suggestionKey,
    },
  };
}

export function takeTurn(question: string, context: AssistantContext): AssistantTurn {
  const state = context.state ?? emptyConversation();
  const result = scoreIntent(question);

  if (shouldContinueDiscovery(question, result, state)) {
    return continueDiscovery(question, { ...state, language: result.language });
  }

  if (state.discoveryStep && result.intent === "CONTACT") {
    const finished = finishIfReady(state, result.language);
    if (finished) return finished;
  }

  if (result.intent === "START_PROJECT") {
    return startFromUtterance(question, state, result.language);
  }

  const strongRedirect = redirect.has(result.intent) && (result.scores.find((item) => item.intent === result.intent)?.score ?? 0) >= 0.7;
  if (result.followUp && state.currentIntent && !strongRedirect) {
    const reply = followUpReply(question, result.language, state.currentIntent, state.mentionedService, state.lastSuggestionKey);
    return remember(state, { ...result, intent: state.currentIntent ?? result.intent }, reply, reply);
  }

  const canRecommend =
    openNeed.has(result.intent) ||
    result.intent === "ECOMMERCE" ||
    result.intent === "AUTOMATION" ||
    result.intent === "AGENTS" ||
    result.intent === "BOOKING" ||
    result.intent === "SUPPORT";
  if (result.need && canRecommend && result.intent !== "PROJECT_DETAILS") {
    const matches = rankProjects(question);
    if (matches[0] && matches[0].score >= 0.45) {
      const reply = recommendationReply(matches, result.language, state.lastSuggestionKey);
      return remember(state, result, reply, reply);
    }
  }

  if (result.need && !result.asking && result.intent === "PROJECT_DETAILS") {
    const matches = rankProjects(question);
    if (matches[0] && matches[0].score >= 0.45) {
      const reply = recommendationReply(matches, result.language, state.lastSuggestionKey);
      return remember(state, result, reply, reply);
    }
  }

  if (result.intent === "PROJECT_SIMILARITY") {
    const matches = rankProjects(question);
    if (matches[0]) {
      const reply = recommendationReply(matches, result.language, state.lastSuggestionKey);
      return remember(state, result, reply, reply);
    }
  }

  const reply = answerIntent({
    question,
    result,
    pathname: context.pathname,
    lastKey: state.lastSuggestionKey,
  });
  return remember(state, result, reply, reply);
}

export function answerQuestion(question: string, context: AssistantContext): AssistantReply {
  return takeTurn(question, context).reply;
}

export { emptyConversation };
