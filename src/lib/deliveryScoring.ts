import { forAddress, formatRate, sortDeliveries, type DeliveryRecord } from "@/lib/deliveryAnalytics";
import { neighborStats } from "@/lib/neighborAnalysis";
import { bestWeekday, bestWindow, morningFailures, windowStats } from "@/lib/timeWindowAnalysis";

export type ScoreFactor = {
  id: string;
  label: string;
  points: number;
};

export type AddressPrediction = {
  score: number;
  confidence: "High" | "Medium" | "Low";
  factors: ScoreFactor[];
  homeProbability: number;
  bestWindowLabel: string | null;
  recommendedDay: string | null;
  insights: string[];
};

function windowFactorLabel(startHour: number) {
  if (startHour >= 17) return "Evening performance";
  if (startHour < 13) return "Morning performance";
  return "Time-window performance";
}

function confidenceFor(total: number, score: number): AddressPrediction["confidence"] {
  if (total >= 12 && score >= 70) return "High";
  if (total >= 6) return "Medium";
  return "Low";
}

export function scoreAddress(records: readonly DeliveryRecord[]): AddressPrediction | null {
  if (records.length === 0) return null;
  const ordered = sortDeliveries(records);
  const total = ordered.length;
  const successes = ordered.filter((record) => record.outcome === "Delivered").length;
  const home = ordered.filter((record) => record.recipientHome).length;
  const window = bestWindow(ordered);
  const neighbors = neighborStats(ordered);
  const neighborDeliveries = neighbors.reduce((sum, neighbor) => sum + neighbor.receipts, 0);
  const topNeighbor = neighbors[0] ?? null;
  const recentFailures = ordered.slice(-3).filter((record) => record.outcome === "Failed").length;

  const historical = Math.round((successes / total) * 40);
  const windowPoints = window ? Math.round((window.successes / window.attempts) * 25) : 0;
  const homePoints = Math.round((home / total) * 20);
  const neighborPoints = topNeighbor && neighborDeliveries > 0 ? Math.round((topNeighbor.receipts / neighborDeliveries) * 15) : 0;
  const positive = historical + windowPoints + homePoints + neighborPoints;
  const penalty = -Math.min(recentFailures * 5, 15, positive);
  const score = positive + penalty;

  const factors: ScoreFactor[] = [
    { id: "history", label: "Historical success", points: historical },
    {
      id: "window",
      label: window ? windowFactorLabel(window.startHour) : "Time-window performance",
      points: windowPoints,
    },
    { id: "home", label: "Recipient availability", points: homePoints },
    { id: "neighbor", label: "Neighbor reliability", points: neighborPoints },
    { id: "recent", label: "Recent failed attempts", points: penalty },
  ];

  return {
    score,
    confidence: confidenceFor(total, score),
    factors,
    homeProbability: (home / total) * 100,
    bestWindowLabel: window?.label ?? null,
    recommendedDay: bestWeekday(ordered)?.label ?? null,
    insights: buildInsights(ordered, window?.label ?? null, topNeighbor),
  };
}

function buildInsights(
  records: readonly DeliveryRecord[],
  bestLabel: string | null,
  topNeighbor: { address: string; receipts: number } | null,
) {
  const insights: string[] = [];
  const windows = windowStats(records);
  const morning = windows.filter((window) => window.startHour < 13 && window.attempts > 0);
  const evening = windows.filter((window) => window.startHour >= 17 && window.attempts > 0);
  const morningAttempts = morning.reduce((sum, window) => sum + window.attempts, 0);
  const morningSuccesses = morning.reduce((sum, window) => sum + window.successes, 0);
  const eveningAttempts = evening.reduce((sum, window) => sum + window.attempts, 0);
  const eveningSuccesses = evening.reduce((sum, window) => sum + window.successes, 0);

  if (morningAttempts >= 2 && eveningAttempts >= 2) {
    const morningRate = (morningSuccesses / morningAttempts) * 100;
    const eveningRate = (eveningSuccesses / eveningAttempts) * 100;
    if (eveningRate > morningRate) {
      insights.push(
        `Evening deliveries have a higher success rate for this address (${formatRate(eveningRate)} from ${eveningAttempts} attempts) than morning windows (${formatRate(morningRate)} from ${morningAttempts} attempts).`,
      );
    } else if (morningRate > eveningRate) {
      insights.push(
        `Morning deliveries have a higher success rate for this address (${formatRate(morningRate)} from ${morningAttempts} attempts) than evening windows (${formatRate(eveningRate)} from ${eveningAttempts} attempts).`,
      );
    }
  } else if (bestLabel) {
    const match = windows.find((window) => window.label === bestLabel);
    if (match && match.attempts > 0) {
      insights.push(
        `${match.label} has the highest success rate in this history (${formatRate(match.rate)} from ${match.attempts} attempts).`,
      );
    }
  }

  const failedMornings = morningFailures(records);
  if (failedMornings > 0) {
    insights.push(
      `This address has ${failedMornings} failed ${failedMornings === 1 ? "attempt" : "attempts"} during morning windows.`,
    );
  }

  if (topNeighbor && topNeighbor.receipts > 0) {
    insights.push(
      `${topNeighbor.address} is the most frequent neighbor receiver in this history (${topNeighbor.receipts} successful ${topNeighbor.receipts === 1 ? "receipt" : "receipts"}).`,
    );
  }

  const latest = records.at(-1);
  if (latest?.outcome === "Failed") {
    insights.push(`The most recent attempt on ${latest.date} was not successful.`);
  }

  return insights.slice(0, 4);
}

export function meanPredictedScore(records: readonly DeliveryRecord[]) {
  const addresses = [...new Set(records.map((record) => record.address))];
  const scores = addresses
    .map((address) => scoreAddress(forAddress(records, address))?.score)
    .filter((score): score is number => score !== undefined);
  if (scores.length === 0) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}
