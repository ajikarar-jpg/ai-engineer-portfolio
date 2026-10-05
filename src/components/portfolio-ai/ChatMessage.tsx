import type { AssistantAction, ProjectCard } from "@/lib/portfolioAssistantTypes";
import { ActionButtons } from "@/components/portfolio-ai/ActionButtons";
import { ProjectRecommendation } from "@/components/portfolio-ai/ProjectRecommendation";
import { SuggestedPrompts } from "@/components/portfolio-ai/SuggestedPrompts";

export type ChatEntry = {
  id: number;
  role: "user" | "assistant";
  text: string;
  actions?: AssistantAction[];
  cards?: ProjectCard[];
  suggestions?: string[];
};

export function ChatMessage({
  message,
  showSuggestions,
  onSuggest,
  onNavigate,
  onStart,
}: {
  message: ChatEntry;
  showSuggestions: boolean;
  onSuggest: (question: string) => void;
  onNavigate: () => void;
  onStart: () => void;
}) {
  const cardHrefs = new Set((message.cards ?? []).map((card) => card.href));
  const actions = (message.actions ?? []).filter((action) => !action.href || !cardHrefs.has(action.href));
  const user = message.role === "user";

  return (
    <div className={`assistant-in flex gap-2 ${user ? "justify-end" : "items-start"}`}>
      {user ? null : (
        <span
          className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-[13px] leading-none"
          aria-hidden="true"
        >
          ✦
        </span>
      )}
      <div
        dir="auto"
        className={
          user
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-[15px] leading-6 text-accent-ink"
            : "max-w-[92%] rounded-2xl rounded-bl-md border border-line bg-[#11151d] px-3.5 py-2.5 text-[15px] leading-6"
        }
      >
        <p className="whitespace-pre-wrap leading-6">{message.text}</p>
        {message.cards?.map((card) => (
          <ProjectRecommendation key={card.slug} card={card} onNavigate={onNavigate} />
        ))}
        <ActionButtons actions={actions} onNavigate={onNavigate} onStart={onStart} />
        {showSuggestions && message.suggestions ? (
          <SuggestedPrompts questions={message.suggestions} onSelect={onSuggest} />
        ) : null}
      </div>
    </div>
  );
}
