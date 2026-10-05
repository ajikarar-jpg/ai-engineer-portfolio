import type { AssistantLanguage } from "@/lib/portfolioAssistantTypes";

export type AgentCard = {
  title: string;
  columns: { heading: string; items: string[] }[];
  action?: { label: string; href: string };
};

export const suggestedPrompts = [
  "Help me plan an AI product",
  "Build an e-commerce concept",
  "How can I automate my business?",
  "Help me design a dashboard",
] as const;

export const cartTotalSource = `function cartTotal(lines) {
  return lines.reduce((sum, line) => {
    return sum + line.price * line.quantity;
  }, 0);
}`;

type Pack = Record<AssistantLanguage, string>;

function tr(language: AssistantLanguage, pack: Pack) {
  return pack[language];
}

export function askProducts(language: AssistantLanguage) {
  return tr(language, {
    en: "Sure. What type of products will you sell?",
    de: "Gern. Welche Art von Produkten möchten Sie verkaufen?",
    ar: "حاضر. ما نوع المنتجات التي ستبيعها؟",
  });
}

export function productFollowUp(language: AssistantLanguage, product: string) {
  return tr(language, {
    en: `Got it. A ${product} e-commerce store could include product categories, variants, cart, checkout and order management.`,
    de: `Verstanden. Ein ${product}-Shop kann Kategorien, Varianten, Warenkorb, Checkout und Bestellverwaltung enthalten.`,
    ar: `تمام. متجر ${product} يمكن أن يشمل تصنيفات، ومتغيرات، وسلة، وإتمام الطلب، وإدارة الطلبات.`,
  });
}

export function storeOverview(language: AssistantLanguage) {
  return tr(language, {
    en: "A custom store usually splits the catalog from the order records. The visitor browses products, the cart holds the selection, and checkout creates an order a person can fulfill.",
    de: "Ein individueller Shop trennt den Katalog von den Bestellungen. Der Besucher sieht Produkte, der Warenkorb hält die Auswahl, der Checkout erzeugt eine Bestellung.",
    ar: "المتجر المخصص يفصل الكتالوج عن سجل الطلبات. الزائر يتصفح المنتجات، والسلة تحفظ الاختيار، وإتمام الطلب ينشئ طلباً يمكن تنفيذه.",
  });
}

export function storeCard(language: AssistantLanguage): AgentCard {
  return {
    title: tr(language, {
      en: "Recommended Architecture",
      de: "Empfohlene Architektur",
      ar: "البنية المقترحة",
    }),
    columns: [
      {
        heading: tr(language, { en: "Frontend", de: "Frontend", ar: "الواجهة" }),
        items: [
          tr(language, { en: "Product Catalog", de: "Produktkatalog", ar: "كتالوج المنتجات" }),
          tr(language, { en: "Cart", de: "Warenkorb", ar: "السلة" }),
          tr(language, { en: "Checkout", de: "Checkout", ar: "إتمام الطلب" }),
        ],
      },
      {
        heading: tr(language, { en: "Backend", de: "Backend", ar: "الخلفية" }),
        items: [
          tr(language, { en: "Products", de: "Produkte", ar: "المنتجات" }),
          tr(language, { en: "Orders", de: "Bestellungen", ar: "الطلبات" }),
          tr(language, { en: "Customers", de: "Kunden", ar: "العملاء" }),
        ],
      },
    ],
    action: {
      label: tr(language, {
        en: "Explore E-commerce Project",
        de: "E-Commerce-Projekt ansehen",
        ar: "عرض مشروع التجارة الإلكترونية",
      }),
      href: "/work/ecommerce-platform",
    },
  };
}

export function dashboardReply(language: AssistantLanguage) {
  return tr(language, {
    en: "A sales dashboard should start with a few KPIs: revenue, orders, average order value, and the change versus the previous period. Charts that help are revenue over time, orders by day, and top products. Useful sources are the order table, the product catalog, and customer records.",
    de: "Ein Umsatz-Dashboard beginnt mit wenigen Kennzahlen: Umsatz, Bestellungen, durchschnittlicher Bestellwert und die Veränderung zur Vorperiode. Hilfreiche Diagramme sind Umsatz über die Zeit, Bestellungen pro Tag und Top-Produkte. Quellen sind Bestellungen, Katalog und Kunden.",
    ar: "لوحة المبيعات تبدأ بمؤشرات قليلة: الإيراد، وعدد الطلبات، ومتوسط قيمة الطلب، والتغير عن الفترة السابقة. الرسوم المفيدة هي الإيراد عبر الوقت، والطلبات يومياً، وأفضل المنتجات. المصادر هي جدول الطلبات والكتالوج وسجل العملاء.",
  });
}

export function dashboardCard(language: AssistantLanguage): AgentCard {
  return {
    title: tr(language, { en: "Dashboard outline", de: "Dashboard-Umriss", ar: "مخطط اللوحة" }),
    columns: [
      {
        heading: tr(language, { en: "KPIs", de: "Kennzahlen", ar: "المؤشرات" }),
        items: ["Revenue", "Orders", "Average order value"],
      },
      {
        heading: tr(language, { en: "Charts", de: "Diagramme", ar: "الرسوم" }),
        items: [
          tr(language, { en: "Revenue over time", de: "Umsatz über die Zeit", ar: "الإيراد عبر الوقت" }),
          tr(language, { en: "Top products", de: "Top-Produkte", ar: "أفضل المنتجات" }),
        ],
      },
    ],
    action: {
      label: tr(language, {
        en: "View E-commerce Platform",
        de: "E-commerce Platform ansehen",
        ar: "عرض E-commerce Platform",
      }),
      href: "/work/ecommerce-platform",
    },
  };
}

export function automationReply(language: AssistantLanguage) {
  return tr(language, {
    en: "Lead management can be a short workflow: a new lead arrives, the request is classified, a fit score is set, a person is assigned, and a follow-up is drafted for review. The decision stays with a person. This chat only describes the path. It does not run an external model.",
    de: "Lead-Management kann ein kurzer Ablauf sein: eine Anfrage kommt an, wird eingeordnet, bewertet, einer Person zugewiesen, und eine Antwort wird zur Prüfung vorbereitet. Die Entscheidung bleibt bei einem Menschen. Dieser Chat beschreibt den Pfad nur.",
    ar: "إدارة الطلبات يمكن أن تكون مساراً قصيراً: يصل طلب، يُصنَّف، تُوضع درجة ملاءمة، يُسنَد إلى شخص، وتُجهَّز متابعة للمراجعة. القرار يبقى عند الإنسان. هذه المحادثة تصف المسار فقط.",
  });
}

export function bookingReply(language: AssistantLanguage) {
  return tr(language, {
    en: "An appointment system needs services and durations, staff, a calendar of open times, customer details, a confirmation, and a way to reschedule or cancel. An admin view can show today's book, revenue, and which service is booked most. A portfolio version of that flow is a simulated booking, not a live calendar.",
    de: "Ein Terminsystem braucht Leistungen und Dauern, Personal, freie Zeiten, Kundendaten, eine Bestätigung und Umbuchen oder Stornieren. Die Verwaltung zeigt den Tag, den Umsatz und die häufigste Leistung. Die Portfolio-Version ist eine simulierte Buchung, kein echter Kalender.",
    ar: "نظام المواعيد يحتاج خدمات ومدداً، وموظفين، وأوقاتاً متاحة، وبيانات العميل، وتأكيداً، وإعادة جدولة أو إلغاء. لوحة الإدارة تعرض يوم اليوم والإيراد والخدمة الأكثر حجزاً. نسخة الموقع حجز محاكى، وليست تقويماً حقيقياً.",
  });
}

export function bookingCard(language: AssistantLanguage): AgentCard {
  return {
    title: tr(language, { en: "Booking scope", de: "Buchungsumfang", ar: "نطاق الحجز" }),
    columns: [
      {
        heading: tr(language, { en: "Visitor", de: "Besucher", ar: "الزائر" }),
        items: [
          tr(language, { en: "Service", de: "Leistung", ar: "الخدمة" }),
          tr(language, { en: "Staff and time", de: "Personal und Zeit", ar: "الموظف والوقت" }),
          tr(language, { en: "Confirmation", de: "Bestätigung", ar: "التأكيد" }),
        ],
      },
      {
        heading: tr(language, { en: "Admin", de: "Verwaltung", ar: "الإدارة" }),
        items: [
          tr(language, { en: "Calendar", de: "Kalender", ar: "التقويم" }),
          tr(language, { en: "Customers", de: "Kunden", ar: "العملاء" }),
          tr(language, { en: "Revenue", de: "Umsatz", ar: "الإيراد" }),
        ],
      },
    ],
    action: {
      label: tr(language, {
        en: "Explore Appointment Booking",
        de: "Terminbuchung ansehen",
        ar: "عرض حجز المواعيد",
      }),
      href: "/work/appointment-booking",
    },
  };
}

export function productPlan(language: AssistantLanguage) {
  return tr(language, {
    en: "Plan the agent around one job first. Keep conversation state, detect the intent, answer in the visitor's language, and only then add tools such as search or a handoff. This demo uses local rules so the product shape is visible without an external model.",
    de: "Planen Sie den Agenten zuerst um eine Aufgabe. Halten Sie den Gesprächsstand, erkennen Sie die Absicht, antworten Sie in der Sprache des Besuchers, und ergänzen Sie danach Werkzeuge. Diese Demo nutzt lokale Regeln, ohne externes Modell.",
    ar: "خطّط للوكيل حول مهمة واحدة أولاً. احفظ حالة المحادثة، تعرّف على القصد، وأجب بلغة الزائر، ثم أضف أدوات مثل البحث أو التحويل. هذا العرض يستخدم قواعد محلية بلا نموذج خارجي.",
  });
}

export function codingReply(language: AssistantLanguage) {
  return tr(language, {
    en: "Here is a small JavaScript function for a cart total. This is a local demo of a coding reply. The snippet is not executed, and this chat is not a production coding agent.",
    de: "Hier ist eine kleine JavaScript-Funktion für eine Warenkorbsumme. Das ist eine lokale Demo einer Code-Antwort. Der Ausschnitt wird nicht ausgeführt, und dieser Chat ist kein produktiver Coding-Agent.",
    ar: "هذه دالة JavaScript صغيرة لمجموع السلة. هذا عرض محلي لرد برمجي. المقطع لا يُنفَّذ، وهذه المحادثة ليست وكيل برمجة إنتاجياً.",
  });
}

export function greeting(language: AssistantLanguage) {
  return tr(language, {
    en: "Hello. I can help you shape a product request: a store, a dashboard, an automation path, a booking system, or a short code example. This is a local simulation.",
    de: "Hallo. Ich kann eine Produktanfrage formen: Shop, Dashboard, Ablauf, Buchungssystem oder ein kurzes Codebeispiel. Das ist eine lokale Simulation.",
    ar: "مرحبا. أقدر أساعد في صياغة طلب: متجر، أو لوحة، أو أتمتة، أو نظام مواعيد، أو مثال برمجي قصير. هذه محاكاة محلية.",
  });
}

export function capabilities(language: AssistantLanguage) {
  return tr(language, {
    en: "In this demo I can outline an AI product, a store, a dashboard, a workflow, a booking system, or a small code snippet. Replies stay in the browser.",
    de: "In dieser Demo skizziere ich ein KI-Produkt, einen Shop, ein Dashboard, einen Ablauf, ein Buchungssystem oder einen kurzen Code. Die Antworten bleiben im Browser.",
    ar: "في هذا العرض أقدر أرسم منتج ذكاء، أو متجراً، أو لوحة، أو مساراً، أو نظام مواعيد، أو مقطعاً برمجياً قصيراً. الردود تبقى في المتصفح.",
  });
}

export function portfolioReply(language: AssistantLanguage) {
  return tr(language, {
    en: "This portfolio has five prototypes: AI Agent Platform, AI Customer Support Platform, Delivery Intelligence, E-commerce Platform, and Appointment Booking Platform.",
    de: "Dieses Portfolio hat fünf Prototypen: AI Agent Platform, AI Customer Support Platform, Delivery Intelligence, E-commerce Platform und Appointment Booking Platform.",
    ar: "هذا الموقع فيه خمسة نماذج: AI Agent Platform وAI Customer Support Platform وDelivery Intelligence وE-commerce Platform وAppointment Booking Platform.",
  });
}

export function unknownReply(language: AssistantLanguage) {
  return tr(language, {
    en: "I can stay with product planning, a store concept, a dashboard, automation, booking, or a short coding example. Ask one of those and I will answer from the local demo.",
    de: "Ich bleibe bei Produktplanung, Shop, Dashboard, Automatisierung, Buchung oder einem kurzen Codebeispiel. Fragen Sie nach einem davon.",
    ar: "أقدر أبقى عند تخطيط المنتج، أو المتجر، أو اللوحة، أو الأتمتة، أو الحجز، أو مثال برمجي قصير. اسأل عن واحد منها.",
  });
}
