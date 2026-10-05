import type {
  AnalyticsPoint,
  AnalysisSnapshot,
  AppNotification,
  Customer,
  CustomerActivity,
  CustomerSummary,
  DashboardStats,
  DateRange,
  RevenueData,
  SalesData,
} from "@/lib/types";

export const dashboardStats: DashboardStats = {
  revenue: 128430,
  revenueChange: 12.5,
  customers: 2847,
  customersChange: 8.2,
  orders: 1426,
  ordersChange: 15.7,
  conversionRate: 4.8,
  conversionChange: 0.6,
};

// Last reported year. The overview and revenue views plot this series as given.
export const monthlyRevenue: RevenueData[] = [
  { month: "Jan", revenue: 7200, orders: 620, customers: 2140, conversion: 3.6 },
  { month: "Feb", revenue: 8100, orders: 680, customers: 2210, conversion: 3.7 },
  { month: "Mar", revenue: 9200, orders: 740, customers: 2295, conversion: 3.9 },
  { month: "Apr", revenue: 8800, orders: 710, customers: 2340, conversion: 3.8 },
  { month: "May", revenue: 10400, orders: 860, customers: 2410, conversion: 4.0 },
  { month: "Jun", revenue: 11200, orders: 910, customers: 2488, conversion: 4.1 },
  { month: "Jul", revenue: 11900, orders: 980, customers: 2552, conversion: 4.2 },
  { month: "Aug", revenue: 12700, orders: 1040, customers: 2630, conversion: 4.4 },
  { month: "Sep", revenue: 12100, orders: 990, customers: 2684, conversion: 4.3 },
  { month: "Oct", revenue: 13900, orders: 1160, customers: 2740, conversion: 4.5 },
  { month: "Nov", revenue: 15100, orders: 1280, customers: 2796, conversion: 4.6 },
  { month: "Dec", revenue: 16400, orders: 1426, customers: 2847, conversion: 4.8 },
];

export const salesByCategory: SalesData[] = [
  { category: "Electronics", revenue: 41200 },
  { category: "Software", revenue: 33800 },
  { category: "Services", revenue: 27450 },
  { category: "Subscriptions", revenue: 22100 },
  { category: "Accessories", revenue: 12450 },
];

export const customers: Customer[] = [
  { id: "cus_01", name: "Lina Berg", email: "lina.berg@example.com", orders: 18, totalSpent: 4860, status: "active", lastOrder: "2026-09-28" },
  { id: "cus_02", name: "Omar Haddad", email: "omar.haddad@example.com", orders: 11, totalSpent: 3120, status: "active", lastOrder: "2026-09-26" },
  { id: "cus_03", name: "Sofia Almeida", email: "sofia.almeida@example.com", orders: 27, totalSpent: 9640, status: "vip", lastOrder: "2026-09-24" },
  { id: "cus_04", name: "Jonah Keller", email: "jonah.keller@example.com", orders: 6, totalSpent: 980, status: "pending", lastOrder: "2026-09-22" },
  { id: "cus_05", name: "Priya Nair", email: "priya.nair@example.com", orders: 22, totalSpent: 7410, status: "vip", lastOrder: "2026-09-20" },
  { id: "cus_06", name: "Elena Rossi", email: "elena.rossi@example.com", orders: 9, totalSpent: 2540, status: "active", lastOrder: "2026-09-18" },
  { id: "cus_07", name: "Marcus Adel", email: "marcus.adel@example.com", orders: 4, totalSpent: 640, status: "churned", lastOrder: "2026-08-30" },
  { id: "cus_08", name: "Hana Ito", email: "hana.ito@example.com", orders: 15, totalSpent: 5280, status: "active", lastOrder: "2026-09-16" },
  { id: "cus_09", name: "Theo Marchand", email: "theo.marchand@example.com", orders: 8, totalSpent: 1870, status: "active", lastOrder: "2026-09-14" },
  { id: "cus_10", name: "Aisha Rahman", email: "aisha.rahman@example.com", orders: 31, totalSpent: 11240, status: "vip", lastOrder: "2026-09-12" },
  { id: "cus_11", name: "Camille Dubois", email: "camille.dubois@example.com", orders: 3, totalSpent: 420, status: "pending", lastOrder: "2026-09-09" },
  { id: "cus_12", name: "Henrik Solberg", email: "henrik.solberg@example.com", orders: 12, totalSpent: 3360, status: "active", lastOrder: "2026-09-07" },
  { id: "cus_13", name: "Maya Chen", email: "maya.chen@example.com", orders: 7, totalSpent: 1590, status: "active", lastOrder: "2026-09-04" },
  { id: "cus_14", name: "Luca Moretti", email: "luca.moretti@example.com", orders: 2, totalSpent: 260, status: "churned", lastOrder: "2026-07-19" },
  { id: "cus_15", name: "Freya Nielsen", email: "freya.nielsen@example.com", orders: 16, totalSpent: 4720, status: "active", lastOrder: "2026-09-02" },
  { id: "cus_16", name: "Samir Elbaz", email: "samir.elbaz@example.com", orders: 10, totalSpent: 2980, status: "active", lastOrder: "2026-08-28" },
];

export const recentActivity: CustomerActivity[] = [
  { id: "act_01", name: "Lina Berg", email: "lina.berg@example.com", order: "NX-20418 · Studio monitor", amount: 1280, status: "paid", date: "2026-09-28" },
  { id: "act_02", name: "Omar Haddad", email: "omar.haddad@example.com", order: "NX-20411 · Lens kit", amount: 240, status: "paid", date: "2026-09-26" },
  { id: "act_03", name: "Sofia Almeida", email: "sofia.almeida@example.com", order: "NX-20388 · Annual subscription", amount: 1440, status: "paid", date: "2026-09-24" },
  { id: "act_04", name: "Jonah Keller", email: "jonah.keller@example.com", order: "NX-20402 · Onboarding workshop", amount: 860, status: "pending", date: "2026-09-22" },
  { id: "act_05", name: "Hana Ito", email: "hana.ito@example.com", order: "NX-20380 · License seats", amount: 640, status: "paid", date: "2026-09-16" },
  { id: "act_06", name: "Camille Dubois", email: "camille.dubois@example.com", order: "NX-20371 · Replacement cable", amount: 48, status: "refunded", date: "2026-09-09" },
  { id: "act_07", name: "Henrik Solberg", email: "henrik.solberg@example.com", order: "NX-20364 · Service retainer", amount: 320, status: "paid", date: "2026-09-07" },
  { id: "act_08", name: "Marcus Adel", email: "marcus.adel@example.com", order: "NX-20290 · Accessory bundle", amount: 95, status: "failed", date: "2026-08-30" },
];

export const notifications: AppNotification[] = [
  {
    id: "ntf_01",
    title: "Order paid",
    body: "Lina Berg completed NX-20418 for €1,280.",
    time: "12m ago",
  },
  {
    id: "ntf_02",
    title: "Weekly digest",
    body: "Revenue is up 12.5% versus the previous period.",
    time: "2h ago",
  },
  {
    id: "ntf_03",
    title: "Renewals on Friday",
    body: "Six subscriptions are due to renew this week.",
    time: "Yesterday",
  },
];

export const customerSummary: CustomerSummary = customers.reduce(
  (summary, customer) => {
    summary[customer.status] += 1;
    return summary;
  },
  { active: 0, vip: 0, pending: 0, churned: 0 },
);

export const workspaceUser = {
  name: "Amira Cole",
  initials: "AC",
};

const MS_DAY = 24 * 60 * 60 * 1000;
const PERIOD_END = Date.UTC(2026, 9, 1);

function unit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

type DailyMetric = {
  date: Date;
  revenue: number;
  orders: number;
  customers: number;
  conversion: number;
};

// Rolling daily series ending 1 Oct 2026. The latest 30 days match the headline totals.
function buildDailySeries(): DailyMetric[] {
  const days = 365;
  const rows: DailyMetric[] = [];

  for (let index = 0; index < days; index += 1) {
    const progress = index / (days - 1);
    const date = new Date(PERIOD_END - (days - 1 - index) * MS_DAY);
    const wave = 1 + 0.05 * Math.sin((index / 28) * Math.PI * 2);
    const jitter = 0.93 + unit(index + 3) * 0.14;
    rows.push({
      date,
      revenue: (3400 + 1500 * progress) * wave * jitter,
      orders: (34 + 18 * progress) * (0.94 + unit(index + 11) * 0.12),
      customers:
        index === days - 1
          ? dashboardStats.customers
          : Math.round(
              2410 +
                (dashboardStats.customers - 2410) * progress +
                (unit(index + 5) - 0.5) * 6,
            ),
      conversion:
        Math.round((3.8 + 0.9 * progress + (unit(index + 17) - 0.5) * 0.2) * 10) /
        10,
    });
  }

  const recent = rows.slice(-30);
  const revenueScale =
    dashboardStats.revenue / recent.reduce((sum, row) => sum + row.revenue, 0);
  const orderScale =
    dashboardStats.orders / recent.reduce((sum, row) => sum + row.orders, 0);

  const scaled = rows.map((row) => ({
    ...row,
    revenue: Math.round(row.revenue * revenueScale),
    orders: Math.max(1, Math.round(row.orders * orderScale)),
  }));

  const last = scaled[scaled.length - 1];
  last.conversion = dashboardStats.conversionRate;
  last.revenue +=
    dashboardStats.revenue -
    scaled.slice(-30).reduce((sum, row) => sum + row.revenue, 0);
  last.orders +=
    dashboardStats.orders -
    scaled.slice(-30).reduce((sum, row) => sum + row.orders, 0);

  return scaled;
}

const dailySeries = buildDailySeries();

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function weekLabel(date: Date) {
  const mondayOffset = (date.getUTCDay() + 6) % 7;
  const monday = new Date(date.getTime() - mondayOffset * MS_DAY);
  return dayLabel(monday);
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

function aggregate(
  rows: DailyMetric[],
  bucket: (date: Date) => string,
): AnalyticsPoint[] {
  const groups = new Map<string, DailyMetric[]>();
  for (const row of rows) {
    const key = bucket(row.date);
    const group = groups.get(key);
    if (group) group.push(row);
    else groups.set(key, [row]);
  }

  return [...groups.entries()].map(([label, group]) => ({
    label,
    revenue: group.reduce((sum, row) => sum + row.revenue, 0),
    orders: group.reduce((sum, row) => sum + row.orders, 0),
    customers: group[group.length - 1].customers,
    conversion:
      Math.round(
        (group.reduce((sum, row) => sum + row.conversion, 0) / group.length) * 10,
      ) / 10,
  }));
}

export function getAnalyticsSeries(range: DateRange): AnalyticsPoint[] {
  const count = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
  const slice = dailySeries.slice(-count);

  if (range === "12m") return aggregate(slice, monthLabel);
  if (range === "90d") return aggregate(slice, weekLabel);

  return slice.map((row) => ({
    label: dayLabel(row.date),
    revenue: row.revenue,
    orders: row.orders,
    customers: row.customers,
    conversion: row.conversion,
  }));
}

export function createAnalysisSnapshot(
  preferences?: AnalysisSnapshot["preferences"],
): AnalysisSnapshot {
  return {
    stats: dashboardStats,
    monthlyRevenue,
    salesByCategory,
    customerSummary,
    preferences,
  };
}
