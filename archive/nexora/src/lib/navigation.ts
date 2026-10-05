export const navigation = [
  {
    href: "/",
    label: "Overview",
    description: "Current performance for Nexora",
  },
  {
    href: "/analytics",
    label: "Analytics",
    description: "Trends for the selected range",
  },
  {
    href: "/customers",
    label: "Customers",
    description: "Accounts, spend, and status",
  },
  {
    href: "/revenue",
    label: "Revenue",
    description: "Monthly revenue and category mix",
  },
  {
    href: "/insights",
    label: "AI Insights",
    description: "A written read of the same numbers",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Workspace preferences on this device",
  },
] as const;

export type NavItem = (typeof navigation)[number];

export function getCurrentPage(pathname: string): NavItem {
  if (pathname === "/") return navigation[0];
  return (
    navigation.find((item) => item.href !== "/" && pathname.startsWith(item.href)) ??
    navigation[0]
  );
}
