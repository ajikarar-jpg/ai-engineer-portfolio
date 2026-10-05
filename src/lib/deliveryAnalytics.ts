export type DeliveryOutcome = "Delivered" | "Failed";

export type DeliveryRecord = {
  id: string;
  date: string;
  time: string;
  address: string;
  customer: string;
  outcome: DeliveryOutcome;
  recipientHome: boolean;
  neighborReceiver: string | null;
  driver: string;
  dayOfWeek: string;
};

export type AddressStats = {
  address: string;
  customer: string;
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  homeRate: number;
};

export type AttemptBreakdown = {
  firstDelivered: number;
  firstFailed: number;
  repeatDelivered: number;
  repeatFailed: number;
  firstAttemptRate: number | null;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export function dayName(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()] ?? "Unknown";
}

export function formatRate(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded.toFixed(1)}%`;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("de-DE").format(value);
}

export function hourOf(time: string) {
  return Number(time.slice(0, 2));
}

export function sortDeliveries(records: readonly DeliveryRecord[]) {
  return [...records].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time) || a.id.localeCompare(b.id));
}

export function forAddress(records: readonly DeliveryRecord[], address: string) {
  return sortDeliveries(records.filter((record) => record.address === address));
}

export function addressesIn(records: readonly DeliveryRecord[]) {
  return [...new Set(records.map((record) => record.address))].sort((a, b) => a.localeCompare(b));
}

export function addressStats(records: readonly DeliveryRecord[], address: string): AddressStats | null {
  const rows = forAddress(records, address);
  if (rows.length === 0) return null;
  const successful = rows.filter((row) => row.outcome === "Delivered").length;
  const home = rows.filter((row) => row.recipientHome).length;
  return {
    address,
    customer: rows[0]?.customer ?? "Sample Customer",
    total: rows.length,
    successful,
    failed: rows.length - successful,
    successRate: (successful / rows.length) * 100,
    homeRate: (home / rows.length) * 100,
  };
}

export function allAddressStats(records: readonly DeliveryRecord[]) {
  return addressesIn(records)
    .map((address) => addressStats(records, address))
    .filter((stats): stats is AddressStats => stats !== null)
    .sort((a, b) => b.total - a.total || a.address.localeCompare(b.address));
}

export function isFirstAttempt(records: readonly DeliveryRecord[], record: DeliveryRecord) {
  const rows = forAddress(records, record.address);
  const index = rows.findIndex((row) => row.id === record.id);
  if (index <= 0) return true;
  return rows[index - 1]?.outcome === "Delivered";
}

export function attemptBreakdown(records: readonly DeliveryRecord[]): AttemptBreakdown {
  let firstDelivered = 0;
  let firstFailed = 0;
  let repeatDelivered = 0;
  let repeatFailed = 0;

  for (const record of records) {
    const first = isFirstAttempt(records, record);
    if (first && record.outcome === "Delivered") firstDelivered += 1;
    else if (first) firstFailed += 1;
    else if (record.outcome === "Delivered") repeatDelivered += 1;
    else repeatFailed += 1;
  }

  const firstTotal = firstDelivered + firstFailed;
  return {
    firstDelivered,
    firstFailed,
    repeatDelivered,
    repeatFailed,
    firstAttemptRate: firstTotal > 0 ? (firstDelivered / firstTotal) * 100 : null,
  };
}

export type RatePoint = { label: string; attempts: number; successes: number; rate: number };

export function successByHour(records: readonly DeliveryRecord[]): RatePoint[] {
  const buckets = new Map<number, { attempts: number; successes: number }>();
  for (const record of records) {
    const hour = hourOf(record.time);
    const current = buckets.get(hour) ?? { attempts: 0, successes: 0 };
    current.attempts += 1;
    if (record.outcome === "Delivered") current.successes += 1;
    buckets.set(hour, current);
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([hour, bucket]) => ({
      label: `${String(hour).padStart(2, "0")}:00`,
      attempts: bucket.attempts,
      successes: bucket.successes,
      rate: (bucket.successes / bucket.attempts) * 100,
    }));
}

export function successByDay(records: readonly DeliveryRecord[]): RatePoint[] {
  const buckets = new Map<string, { attempts: number; successes: number }>();
  for (const day of WEEKDAYS) buckets.set(day, { attempts: 0, successes: 0 });
  for (const record of records) {
    const current = buckets.get(record.dayOfWeek) ?? { attempts: 0, successes: 0 };
    current.attempts += 1;
    if (record.outcome === "Delivered") current.successes += 1;
    buckets.set(record.dayOfWeek, current);
  }
  return WEEKDAYS.map((day) => {
    const bucket = buckets.get(day) ?? { attempts: 0, successes: 0 };
    return {
      label: day.slice(0, 3),
      attempts: bucket.attempts,
      successes: bucket.successes,
      rate: bucket.attempts > 0 ? (bucket.successes / bucket.attempts) * 100 : 0,
    };
  }).filter((point) => point.attempts > 0);
}

export type FleetKpis = {
  successRate: number;
  firstAttemptRate: number | null;
  predictedSuccess: number | null;
  knownAddresses: number;
  deliveries: number;
};

export function fleetKpis(records: readonly DeliveryRecord[], predictedSuccess: number | null): FleetKpis {
  const delivered = records.filter((record) => record.outcome === "Delivered").length;
  const attempts = attemptBreakdown(records);
  return {
    successRate: records.length > 0 ? (delivered / records.length) * 100 : 0,
    firstAttemptRate: attempts.firstAttemptRate,
    predictedSuccess,
    knownAddresses: addressesIn(records).length,
    deliveries: records.length,
  };
}
