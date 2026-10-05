export type CurrencyCode = "EUR" | "USD" | "GBP";

export type AnalysisFocus = "balanced" | "revenue" | "customers" | "retention";

export type AnalysisDetail = "concise" | "detailed";

export type CustomerStatus = "active" | "vip" | "pending" | "churned";

export type OrderStatus = "paid" | "pending" | "refunded" | "failed";

export type DateRange = "7d" | "30d" | "90d" | "12m";

export type Customer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  status: CustomerStatus;
  lastOrder: string;
};

export type RevenueData = {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
  conversion: number;
};

export type SalesData = {
  category: string;
  revenue: number;
};

export type DashboardStats = {
  revenue: number;
  revenueChange: number;
  customers: number;
  customersChange: number;
  orders: number;
  ordersChange: number;
  conversionRate: number;
  conversionChange: number;
};

export type CustomerActivity = {
  id: string;
  name: string;
  email: string;
  order: string;
  amount: number;
  status: OrderStatus;
  date: string;
};

export type AnalyticsPoint = {
  label: string;
  revenue: number;
  orders: number;
  customers: number;
  conversion: number;
};

export type CustomerSummary = {
  active: number;
  vip: number;
  pending: number;
  churned: number;
};

export type AIInsight = {
  summary: string;
  findings: string[];
  recommendations: string[];
  risk: string;
};

export type AnalysisPreferences = {
  focus: AnalysisFocus;
  detail: AnalysisDetail;
};

export type AnalysisSnapshot = {
  stats: DashboardStats;
  monthlyRevenue: RevenueData[];
  salesByCategory: SalesData[];
  customerSummary: CustomerSummary;
  preferences?: AnalysisPreferences;
};

export type AnalysisResponse = {
  insight: AIInsight;
  source: "openai" | "fallback";
};

export type AppSettings = {
  businessName: string;
  email: string;
  currency: CurrencyCode;
  notifications: {
    orderAlerts: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
  };
  ai: AnalysisPreferences;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
};
