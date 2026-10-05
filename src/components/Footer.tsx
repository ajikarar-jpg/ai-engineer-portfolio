import { emailHref, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted">
          AI ENGINEER
          <span className="mt-1 block text-[10px] tracking-[0.14em]">RUNTIME: ACTIVE</span>
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a href={emailHref} className="text-muted transition-colors duration-200 hover:text-foreground">
            {site.email}
          </a>
          <a
            href={site.github}
            className="text-muted transition-colors duration-200 hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-6xl px-5 py-5 text-xs text-muted md:px-8">
          © 2026 {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
