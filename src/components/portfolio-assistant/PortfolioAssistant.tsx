"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PortfolioAI } from "@/components/portfolio-ai/PortfolioAI";
import type { ChatEntry } from "@/components/portfolio-ai/ChatMessage";
import { portfolioAssistant } from "@/lib/portfolioAssistantProvider";
import { emptyConversation, type ConversationState } from "@/lib/portfolioAssistantTypes";
import { openDiscovery } from "@/lib/portfolio/projectDiscovery";
import { usePathname } from "next/navigation";

export function PortfolioAssistant() {
  const pathname = usePathname();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [thinking, setThinking] = useState(false);
  const [conversation, setConversation] = useState<ConversationState>(emptyConversation());
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const request = useRef(0);
  const returnFocus = useRef(false);
  const conversationRef = useRef(conversation);
  const [mobileFrame, setMobileFrame] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    if (!open) {
      if (returnFocus.current) {
        returnFocus.current = false;
        launcherRef.current?.focus();
      }
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    const sync = () => {
      const narrow = window.innerWidth < 768;
      if (!narrow || !viewport) {
        setMobileFrame(null);
        return;
      }
      setMobileFrame({ top: viewport.offsetTop, height: viewport.height });
    };
    sync();
    window.addEventListener("resize", sync);
    viewport?.addEventListener("resize", sync);
    viewport?.addEventListener("scroll", sync);
    return () => {
      window.removeEventListener("resize", sync);
      viewport?.removeEventListener("resize", sync);
      viewport?.removeEventListener("scroll", sync);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [messages, open, thinking]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>("a, button, textarea")].filter(
        (item) => !item.hasAttribute("disabled"),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, messages, thinking, conversation.conversationStage]);

  function close() {
    returnFocus.current = true;
    setOpen(false);
  }

  function remember(next: ConversationState) {
    conversationRef.current = next;
    setConversation(next);
  }

  function reset() {
    request.current += 1;
    setThinking(false);
    setDraft("");
    setMessages([]);
    remember(emptyConversation());
    inputRef.current?.focus();
  }

  function startProject() {
    if (thinking) return;
    const turn = openDiscovery(conversationRef.current);
    remember(turn.state);
    setMessages((items) => [
      ...items,
      {
        id: nextId.current++,
        role: "assistant",
        text: turn.reply.text,
        actions: turn.reply.actions,
        cards: turn.reply.cards,
        suggestions: turn.reply.suggestions,
      },
    ]);
  }

  async function ask(text: string) {
    const question = text.trim();
    if (!question || thinking) return;
    const current = request.current + 1;
    request.current = current;
    setDraft("");
    setThinking(true);
    setMessages((items) => [...items, { id: nextId.current++, role: "user", text: question }]);
    try {
      const turn = await portfolioAssistant.respond(question, {
        pathname,
        state: conversationRef.current,
      });
      if (request.current !== current) return;
      remember(turn.state);
      setMessages((items) => [
        ...items,
        {
          id: nextId.current++,
          role: "assistant",
          text: turn.reply.text,
          actions: turn.reply.actions,
          cards: turn.reply.cards,
          suggestions: turn.reply.suggestions,
        },
      ]);
    } catch {
      if (request.current !== current) return;
      setMessages((items) => [
        ...items,
        {
          id: nextId.current++,
          role: "assistant",
          text: "I couldn't process that question. Try asking about my services, projects, or capabilities.",
        },
      ]);
    } finally {
      if (request.current === current) setThinking(false);
    }
  }

  if (!open) {
    return (
      <button
        ref={launcherRef}
        type="button"
        className="cta-secondary fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex h-11 items-center rounded-lg px-4 text-sm backdrop-blur-sm transition duration-200"
        aria-haspopup="dialog"
        aria-expanded={false}
        onClick={() => setOpen(true)}
      >
        ✦ Ask AI
      </button>
    );
  }

  return (
    <PortfolioAI
      titleId={titleId}
      panelRef={panelRef}
      inputRef={inputRef}
      endRef={endRef}
      messages={messages}
      thinking={thinking}
      draft={draft}
      stage={conversation.conversationStage}
      language={conversation.language}
      mobileFrame={mobileFrame}
      onDraft={setDraft}
      onSubmit={() => void ask(draft)}
      onAsk={(question) => void ask(question)}
      onClose={close}
      onReset={reset}
      onStart={startProject}
    />
  );
}
