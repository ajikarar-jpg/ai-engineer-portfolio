"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSettings } from "@/components/settings/settings-provider";
import { Pill } from "@/components/ui/pill";
import { customers } from "@/lib/data";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import type { CustomerStatus } from "@/lib/types";

const PAGE_SIZE = 8;

const statusOptions: Array<{ id: "all" | CustomerStatus; label: string }> = [
  { id: "all", label: "All statuses" },
  { id: "active", label: "Active" },
  { id: "vip", label: "VIP" },
  { id: "pending", label: "Pending" },
  { id: "churned", label: "Churned" },
];

const tones: Record<CustomerStatus, "positive" | "warning" | "neutral" | "negative"> = {
  active: "positive",
  vip: "positive",
  pending: "warning",
  churned: "negative",
};

const labels: Record<CustomerStatus, string> = {
  active: "Active",
  vip: "VIP",
  pending: "Pending",
  churned: "Churned",
};

export function CustomerTable() {
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const paramQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(paramQuery);
  const [appliedParam, setAppliedParam] = useState(paramQuery);
  const [status, setStatus] = useState<(typeof statusOptions)[number]["id"]>("all");
  const [page, setPage] = useState(0);

  if (paramQuery !== appliedParam) {
    setAppliedParam(paramQuery);
    setQuery(paramQuery);
    setPage(0);
  }

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesStatus = status === "all" || customer.status === status;
      const matchesQuery =
        !normalized ||
        customer.name.toLowerCase().includes(normalized) ||
        customer.email.toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const start = currentPage * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const fieldClass =
    "h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-accent";

  return (
    <section className="rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(23,33,28,0.04)]">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="sr-only" htmlFor="customer-search">
          Search customers
        </label>
        <input
          id="customer-search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
          placeholder="Search name or email"
          className={`${fieldClass} w-full sm:max-w-xs`}
        />
        <label className="sr-only" htmlFor="customer-status">
          Filter by status
        </label>
        <select
          id="customer-status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as (typeof statusOptions)[number]["id"]);
            setPage(0);
          }}
          className={`${fieldClass} w-full sm:w-44`}
        >
          {statusOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {visible.length ? (
        <>
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Orders</th>
                    <th className="px-4 py-3 font-medium">Total spent</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Last order</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((customer) => (
                    <tr key={customer.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{customer.name}</td>
                      <td className="px-4 py-3 text-muted">{customer.email}</td>
                      <td className="px-4 py-3 font-mono tabular-nums">{formatNumber(customer.orders)}</td>
                      <td className="px-4 py-3 font-mono tabular-nums">
                        {formatMoney(customer.totalSpent, settings.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <Pill tone={tones[customer.status]}>{labels[customer.status]}</Pill>
                      </td>
                      <td className="px-4 py-3 text-muted">{formatDate(customer.lastOrder)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="divide-y divide-border md:hidden">
            {visible.map((customer) => (
              <li key={customer.id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{customer.name}</p>
                    <p className="truncate text-sm text-muted">{customer.email}</p>
                  </div>
                  <Pill tone={tones[customer.status]}>{labels[customer.status]}</Pill>
                </div>
                <dl className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted">Orders</dt>
                    <dd className="font-mono tabular-nums">{formatNumber(customer.orders)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Spent</dt>
                    <dd className="font-mono tabular-nums">
                      {formatMoney(customer.totalSpent, settings.currency)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Last order</dt>
                    <dd>{formatDate(customer.lastOrder)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="px-4 py-10 text-center text-sm text-muted">No customers match this search.</p>
      )}

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {filtered.length
            ? `Showing ${start + 1}–${start + visible.length} of ${filtered.length}`
            : "Showing 0 customers"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          <span className="text-sm text-muted">
            {currentPage + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
            disabled={currentPage >= pageCount - 1}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm disabled:opacity-40"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
