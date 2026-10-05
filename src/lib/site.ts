export const site = {
  name: "Karar Al Ajeli",
  role: "AI Engineer",
  description:
    "I design and build custom AI tools, business automation, dashboards and software applications that help companies work smarter and faster.",
  email: "aji.karar@icloud.com",
  github: "https://github.com/ajikarar-jpg/ai-engineer-portfolio",
} as const;

export const emailHref = `mailto:${site.email}`;

export const navigation = [
  { label: "Work", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const brand = "AI / ENGINEER";
