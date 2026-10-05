"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/LinkButton";
import { cn } from "@/lib/cn";
import { scrollToSection } from "@/lib/scroll";
import { brand, navigation } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const items = [
        ...panelRef.current.querySelectorAll<HTMLElement>("a, button"),
        toggleRef.current,
      ].filter((item): item is HTMLElement => item !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const nodes = navigation
      .map((item) => document.getElementById(item.href.split("#")[1] ?? ""))
      .filter((node): node is HTMLElement => node !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  const follow = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    document.body.style.overflow = "";
    setOpen(false);
    scrollToSection(event, href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled || open
            ? "border-line bg-[#07080c]/88 backdrop-blur-md"
            : "border-transparent bg-[#07080c]/50 backdrop-blur-sm",
        )}
      >
      <div className="mx-auto grid h-14 w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 md:h-16 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <Link
          href="/#home"
          className="justify-self-start font-mono text-[11px] tracking-[0.16em] whitespace-nowrap text-foreground"
          onClick={(event) => follow(event, "/#home")}
        >
          {brand}
        </Link>

        <nav className="hidden items-center justify-center gap-7 md:flex" aria-label="Primary">
          {navigation.map((item) => {
            const id = item.href.split("#")[1] ?? "";
            const current = pathname === "/" && active === id;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "text-sm transition-colors duration-200",
                  current ? "text-foreground" : "text-muted hover:text-foreground",
                )}
                onClick={(event) => follow(event, item.href)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/#contact"
            className="cta-secondary inline-flex h-9 items-center rounded-lg px-3.5 text-[13px] font-medium tracking-[0.08em] uppercase transition duration-200 md:h-10 md:px-4"
            onClick={(event) => follow(event, "/#contact")}
          >
            Let&apos;s Talk
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      </div>

      {open ? (
        <div
          ref={panelRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile"
          className="menu-in fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto border-t border-line bg-[#07080c]/96 backdrop-blur-md md:hidden"
        >
          <nav className="flex flex-col px-6 py-6" aria-label="Mobile">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line py-3.5 text-xl font-medium tracking-tight"
                onClick={(event) => follow(event, item.href)}
              >
                {item.label}
              </Link>
            ))}
            <LinkButton href="/#contact" variant="secondary" className="mt-6 w-full tracking-[0.08em] uppercase" onClick={() => setOpen(false)}>
              Let&apos;s Talk
            </LinkButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
