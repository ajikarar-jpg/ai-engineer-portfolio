import { portfolioKnowledge } from "@/data/portfolioKnowledge";
import type {
  AssistantLanguage,
  AssistantReply,
  ConversationStage,
  ConversationState,
  DiscoveryStep,
  ProjectBrief,
} from "@/lib/portfolioAssistantTypes";
import type { IntentResult } from "@/lib/portfolio/intentEngine";
import { detectLanguage, looksLikeQuestion, normalizeQuestion } from "@/lib/portfolio/languageDetector";
import { cardFor, rankProjects, serviceIdForProject, type ProjectMatch } from "@/lib/portfolio/recommendationEngine";

const hardInterrupt = new Set([
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

const stagePack: Record<Exclude<ConversationStage, "idle">, Record<AssistantLanguage, { kicker: string; line: string }>> = {
  discovery: {
    en: { kicker: "Project discovery", line: "Let's understand your idea." },
    de: { kicker: "Projektklärung", line: "Lass uns die Idee verstehen." },
    ar: { kicker: "فهم المشروع", line: "خلّينا نفهم الفكرة." },
  },
  understanding: {
    en: { kicker: "Understanding", line: "What the system should do." },
    de: { kicker: "Verstehen", line: "Was das System tun soll." },
    ar: { kicker: "الفهم", line: "ما الذي يجب أن يفعله النظام." },
  },
  recommendation: {
    en: { kicker: "Recommendation", line: "The closest fit on this portfolio." },
    de: { kicker: "Empfehlung", line: "Die nächste Entsprechung auf dieser Seite." },
    ar: { kicker: "الاقتراح", line: "الأقرب مما هو موجود في الموقع." },
  },
  qualification: {
    en: { kicker: "Qualification", line: "A few details about the work." },
    de: { kicker: "Einordnung", line: "Ein paar Angaben zur Arbeit." },
    ar: { kicker: "التفاصيل", line: "بعض التفاصيل عن العمل." },
  },
  contact: {
    en: { kicker: "Next step", line: "Contact me when you are ready." },
    de: { kicker: "Nächster Schritt", line: "Schreib mir, wenn du soweit bist." },
    ar: { kicker: "الخطوة التالية", line: "تواصل معي عندما تكون جاهزاً." },
  },
};

function tr(language: AssistantLanguage, pack: Record<AssistantLanguage, string>) {
  return pack[language];
}

export function stageCopy(stage: ConversationStage, language: AssistantLanguage) {
  if (stage === "idle") return null;
  return stagePack[stage][language];
}

export function shouldContinueDiscovery(question: string, result: IntentResult, state: ConversationState) {
  if (!state.discoveryStep) return false;
  if (result.intent === "START_PROJECT") return true;
  if (!hardInterrupt.has(result.intent)) return true;
  const score = result.scores.find((item) => item.intent === result.intent)?.score ?? 0;
  if (score < 0.7) return true;
  if (result.intent === "GREETING" || result.intent === "CONTACT" || result.asking || looksLikeQuestion(normalizeQuestion(question), question)) {
    return false;
  }
  return true;
}

function payload(normalized: string) {
  return normalized
    .replace(/how do i start a project/g, " ")
    .replace(/i would like to build/g, " ")
    .replace(/id like to build/g, " ")
    .replace(/i want to build/g, " ")
    .replace(/i want to hire you to/g, " ")
    .replace(/i want to hire you/g, " ")
    .replace(/i want to hire/g, " ")
    .replace(/hire you/g, " ")
    .replace(/i have a project/g, " ")
    .replace(/start a project/g, " ")
    .replace(/work together/g, " ")
    .replace(/lets work/g, " ")
    .replace(/بدي اعمل/g, " ")
    .replace(/بدي نظام/g, " ")
    .replace(/اريد بناء/g, " ")
    .replace(/ich moechte bauen/g, " ")
    .replace(/ich will bauen/g, " ")
    .replace(/projekt starten/g, " ")
    .replace(/\b(a|an|the|ein|eine|einen|bitte)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includes(text: string, words: readonly string[]) {
  return words.some((word) => {
    const normalized = normalizeQuestion(word);
    if (!normalized) return false;
    if (normalized.includes(" ")) return text.includes(normalized);
    return text.split(" ").includes(normalized);
  });
}

function domainOf(text: string) {
  if (includes(text, ["sales", "revenue", "umsatz", "مبيعات", "orders"])) return "sales" as const;
  if (includes(text, ["logistics", "logistic", "delivery", "deliveries", "lieferung", "zustellung", "logistik", "توصيل", "لوجست"])) {
    return "logistics" as const;
  }
  if (includes(text, ["lead", "leads", "anfrage", "anfragen", "crm"])) return "leads" as const;
  return null;
}

function projectLabelFor(text: string, language: AssistantLanguage) {
  const dashboard = includes(text, ["dashboard", "dashboards", "analytics", "kpi", "لوحة", "لوحه"]);
  const domain = domainOf(text);
  if (dashboard) {
    return tr(language, {
      en: "AI-powered business dashboard",
      de: "KI-Dashboard für Geschäftsdaten",
      ar: "لوحة أعمال بالذكاء الاصطناعي",
    });
  }
  if (domain === "leads") {
    return tr(language, {
      en: "AI lead system",
      de: "KI-System für Anfragen",
      ar: "نظام ذكاء اصطناعي للطلبات",
    });
  }
  if (domain === "logistics") {
    return tr(language, {
      en: "Delivery intelligence system",
      de: "System für Zustellentscheidungen",
      ar: "نظام ذكاء للتوصيل",
    });
  }
  if (includes(text, ["support", "helpdesk", "ticket", "tickets", "kundenservice", "دعم", "تذاكر", "خدمه"])) {
    return tr(language, {
      en: "Customer support platform",
      de: "Kundensupport-Plattform",
      ar: "منصة دعم العملاء",
    });
  }
  if (includes(text, ["appointment", "booking", "schedule", "termin", "buchung", "حجز", "مواعيد", "موعد"])) {
    return tr(language, {
      en: "Appointment booking platform",
      de: "Terminbuchungsplattform",
      ar: "منصة حجز مواعيد",
    });
  }
  if (includes(text, ["agent", "chatgpt", "assistant", "وكيل"])) {
    return tr(language, {
      en: "AI agent platform",
      de: "KI-Agenten-Plattform",
      ar: "منصة وكيل ذكاء",
    });
  }
  if (includes(text, ["store", "shop", "ecommerce", "onlineshop", "متجر", "كتروني", "اتمته"])) {
    if (includes(text, ["store", "shop", "ecommerce", "onlineshop", "متجر", "كتروني"])) {
      return tr(language, {
        en: "E-commerce platform",
        de: "E-Commerce-Plattform",
        ar: "منصة تجارة إلكترونية",
      });
    }
  }
  if (includes(text, ["automation", "automate", "workflow", "automatisierung", "automatisieren", "اتمته"])) {
    return tr(language, {
      en: "Workflow automation system",
      de: "System für Geschäftsautomatisierung",
      ar: "نظام أتمتة للأعمال",
    });
  }
  if (includes(text, ["ai", "artificial", "ذكاء", "ki"])) {
    return tr(language, {
      en: "Custom AI system",
      de: "Individuelles KI-System",
      ar: "نظام ذكاء اصطناعي مخصص",
    });
  }
  return undefined;
}

function goalFor(domain: ReturnType<typeof domainOf>, language: AssistantLanguage) {
  if (domain === "sales") {
    return tr(language, {
      en: "Analyze sales data",
      de: "Umsatzdaten auswerten",
      ar: "تحليل بيانات المبيعات",
    });
  }
  if (domain === "logistics") {
    return tr(language, {
      en: "Predict delivery success and recipient availability",
      de: "Zustellerfolg und Erreichbarkeit einschätzen",
      ar: "تقدير نجاح التوصيل وتوفر المستلم",
    });
  }
  if (domain === "leads") {
    return tr(language, {
      en: "Prioritize incoming leads",
      de: "Eingehende Anfragen priorisieren",
      ar: "ترتيب الطلبات الواردة حسب الأولوية",
    });
  }
  return undefined;
}

function readData(text: string, language: AssistantLanguage) {
  const parts: string[] = [];
  const add = (ok: boolean, label: string) => {
    if (ok) parts.push(label);
  };
  add(/\bcsv\b/.test(text), tr(language, { en: "CSV files", de: "CSV-Dateien", ar: "ملفات CSV" }));
  add(/\b(excel|xlsx)\b/.test(text), tr(language, { en: "Excel files", de: "Excel-Dateien", ar: "ملفات Excel" }));
  add(
    /\b(database|postgres|sql|datenbank)\b/.test(text) || text.includes("قاعده بيانات") || text.includes("قاعدة"),
    tr(language, { en: "Database", de: "Datenbank", ar: "قاعدة بيانات" }),
  );
  add(/\bapi\b/.test(text), "API");
  add(
    /\b(spreadsheet|google sheets|google sheet)\b/.test(text),
    tr(language, { en: "Spreadsheets", de: "Tabellen", ar: "جداول" }),
  );
  if (parts.length > 0) return parts.join(", ");
  if (
    /\b(no data|dont have|do not have|keine daten|noch keine)\b/.test(text) ||
    text.includes("ما عندي") ||
    text.includes("لا توجد")
  ) {
    return tr(language, { en: "Not available yet", de: "Noch nicht vorhanden", ar: "غير متوفرة بعد" });
  }
  return null;
}

function readUsers(text: string, language: AssistantLanguage) {
  if (/\b(not sure|unknown|dont know|keine ahnung|weiss nicht|weiß nicht)\b/.test(text) || text.includes("لا اعرف") || text.includes("مو متاكد")) {
    return tr(language, { en: "Not specified yet", de: "Noch offen", ar: "غير محدد بعد" });
  }
  if (/\b(internal team|my team|our team|internes team|internen team)\b/.test(text) || text.includes("فريق")) {
    return tr(language, { en: "Internal team", de: "Internes Team", ar: "فريق داخلي" });
  }
  const num = text.match(/\b(\d{1,6})\b/);
  if (num && (/\b(user|users|people|person|team|nutzer|personen)\b/.test(text) || text.trim() === num[1] || text.includes("شخص") || text.includes("مستخدم"))) {
    return tr(language, {
      en: `${num[1]} people`,
      de: `${num[1]} Personen`,
      ar: `${num[1]} أشخاص`,
    });
  }
  return null;
}

function clip(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > 180 ? `${clean.slice(0, 177)}...` : clean;
}

function extract(original: string, language: AssistantLanguage): ProjectBrief & { vague: boolean } {
  const text = normalizeQuestion(original);
  const domain = domainOf(text);
  const projectLabel = projectLabelFor(text, language);
  const goal = goalFor(domain, language);
  const dataSource = readData(text, language) ?? undefined;
  const users = readUsers(text, language) ?? undefined;
  const industry =
    domain === "sales"
      ? tr(language, { en: "Sales", de: "Vertrieb", ar: "المبيعات" })
      : domain === "logistics"
        ? tr(language, { en: "Logistics", de: "Logistik", ar: "الخدمات اللوجستية" })
        : domain === "leads"
          ? tr(language, { en: "Inbound leads", de: "Eingehende Anfragen", ar: "الطلبات الواردة" })
          : undefined;
  const budget = /\b(budget|preisrahmen)\b/.test(text) || text.includes("ميزانيه") || text.includes("ميزانية") ? clip(original) : undefined;
  const timeline = /\b(timeline|deadline|asap|next month)\b/.test(text) || text.includes("هذا الشهر") ? clip(original) : undefined;
  const vague = !goal && !domain;
  return { projectLabel, goal, dataSource, users, industry, budget, timeline, vague };
}

function mergeBrief(current: ProjectBrief, next: ProjectBrief) {
  return {
    ...current,
    ...Object.fromEntries(Object.entries(next).filter(([, value]) => value !== undefined)),
  } as ProjectBrief;
}

function isDashboardLabel(label?: string) {
  if (!label) return false;
  const text = normalizeQuestion(label);
  return text.includes("dashboard") || text.includes("لوحه") || text.includes("analyt") || text.includes("kennzahl");
}

function wantsHandoff(text: string) {
  return (
    /\b(email me|contact you|just email|thats enough|that is enough|im ready|i am ready|lets talk|ready to talk)\b/.test(text) ||
    text.includes("راسلني") ||
    text.includes("تواصل معي")
  );
}

function hasContent(brief: ProjectBrief) {
  return Boolean(brief.goal || brief.projectLabel || brief.dataSource || brief.users);
}

export function inquiryMailto(brief: ProjectBrief, language: AssistantLanguage) {
  const labels = {
    en: ["Project", "Goal", "Data", "Users"],
    de: ["Projekt", "Ziel", "Daten", "Nutzer"],
    ar: ["المشروع", "الهدف", "البيانات", "المستخدمون"],
  }[language];
  const values = [brief.projectLabel, brief.goal, brief.dataSource, brief.users];
  const body = values
    .map((value, index) => (value ? `${labels[index]}: ${value}` : ""))
    .filter(Boolean)
    .join("\n");
  const query = [`subject=${encodeURIComponent(portfolioKnowledge.contact.subject)}`];
  if (body) query.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${portfolioKnowledge.contact.email}?${query.join("&")}`;
}

function emailAction(brief: ProjectBrief, language: AssistantLanguage) {
  return {
    label: tr(language, { en: "Email me", de: "E-Mail", ar: "البريد" }),
    href: inquiryMailto(brief, language),
  };
}

function viewAction(language: AssistantLanguage, href: string) {
  return {
    label: tr(language, { en: "View project", de: "Projekt ansehen", ar: "عرض المشروع" }),
    href,
  };
}

function fitSentence(matches: ProjectMatch[], language: AssistantLanguage) {
  const [first] = matches;
  if (!first || first.score < 0.4) {
    return tr(language, {
      en: "Custom software is the listed service for a system built around a specific workflow.",
      de: "Individuelle Software ist die aufgeführte Leistung für ein System um einen konkreten Ablauf.",
      ar: "البرمجيات المخصصة هي الخدمة المذكورة لنظام يُبنى حول سير عمل محدد.",
    });
  }
  return tr(language, {
    en: `${first.project.name} is the closest match on this portfolio, ${first.project.why.en}.`,
    de: `${first.project.name} ist die nächste Entsprechung auf dieser Seite, ${first.project.why.de}.`,
    ar: `${first.project.name} هو الأقرب في هذا الموقع، ${first.project.why.ar}.`,
  });
}

function briefText(brief: ProjectBrief) {
  return [brief.projectLabel, brief.goal, brief.industry, brief.dataSource].filter(Boolean).join(" ");
}

function question(language: AssistantLanguage, step: DiscoveryStep, brief: ProjectBrief) {
  if (step === "goal") {
    return tr(language, {
      en: "Great. What are you looking to build?",
      de: "Gut. Was möchtest du bauen?",
      ar: "تمام. ما الذي تريد بناءه؟",
    });
  }
  if (step === "subject") {
    if (isDashboardLabel(brief.projectLabel)) {
      return tr(language, {
        en: "Absolutely. I can help you figure out the right system.\n\nWhat would you like the dashboard to analyze?",
        de: "Ja. Dann grenzen wir das System ein.\n\nWas soll das Dashboard auswerten?",
        ar: "حاضر. نحدد النظام المناسب.\n\nما الذي تريد أن تحلّله اللوحة؟",
      });
    }
    return tr(language, {
      en: "What should the system actually do?",
      de: "Was soll das System konkret tun?",
      ar: "ما الذي يجب أن يفعله النظام فعلياً؟",
    });
  }
  if (step === "users") {
    return tr(language, {
      en: "Approximately how many users would need access to it?",
      de: "Wie viele Personen brauchen ungefähr Zugriff?",
      ar: "كم عدد الأشخاص الذين سيحتاجون إلى الوصول تقريباً؟",
    });
  }
  return tr(language, {
    en: "Do you already have the data available, such as CSV, Excel, a database, or an API?",
    de: "Liegen die Daten schon vor, zum Beispiel als CSV, Excel, Datenbank oder API?",
    ar: "هل البيانات متوفرة، مثل CSV أو Excel أو قاعدة بيانات أو API؟",
  });
}

function stageFor(step: DiscoveryStep, pitched: boolean): ConversationStage {
  if (step === "goal") return "discovery";
  if (step === "subject") return "understanding";
  if (step === "data") return pitched ? "qualification" : "recommendation";
  if (step === "users") return "qualification";
  return "contact";
}

function summarize(state: ConversationState, language: AssistantLanguage): { reply: AssistantReply; state: ConversationState } {
  const brief = state.brief;
  const labels = {
    en: ["Project", "Goal", "Data", "Users", "Budget", "Timeline"],
    de: ["Projekt", "Ziel", "Daten", "Nutzer", "Budget", "Zeitrahmen"],
    ar: ["المشروع", "الهدف", "البيانات", "المستخدمون", "الميزانية", "الجدول"],
  }[language];
  const values = [brief.projectLabel, brief.goal, brief.dataSource, brief.users, brief.budget, brief.timeline];
  const lines = [
    tr(language, {
      en: "Here's what I understand:",
      de: "So habe ich es verstanden:",
      ar: "هذا ما فهمته:",
    }),
    "",
  ];
  values.forEach((value, index) => {
    if (!value) return;
    lines.push(`${labels[index]}:`);
    lines.push(value);
    lines.push("");
  });
  const matches = rankProjects(briefText(brief));
  if (!state.pitched) {
    lines.push(fitSentence(matches, language));
    lines.push("");
  }
  lines.push(
    tr(language, {
      en: "Based on this, I can help design and build a system around these requirements.",
      de: "Darauf kann ich ein System um diese Anforderungen entwerfen und bauen.",
      ar: "بناءً على ذلك أقدر أساعد في تصميم نظام حول هذه المتطلبات وبنائه.",
    }),
  );
  lines.push("");
  lines.push(
    tr(language, {
      en: "I've summarized what you've described. The next step is to contact me directly.",
      de: "Das ist die Zusammenfassung. Der nächste Schritt ist, mich direkt zu kontaktieren.",
      ar: "لخّصت ما وصفته. الخطوة التالية هي التواصل معي مباشرة.",
    }),
  );
  const top = matches[0]?.score >= 0.4 ? matches[0].project : null;
  return {
    reply: {
      text: lines.join("\n").trim(),
      actions: [emailAction(brief, language)],
      cards: top ? [cardFor(top, language)] : [],
    },
    state: {
      ...state,
      language,
      currentIntent: "START_PROJECT",
      conversationStage: "contact",
      discoveryStep: null,
      pitched: true,
      userGoal: brief.goal ?? brief.projectLabel ?? state.userGoal,
      mentionedProject: top?.slug ?? state.mentionedProject,
      mentionedService: (top && serviceIdForProject(top.slug)) ?? state.mentionedService,
      lastSuggestionKey: state.lastSuggestionKey,
    },
  };
}

function ask(
  state: ConversationState,
  language: AssistantLanguage,
  step: Exclude<DiscoveryStep, null>,
  extra?: string,
): { reply: AssistantReply; state: ConversationState } {
  const pitched = step === "data" ? true : state.pitched;
  const body = question(language, step, state.brief);
  const matches = rankProjects(briefText(state.brief));
  const showFit = step === "data" && !state.pitched;
  const top = showFit && matches[0] && matches[0].score >= 0.4 ? matches[0].project : null;
  const intro = showFit
    ? tr(language, { en: "Got it.", de: "Verstanden.", ar: "تمام." })
    : "";
  const text = [extra, intro && showFit ? `${intro} ${fitSentence(matches, language)}` : "", body].filter(Boolean).join("\n\n");
  return {
    reply: {
      text,
      actions: top ? [viewAction(language, top.href)] : [],
      cards: top ? [cardFor(top, language)] : [],
    },
    state: {
      ...state,
      language,
      currentIntent: "START_PROJECT",
      conversationStage: stageFor(step, state.pitched),
      discoveryStep: step,
      pitched,
      userGoal: state.brief.goal ?? state.brief.projectLabel ?? state.userGoal,
      mentionedProject: top?.slug ?? state.mentionedProject,
      mentionedService: (top && serviceIdForProject(top.slug)) ?? state.mentionedService,
    },
  };
}

function promptNext(state: ConversationState, language: AssistantLanguage, preface?: string) {
  const brief = state.brief;
  const specific = brief.projectLabel
    ? /lead|delivery|zustell|توصيل|logistik/.test(normalizeQuestion(brief.projectLabel))
    : false;
  const vague = !brief.goal && !specific;
  if (!brief.projectLabel && !brief.goal) return ask(state, language, "goal", preface);
  if (vague && !brief.goal) return ask(state, language, "subject", preface);
  if (!brief.dataSource) return ask(state, language, "data", preface);
  if (!brief.users) return ask(state, language, "users", preface);
  return summarize(state, language);
}

function absorb(step: DiscoveryStep, original: string, state: ConversationState): ProjectBrief {
  const language = detectLanguage(original, normalizeQuestion(original));
  const found = extract(original, language);
  const text = normalizeQuestion(original);
  if (step === "data") {
    return mergeBrief(state.brief, {
      dataSource: found.dataSource ?? clip(original),
      users: found.users,
      budget: found.budget,
      timeline: found.timeline,
    });
  }
  if (step === "users") {
    return mergeBrief(state.brief, {
      users: found.users ?? clip(original),
      dataSource: found.dataSource,
      budget: found.budget,
      timeline: found.timeline,
    });
  }
  const stripped = payload(text);
  const unmatched = !found.goal && !found.projectLabel && (step === "goal" || step === "subject" || step === null);
  return mergeBrief(state.brief, {
    projectLabel: found.projectLabel ?? state.brief.projectLabel,
    goal: found.goal ?? (step === "subject" || unmatched ? clip(original) : stripped.length > 24 ? clip(original) : undefined),
    industry: found.industry,
    dataSource: found.dataSource ?? state.brief.dataSource,
    users: found.users ?? state.brief.users,
    budget: found.budget,
    timeline: found.timeline,
  });
}

export function openDiscovery(prev: ConversationState): { reply: AssistantReply; state: ConversationState } {
  const language = prev.language;
  const state: ConversationState = { ...prev, language, brief: { ...prev.brief }, currentIntent: "START_PROJECT" };
  if (prev.brief.goal || prev.brief.projectLabel) return promptNext(state, language);
  return ask(state, language, "goal");
}

export function continueDiscovery(question: string, prev: ConversationState): { reply: AssistantReply; state: ConversationState } {
  const language = detectLanguage(question, normalizeQuestion(question));
  const normalized = normalizeQuestion(question);
  const state: ConversationState = { ...prev, language, brief: { ...prev.brief } };
  if (wantsHandoff(normalized)) {
    if (hasContent(state.brief)) return summarize(state, language);
  }
  const brief = absorb(prev.discoveryStep, question, state);
  return promptNext({ ...state, brief }, language, undefined);
}

export function startFromUtterance(
  question: string,
  prev: ConversationState,
  language: AssistantLanguage,
): { reply: AssistantReply; state: ConversationState } {
  const normalized = normalizeQuestion(question);
  if (payload(normalized).length < 3) return openDiscovery({ ...prev, language });
  return continueDiscovery(question, {
    ...prev,
    language,
    currentIntent: "START_PROJECT",
    conversationStage: "discovery",
    discoveryStep: "goal",
    brief: { ...prev.brief },
  });
}

export function finishIfReady(prev: ConversationState, language: AssistantLanguage) {
  if (!hasContent(prev.brief)) return null;
  return summarize({ ...prev, language, brief: { ...prev.brief } }, language);
}
