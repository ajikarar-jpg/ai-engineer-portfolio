import { takeTurn } from "@/lib/portfolio/conversation";
import { emptyConversation, type AssistantContext, type AssistantReply, type AssistantTurn, type PortfolioAssistantProvider } from "@/lib/portfolioAssistantTypes";

const fallback: AssistantReply = {
  text: "I couldn't process that question. Try asking about my services, projects, or capabilities.",
  actions: [],
};

export class LocalPortfolioAssistantProvider implements PortfolioAssistantProvider {
  constructor(private readonly delayMs = 420) {}

  async respond(question: string, context: AssistantContext): Promise<AssistantTurn> {
    const state = context.state ?? emptyConversation();
    await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    try {
      const trimmed = question.trim();
      if (!trimmed) return { reply: fallback, state };
      return takeTurn(trimmed, { ...context, state });
    } catch {
      return { reply: fallback, state };
    }
  }
}

export const portfolioAssistant: PortfolioAssistantProvider = new LocalPortfolioAssistantProvider();
