export type TicketStatus = "Open" | "In Progress" | "Waiting for Customer" | "Resolved";
export type Priority = "Low" | "Medium" | "High";

export type SupportArticle = {
  id: string;
  title: string;
  category: string;
  summary: string;
  facts: { en: string; de: string; ar: string };
  keywords: readonly string[];
};

export type SupportCustomer = {
  id: string;
  name: string;
  email: string;
  status: "Active" | "VIP" | "New";
  orders: readonly { id: string; label: string; date: string }[];
  activity: readonly { label: string; date: string }[];
};

export type SupportMessage = {
  id: string;
  from: "customer" | "agent" | "system";
  text: string;
  at: string;
};

export type SupportConversation = {
  id: string;
  customerId: string;
  subject: string;
  status: "Open" | "Waiting" | "Escalated";
  escalated: boolean;
  messages: SupportMessage[];
};

export type SupportTicket = {
  id: string;
  customerId: string;
  conversationId: string | null;
  subject: string;
  category: string;
  priority: Priority;
  status: TicketStatus;
  agent: string;
  created: string;
};

export const ticketStatuses: readonly TicketStatus[] = [
  "Open",
  "In Progress",
  "Waiting for Customer",
  "Resolved",
];

export const supportArticles: readonly SupportArticle[] = [
  {
    id: "shipping",
    title: "Shipping & Delivery",
    category: "Orders",
    summary: "Dispatch windows, tracking, and what to tell a customer when a parcel is late.",
    facts: {
      en: "Standard shipping takes 2–4 business days. Tracking is sent when the parcel leaves the warehouse. A late parcel can be traced from the order number before a replacement is offered.",
      de: "Der Standardversand dauert 2–4 Werktage. Die Sendungsverfolgung kommt, sobald das Paket das Lager verlässt. Eine verspätete Sendung wird zuerst über die Bestellnummer geprüft.",
      ar: "الشحن العادي يستغرق من يومين إلى أربعة أيام عمل. يصل رقم التتبع عند خروج الطرد من المستودع. الطرد المتأخر يُراجع أولاً من رقم الطلب.",
    },
    keywords: ["shipping", "delivery", "package", "parcel", "tracking", "order", "late", "lieferung", "versand", "paket", "توصيل", "شحن", "طرد", "طلب"],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    category: "Billing",
    summary: "Return window, refund timing, and when an agent should open a case.",
    facts: {
      en: "Unworn items can be returned within 30 days. Refunds are reviewed within 5 business days after the return arrives. The original order number is required.",
      de: "Ungetragene Artikel können innerhalb von 30 Tagen zurückgegeben werden. Erstattungen werden innerhalb von 5 Werktagen nach Eingang geprüft. Die Bestellnummer wird benötigt.",
      ar: "يمكن إرجاع القطع غير المستخدمة خلال 30 يوماً. تُراجع المبالغ المستردة خلال 5 أيام عمل بعد وصول المرتجع. رقم الطلب مطلوب.",
    },
    keywords: ["refund", "return", "money back", "erstattung", "ruckgabe", "استرداد", "استرجاع", "ارجاع"],
  },
  {
    id: "payments",
    title: "Payment Methods",
    category: "Billing",
    summary: "Cards, duplicate charges, and when a billing review should be opened.",
    facts: {
      en: "A duplicate card charge is often a pending authorization and usually drops off within 3 business days. If it posts, support opens a billing review with the order number.",
      de: "Eine doppelte Kartenbelastung ist oft eine vorgemerkte Autorisierung und fällt meist innerhalb von 3 Werktagen weg. Wenn sie gebucht wird, öffnet der Support eine Prüfung mit der Bestellnummer.",
      ar: "الخصم المكرر على البطاقة غالباً تفويض معلّق ويسقط عادة خلال 3 أيام عمل. إذا تم الترحيل، يفتح الدعم مراجعة للفاتورة برقم الطلب.",
    },
    keywords: ["payment", "card", "charged", "charge", "billing", "zahlung", "karte", "دفع", "بطاقه", "خصم"],
  },
  {
    id: "account",
    title: "Account Management",
    category: "Account",
    summary: "Login, password resets, and confirming the email on the account.",
    facts: {
      en: "Password reset links expire after 30 minutes. If login still fails, support confirms the email on the account and sends a new link. The password itself is never read back.",
      de: "Links zum Zurücksetzen des Passworts verfallen nach 30 Minuten. Wenn die Anmeldung weiter scheitert, prüft der Support die E-Mail und sendet einen neuen Link. Das Passwort wird nicht vorgelesen.",
      ar: "تنتهي روابط إعادة تعيين كلمة المرور بعد 30 دقيقة. إذا استمر فشل الدخول، يؤكد الدعم البريد ويرسل رابطاً جديداً. لا تُقرأ كلمة المرور.",
    },
    keywords: ["login", "password", "account", "sign in", "passwort", "konto", "anmelden", "حساب", "دخول", "كلمه", "مرور"],
  },
  {
    id: "appointments",
    title: "Appointments",
    category: "Scheduling",
    summary: "How far ahead a booking can move, and which slot can be offered.",
    facts: {
      en: "Appointments can be moved until 12 hours before the start time. The new time has to be an open slot for the same service. A changed booking keeps the same customer record.",
      de: "Termine können bis 12 Stunden vor Beginn verschoben werden. Die neue Zeit muss ein freier Platz für dieselbe Leistung sein. Die Buchung bleibt am selben Kunden.",
      ar: "يمكن نقل الموعد حتى 12 ساعة قبل بدايته. الوقت الجديد يجب أن يكون خانة متاحة لنفس الخدمة. الحجز يبقى على نفس سجل العميل.",
    },
    keywords: ["appointment", "booking", "reschedule", "termin", "buchung", "verschieben", "موعد", "حجز"],
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    category: "General",
    summary: "Damaged goods, how a case stays with one agent, and what the customer should send.",
    facts: {
      en: "Damaged items are replaced or refunded after a photo and the order number. A ticket keeps the case with one agent so the customer is not asked to repeat it.",
      de: "Beschädigte Artikel werden ersetzt oder erstattet, sobald ein Foto und die Bestellnummer vorliegen. Ein Ticket hält den Fall bei einer Person.",
      ar: "القطع التالفة تُستبدل أو تُسترد بعد صورة ورقم الطلب. التذكرة تبقي الحالة مع موظف واحد حتى لا يعيد العميل الشرح.",
    },
    keywords: ["problem", "broken", "damaged", "issue", "faq", "fehler", "defekt", "مشكله", "عطل", "تالف"],
  },
];

export const supportCustomers: readonly SupportCustomer[] = [
  {
    id: "nora",
    name: "Nora Ellison",
    email: "nora.ellison@northline.example",
    status: "Active",
    orders: [{ id: "NL-1042", label: "Linen jacket", date: "28 Sep 2026" }],
    activity: [
      { label: "Placed order NL-1042", date: "28 Sep 2026" },
      { label: "Opened a status question", date: "04 Oct 2026" },
    ],
  },
  {
    id: "jonah",
    name: "Jonah Peck",
    email: "jonah.peck@northline.example",
    status: "VIP",
    orders: [{ id: "NL-0988", label: "Wool jacket", date: "12 Sep 2026" }],
    activity: [
      { label: "Placed order NL-0988", date: "12 Sep 2026" },
      { label: "Asked for a refund", date: "03 Oct 2026" },
    ],
  },
  {
    id: "amina",
    name: "Amina Darwish",
    email: "amina.darwish@northline.example",
    status: "Active",
    orders: [{ id: "NL-1210", label: "Ceramic set", date: "01 Oct 2026" }],
    activity: [
      { label: "Placed order NL-1210", date: "01 Oct 2026" },
      { label: "Reported a late parcel", date: "05 Oct 2026" },
    ],
  },
  {
    id: "lena",
    name: "Lena Voss",
    email: "lena.voss@northline.example",
    status: "Active",
    orders: [],
    activity: [
      { label: "Booked consultation, Thursday 10:00", date: "22 Sep 2026" },
      { label: "Asked to move the appointment", date: "04 Oct 2026" },
    ],
  },
  {
    id: "marcus",
    name: "Marcus Hale",
    email: "marcus.hale@northline.example",
    status: "New",
    orders: [{ id: "NL-1104", label: "Table lamp", date: "27 Sep 2026" }],
    activity: [
      { label: "Placed order NL-1104", date: "27 Sep 2026" },
      { label: "Reported damage", date: "05 Oct 2026" },
    ],
  },
  {
    id: "priya",
    name: "Priya Shah",
    email: "priya.shah@northline.example",
    status: "Active",
    orders: [{ id: "NL-1077", label: "Repair visit", date: "18 Sep 2026" }],
    activity: [
      { label: "Paid for repair visit NL-1077", date: "18 Sep 2026" },
      { label: "Reported a duplicate charge", date: "02 Oct 2026" },
    ],
  },
  {
    id: "omar",
    name: "Omar Nasser",
    email: "omar.nasser@northline.example",
    status: "Active",
    orders: [],
    activity: [
      { label: "Created an account", date: "02 Aug 2026" },
      { label: "Asked for help signing in", date: "05 Oct 2026" },
    ],
  },
];

const conversationSeed: readonly SupportConversation[] = [
  {
    id: "c-nora",
    customerId: "nora",
    subject: "Where is order NL-1042?",
    status: "Open",
    escalated: false,
    messages: [
      { id: "c-nora-1", from: "customer", text: "Hi, I need an update on order NL-1042. The site said it would ship this week.", at: "09:14" },
      { id: "c-nora-2", from: "agent", text: "Thanks Nora. I am looking up that order on the profile now.", at: "09:18" },
      { id: "c-nora-3", from: "customer", text: "Can you tell me the status of order NL-1042?", at: "09:21" },
    ],
  },
  {
    id: "c-jonah",
    customerId: "jonah",
    subject: "Refund for the wool jacket",
    status: "Open",
    escalated: false,
    messages: [
      { id: "c-jonah-1", from: "customer", text: "The jacket from order NL-0988 does not fit. I want my money back.", at: "11:02" },
      { id: "c-jonah-2", from: "agent", text: "I can see the order. I will check the return window before I confirm anything.", at: "11:06" },
      { id: "c-jonah-3", from: "customer", text: "Please start the refund. I have not worn it.", at: "11:09" },
    ],
  },
  {
    id: "c-amina",
    customerId: "amina",
    subject: "Late parcel",
    status: "Waiting",
    escalated: false,
    messages: [
      { id: "c-amina-1", from: "customer", text: "مرحبا، الطلب تأخر عن الموعد.", at: "13:40" },
      { id: "c-amina-2", from: "agent", text: "أراجع رقم الطلب NL-1210 الآن.", at: "13:44" },
      { id: "c-amina-3", from: "customer", text: "متى يوصل الطرد؟ الشحن تأخر.", at: "13:47" },
    ],
  },
  {
    id: "c-lena",
    customerId: "lena",
    subject: "Move Thursday's appointment",
    status: "Open",
    escalated: false,
    messages: [
      { id: "c-lena-1", from: "customer", text: "Guten Tag, ich habe am Donnerstag um 10:00 einen Termin.", at: "08:12" },
      { id: "c-lena-2", from: "agent", text: "Guten Tag Lena. Ich sehe die Beratung am Donnerstag.", at: "08:16" },
      { id: "c-lena-3", from: "customer", text: "Ich möchte meinen Termin am Donnerstag verschieben.", at: "08:19" },
    ],
  },
  {
    id: "c-marcus",
    customerId: "marcus",
    subject: "Lamp arrived damaged",
    status: "Open",
    escalated: false,
    messages: [
      { id: "c-marcus-1", from: "customer", text: "Order NL-1104 arrived today.", at: "16:05" },
      { id: "c-marcus-2", from: "agent", text: "Sorry to hear there is an issue. What happened to the lamp?", at: "16:08" },
      { id: "c-marcus-3", from: "customer", text: "The lamp is broken. This is a problem with the item I received.", at: "16:11" },
    ],
  },
  {
    id: "c-priya",
    customerId: "priya",
    subject: "Card charged twice",
    status: "Open",
    escalated: false,
    messages: [
      { id: "c-priya-1", from: "customer", text: "I paid for the repair visit NL-1077 last month.", at: "10:22" },
      { id: "c-priya-2", from: "agent", text: "I can see that payment on the profile.", at: "10:25" },
      { id: "c-priya-3", from: "customer", text: "My card was charged twice for the same repair. Can you check the payment?", at: "10:28" },
    ],
  },
  {
    id: "c-omar",
    customerId: "omar",
    subject: "Cannot sign in",
    status: "Waiting",
    escalated: false,
    messages: [
      { id: "c-omar-1", from: "customer", text: "I have been trying to open my account since this morning.", at: "15:02" },
      { id: "c-omar-2", from: "agent", text: "I will not ask you to send the password here.", at: "15:05" },
      { id: "c-omar-3", from: "customer", text: "The login still fails and the password reset never arrives.", at: "15:11" },
    ],
  },
];

const ticketSeed: readonly SupportTicket[] = [
  {
    id: "TCK-1048",
    customerId: "nora",
    conversationId: "c-nora",
    subject: "Order status NL-1042",
    category: "Order",
    priority: "Medium",
    status: "Open",
    agent: "Lena Ortiz",
    created: "04 Oct 2026",
  },
  {
    id: "TCK-1042",
    customerId: "jonah",
    conversationId: "c-jonah",
    subject: "Refund for NL-0988",
    category: "Refund",
    priority: "High",
    status: "In Progress",
    agent: "Samir Haddad",
    created: "03 Oct 2026",
  },
  {
    id: "TCK-1033",
    customerId: "amina",
    conversationId: "c-amina",
    subject: "Late delivery NL-1210",
    category: "Delivery",
    priority: "Medium",
    status: "Waiting for Customer",
    agent: "Maya Chen",
    created: "05 Oct 2026",
  },
  {
    id: "TCK-1019",
    customerId: "marcus",
    conversationId: "c-marcus",
    subject: "Damaged lamp NL-1104",
    category: "Problem",
    priority: "High",
    status: "Open",
    agent: "Lena Ortiz",
    created: "05 Oct 2026",
  },
  {
    id: "TCK-1004",
    customerId: "priya",
    conversationId: "c-priya",
    subject: "Duplicate card charge",
    category: "Payment",
    priority: "High",
    status: "Open",
    agent: "Samir Haddad",
    created: "02 Oct 2026",
  },
  {
    id: "TCK-0988",
    customerId: "omar",
    conversationId: "c-omar",
    subject: "Password reset not received",
    category: "Account",
    priority: "Medium",
    status: "Resolved",
    agent: "Maya Chen",
    created: "20 Sep 2026",
  },
];

export const supportAnalytics = {
  totalConversations: 186,
  averageResponse: "4 min",
  resolutionRate: "91%",
  escalationRate: "8%",
  satisfaction: "4.6/5",
  categories: [
    { label: "Order", count: 42 },
    { label: "Refund", count: 28 },
    { label: "Delivery", count: 36 },
    { label: "Payment", count: 18 },
    { label: "Appointment", count: 22 },
    { label: "Account", count: 24 },
    { label: "Problem", count: 16 },
  ],
  volume: [
    { label: "Mon", count: 12 },
    { label: "Tue", count: 18 },
    { label: "Wed", count: 15 },
    { label: "Thu", count: 21 },
    { label: "Fri", count: 17 },
    { label: "Sat", count: 9 },
    { label: "Sun", count: 6 },
  ],
  agents: [
    { name: "Lena Ortiz", resolved: 46, satisfaction: "4.8", response: "3 min" },
    { name: "Samir Haddad", resolved: 38, satisfaction: "4.6", response: "4 min" },
    { name: "Maya Chen", resolved: 41, satisfaction: "4.5", response: "5 min" },
  ],
} as const;

export function initialConversations(): SupportConversation[] {
  return conversationSeed.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({ ...message })),
  }));
}

export function initialTickets(): SupportTicket[] {
  return ticketSeed.map((ticket) => ({ ...ticket }));
}

export function customerById(id: string) {
  const customer = supportCustomers.find((item) => item.id === id);
  if (!customer) throw new Error(`Unknown customer ${id}`);
  return customer;
}
