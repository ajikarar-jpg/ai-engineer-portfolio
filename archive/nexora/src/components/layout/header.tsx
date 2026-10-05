"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { SearchDialog } from "@/components/layout/search-dialog";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { workspaceUser } from "@/lib/data";
import { getCurrentPage } from "@/lib/navigation";

export function Header({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const page = getCurrentPage(pathname);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-lg text-foreground hover:bg-surface-muted lg:hidden"
          onClick={onMenu}
          aria-label="Open navigation"
          aria-controls="workspace-nav"
          aria-expanded={false}
        >
          <Menu className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold tracking-tight">{page.label}</h1>
          <p className="hidden truncate text-xs text-muted sm:block">{page.description}</p>
        </div>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-sm text-muted transition-colors hover:text-foreground sm:px-3"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
        <ThemeToggle />
        <NotificationsMenu />
        <Link
          href="/settings"
          aria-label="Account settings"
          className="grid size-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background"
        >
          {workspaceUser.initials}
        </Link>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
