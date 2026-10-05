"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Search } from "lucide-react";
import { customers } from "@/lib/data";
import { navigation } from "@/lib/navigation";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return <SearchPanel onClose={onClose} />;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const titleId = useId();

  useEffect(() => {
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
  }, [onClose]);

  const normalized = query.trim().toLowerCase();
  const pages = navigation.filter((item) =>
    normalized
      ? item.label.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized)
      : true,
  );
  const people = normalized
    ? customers
        .filter(
          (customer) =>
            customer.name.toLowerCase().includes(normalized) ||
            customer.email.toLowerCase().includes(normalized),
        )
        .slice(0, 5)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 px-4 pt-[10vh]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_16px_50px_rgb(16_20_17/0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">
          Search
        </h2>
        <label className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages and customers"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </label>
        <div className="max-h-80 overflow-y-auto p-2">
          <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted">
            Pages
          </p>
          {pages.length ? (
            pages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block rounded-lg px-3 py-2 hover:bg-surface-muted"
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="block text-xs text-muted">{item.description}</span>
              </Link>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-muted">No matching pages.</p>
          )}
          {people.length ? (
            <>
              <p className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-muted">
                Customers
              </p>
              {people.map((person) => (
                <Link
                  key={person.id}
                  href={`/customers?q=${encodeURIComponent(person.name)}`}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2 hover:bg-surface-muted"
                >
                  <span className="block text-sm font-medium">{person.name}</span>
                  <span className="block text-xs text-muted">{person.email}</span>
                </Link>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
