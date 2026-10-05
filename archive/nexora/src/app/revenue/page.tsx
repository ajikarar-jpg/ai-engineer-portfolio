import type { Metadata } from "next";
import { RevenueView } from "@/components/dashboard/revenue-view";

export const metadata: Metadata = {
  title: "Revenue",
};

export default function RevenuePage() {
  return <RevenueView />;
}
