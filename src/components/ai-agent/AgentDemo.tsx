"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Menu, Pencil, Plus, RefreshCw, Send, Settings, Square, Trash2 } from "lucide-react";
import { emptyMemory, runAgent, suggestedPrompts } from "@/lib/ai-agent/agentEngine";
import type { AgentMemory } from "@/lib/ai-agent/conversationEngine";
import type { AgentCard } from "@/lib/ai-agent/knowledge";
import { cn } from "@/lib/cn";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  card?: AgentCard;
  code?: { language: string; source: string };
};

type Chat = {
  id: string;
  title: string;
  renamed: boolean;
  messages: ChatMessage[];
  memory: AgentMemory;
};

function createChat(id: string): Chat {
  return { id, title: "New chat", renamed: false, messages: [], memory: emptyMemory() };
}

export function AgentDemo() {
  const [chats, setChats] = useState<Chat[]>(() => [createChat("chat-1")]);
  const [activeId, setActiveId] = useState("chat-1");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sequence = useRef(2);
  const active = chats.find((chat) => chat.id === activeId) ?? chats[0];

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [active.messages, typing, activeId]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function nextId(prefix: string) {
    const id = `${prefix}-${sequence.current}`;
    sequence.current += 1;
    return id;
  }

  function patchChat(id: string, update: (chat: Chat) => Chat) {
    setChats((current) => current.map((chat) => (chat.id === id ? update(chat) : chat)));
  }

  function finishTimer() {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setTyping(false);
  }

  function sendText(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;
    const chatId = activeId;
    const memory = active.memory;
    const userMessage: ChatMessage = { id: nextId("m"), role: "user", text };
    patchChat(chatId, (chat) => ({
      ...chat,
      title: chat.renamed || chat.messages.some((message) => message.role === "user") ? chat.title : text.slice(0, 42),
      messages: [...chat.messages, userMessage],
    }));
    setDraft("");
    setTyping(true);
    setSettingsOpen(false);
    setSidebar(false);
    timer.current = window.setTimeout(() => {
      const result = runAgent(text, memory);
      const assistant: ChatMessage = {
        id: nextId("m"),
        role: "assistant",
        text: result.text,
        card: result.card,
        code: result.code,
      };
      patchChat(chatId, (chat) => ({ ...chat, messages: [...chat.messages, assistant], memory: result.memory }));
      setTyping(false);
      timer.current = null;
    }, 1100);
  }

  function stop() {
    if (!typing) return;
    finishTimer();
    const chatId = activeId;
    patchChat(chatId, (chat) => ({
      ...chat,
      messages: [...chat.messages, { id: nextId("m"), role: "assistant", text: "Stopped." }],
    }));
  }

  function regenerate() {
    if (typing) return;
    const chat = chats.find((item) => item.id === activeId);
    if (!chat) return;
    let lastUser = -1;
    chat.messages.forEach((message, index) => {
      if (message.role === "user") lastUser = index;
    });
    if (lastUser < 0) return;
    let memory = emptyMemory();
    for (const message of chat.messages.slice(0, lastUser)) {
      if (message.role === "user") memory = runAgent(message.text, memory).memory;
    }
    const prompt = chat.messages[lastUser].text;
    const trimmed =
      chat.messages[chat.messages.length - 1]?.role === "assistant" ? chat.messages.slice(0, -1) : chat.messages;
    const chatId = activeId;
    patchChat(chatId, (item) => ({ ...item, messages: trimmed }));
    setTyping(true);
    timer.current = window.setTimeout(() => {
      const result = runAgent(prompt, memory);
      patchChat(chatId, (item) => ({
        ...item,
        memory: result.memory,
        messages: [
          ...item.messages,
          { id: nextId("m"), role: "assistant", text: result.text, card: result.card, code: result.code },
        ],
      }));
      setTyping(false);
      timer.current = null;
    }, 1100);
  }

  function newChat() {
    finishTimer();
    const chat = createChat(nextId("chat"));
    setChats((current) => [chat, ...current]);
    setActiveId(chat.id);
    setSettingsOpen(false);
    setSidebar(false);
    setDraft("");
  }

  function removeChat(id: string) {
    if (typing && id === activeId) finishTimer();
    setChats((current) => {
      const next = current.filter((chat) => chat.id !== id);
      if (next.length === 0) {
        const fresh = createChat(nextId("chat"));
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  }

  function clearActive() {
    if (typing) finishTimer();
    patchChat(activeId, (chat) => ({ ...chat, messages: [], memory: emptyMemory() }));
  }

  async function copyText(id: string, value: string) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      copied = document.execCommand("copy");
      area.remove();
    }
    if (!copied) return;
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1200);
  }

  function commitRename(id: string) {
    const title = editTitle.trim();
    if (title) patchChat(id, (chat) => ({ ...chat, title, renamed: true }));
    setEditingId(null);
  }

  const lastIsAssistant = active.messages[active.messages.length - 1]?.role === "assistant";

  return (
    <div className="relative flex h-[min(720px,calc(100vh-9rem))] min-h-[560px] overflow-hidden rounded-2xl border border-line bg-[#0d1016]">
      {sidebar ? (
        <button
          type="button"
          aria-label="Close conversations"
          className="absolute inset-0 z-10 bg-black/50 md:hidden"
          onClick={() => setSidebar(false)}
        />
      ) : null}
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-20 w-[min(100%,16rem)] flex-col border-r border-line bg-[#0d1016] md:static md:flex md:w-60",
          sidebar ? "flex" : "hidden",
        )}
      >
        <div className="flex items-center gap-2 p-3">
          <button
            type="button"
            onClick={newChat}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line px-3 text-sm"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New Chat
          </button>
        </div>
        <p className="px-4 pb-2 font-mono text-[13px] leading-5 tracking-[0.14em] text-muted">RECENT</p>
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
          {chats.map((chat) => (
            <li key={chat.id} className="group rounded-xl">
              {editingId === chat.id ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    commitRename(chat.id);
                  }}
                >
                  <input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    aria-label="Conversation name"
                    className="w-full rounded-xl border border-line bg-transparent px-3 py-2 text-sm outline-none"
                    autoFocus
                  />
                </form>
              ) : (
                <div className={cn("flex items-center gap-1 rounded-xl px-1", chat.id === activeId && "bg-white/[0.04]")}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(chat.id);
                      setSidebar(false);
                      setSettingsOpen(false);
                    }}
                    className="min-h-11 min-w-0 flex-1 truncate px-2 text-left text-sm"
                  >
                    {chat.title}
                  </button>
                  <button
                    type="button"
                    aria-label={`Rename ${chat.title}`}
                    className="inline-flex h-11 w-9 items-center justify-center text-muted"
                    onClick={() => {
                      setEditingId(chat.id);
                      setEditTitle(chat.title);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${chat.title}`}
                    className="inline-flex h-11 w-9 items-center justify-center text-muted"
                    onClick={() => removeChat(chat.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="border-t border-line p-2">
          <button
            type="button"
            onClick={() => {
              setSettingsOpen(true);
              setSidebar(false);
            }}
            className="inline-flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm text-muted"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Settings
          </button>
        </div>
      </aside>
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-line px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line md:hidden"
              aria-label="Open conversations"
              onClick={() => setSidebar(true)}
            >
              <Menu className="h-4 w-4" aria-hidden />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[15px] leading-6 font-medium">AI Agent</p>
              <p className="text-[13px] leading-5 text-muted">Online · Portfolio Demo · Simulated AI</p>
            </div>
          </div>
          <button type="button" onClick={clearActive} className="min-h-11 shrink-0 px-2 text-[13px] text-muted">
            Clear
          </button>
        </header>
        <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-5">
          {settingsOpen ? (
            <div className="rounded-2xl border border-line p-4">
              <p className="text-[15px] leading-6">Settings</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Portfolio Demo · Simulated AI. Replies are deterministic local rules. This chat does not call an external model.
              </p>
              <button
                type="button"
                onClick={() => {
                  finishTimer();
                  const fresh = createChat(nextId("chat"));
                  setChats([fresh]);
                  setActiveId(fresh.id);
                  setSettingsOpen(false);
                }}
                className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-line px-3 text-sm"
              >
                Clear all conversations
              </button>
            </div>
          ) : null}
          {active.messages.length === 0 && !settingsOpen ? (
            <div className="mx-auto max-w-md pt-6 text-center">
              <p className="text-[15px] leading-6">Start a conversation</p>
              <p className="mt-2 text-sm leading-6 text-muted">Local simulation. Context stays in this chat.</p>
              <div className="mt-5 grid gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendText(prompt)}
                    className="min-h-11 rounded-xl border border-line px-3 text-left text-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {active.messages.map((message, index) => (
            <article key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[min(100%,34rem)]", message.role === "user" ? "rounded-2xl bg-white/[0.06] px-3 py-2" : "")}>
                <p className="text-[15px] leading-6 whitespace-pre-wrap">{message.text}</p>
                {message.card ? (
                  <div className="mt-3 rounded-2xl border border-line p-3">
                    <p className="text-sm font-medium">{message.card.title}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {message.card.columns.map((column) => (
                        <div key={column.heading}>
                          <p className="font-mono text-[13px] leading-5 text-muted">{column.heading}</p>
                          <ul className="mt-1 space-y-1 text-sm">
                            {column.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {message.card.action ? (
                      <Link
                        href={message.card.action.href}
                        className="mt-3 inline-flex min-h-11 items-center text-sm underline decoration-white/30 underline-offset-4"
                      >
                        {message.card.action.label}
                      </Link>
                    ) : null}
                  </div>
                ) : null}
                {message.code ? (
                  <div className="mt-3 overflow-hidden rounded-xl border border-line">
                    <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
                      <p className="font-mono text-[13px] leading-5 text-muted">{message.code.language}</p>
                      <button
                        type="button"
                        onClick={() => copyText(`${message.id}-code`, message.code?.source ?? "")}
                        className="inline-flex min-h-11 items-center gap-1 text-[13px]"
                      >
                        {copiedId === `${message.id}-code` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        Copy
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-3 font-mono text-[13px] leading-5 text-foreground">
                      <code>{message.code.source}</code>
                    </pre>
                  </div>
                ) : null}
                {message.role === "assistant" ? (
                  <div className="mt-2 flex gap-1">
                    <button
                      type="button"
                      aria-label="Copy response"
                      onClick={() => copyText(message.id, message.text)}
                      className="inline-flex h-11 w-11 items-center justify-center text-muted"
                    >
                      {copiedId === message.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    {lastIsAssistant && index === active.messages.length - 1 ? (
                      <button
                        type="button"
                        aria-label="Regenerate response"
                        onClick={regenerate}
                        className="inline-flex h-11 w-11 items-center justify-center text-muted"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
          {typing ? (
            <p className="text-[13px] leading-5 text-muted" aria-live="polite">
              AI Agent is writing…
            </p>
          ) : null}
        </div>
        <form
          className="border-t border-line p-3 sm:p-4"
          onSubmit={(event) => {
            event.preventDefault();
            sendText(draft);
          }}
        >
          <div className="flex items-end gap-2 rounded-2xl border border-line px-3 py-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendText(draft);
                }
              }}
              rows={2}
              placeholder="Message AI Agent..."
              aria-label="Message AI Agent"
              className="max-h-32 min-h-12 min-w-0 flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 outline-none"
            />
            {typing ? (
              <button type="button" onClick={stop} aria-label="Stop generation" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line">
                <Square className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : (
              <button type="submit" aria-label="Send" className="cta-primary inline-flex h-11 w-11 items-center justify-center rounded-lg">
                <Send className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
