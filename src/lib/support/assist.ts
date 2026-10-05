import type { SupportArticle, SupportCustomer } from "@/data/supportDesk";
import { supportArticles } from "@/data/supportDesk";
import type { AssistantLanguage } from "@/lib/portfolioAssistantTypes";
import { detectLanguage, normalizeQuestion } from "@/lib/portfolio/languageDetector";

export type SupportIntent = "Refund" | "Delivery" | "Payment" | "Appointment" | "Account" | "Order" | "Problem" | "General";
export type PriorityLevel = "Low" | "Medium" | "High";

export type SupportAnalysis = {
  language: AssistantLanguage;
  intent: SupportIntent;
  priority: PriorityLevel;
  score: number;
  article: SupportArticle;
  reply: string;
};

const typos: Record<string, string> = {
  refud: "refund",
  refunde: "refund",
  refundd: "refund",
  mony: "money",
  delivry: "delivery",
  delivary: "delivery",
  shiping: "shipping",
  shippment: "shipment",
  apoitment: "appointment",
  apointment: "appointment",
  appointmnt: "appointment",
  passwrd: "password",
  passord: "password",
  paymet: "payment",
  chargd: "charged",
  pakage: "package",
  reciept: "receipt",
  zurueck: "refund",
  zuruck: "refund",
};

const groups: { intent: SupportIntent; words: readonly string[] }[] = [
  { intent: "Refund", words: ["refund", "money back", "erstattung", "ruckerstattung", "erstatt", "geld zuruck", "استرداد", "استرجاع", "فلوس", "ارجاع"] },
  { intent: "Delivery", words: ["delivery", "shipping", "package", "shipment", "parcel", "tracking", "lieferung", "versand", "paket", "توصيل", "شحن", "طرد", "يوصل"] },
  { intent: "Payment", words: ["payment", "card", "charged", "charge", "billing", "zahlung", "karte", "belastet", "دفع", "بطاقه", "خصم"] },
  { intent: "Appointment", words: ["appointment", "booking", "reschedule", "termin", "buchung", "verschieben", "موعد", "حجز"] },
  { intent: "Account", words: ["login", "password", "account", "sign in", "passwort", "konto", "anmelden", "حساب", "دخول", "كلمه المرور", "كلمه"] },
  { intent: "Order", words: ["order", "bestellung", "طلب", "طلبي"] },
  { intent: "Problem", words: ["problem", "broken", "damaged", "issue", "not working", "fehler", "defekt", "مشكله", "عطل", "تالف"] },
];

const articleForIntent: Record<SupportIntent, string> = {
  Refund: "returns",
  Delivery: "shipping",
  Payment: "payments",
  Appointment: "appointments",
  Account: "account",
  Order: "shipping",
  Problem: "faq",
  General: "faq",
};

const intentLabel: Record<AssistantLanguage, Record<SupportIntent, string>> = {
  en: {
    Refund: "refund",
    Delivery: "delivery",
    Payment: "payment",
    Appointment: "appointment",
    Account: "account",
    Order: "order",
    Problem: "product problem",
    General: "support",
  },
  de: {
    Refund: "Erstattung",
    Delivery: "Lieferung",
    Payment: "Zahlung",
    Appointment: "Termin",
    Account: "Konto",
    Order: "Bestellung",
    Problem: "Produktproblem",
    General: "Anfrage",
  },
  ar: {
    Refund: "استرداد",
    Delivery: "توصيل",
    Payment: "دفع",
    Appointment: "موعد",
    Account: "حساب",
    Order: "طلب",
    Problem: "مشكلة في المنتج",
    General: "استفسار",
  },
};

const germanHints = [
  "erstatt",
  "lieferung",
  "versand",
  "paket",
  "termin",
  "passwort",
  "konto",
  "bestellung",
  "zahlung",
  "verschieb",
  "moechte",
  "nicht",
  "karte",
];

function prepare(text: string) {
  return normalizeQuestion(text)
    .split(" ")
    .map((token) => typos[token] ?? token)
    .join(" ");
}

function hits(text: string, words: readonly string[]) {
  return words.reduce((count, word) => count + (text.includes(normalizeQuestion(word)) ? 1 : 0), 0);
}

export function detectSupportLanguage(original: string): AssistantLanguage {
  const normalized = normalizeQuestion(original);
  const detected = detectLanguage(original, normalized);
  if (detected !== "en") return detected;
  if (germanHints.some((hint) => normalized.includes(hint)) || normalized.includes("zuruck")) return "de";
  return "en";
}

export function detectSupportIntent(original: string): SupportIntent {
  const text = prepare(original);
  const scored = groups
    .map((group) => ({ intent: group.intent, score: hits(text, group.words) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || groups.findIndex((group) => group.intent === a.intent) - groups.findIndex((group) => group.intent === b.intent));
  const top = scored[0];
  if (!top) return "General";
  if (top.intent === "Problem" || top.intent === "Order") {
    const specific = scored.find((item) => item.intent !== "Problem" && item.intent !== "Order");
    if (specific && specific.score >= top.score) return specific.intent;
  }
  return top.intent;
}

export function priorityFor(original: string, intent: SupportIntent, customer: SupportCustomer) {
  const text = prepare(original);
  let score = 1;
  if (intent === "Refund" || intent === "Payment") score += 2;
  if (intent === "Account" || intent === "Problem" || intent === "Appointment") score += 1;
  if (/(refund|money back|erstatt)/.test(text)) score += 1;
  if (/(urgent|asap|angry|immediately|sofort|dringend|عاجل|فورا)/.test(text)) score += 3;
  if (/(late|delayed|missing|lost|verspaetet|verzoegert|متاخر|تاخر)/.test(text)) score += 2;
  if (/(twice|double|doppelt|مرتين)/.test(text)) score += 2;
  if (/(broken|damaged|defekt|تالف)/.test(text)) score += 2;
  if (customer.status === "VIP") score += 1;
  const priority: PriorityLevel = score >= 5 ? "High" : score >= 3 ? "Medium" : "Low";
  return { priority, score };
}

function matchArticle(original: string, intent: SupportIntent) {
  const text = prepare(original);
  const ranked = supportArticles
    .map((article) => ({ article, score: hits(text, article.keywords) }))
    .sort((a, b) => b.score - a.score);
  if (ranked[0] && ranked[0].score > 0) return ranked[0].article;
  return supportArticles.find((article) => article.id === articleForIntent[intent]) ?? supportArticles[0];
}

function contextLine(language: AssistantLanguage, customer: SupportCustomer) {
  const order = customer.orders[0];
  if (!order) {
    if (language === "de") return "Im Profil liegt kein Produktauftrag, nur frühere Termine.";
    if (language === "ar") return "لا يوجد طلب منتج في الملف، فقط مواعيد سابقة.";
    return "The profile has no product order, only earlier appointments.";
  }
  if (language === "de") return `Die letzte Bestellung im Profil ist ${order.id} (${order.label}, ${order.date}).`;
  if (language === "ar") return `آخر طلب في الملف هو ${order.id} (${order.label}، ${order.date}).`;
  return `The latest order on the profile is ${order.id} (${order.label}, ${order.date}).`;
}

function draftReply(language: AssistantLanguage, customer: SupportCustomer, intent: SupportIntent, article: SupportArticle) {
  const label = intentLabel[language][intent];
  const fact = article.facts[language];
  const context = contextLine(language, customer);
  if (language === "de") {
    return `Guten Tag ${customer.name}, hier ist ein Antwortvorschlag zum Thema ${label}. Aus „${article.title}“: ${fact} ${context} Ich kann ein Ticket anlegen oder an eine Person übergeben.`;
  }
  if (language === "ar") {
    return `مرحباً ${customer.name}، هذا اقتراح رد عن ${label}. من مقال «${article.title}»: ${fact} ${context} أقدر أفتح تذكرة أو أحوّل المحادثة إلى موظف.`;
  }
  return `Hi ${customer.name}, here is a suggested reply for this ${label} request. From “${article.title}”: ${fact} ${context} I can open a ticket or escalate this to a person.`;
}

export function analyzeMessage(original: string, customer: SupportCustomer): SupportAnalysis {
  const language = detectSupportLanguage(original);
  const intent = detectSupportIntent(original);
  const { priority, score } = priorityFor(original, intent, customer);
  const article = matchArticle(original, intent);
  return {
    language,
    intent,
    priority,
    score,
    article,
    reply: draftReply(language, customer, intent, article),
  };
}

export function searchArticles(query: string) {
  const text = prepare(query);
  if (!text) return [...supportArticles];
  const tokens = text.split(" ").filter((token) => token.length > 1);
  if (tokens.length === 0) return [...supportArticles];
  return supportArticles.filter((article) => {
    const haystack = prepare(`${article.title} ${article.category} ${article.summary} ${article.facts.en} ${article.facts.de} ${article.facts.ar} ${article.keywords.join(" ")}`);
    return tokens.some((token) => haystack.includes(token));
  });
}
