"use client";

import { CircleDollarSign, Percent, ShoppingBag, Users } from "lucide-react";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { CustomerActivity } from "@/components/dashboard/customer-activity";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { dashboardStats, monthlyRevenue } from "@/lib/data";

export function OverviewDashboard() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={dashboardStats.revenue}
          change={dashboardStats.revenueChange}
          format="currency"
          icon={CircleDollarSign}
          series={monthlyRevenue.map((month) => month.revenue)}
        />
        <StatCard
          label="Customers"
          value={dashboardStats.customers}
          change={dashboardStats.customersChange}
          format="number"
          icon={Users}
          series={monthlyRevenue.map((month) => month.customers)}
        />
        <StatCard
          label="Orders"
          value={dashboardStats.orders}
          change={dashboardStats.ordersChange}
          format="number"
          icon={ShoppingBag}
          series={monthlyRevenue.map((month) => month.orders)}
        />
        <StatCard
          label="Conversion rate"
          value={dashboardStats.conversionRate}
          change={dashboardStats.conversionChange}
          format="percent"
          icon={Percent}
          series={monthlyRevenue.map((month) => month.conversion)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RevenueChart />
        </div>
        <div className="min-w-0">
          <SalesChart />
        </div>
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-5">
        <div className="min-w-0 xl:col-span-3">
          <CustomerActivity />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <AIInsights />
        </div>
      </section>
    </div>
  );
}
