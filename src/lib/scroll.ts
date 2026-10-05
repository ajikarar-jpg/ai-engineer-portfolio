export function scrollToSection(event: { preventDefault(): void }, href: string) {
  const hash = href.split("#")[1];
  if (!hash || typeof window === "undefined") return;
  if (window.location.pathname !== "/") return;

  const target = document.getElementById(hash);
  if (!target) return;

  event.preventDefault();
  document.body.style.overflow = "";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  window.history.pushState(null, "", `/#${hash}`);
}
