import type { DeliveryRecord } from "@/lib/deliveryAnalytics";

export type NeighborStat = {
  address: string;
  receipts: number;
  share: number;
};

export function neighborStats(records: readonly DeliveryRecord[]): NeighborStat[] {
  const successes = records.filter((record) => record.outcome === "Delivered" && record.neighborReceiver);
  const buckets = new Map<string, number>();
  for (const record of successes) {
    const name = record.neighborReceiver;
    if (!name) continue;
    buckets.set(name, (buckets.get(name) ?? 0) + 1);
  }
  const total = successes.length;
  return [...buckets.entries()]
    .map(([address, receipts]) => ({
      address,
      receipts,
      share: total > 0 ? (receipts / total) * 100 : 0,
    }))
    .sort((a, b) => b.receipts - a.receipts || a.address.localeCompare(b.address));
}
