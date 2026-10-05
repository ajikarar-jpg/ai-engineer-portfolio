import { hourOf, type DeliveryRecord, type RatePoint } from "@/lib/deliveryAnalytics";

export type TimeWindow = {
  label: string;
  startHour: number;
  attempts: number;
  successes: number;
  failures: number;
  rate: number;
};

const WINDOW_STARTS = [9, 11, 13, 15, 17, 19] as const;

export function windowLabel(startHour: number) {
  const end = startHour + 2;
  return `${String(startHour).padStart(2, "0")}:00–${String(end).padStart(2, "0")}:00`;
}

export function windowStartForTime(time: string) {
  const hour = hourOf(time);
  const start = [...WINDOW_STARTS].reverse().find((value) => hour >= value && hour < value + 2);
  return start ?? null;
}

export function windowStats(records: readonly DeliveryRecord[]): TimeWindow[] {
  const buckets = new Map<number, { attempts: number; successes: number }>();
  for (const start of WINDOW_STARTS) buckets.set(start, { attempts: 0, successes: 0 });

  for (const record of records) {
    const start = windowStartForTime(record.time);
    if (start === null) continue;
    const current = buckets.get(start);
    if (!current) continue;
    current.attempts += 1;
    if (record.outcome === "Delivered") current.successes += 1;
  }

  return WINDOW_STARTS.map((start) => {
    const bucket = buckets.get(start) ?? { attempts: 0, successes: 0 };
    return {
      label: windowLabel(start),
      startHour: start,
      attempts: bucket.attempts,
      successes: bucket.successes,
      failures: bucket.attempts - bucket.successes,
      rate: bucket.attempts > 0 ? (bucket.successes / bucket.attempts) * 100 : 0,
    };
  });
}

export function bestWindow(records: readonly DeliveryRecord[]) {
  const windows = windowStats(records).filter((window) => window.attempts > 0);
  const eligible = windows.filter((window) => window.attempts >= 2);
  const pool = eligible.length > 0 ? eligible : windows;
  return (
    [...pool].sort((a, b) => b.rate - a.rate || b.attempts - a.attempts || a.startHour - b.startHour)[0] ?? null
  );
}

export function bestWeekday(records: readonly DeliveryRecord[]): RatePoint | null {
  const buckets = new Map<string, { attempts: number; successes: number }>();
  for (const record of records) {
    const current = buckets.get(record.dayOfWeek) ?? { attempts: 0, successes: 0 };
    current.attempts += 1;
    if (record.outcome === "Delivered") current.successes += 1;
    buckets.set(record.dayOfWeek, current);
  }
  const points = [...buckets.entries()]
    .map(([label, bucket]) => ({
      label,
      attempts: bucket.attempts,
      successes: bucket.successes,
      rate: (bucket.successes / bucket.attempts) * 100,
    }))
    .filter((point) => point.attempts >= 2);
  return points.sort((a, b) => b.rate - a.rate || b.attempts - a.attempts || a.label.localeCompare(b.label))[0] ?? null;
}

export function morningFailures(records: readonly DeliveryRecord[]) {
  return records.filter((record) => record.outcome === "Failed" && hourOf(record.time) < 13).length;
}
