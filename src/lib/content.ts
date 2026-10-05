export const services = [
  {
    title: "AI Applications",
    description: "Custom AI applications designed around a specific business workflow.",
    icon: "cpu",
    href: "/work/ai-agent-platform",
  },
  {
    title: "AI Agents",
    description: "Conversational agents that keep context and guide a task.",
    icon: "bot",
    href: "/work/ai-agent-platform",
  },
  {
    title: "AI Automation",
    description: "Repeatable workflows across requests, documents, and internal handoffs.",
    icon: "workflow",
    href: "/#projects",
  },
  {
    title: "Customer Support",
    description: "Support inbox, knowledge base, tickets, and agent-assist replies.",
    icon: "support",
    href: "/work/ai-customer-support",
  },
  {
    title: "Custom Software",
    description: "Purpose-built software around real business requirements.",
    icon: "software",
    href: "/#projects",
  },
  {
    title: "SaaS Products",
    description: "Product software with accounts, repeatable flows, and an admin view.",
    icon: "saas",
    href: "/work/appointment-booking",
  },
  {
    title: "E-commerce & Online Stores",
    description: "Online stores with a catalog, cart, checkout, and orders.",
    icon: "store",
    href: "/work/ecommerce-platform",
  },
  {
    title: "Appointment Booking Systems",
    description: "Scheduling with services, staff, availability, and customer records.",
    icon: "calendar",
    href: "/work/appointment-booking",
  },
] as const;

export type ServiceIcon = (typeof services)[number]["icon"];

export const processSteps = [
  {
    index: "01",
    title: "Understand",
    body: "I learn how the business currently works and identify the biggest bottleneck.",
  },
  {
    index: "02",
    title: "Design",
    body: "I design the system architecture and user experience around the actual workflow.",
  },
  {
    index: "03",
    title: "Build",
    body: "I develop the AI, backend, frontend and integrations.",
  },
  {
    index: "04",
    title: "Improve",
    body: "I test, measure and refine the system based on real usage.",
  },
] as const;

export const skills = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "FastAPI",
  "PostgreSQL",
  "AI APIs",
  "Machine Learning",
  "Automation",
  "Git / GitHub",
] as const;

export const about = [
  "I'm an AI Engineer focused on building practical software that solves real problems.",
  "My focus is not simply adding AI to a product. I care about understanding the problem first, designing the right system and turning it into reliable software.",
] as const;
