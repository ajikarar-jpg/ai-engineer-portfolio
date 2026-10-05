"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ChartLine,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useSettings } from "@/components/settings/settings-provider";
import { cn } from "@/lib/cn";
import { navigation } from "@/lib/navigation";
import { workspaceUser } from "@/lib/data";

const icons = {
  "/": LayoutDashboard,
  "/analytics": ChartLine,
  "/customers": Users,
  "/revenue": Wallet,
  "/insights": Sparkles,
  "/settings": Settings,
} as const;

export function Sidebar({
  mobileOpen,
  collapsed,
  onClose,
  onToggleCollapse,
}: {
  mobileOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const { settings } = useSettings();

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, onClose]);

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        id="workspace-nav"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-[transform,width] duration-200 motion-reduce:transition-none lg:z-30 lg:translate-x-0",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full max-lg:invisible lg:translate-x-0",
        )}
      >
        <div className={cn("flex items-center gap-3 px-4 py-5", collapsed && "lg:justify-center lg:px-2")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
            N
          </span>
          <div className={cn("min-w-0", collapsed && "lg:hidden")}>
            <p className="truncate text-sm font-semibold tracking-tight">Nexora</p>
            <p className="truncate text-xs text-sidebar-muted">Analytics</p>
          </div>
          <button
            type="button"
            className="ml-auto grid size-8 place-items-center rounded-lg text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3" aria-label="Primary">
          {navigation.map((item) => {
            const Icon = icons[item.href];
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  collapsed && "lg:justify-center lg:px-2",
                  active
                    ? "bg-sidebar-active text-sidebar-foreground"
                    : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground",
                )}
              >
                <Icon className={cn("size-4 shrink-0", active && "text-accent")} />
                <span className={cn("truncate", collapsed && "lg:sr-only")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-9 w-full items-center justify-center gap-2 rounded-lg text-sm text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            <span className={cn(collapsed && "sr-only")}>Collapse</span>
          </button>
          <Link
            href="/settings"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/5",
              collapsed && "lg:justify-center",
            )}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold">
              {workspaceUser.initials}
            </span>
            <span className={cn("min-w-0", collapsed && "lg:hidden")}>
              <span className="block truncate text-sm font-medium">{workspaceUser.name}</span>
              <span className="block truncate text-xs text-sidebar-muted">
                {settings.businessName}
              </span>
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
