import { ArrowUp, X } from "lucide-react";
import type { RefObject } from "react";
import { portfolioKnowledge } from "@/data/portfolioKnowledge";
import { ChatMessage, type ChatEntry } from "@/components/portfolio-ai/ChatMessage";
import { ProjectDiscovery } from "@/components/portfolio-ai/ProjectDiscovery";
import { SuggestedPrompts } from "@/components/portfolio-ai/SuggestedPrompts";
import type { AssistantLanguage, ConversationStage } from "@/lib/portfolioAssistantTypes";

export function PortfolioAI({
  titleId,
  panelRef,
  inputRef,
  endRef,
  messages,
  thinking,
  draft,
  stage,
  language,
  mobileFrame,
  onDraft,
  onSubmit,
  onAsk,
  onClose,
  onReset,
  onStart,
}: {
  titleId: string;
  panelRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
  messages: ChatEntry[];
  thinking: boolean;
  draft: string;
  stage: ConversationStage;
  language: AssistantLanguage;
  mobileFrame: { top: number; height: number } | null;
  onDraft: (value: string) => void;
  onSubmit: () => void;
  onAsk: (question: string) => void;
  onClose: () => void;
  onReset: () => void;
  onStart: () => void;
}) {
  const canReset = messages.length > 0 || stage !== "idle";

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="menu-in fixed inset-x-3 z-[70] flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] top-3 bottom-3 md:inset-auto md:right-5 md:bottom-5 md:h-[600px] md:w-[440px]"
      style={
        mobileFrame
          ? { top: mobileFrame.top + 12, height: Math.max(280, mobileFrame.height - 24), bottom: "auto" }
          : undefined
      }
    >
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <h2 id={titleId} className="text-sm font-medium tracking-tight">
            ✦ Portfolio AI
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-muted">Ask about my work, services, and capabilities.</p>
          <p className="mt-1 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted uppercase">Local AI Assistant</p>
          {canReset ? (
            <button
              type="button"
              className="mt-2 text-[13px] leading-5 text-muted underline-offset-4 hover:underline"
              onClick={onReset}
            >
              New conversation
            </button>
          ) : null}
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line"
          aria-label="Close assistant"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </header>

      <ProjectDiscovery stage={stage} language={language} />

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
        {messages.length === 0 ? (
          <div>
            <p className="text-[15px] leading-6 text-muted">How can I help?</p>
            <SuggestedPrompts questions={portfolioKnowledge.suggestedQuestions} onSelect={onAsk} />
            <button
              type="button"
              className="mt-3 inline-flex min-h-11 items-center rounded-full border border-line px-3.5 text-[15px] leading-6 transition-colors duration-200 hover:bg-white/[0.04]"
              onClick={onStart}
            >
              Start a project
            </button>
          </div>
        ) : null}
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            showSuggestions={index === messages.length - 1 && !thinking}
            onSuggest={onAsk}
            onNavigate={onClose}
            onStart={onStart}
          />
        ))}
        {thinking ? (
          <p className="text-[15px] leading-6 text-muted" aria-busy="true">
            <span className="sr-only">Thinking</span>
            <span aria-hidden="true">
              Thinking
              <span className="motion-safe:animate-pulse">...</span>
            </span>
          </p>
        ) : null}
        <div ref={endRef} />
      </div>

      <form
        className="border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="portfolio-ai-input">
            Ask about services, projects, or capabilities
          </label>
          <textarea
            id="portfolio-ai-input"
            ref={inputRef}
            dir="auto"
            rows={1}
            value={draft}
            placeholder="Ask about my services, projects or capabilities..."
            className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-line bg-transparent px-3 py-2.5 text-[15px] leading-6 text-foreground outline-none placeholder:text-muted"
            onChange={(event) => onDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
          <button
            type="submit"
            className="cta-primary inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition duration-200 disabled:opacity-40"
            aria-label="Send message"
            disabled={thinking || draft.trim().length === 0}
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}
