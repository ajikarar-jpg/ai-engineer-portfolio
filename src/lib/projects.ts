export type FlowStep = {
  title: string;
  detail: string;
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  category: string;
  description: string;
  assistantDescription: string;
  demoType: "interactive";
  features: readonly string[];
  tech: readonly string[];
  problem: string;
  solution?: string;
  approach: string;
  flow: readonly FlowStep[];
};

export const projects: readonly Project[] = [
  {
    slug: "ai-agent-platform",
    index: "01",
    name: "AI Agent Platform",
    category: "AI Applications",
    description:
      "AI-powered conversational agent platform designed to understand requests, maintain context and assist users through intelligent workflows.",
    assistantDescription:
      "Conversational agent demo with context, history, and structured replies. The responses are a local AI simulation, not a call to an external model.",
    demoType: "interactive",
    features: [
      "Conversational AI",
      "Context-aware conversations",
      "Multi-turn interactions",
      "Multi-language support",
      "Local AI simulation",
      "Conversation history",
      "AI-assisted workflows",
      "Developer-style assistance",
    ],
    tech: ["TypeScript", "React", "Next.js", "Local AI simulation"],
    problem:
      "A chat box alone does not show how an agent product holds context, chooses an intent, and turns a request into a next step a team can use.",
    solution:
      "AI Agent Platform is a local conversation product: multiple chats, history, and replies that follow the previous turn.",
    approach:
      "The demo detects intent with local rules, keeps the thread in the browser, and labels itself as a portfolio simulation. It does not call an external model.",
    flow: [
      { title: "Message", detail: "The visitor writes in English, German, or Arabic. Enter sends, Shift+Enter adds a line." },
      { title: "Intent", detail: "Local scoring maps the message to a request such as a store, a dashboard, automation, booking, or code." },
      { title: "Context", detail: "A short answer, such as a product type, stays attached to the question that came before it." },
      { title: "Structured reply", detail: "Some replies include an architecture card or a code sample, with a link to a related project." },
      { title: "History", detail: "Chats can be renamed, cleared, or deleted. Nothing is sent to an external API." },
    ],
  },
  {
    slug: "ai-customer-support",
    index: "02",
    name: "AI Customer Support Platform",
    category: "Customer Support",
    description:
      "AI-powered customer support platform for handling conversations, knowledge, tickets, and support operations.",
    assistantDescription:
      "Support inbox with conversation history, knowledge-base replies, tickets, and escalation. The demo uses fictional data and local rules. It does not call an external model.",
    demoType: "interactive",
    features: [
      "AI customer conversations",
      "Context-aware conversations",
      "Conversation history",
      "Customer profiles",
      "Knowledge base",
      "Knowledge-base search",
      "AI-assisted replies",
      "Suggested replies for support agents",
      "Automatic conversation categorization",
      "Support ticket creation",
      "Ticket status management",
      "Priority detection",
      "Human handoff",
      "Support analytics",
      "Admin dashboard",
      "English, German, and Arabic",
      "Local deterministic AI simulation",
    ],
    tech: ["TypeScript", "React", "Next.js", "Local AI simulation"],
    problem:
      "A support team loses the thread when the question, the policy, and the ticket live in different places. The agent rewrites the same answer, or escalates without a record of why.",
    solution:
      "The product is one inbox: the conversation, the customer, a matched knowledge article, a suggested reply, and a ticket with status and priority. The draft follows the language of the customer message.",
    approach:
      "Local rules detect the intent and a priority score, retrieve one article, and draft a reply from that article plus the customer profile. The demo runs in the browser on fictional data and does not call an external model. A production inbox could keep these screens, store customers and tickets in a database, and put a reviewed model behind the draft, with a person still approving the send and the handoff.",
    flow: [
      { title: "Inbox", detail: "Open a conversation and read the history, the customer status, and the earlier orders." },
      { title: "Intent", detail: "Local rules label a refund, delivery, payment, appointment, account, order, or product problem, then set a priority score." },
      { title: "Knowledge", detail: "The same message is matched to shipping, returns, payments, account, appointments, or the FAQ. Search uses the same articles." },
      { title: "Reply", detail: "A suggested answer is written in English, German, or Arabic. The agent can edit it and send it inside the demo." },
      { title: "Ticket and handoff", detail: "Create a ticket, change its status, or escalate the thread to a person. The demo does not notify a real agent." },
    ],
  },
  {
    slug: "delivery-intelligence",
    index: "03",
    name: "Delivery Intelligence",
    category: "Prediction",
    description:
      "Predict delivery success, understand address patterns, and help drivers make better delivery decisions.",
    assistantDescription:
      "Local scoring that estimates delivery success, recipient availability, and a better delivery window from historical attempts.",
    demoType: "interactive",
    features: [
      "Delivery probability",
      "Address intelligence",
      "Historical analysis",
      "Neighbor receiver patterns",
      "Driver insights",
    ],
    tech: ["Python", "Machine Learning", "FastAPI", "React", "PostgreSQL"],
    problem: "Delivery companies lose time and money when packages require repeated delivery attempts.",
    solution:
      "Delivery Intelligence analyzes historical outcomes to estimate successful delivery windows and identify reliable neighbor receivers.",
    approach:
      "Historical delivery data is converted into address-level signals that help drivers make better delivery decisions.",
    flow: [
      {
        title: "Input",
        detail: "Historical attempts: address, time, outcome, and any note about who received the parcel.",
      },
      {
        title: "Data Processing",
        detail: "Attempts are grouped by address and checked for missing codes or duplicates.",
      },
      {
        title: "AI Analysis",
        detail: "Local scoring reads the address history. It is a portfolio simulation, not a trained production model.",
      },
      {
        title: "Decision Engine",
        detail: "Each stop receives a probability and a reason drawn from that history.",
      },
      {
        title: "Business Action",
        detail: "The dispatcher sees fragile stops before the route goes out and can confirm details first.",
      },
    ],
  },
  {
    slug: "ecommerce-platform",
    index: "04",
    name: "E-commerce Platform",
    category: "E-commerce",
    description:
      "Modern e-commerce platform with product management, shopping cart, checkout flows, customer accounts, order management and business analytics.",
    assistantDescription:
      "Modern e-commerce platform with product management, shopping cart, checkout flows, customer accounts, order management and business analytics.",
    demoType: "interactive",
    features: [
      "Product catalog",
      "Cart and checkout",
      "Customer account",
      "Order management",
      "Admin analytics",
    ],
    tech: ["TypeScript", "React", "Next.js", "Local state"],
    problem:
      "A store needs one place to show products, take an order, and see what sold. Splitting that across a catalog, a cart, and a separate back office makes the first version slower to trust.",
    solution:
      "A single storefront covers the catalog, cart, demo checkout, customer account, and an admin view for products, orders, and revenue.",
    approach:
      "The demo keeps catalog, cart, and orders in the browser. Checkout is labeled as a demo and never asks for payment details.",
    flow: [
      { title: "Catalog", detail: "Products, categories, search, and variants are browsed from local sample data." },
      { title: "Cart", detail: "The visitor adds a variant, changes quantity, and sees the total update." },
      { title: "Checkout", detail: "Demo checkout collects a name and address only. No payment is taken." },
      { title: "Account", detail: "The order appears in the customer history." },
      { title: "Admin", detail: "Product stock, order status, and revenue stay visible in the same demo." },
    ],
  },
  {
    slug: "appointment-booking",
    index: "05",
    name: "Appointment Booking Platform",
    category: "Scheduling",
    description:
      "Modern appointment scheduling platform with online booking, availability management, customer records and business analytics.",
    assistantDescription:
      "Scheduling demo with services, staff, availability, simulated booking, customer records, and an admin view. Bookings stay in the browser.",
    demoType: "interactive",
    features: [
      "Online booking",
      "Availability management",
      "Customer records",
      "Reschedule and cancel",
      "Admin analytics",
    ],
    tech: ["TypeScript", "React", "Next.js", "Local state"],
    problem:
      "A service business needs one place to show what can be booked, who is free, and what already happened. Spreadsheets split that across inboxes.",
    solution:
      "The demo lets a visitor pick a service, a staff member, a date, and an open time, then confirm a simulated booking.",
    approach:
      "Availability, customers, and analytics stay in the browser. Confirmation is labeled as a simulated booking. The people in the demo are fictional.",
    flow: [
      { title: "Service", detail: "Consultation, Premium Session, or Quick Meeting, each with a duration and a sample price." },
      { title: "Availability", detail: "Staff, date, and time. Booked and unavailable slots cannot be selected." },
      { title: "Customer", detail: "A name and email are stored only for this session." },
      { title: "Confirmation", detail: "The slot becomes booked. The visitor can reschedule or cancel it." },
      { title: "Admin", detail: "Today's book, revenue, cancellation rate, calendar, customers, services, staff, and hours." },
    ],
  },
];

const demoSlugs = new Set([
  "ai-agent-platform",
  "ai-customer-support",
  "delivery-intelligence",
  "ecommerce-platform",
  "appointment-booking",
]);

export function demoHref(slug: string) {
  return demoSlugs.has(slug) ? `/work/${slug}/demo` : null;
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
