"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { defaultSettings, useSettings } from "@/components/settings/settings-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { AppSettings } from "@/lib/types";

const fieldClass =
  "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-accent";

export function SettingsForm() {
  const { settings, updateSettings } = useSettings();
  const [draft, setDraft] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = draft ?? settings;
  const dirty = JSON.stringify(current) !== JSON.stringify(settings);

  function save() {
    if (!current.businessName.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    updateSettings(current);
    setDraft(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold">Business</h2>
        <p className="mt-1 text-sm text-muted">Shown in the sidebar and used as the workspace identity.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Business name" htmlFor="business-name">
            <input
              id="business-name"
              value={current.businessName}
              onChange={(event) => setDraft({ ...current, businessName: event.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field label="Email" htmlFor="business-email">
            <input
              id="business-email"
              type="email"
              value={current.email}
              onChange={(event) => setDraft({ ...current, email: event.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field label="Currency" htmlFor="currency">
            <select
              id="currency"
              value={current.currency}
              onChange={(event) =>
                setDraft({
                  ...current,
                  currency: event.target.value as AppSettings["currency"],
                })
              }
              className={fieldClass}
            >
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">US dollar (USD)</option>
              <option value="GBP">Pound sterling (GBP)</option>
            </select>
          </Field>
        </div>
        <p className="mt-3 text-xs text-muted">
          USD and GBP use a fixed demo rate so the workspace can be previewed without a live exchange feed. Source figures stay in euros.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <div className="mt-4 space-y-3">
          <Toggle
            label="Order alerts"
            description="Paid, failed, and refunded orders."
            checked={current.notifications.orderAlerts}
            onChange={(orderAlerts) =>
              setDraft({ ...current, notifications: { ...current.notifications, orderAlerts } })
            }
          />
          <Toggle
            label="Weekly digest"
            description="A Monday summary of revenue and orders."
            checked={current.notifications.weeklyDigest}
            onChange={(weeklyDigest) =>
              setDraft({ ...current, notifications: { ...current.notifications, weeklyDigest } })
            }
          />
          <Toggle
            label="Product updates"
            description="Occasional notes when Nexora ships a workspace change."
            checked={current.notifications.productUpdates}
            onChange={(productUpdates) =>
              setDraft({
                ...current,
                notifications: { ...current.notifications, productUpdates },
              })
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold">AI analysis</h2>
        <p className="mt-1 text-sm text-muted">These preferences are sent with each analysis request.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Focus" htmlFor="ai-focus">
            <select
              id="ai-focus"
              value={current.ai.focus}
              onChange={(event) =>
                setDraft({
                  ...current,
                  ai: { ...current.ai, focus: event.target.value as AppSettings["ai"]["focus"] },
                })
              }
              className={fieldClass}
            >
              <option value="balanced">Balanced</option>
              <option value="revenue">Revenue</option>
              <option value="customers">Customers</option>
              <option value="retention">Retention</option>
            </select>
          </Field>
          <Field label="Detail" htmlFor="ai-detail">
            <select
              id="ai-detail"
              value={current.ai.detail}
              onChange={(event) =>
                setDraft({
                  ...current,
                  ai: { ...current.ai, detail: event.target.value as AppSettings["ai"]["detail"] },
                })
              }
              className={fieldClass}
            >
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
            </select>
          </Field>
        </div>
      </section>

      {error ? <p className="text-sm text-negative">{error}</p> : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!dirty && !saved}>
          {saved ? <Check className="size-4" /> : null}
          {saved ? "Saved" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setDraft(defaultSettings);
            setError(null);
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
