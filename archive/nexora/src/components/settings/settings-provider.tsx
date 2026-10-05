"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { AppSettings } from "@/lib/types";

const STORAGE_KEY = "nexora-settings";

export const defaultSettings: AppSettings = {
  businessName: "Nexora Business",
  email: "amira.cole@nexora.example",
  currency: "EUR",
  notifications: {
    orderAlerts: true,
    weeklyDigest: true,
    productUpdates: false,
  },
  ai: {
    focus: "balanced",
    detail: "concise",
  },
};

type SettingsContextValue = {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function readStoredSettings() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parseStoredSettings(raw: string) {
  if (!raw) return defaultSettings;
  try {
    return sanitizeSettings(JSON.parse(raw));
  } catch {
    return defaultSettings;
  }
}

export function sanitizeSettings(value: unknown): AppSettings {
  if (!value || typeof value !== "object") return defaultSettings;
  const record = value as Partial<AppSettings>;
  const notifications = record.notifications;
  const ai = record.ai;

  return {
    businessName:
      typeof record.businessName === "string" && record.businessName.trim()
        ? record.businessName.trim().slice(0, 80)
        : defaultSettings.businessName,
    email: typeof record.email === "string" ? record.email.slice(0, 120) : defaultSettings.email,
    currency:
      record.currency === "USD" || record.currency === "GBP" || record.currency === "EUR"
        ? record.currency
        : "EUR",
    notifications: {
      orderAlerts:
        typeof notifications?.orderAlerts === "boolean"
          ? notifications.orderAlerts
          : defaultSettings.notifications.orderAlerts,
      weeklyDigest:
        typeof notifications?.weeklyDigest === "boolean"
          ? notifications.weeklyDigest
          : defaultSettings.notifications.weeklyDigest,
      productUpdates:
        typeof notifications?.productUpdates === "boolean"
          ? notifications.productUpdates
          : defaultSettings.notifications.productUpdates,
    },
    ai: {
      focus:
        ai?.focus === "revenue" ||
        ai?.focus === "customers" ||
        ai?.focus === "retention" ||
        ai?.focus === "balanced"
          ? ai.focus
          : "balanced",
      detail: ai?.detail === "detailed" ? "detailed" : "concise",
    },
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readStoredSettings, () => "");
  const settings = useMemo(() => parseStoredSettings(raw), [raw]);
  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      updateSettings: (next) => {
        const clean = sanitizeSettings(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
        emit();
      },
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
