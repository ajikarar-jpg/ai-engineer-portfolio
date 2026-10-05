import type { Metadata } from "next";
import { AnalyticsBoard } from "@/components/dashboard/analytics-board";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AnalyticsPage() {
  return <AnalyticsBoard />;
}
