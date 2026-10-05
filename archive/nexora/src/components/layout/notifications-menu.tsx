"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { notifications } from "@/lib/data";

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
      >
        <Bell className="size-4" />
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-surface p-2 shadow-[0_12px_32px_rgb(16_20_17/0.12)]">
          <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted">
            Notifications
          </p>
          <ul>
            {notifications.map((item) => (
              <li key={item.id} className="rounded-lg px-2 py-2 hover:bg-surface-muted">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted">{item.body}</p>
                <p className="mt-1 text-xs text-muted">{item.time}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
