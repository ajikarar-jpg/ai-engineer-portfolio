"use client";

import {
  BarChart3,
  BookOpen,
  Inbox,
  MessagesSquare,
  Settings,
  Ticket,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  customerById,
  initialConversations,
  initialTickets,
  supportAnalytics,
  supportCustomers,
  ticketStatuses,
  type SupportConversation,
  type SupportCustomer,
  type SupportTicket,
  type TicketStatus,
} from "@/data/supportDesk";
import { cn } from "@/lib/cn";
import { analyzeMessage, searchArticles, type SupportAnalysis } from "@/lib/support/assist";

type View = "inbox" | "conversations" | "customers" | "knowledge" | "tickets" | "analytics" | "settings";

const views: { id: View; label: string; icon: typeof Inbox }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "conversations", label: "Conversations", icon: MessagesSquare },
  { id: "customers", label: "Customers", icon: Users },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

function arabicText(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function lastCustomerText(conversation: SupportConversation) {
  return [...conversation.messages].reverse().find((message) => message.from === "customer")?.text ?? "";
}

export function SupportDemo() {
  const [view, setView] = useState<View>("inbox");
  const [conversations, setConversations] = useState(initialConversations);
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedId, setSelectedId] = useState(initialConversations()[0]?.id ?? "");
  const [customerId, setCustomerId] = useState(supportCustomers[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [articleQuery, setArticleQuery] = useState("");
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  const profileCustomer = customerById(selected?.customerId ?? supportCustomers[0].id);
  const analysis = useMemo(
    () => (selected ? analyzeMessage(lastCustomerText(selected), profileCustomer) : null),
    [selected, profileCustomer],
  );

  function openConversation(id: string) {
    setSelectedId(id);
    setNotice(null);
  }

  function replyValue() {
    if (!selected || !analysis) return "";
    return selected.id in drafts ? drafts[selected.id] : analysis.reply;
  }

  function sendReply() {
    if (!selected) return;
    const text = replyValue().trim();
    if (!text) return;
    const nextId = `${selected.id}-a${selected.messages.length + 1}`;
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selected.id
          ? {
              ...conversation,
              status: conversation.escalated ? conversation.status : "Waiting",
              messages: [...conversation.messages, { id: nextId, from: "agent", text, at: "Now" }],
            }
          : conversation,
      ),
    );
    setDrafts((current) => ({ ...current, [selected.id]: "" }));
    setNotice("Reply kept in this browser. No customer was contacted.");
  }

  function escalate() {
    if (!selected || !analysis) return;
    if (selected.escalated) {
      setNotice("This conversation is already with a human agent in the demo.");
      return;
    }
    const noteId = `${selected.id}-esc`;
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selected.id
          ? {
              ...conversation,
              escalated: true,
              status: "Escalated",
              messages: [
                ...conversation.messages,
                {
                  id: noteId,
                  from: "system",
                  text: "Escalated to a human agent. This demo does not notify anyone. A production inbox would assign the thread to a person on shift.",
                  at: "Now",
                },
              ],
            }
          : conversation,
      ),
    );
    setTickets((current) => {
      const existing = current.find((ticket) => ticket.conversationId === selected.id);
      if (!existing) {
        return [
          {
            id: `TCK-${1200 + current.length}`,
            customerId: selected.customerId,
            conversationId: selected.id,
            subject: selected.subject,
            category: analysis.intent,
            priority: "High",
            status: "In Progress",
            agent: "Unassigned",
            created: "05 Oct 2026",
          },
          ...current,
        ];
      }
      return current.map((ticket) =>
        ticket.conversationId === selected.id
          ? { ...ticket, priority: "High", status: ticket.status === "Resolved" ? "In Progress" : ticket.status }
          : ticket,
      );
    });
    setNotice("Escalated inside this demo. Priority is now High.");
  }

  function createTicket() {
    if (!selected || !analysis) return;
    const existing = tickets.find((ticket) => ticket.conversationId === selected.id);
    if (existing) {
      setView("tickets");
      setNotice(`${existing.id} is already open for this conversation.`);
      return;
    }
    const created: SupportTicket = {
      id: `TCK-${1200 + tickets.length}`,
      customerId: selected.customerId,
      conversationId: selected.id,
      subject: selected.subject,
      category: analysis.intent,
      priority: analysis.priority,
      status: "Open",
      agent: "Unassigned",
      created: "05 Oct 2026",
    };
    setTickets((current) => [created, ...current]);
    setView("tickets");
    setNotice(`Created ${created.id} from this conversation.`);
  }

  function updateTicket(id: string, status: TicketStatus) {
    setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#0d1016]">
      <div className="flex flex-col lg:min-h-[760px] lg:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b border-line p-3 lg:w-52 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0" aria-label="Support">
          {views.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setView(item.id);
                  setNotice(null);
                }}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-left text-sm lg:w-full",
                  active ? "bg-accent text-accent-ink" : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1">
          {notice ? (
            <p className="border-b border-line px-4 py-3 text-sm text-muted" role="status">
              {notice}
            </p>
          ) : null}
          {view === "inbox" || view === "conversations" ? (
            <Workspace
              title={view === "inbox" ? "Inbox" : "Conversations"}
              conversations={conversations}
              tickets={tickets}
              selectedId={selected?.id ?? ""}
              analysis={analysis}
              reply={replyValue()}
              onSelect={openConversation}
              onDraft={(value) => selected && setDrafts((current) => ({ ...current, [selected.id]: value }))}
              onSend={sendReply}
              onEscalate={escalate}
              onCreateTicket={createTicket}
              onUseSuggestion={() => selected && analysis && setDrafts((current) => ({ ...current, [selected.id]: analysis.reply }))}
            />
          ) : null}
          {view === "customers" ? (
            <Customers
              selectedId={customerId}
              tickets={tickets}
              onSelect={setCustomerId}
            />
          ) : null}
          {view === "knowledge" ? (
            <Knowledge query={articleQuery} openId={openArticle} onQuery={setArticleQuery} onOpen={setOpenArticle} />
          ) : null}
          {view === "tickets" ? <Tickets tickets={tickets} onStatus={updateTicket} /> : null}
          {view === "analytics" ? <Analytics tickets={tickets} /> : null}
          {view === "settings" ? <DemoSettings /> : null}
        </div>
      </div>
    </div>
  );
}

function Workspace({
  title,
  conversations,
  tickets,
  selectedId,
  analysis,
  reply,
  onSelect,
  onDraft,
  onSend,
  onEscalate,
  onCreateTicket,
  onUseSuggestion,
}: {
  title: string;
  conversations: SupportConversation[];
  tickets: SupportTicket[];
  selectedId: string;
  analysis: SupportAnalysis | null;
  reply: string;
  onSelect: (id: string) => void;
  onDraft: (value: string) => void;
  onSend: () => void;
  onEscalate: () => void;
  onCreateTicket: () => void;
  onUseSuggestion: () => void;
}) {
  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  if (!selected || !analysis) return null;
  const customer = customerById(selected.customerId);
  const related = tickets.filter((ticket) => ticket.customerId === customer.id);

  return (
    <div className="grid lg:grid-cols-[15.5rem_minmax(0,1fr)_17rem]">
      <div className="border-b border-line lg:border-r lg:border-b-0">
        <div className="px-4 py-4">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{title}</p>
          <p className="mt-1 text-sm text-muted">{conversations.length} sample conversations</p>
        </div>
        <ul className="max-h-72 overflow-y-auto lg:max-h-[680px]">
          {conversations.map((conversation) => {
            const person = customerById(conversation.customerId);
            const active = conversation.id === selected.id;
            const read = analyzeMessage(lastCustomerText(conversation), person);
            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  className={cn(
                    "w-full border-t border-line px-4 py-3 text-left",
                    active ? "bg-white/[0.04]" : "hover:bg-white/[0.03]",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{person.name}</span>
                    <span className="font-mono text-[10px] text-muted">{conversation.messages.at(-1)?.at}</span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-muted">{conversation.subject}</span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    <Pill>{read.intent}</Pill>
                    <Pill>{read.priority}</Pill>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="min-w-0 border-b border-line lg:border-r lg:border-b-0">
        <header className="border-b border-line px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-medium tracking-tight">{customer.name}</h2>
            <Pill>{customer.status}</Pill>
            <Pill>{selected.status}</Pill>
          </div>
          <p className="mt-1 text-sm text-muted">{selected.subject}</p>
        </header>
        <ol className="max-h-80 space-y-3 overflow-y-auto px-4 py-4 lg:max-h-[340px]">
          {selected.messages.map((message) => (
            <li
              key={message.id}
              dir={arabicText(message.text) ? "rtl" : "ltr"}
              className={cn(
                "rounded-xl border border-line px-3 py-3 text-sm leading-relaxed",
                message.from === "customer" ? "bg-white/[0.03]" : "bg-transparent",
              )}
            >
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                {message.from === "customer" ? customer.name : message.from === "agent" ? "Agent" : "System"} · {message.at}
              </p>
              <p className="mt-1">{message.text}</p>
            </li>
          ))}
        </ol>
        <div className="space-y-3 border-t border-line px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <Pill>{`Intent ${analysis.intent}`}</Pill>
            <Pill>{`Priority ${analysis.priority} · ${analysis.score}`}</Pill>
            <Pill>{analysis.language.toUpperCase()}</Pill>
          </div>
          <p className="text-xs text-muted">Matched article: {analysis.article.title}</p>
          <div dir={analysis.language === "ar" ? "rtl" : "ltr"} className="rounded-xl border border-line bg-white/[0.03] p-3">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">Suggested AI response</p>
            <p className="mt-2 text-sm leading-relaxed">{analysis.reply}</p>
            <p className="mt-2 text-xs text-muted">Local rules from the intent, the article, and this customer. No external model is called.</p>
          </div>
          <label className="block text-sm text-muted" htmlFor="support-reply">
            Reply
            <textarea
              id="support-reply"
              value={reply}
              dir={arabicText(reply) ? "rtl" : "ltr"}
              onChange={(event) => onDraft(event.target.value)}
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-line bg-[#0d1016] px-3 py-3 text-sm leading-relaxed text-foreground"
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button type="button" onClick={onSend} className="cta-primary inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition duration-200">
              Send
            </button>
            <button type="button" onClick={onUseSuggestion} className="inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-sm text-foreground">
              Use suggestion
            </button>
            <button type="button" onClick={onEscalate} className="inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-sm text-foreground">
              Escalate to human
            </button>
            <button type="button" onClick={onCreateTicket} className="inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-sm text-foreground">
              Create ticket
            </button>
          </div>
        </div>
      </div>

      <Profile customer={customer} tickets={related} />
    </div>
  );
}

function Profile({ customer, tickets }: { customer: SupportCustomer; tickets: SupportTicket[] }) {
  return (
    <aside className="px-4 py-4">
      <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Customer</p>
      <h3 className="mt-2 text-lg font-medium">{customer.name}</h3>
      <p className="mt-1 text-sm text-muted">{customer.email}</p>
      <p className="mt-3 text-sm">
        Status <span className="text-muted">{customer.status}</span>
      </p>
      <section className="mt-5">
        <h4 className="text-sm font-medium">Previous orders</h4>
        {customer.orders.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No product orders. Earlier contact was an appointment.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {customer.orders.map((order) => (
              <li key={order.id} className="text-sm">
                {order.id}
                <span className="mt-0.5 block text-muted">
                  {order.label} · {order.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-5">
        <h4 className="text-sm font-medium">Previous support tickets</h4>
        {tickets.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No tickets yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="text-sm">
                {ticket.id}
                <span className="mt-0.5 block text-muted">
                  {ticket.subject} · {ticket.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-5">
        <h4 className="text-sm font-medium">Recent activity</h4>
        <ul className="mt-2 space-y-2">
          {customer.activity.map((item) => (
            <li key={`${item.date}-${item.label}`} className="text-sm">
              {item.label}
              <span className="mt-0.5 block text-muted">{item.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function Customers({
  selectedId,
  tickets,
  onSelect,
}: {
  selectedId: string;
  tickets: SupportTicket[];
  onSelect: (id: string) => void;
}) {
  const customer = supportCustomers.find((item) => item.id === selectedId) ?? supportCustomers[0];
  const related = tickets.filter((ticket) => ticket.customerId === customer.id);
  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="border-b border-line lg:border-r lg:border-b-0">
        <div className="px-4 py-4">
          <h2 className="text-xl font-medium tracking-tight">Customers</h2>
          <p className="mt-1 text-sm text-muted">Fictional accounts used by this demo.</p>
        </div>
        <ul>
          {supportCustomers.map((person) => (
            <li key={person.id} className="border-t border-line">
              <button
                type="button"
                onClick={() => onSelect(person.id)}
                className={cn("flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left", person.id === customer.id && "bg-white/[0.04]")}
              >
                <span>
                  <span className="block text-sm font-medium">{person.name}</span>
                  <span className="block text-sm text-muted">{person.email}</span>
                </span>
                <Pill>{person.status}</Pill>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Profile customer={customer} tickets={related} />
    </div>
  );
}

function Knowledge({
  query,
  openId,
  onQuery,
  onOpen,
}: {
  query: string;
  openId: string | null;
  onQuery: (value: string) => void;
  onOpen: (id: string | null) => void;
}) {
  const results = searchArticles(query);
  const open = results.find((article) => article.id === openId) ?? null;
  return (
    <div className="px-4 py-4 md:px-6">
      <h2 className="text-xl font-medium tracking-tight">Knowledge Base</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Articles the local reply uses when a conversation matches. Search stays in the browser.
      </p>
      <label className="mt-4 block max-w-md text-sm text-muted" htmlFor="kb-search">
        Search
        <input
          id="kb-search"
          value={query}
          onChange={(event) => {
            onQuery(event.target.value);
            onOpen(null);
          }}
          placeholder="Refund, shipping, appointment…"
          className="mt-2 h-11 w-full rounded-xl border border-line bg-[#0d1016] px-3 text-sm text-foreground"
        />
      </label>
      {open ? (
        <article className="mt-4 rounded-xl border border-line p-4">
          <button type="button" onClick={() => onOpen(null)} className="text-sm text-muted">
            All articles
          </button>
          <h3 className="mt-3 text-lg font-medium">{open.title}</h3>
          <p className="mt-1 text-xs text-muted">{open.category}</p>
          <p className="mt-3 text-sm leading-relaxed">{open.summary}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{open.facts.en}</p>
        </article>
      ) : (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {results.length === 0 ? <li className="text-sm text-muted">No article matches that search.</li> : null}
          {results.map((article) => (
            <li key={article.id}>
              <button type="button" onClick={() => onOpen(article.id)} className="h-full w-full rounded-xl border border-line p-4 text-left hover:bg-white/[0.03]">
                <span className="text-sm font-medium">{article.title}</span>
                <span className="mt-1 block text-xs text-muted">{article.category}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">{article.summary}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tickets({ tickets, onStatus }: { tickets: SupportTicket[]; onStatus: (id: string, status: TicketStatus) => void }) {
  return (
    <div className="px-4 py-4 md:px-6">
      <h2 className="text-xl font-medium tracking-tight">Tickets</h2>
      <p className="mt-1 text-sm text-muted">Sample cases already on the board. Status changes stay in this browser.</p>
      <ul className="mt-4 space-y-3">
        {tickets.map((ticket) => {
          const customer = customerById(ticket.customerId);
          return (
            <li key={ticket.id} className="rounded-xl border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-muted">{ticket.id}</p>
                  <h3 className="mt-1 text-base font-medium">{ticket.subject}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {customer.name} · {ticket.category} · {ticket.priority} · {ticket.agent}
                  </p>
                  <p className="mt-1 text-xs text-muted">Created {ticket.created}</p>
                </div>
                <label className="text-xs text-muted">
                  Status
                  <select
                    value={ticket.status}
                    onChange={(event) => onStatus(ticket.id, event.target.value as TicketStatus)}
                    className="mt-1 block h-11 rounded-lg border border-line bg-[#0d1016] px-3 text-sm text-foreground"
                  >
                    {ticketStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Analytics({ tickets }: { tickets: SupportTicket[] }) {
  const openTickets = tickets.filter((ticket) => ticket.status === "Open").length;
  const categoryMax = Math.max(...supportAnalytics.categories.map((item) => item.count));
  const volumeMax = Math.max(...supportAnalytics.volume.map((item) => item.count));
  return (
    <div className="px-4 py-4 md:px-6">
      <h2 className="text-xl font-medium tracking-tight">Analytics</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Fictional 30-day sample, already loaded. Open tickets follow the cases in this demo.
      </p>
      <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Total conversations", String(supportAnalytics.totalConversations)],
          ["Open tickets", String(openTickets)],
          ["Average response time", supportAnalytics.averageResponse],
          ["Resolution rate", supportAnalytics.resolutionRate],
          ["Escalation rate", supportAnalytics.escalationRate],
          ["Customer satisfaction", supportAnalytics.satisfaction],
        ].map(([label, value]) => (
          <div key={label} className="bg-[#0d1016] px-4 py-4">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-2 font-mono text-2xl tracking-tight">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section>
          <h3 className="text-sm font-medium">Conversations by category</h3>
          <ul className="mt-3 space-y-2">
            {supportAnalytics.categories.map((item) => (
              <li key={item.label}>
                <div className="flex justify-between text-xs text-muted">
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-accent/80" style={{ width: `${(item.count / categoryMax) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-sm font-medium">Ticket volume over time</h3>
          <div className="mt-3 flex h-36 items-end gap-2">
            {supportAnalytics.volume.map((item) => (
              <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
                <div className="rounded-sm bg-accent/75" style={{ height: `${Math.max(8, (item.count / volumeMax) * 100)}%` }} />
                <span className="mt-2 text-center font-mono text-[10px] text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6">
        <h3 className="text-sm font-medium">Agent performance</h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {supportAnalytics.agents.map((agent) => (
            <li key={agent.name} className="rounded-xl border border-line p-4">
              <p className="text-sm font-medium">{agent.name}</p>
              <p className="mt-2 text-sm text-muted">{agent.resolved} resolved</p>
              <p className="text-sm text-muted">Satisfaction {agent.satisfaction}</p>
              <p className="text-sm text-muted">Response {agent.response}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function DemoSettings() {
  return (
    <div className="max-w-2xl px-4 py-4 md:px-6">
      <h2 className="text-xl font-medium tracking-tight">Settings</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        This is a portfolio demo of a support product. Conversations, customers, articles, tickets, and analytics are fictional sample data. Suggested replies are chosen by local rules in the browser. No external AI API is called, and nothing is sent to a real customer.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        <li>Languages in the suggestion: English, German, and Arabic, following the customer message.</li>
        <li>Agents named in the sample are fictional.</li>
        <li>Changing a ticket status or sending a reply lasts for this browser session only.</li>
      </ul>
    </div>
  );
}

function Pill({ children }: { children: string }) {
  return <span className="inline-flex rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">{children}</span>;
}
