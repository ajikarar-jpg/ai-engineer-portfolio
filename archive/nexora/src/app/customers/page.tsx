import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerTable } from "@/components/customers/customer-table";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading customers...</p>}>
      <CustomerTable />
    </Suspense>
  );
}
