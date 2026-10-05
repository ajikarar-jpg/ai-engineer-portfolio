export const DEMO_TODAY = "2026-10-05";

export const bookingServices = [
  {
    id: "consultation",
    name: "Consultation",
    minutes: 60,
    price: 120,
    detail: "A working session to define the problem, the constraints, and the next step.",
    active: true,
  },
  {
    id: "premium",
    name: "Premium Session",
    minutes: 90,
    price: 210,
    detail: "A longer session for scope, architecture, and a written summary.",
    active: true,
  },
  {
    id: "quick",
    name: "Quick Meeting",
    minutes: 30,
    price: 70,
    detail: "A short call to confirm fit and timing.",
    active: true,
  },
] as const;

export const staffMembers = [
  { id: "lena", name: "Lena Ortiz", role: "Advisor", active: true },
  { id: "marcus", name: "Marcus Hale", role: "Specialist", active: true },
  { id: "priya", name: "Priya Shah", role: "Consultant", active: true },
] as const;

export const bookingTimes = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] as const;

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  customerName: string;
  email: string;
  status: AppointmentStatus;
  price: number;
};

export const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type DayHours = { day: number; open: boolean };

export const defaultHours: DayHours[] = weekdayLabels.map((_, day) => ({ day, open: day !== 0 }));

const unavailable = new Set(["2026-10-06|11:00|lena", "2026-10-08|09:00|lena", "2026-10-07|15:00|marcus", "2026-10-09|13:00|priya"]);

export function addDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekday(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function slotKey(date: string, time: string, staffId: string) {
  return `${date}|${time}|${staffId}`;
}

export function presetUnavailable(date: string, time: string, staffId: string) {
  if (unavailable.has(slotKey(date, time, staffId))) return true;
  return time === "15:00" && staffId === "lena";
}

export const seedAppointments: Appointment[] = [
  {
    id: "AB-1008",
    serviceId: "consultation",
    staffId: "lena",
    date: "2026-09-28",
    time: "10:00",
    customerName: "Elena Voss",
    email: "elena.voss@example.com",
    status: "completed",
    price: 120,
  },
  {
    id: "AB-1014",
    serviceId: "premium",
    staffId: "marcus",
    date: "2026-09-22",
    time: "14:00",
    customerName: "Samir Haddad",
    email: "samir.haddad@example.com",
    status: "completed",
    price: 210,
  },
  {
    id: "AB-1019",
    serviceId: "quick",
    staffId: "priya",
    date: "2026-09-18",
    time: "11:00",
    customerName: "Jonah Peck",
    email: "jonah.peck@example.com",
    status: "cancelled",
    price: 70,
  },
  {
    id: "AB-1022",
    serviceId: "consultation",
    staffId: "lena",
    date: "2026-09-15",
    time: "13:00",
    customerName: "Ruth Keller",
    email: "ruth.keller@example.com",
    status: "cancelled",
    price: 120,
  },
  {
    id: "AB-1031",
    serviceId: "quick",
    staffId: "priya",
    date: "2026-10-05",
    time: "11:00",
    customerName: "Amina Darwish",
    email: "amina.darwish@example.com",
    status: "upcoming",
    price: 70,
  },
  {
    id: "AB-1036",
    serviceId: "consultation",
    staffId: "lena",
    date: "2026-10-06",
    time: "10:00",
    customerName: "Nora Ellison",
    email: "nora.ellison@example.com",
    status: "upcoming",
    price: 120,
  },
  {
    id: "AB-1040",
    serviceId: "premium",
    staffId: "marcus",
    date: "2026-10-07",
    time: "14:00",
    customerName: "Julian Crowe",
    email: "julian.crowe@example.com",
    status: "upcoming",
    price: 210,
  },
];

export function monthCells(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<string | null> = Array.from({ length: first }, () => null);
  for (let day = 1; day <= count; day += 1) {
    cells.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function formatMoney(value: number) {
  return `$${value}`;
}
