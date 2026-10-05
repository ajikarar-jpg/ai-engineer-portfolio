export type AssistantLanguage = "en" | "de" | "ar";

export type PortfolioIntent =
  | "GREETING"
  | "SERVICES"
  | "PROJECTS"
  | "PROJECT_DETAILS"
  | "CAPABILITY"
  | "TECHNOLOGY"
  | "CONTACT"
  | "ABOUT"
  | "PRICING"
  | "ECOMMERCE"
  | "DASHBOARD"
  | "AI"
  | "AUTOMATION"
  | "SAAS"
  | "CUSTOM_SOFTWARE"
  | "START_PROJECT"
  | "PROJECT_SIMILARITY"
  | "UNKNOWN"
  | "UNLISTED"
  | "CONTEXT"
  | "MOBILE"
  | "AGENTS"
  | "BOOKING"
  | "SUPPORT";

export type ConversationStage =
  | "idle"
  | "discovery"
  | "understanding"
  | "recommendation"
  | "qualification"
  | "contact";

export type DiscoveryStep = "goal" | "subject" | "data" | "users" | null;

export type ProjectBrief = {
  goal?: string;
  industry?: string;
  dataSource?: string;
  users?: string;
  features?: string[];
  timeline?: string;
  budget?: string;
  projectLabel?: string;
};

export type ConversationState = {
  currentIntent: PortfolioIntent | null;
  mentionedProject: string | null;
  mentionedService: string | null;
  userGoal: string | null;
  conversationStage: ConversationStage;
  discoveryStep: DiscoveryStep;
  brief: ProjectBrief;
  pitched: boolean;
  language: AssistantLanguage;
  lastSuggestionKey: string | null;
};

export type AssistantAction = {
  label: string;
  href?: string;
  external?: boolean;
  command?: "start-project";
};

export type ProjectCard = {
  slug: string;
  name: string;
  summary: string;
  points: readonly string[];
  href: string;
  actionLabel: string;
};

export type AssistantReply = {
  text: string;
  actions: AssistantAction[];
  cards?: ProjectCard[];
  suggestions?: string[];
};

export type AssistantContext = {
  pathname: string;
  state?: ConversationState;
};

export type AssistantTurn = {
  reply: AssistantReply;
  state: ConversationState;
};

/**
 * Local today. A later provider can call an external model without changing the chat UI.
 * This interface must not require an API key.
 */
export interface PortfolioAssistantProvider {
  respond(question: string, context: AssistantContext): Promise<AssistantTurn>;
}

export function emptyConversation(): ConversationState {
  return {
    currentIntent: null,
    mentionedProject: null,
    mentionedService: null,
    userGoal: null,
    conversationStage: "idle",
    discoveryStep: null,
    brief: {},
    pitched: false,
    language: "en",
    lastSuggestionKey: null,
  };
}
