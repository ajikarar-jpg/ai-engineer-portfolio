import { portfolioKnowledge } from "@/data/portfolioKnowledge";
import type { AssistantLanguage, AssistantReply } from "@/lib/portfolioAssistantTypes";
import { projectFromPath, type IntentResult } from "@/lib/portfolio/intentEngine";
import { cardFor, projectBySlug, rankProjects, serviceIdForProject, type ProjectMatch } from "@/lib/portfolio/recommendationEngine";

function tr(language: AssistantLanguage, pack: Record<AssistantLanguage, string>) {
  return pack[language];
}

const pools: Record<string, Record<AssistantLanguage, string[]>> = {
  explore: {
    en: ["Show me your projects", "Can you build a custom dashboard?", "How do I start a project?"],
    de: ["Welche Projekte gibt es?", "Kannst du ein Dashboard bauen?", "Wie starte ich ein Projekt?"],
    ar: ["شو المشاريع اللي عندك؟", "هل يمكن بناء لوحة تحكم؟", "كيف أبدأ مشروعاً؟"],
  },
  projects: {
    en: ["Tell me about Delivery Intelligence", "What services do you offer?", "How do I start a project?"],
    de: ["Erzähl mir von Delivery Intelligence", "Welche Leistungen bietest du an?", "Wie starte ich ein Projekt?"],
    ar: ["احكي عن Delivery Intelligence", "ما هي الخدمات؟", "كيف أبدأ مشروعاً؟"],
  },
  ai: {
    en: ["Show me your projects", "Can you build a custom AI system?", "How do I start a project?"],
    de: ["Zeig mir die Projekte", "Kannst du ein individuelles KI-System bauen?", "Wie starte ich ein Projekt?"],
    ar: ["شو المشاريع اللي عندك؟", "هل يمكن بناء نظام ذكاء اصطناعي؟", "كيف أبدأ مشروعاً؟"],
  },
  next: {
    en: ["How do I start a project?", "What services do you offer?", "Show me your projects"],
    de: ["Wie starte ich ein Projekt?", "Welche Leistungen bietest du an?", "Zeig mir die Projekte"],
    ar: ["كيف أبدأ مشروعاً؟", "ما هي الخدمات؟", "شو المشاريع اللي عندك؟"],
  },
  listed: {
    en: ["What services do you offer?", "Show me your projects"],
    de: ["Welche Leistungen bietest du an?", "Zeig mir die Projekte"],
    ar: ["ما هي الخدمات؟", "شو المشاريع اللي عندك؟"],
  },
  services: {
    en: ["Do you build online stores?", "Can you build AI systems?", "Show me your projects"],
    de: ["Baut ihr Online-Shops?", "Kannst du KI-Systeme bauen?", "Zeig mir die Projekte"],
    ar: ["هل تبنون متجر إلكتروني؟", "هل تبنون أنظمة ذكاء اصطناعي؟", "شو المشاريع اللي عندك؟"],
  },
  ecommerce: {
    en: ["What can you build?", "Start a project", "How can I contact you?"],
    de: ["Was könnt ihr bauen?", "Projekt starten", "Wie kann ich Sie erreichen?"],
    ar: ["شو بتقدروا تبنوا؟", "ابدأ مشروعاً", "كيف أتواصل معك؟"],
  },
};

export function suggest(pool: string, language: AssistantLanguage, lastKey: string | null) {
  const key = `${pool}:${language}`;
  if (lastKey === key) return { suggestions: undefined, key: lastKey };
  return { suggestions: pools[pool][language].slice(0, 3), key };
}

function buildList(language: AssistantLanguage) {
  return tr(language, {
    en: "AI applications, AI agents, AI automation, customer support, custom software, SaaS products, e-commerce, and appointment booking",
    de: "KI-Anwendungen, KI-Agenten, KI-Automatisierung, Kundensupport, individuelle Software, SaaS-Produkte, E-Commerce und Terminbuchung",
    ar: "تطبيقات ذكاء اصطناعي، ووكلاء ذكاء، وأتمتة، ودعم عملاء، وبرمجيات مخصصة، ومنتجات SaaS، وتجارة إلكترونية، وحجز مواعيد",
  });
}

function viewServices(language: AssistantLanguage) {
  return {
    label: tr(language, { en: "View services", de: "Leistungen ansehen", ar: "عرض الخدمات" }),
    href: "/#services",
  };
}

function viewProjects(language: AssistantLanguage) {
  return {
    label: tr(language, { en: "View all projects", de: "Alle Projekte", ar: "كل المشاريع" }),
    href: "/#projects",
  };
}

function viewProject(language: AssistantLanguage, href: string) {
  return {
    label: tr(language, { en: "View project", de: "Projekt ansehen", ar: "عرض المشروع" }),
    href,
  };
}

export function startAction(language: AssistantLanguage) {
  return {
    label: tr(language, { en: "Start a project", de: "Projekt starten", ar: "ابدأ مشروعاً" }),
    command: "start-project" as const,
  };
}

function contactActions(language: AssistantLanguage, withSubject = false) {
  const email = portfolioKnowledge.contact.email;
  const href = withSubject
    ? `mailto:${email}?subject=${encodeURIComponent(portfolioKnowledge.contact.subject)}`
    : `mailto:${email}`;
  return [
    { label: tr(language, { en: "Email me", de: "E-Mail", ar: "البريد" }), href },
    {
      label: "GitHub",
      href: portfolioKnowledge.contact.github,
      external: true,
    },
  ];
}

function notListed(id: string, language: AssistantLanguage) {
  const item = portfolioKnowledge.capabilities.notListed.find((entry) => entry.id === id);
  const label = item?.label[language] ?? id;
  return tr(language, {
    en: `${label} ${/s$/i.test(label) ? "aren't" : "isn't"} currently listed. I can build ${buildList("en")}.`,
    de: `${label} ist hier nicht aufgeführt. Ich kann ${buildList("de")} bauen.`,
    ar: `${label} غير مذكورة هنا. أقدر أبني ${buildList("ar")}.`,
  });
}

export function recommendationReply(
  matches: ProjectMatch[],
  language: AssistantLanguage,
  lastKey: string | null,
): AssistantReply & { suggestionKey: string | null; projectSlug: string | null; serviceId: string | null } {
  const focus = matches[0].project;
  const suggested = suggest("next", language, lastKey);
  const text = tr(language, {
    en: `That sounds very close to ${focus.name}, ${focus.why.en}.`,
    de: `Das liegt nah an ${focus.name}, ${focus.why.de}.`,
    ar: `هذا قريب من ${focus.name}، ${focus.why.ar}.`,
  });
  return {
    text,
    actions: [],
    cards: [cardFor(focus, language)],
    suggestions: suggested.suggestions,
    suggestionKey: suggested.key,
    projectSlug: focus.slug,
    serviceId: serviceIdForProject(focus.slug),
  };
}

export function followUpReply(
  question: string,
  language: AssistantLanguage,
  previousIntent: IntentResult["intent"] | null,
  _mentionedService: string | null,
  lastKey: string | null,
): AssistantReply & { suggestionKey: string | null; projectSlug: string | null; serviceId: string | null } {
  const matches = rankProjects(question);
  const dashboardContext = previousIntent === "DASHBOARD" || previousIntent === "PROJECT_SIMILARITY";
  const delivery = matches.find((item) => item.project.slug === "delivery-intelligence");
  if (dashboardContext && delivery && delivery.score >= 0.4) {
    const suggested = suggest("next", language, lastKey);
    return {
      text: tr(language, {
        en: `Yes. A business dashboard can cover logistics operations. The closest prototype is Delivery Intelligence, ${delivery.project.why.en}.`,
        de: `Ja. Ein Dashboard kann Logistik abbilden. Der nächste Prototyp ist Delivery Intelligence, ${delivery.project.why.de}.`,
        ar: `نعم. لوحة الأعمال يمكن أن تغطي العمليات اللوجستية. أقرب نموذج هو Delivery Intelligence، ${delivery.project.why.ar}.`,
      }),
      actions: [],
      cards: [cardFor(delivery.project, language)],
      suggestions: suggested.suggestions,
      suggestionKey: suggested.key,
      projectSlug: delivery.project.slug,
      serviceId: null,
    };
  }
  if (matches[0] && matches[0].score >= 0.4) return recommendationReply(matches, language, lastKey);
  const suggested = suggest("listed", language, lastKey);
  return {
    text: tr(language, {
      en: "I can stay on that topic, but I don't have a more specific match on this portfolio. You can ask about the services, the projects, or a system you want to build.",
      de: "Ich bleibe beim Thema, habe dazu aber keine genauere Entsprechung auf dieser Seite. Fragen Sie gern nach Leistungen, Projekten oder einem System, das Sie bauen wollen.",
      ar: "أقدر أبقى على نفس الموضوع، لكن لا يوجد تطابق أدق في هذا الموقع. يمكن السؤال عن الخدمات أو المشاريع أو نظام تريد بناءه.",
    }),
    actions: [viewServices(language)],
    suggestions: suggested.suggestions,
    suggestionKey: suggested.key,
    projectSlug: null,
    serviceId: null,
  };
}

export function answerIntent(input: {
  question: string;
  result: IntentResult;
  pathname: string;
  lastKey: string | null;
}): AssistantReply & { suggestionKey: string | null; projectSlug: string | null; serviceId: string | null } {
  const { result, pathname, lastKey } = input;
  const language = result.language;
  const pageSlug = projectFromPath(pathname);
  const named = projectBySlug(result.projectSlug);
  const pageProject = projectBySlug(pageSlug);

  const pack = (pool: string, text: string, extra: Partial<AssistantReply> = {}, projectSlug = result.projectSlug, serviceId = result.serviceId) => {
    const suggested = suggest(pool, language, lastKey);
    return {
      text,
      actions: extra.actions ?? [],
      cards: extra.cards,
      suggestions: suggested.suggestions,
      suggestionKey: suggested.key,
      projectSlug,
      serviceId,
    };
  };

  if (result.intent === "ECOMMERCE") {
    return pack(
      "ecommerce",
      tr(language, {
        en: "Yes. I build custom online stores and e-commerce platforms.",
        de: "Ja. Ich baue individuelle Online-Shops und E-Commerce-Plattformen.",
        ar: "نعم. أبني متاجر إلكترونية ومنصات تجارة إلكترونية مخصصة.",
      }),
      {
        actions: [
          {
            label: tr(language, {
              en: "View E-commerce Platform",
              de: "E-commerce Platform ansehen",
              ar: "عرض E-commerce Platform",
            }),
            href: "/work/ecommerce-platform",
          },
        ],
      },
      null,
      "ecommerce",
    );
  }
  if (result.intent === "SAAS") {
    return pack(
      "services",
      tr(language, {
        en: "Yes. I can build SaaS products as custom software.",
        de: "Ja. Ich kann SaaS-Produkte als individuelle Software bauen.",
        ar: "نعم، أقدر أبني منتجات SaaS كبرمجيات مخصصة.",
      }),
      { actions: [startAction(language)] },
      null,
      "saas",
    );
  }
  if (result.intent === "AGENTS") {
    const chatgpt = /chatgpt|chat gpt/.test(input.question.toLowerCase());
    return pack(
      "services",
      chatgpt
        ? tr(language, {
            en: "Yes. I can build custom AI-powered conversational applications and agent-style interfaces. The portfolio includes an AI Agent Platform demo.",
            de: "Ja. Ich kann individuelle KI-gestützte Gesprächsanwendungen und Agenten-Oberflächen bauen. Das Portfolio enthält eine AI Agent Platform Demo.",
            ar: "نعم. أقدر أبني تطبيقات محادثة بالذكاء الاصطناعي وواجهات على أسلوب الوكيل. الموقع يتضمن عرض AI Agent Platform.",
          })
        : tr(language, {
            en: "Yes. I build custom AI agents and conversational applications.",
            de: "Ja. Ich baue individuelle KI-Agenten und Gesprächsanwendungen.",
            ar: "نعم. أبني وكلاء ذكاء اصطناعي وتطبيقات محادثة مخصصة.",
          }),
      {
        actions: [
          {
            label: tr(language, {
              en: "View AI Agent Platform",
              de: "AI Agent Platform ansehen",
              ar: "عرض AI Agent Platform",
            }),
            href: "/work/ai-agent-platform",
          },
        ],
      },
      "ai-agent-platform",
      "ai-agents",
    );
  }
  if (result.intent === "SUPPORT") {
    return pack(
      "services",
      tr(language, {
        en: "Yes. I build customer support systems with conversations, a knowledge base, tickets, and escalation.",
        de: "Ja. Ich baue Kundensupport-Systeme mit Gesprächen, einer Wissensbasis, Tickets und Eskalation.",
        ar: "نعم. أبني أنظمة دعم العملاء مع المحادثات وقاعدة المعرفة والتذاكر والتحويل إلى موظف.",
      }),
      {
        actions: [
          {
            label: tr(language, {
              en: "View AI Customer Support Platform",
              de: "AI Customer Support Platform ansehen",
              ar: "عرض AI Customer Support Platform",
            }),
            href: "/work/ai-customer-support",
          },
        ],
      },
      "ai-customer-support",
      "customer-support",
    );
  }
  if (result.intent === "BOOKING") {
    return pack(
      "services",
      tr(language, {
        en: "Yes. I build appointment booking and scheduling systems.",
        de: "Ja. Ich baue Terminbuchungs- und Planungssysteme.",
        ar: "نعم. أبني أنظمة حجز مواعيد وجدولة.",
      }),
      {
        actions: [
          {
            label: tr(language, {
              en: "View Appointment Booking Platform",
              de: "Appointment Booking Platform ansehen",
              ar: "عرض Appointment Booking Platform",
            }),
            href: "/work/appointment-booking",
          },
        ],
      },
      "appointment-booking",
      "appointment-booking",
    );
  }
  if (result.intent === "MOBILE") return pack("listed", notListed("mobile", language), { actions: [viewServices(language)] }, null, null);

  if (result.intent === "PRICING") {
    return pack(
      "next",
      tr(language, {
        en: "Pricing depends on the scope and requirements. There isn't a fixed price list on this portfolio. If you tell me what you'd like to build, I can help you define the scope.",
        de: "Der Preis hängt von Umfang und Anforderungen ab. Eine feste Preisliste gibt es hier nicht. Wenn Sie sagen, was gebaut werden soll, lässt sich der Umfang eingrenzen.",
        ar: "السعر يعتمد على النطاق والمتطلبات. لا توجد قائمة أسعار ثابتة في هذا الموقع. إذا قلت ما الذي تريد بناءه، أقدر أساعد في تحديد النطاق.",
      }),
      { actions: [startAction(language)] },
      null,
      null,
    );
  }

  if (result.intent === "UNLISTED") {
    return pack(
      "listed",
      tr(language, {
        en: "I only describe what is listed on this portfolio. If it is not one of the services or the five projects, I don't have information about it here.",
        de: "Ich beschreibe nur, was hier steht. Steht es nicht bei den Leistungen oder den fünf Projekten, habe ich dazu keine Angabe.",
        ar: "أصف فقط ما هو مذكور هنا. إذا لم يكن ضمن الخدمات أو المشاريع الخمسة، فلا توجد عنه معلومة في هذا الموقع.",
      }),
      { actions: [viewServices(language)] },
      null,
      null,
    );
  }

  if (result.intent === "CONTACT") {
    return {
      ...pack(
        "listed",
        tr(language, {
          en: `You can reach me by email at ${portfolioKnowledge.contact.email}, or view the work on GitHub.`,
          de: `Erreichbar bin ich per E-Mail unter ${portfolioKnowledge.contact.email} oder über GitHub.`,
          ar: `للتواصل: ${portfolioKnowledge.contact.email} أو عبر GitHub.`,
        }),
        { actions: contactActions(language) },
        null,
        null,
      ),
      suggestions: undefined,
    };
  }

  if (result.intent === "TECHNOLOGY") {
    if (result.facet === "openai") {
      const agent = projectBySlug("ai-agent-platform");
      return pack(
        "projects",
        portfolioKnowledge.technologies.openaiNote[language],
        { actions: agent ? [viewProject(language, agent.href)] : [], cards: agent ? [cardFor(agent, language)] : [] },
        "ai-agent-platform",
        "ai-agents",
      );
    }
    const list = portfolioKnowledge.technologies.skills.join(", ");
    return pack(
      "explore",
      tr(language, {
        en: `The site lists ${list}. Each project page also names its own stack. The demos on this site run locally in the browser.`,
        de: `Auf der Seite stehen ${list}. Jede Projektseite nennt zusätzlich ihren eigenen Stack. Die Demos laufen lokal im Browser.`,
        ar: `الموقع يذكر: ${list}. كل صفحة مشروع تذكر تقنياتها أيضاً. العروض التفاعلية تعمل محلياً في المتصفح.`,
      }),
      {},
      null,
      null,
    );
  }

  if (result.intent === "PROJECTS") {
    const names = portfolioKnowledge.projects.map((project) => project.name);
    return pack(
      "projects",
      tr(language, {
        en: `This portfolio showcases five prototypes:\n\n• ${names.join("\n• ")}\n\nYou can open any project below.`,
        de: `Hier stehen fünf Prototypen:\n\n• ${names.join("\n• ")}\n\nJedes Projekt lässt sich unten öffnen.`,
        ar: `أعرض خمسة نماذج:\n\n• ${names.join("\n• ")}\n\nتقدر تفتح أي مشروع من الأزرار تحت.`,
      }),
      {
        actions: [
          ...portfolioKnowledge.projects.map((project) => ({
            label: tr(language, {
              en: `View ${project.name}`,
              de: `${project.name} ansehen`,
              ar: `عرض ${project.name}`,
            }),
            href: project.href,
          })),
          viewProjects(language),
        ],
      },
      null,
      null,
    );
  }

  if (result.intent === "PROJECT_DETAILS" || result.intent === "PROJECT_SIMILARITY") {
    const project = named ?? (result.intent === "PROJECT_SIMILARITY" ? rankProjects(input.question)[0]?.project : null);
    if (project && result.intent === "PROJECT_SIMILARITY") {
      return recommendationReply(rankProjects(input.question), language, lastKey);
    }
    if (project) {
      return pack(
        "projects",
        project.detail[language],
        { cards: [cardFor(project, language)], actions: [viewProject(language, project.href)] },
        project.slug,
        serviceIdForProject(project.slug),
      );
    }
  }

  if (result.intent === "CONTEXT") {
    const project = pageProject ?? named;
    if (project) {
      return pack(
        "projects",
        project.detail[language],
        { cards: [cardFor(project, language)], actions: [viewProject(language, project.href)] },
        project.slug,
        serviceIdForProject(project.slug),
      );
    }
    return pack(
      "projects",
      tr(language, {
        en: "This is an AI engineer portfolio. It presents eight services, five prototype projects, and contact details.",
        de: "Das ist das Portfolio eines AI Engineers. Es zeigt acht Leistungen, fünf Prototypen und die Kontaktwege.",
        ar: "هذه صفحة مهندس ذكاء اصطناعي. تعرض ثماني خدمات، وخمسة نماذج، وطرق التواصل.",
      }),
      { actions: [viewProjects(language)] },
      null,
      null,
    );
  }

  if (result.intent === "DASHBOARD") {
    return pack(
      "next",
      tr(language, {
        en: "Yes. I can build dashboards and analytics views as part of custom software. The prototypes include support analytics, delivery scoring, a store admin, and a booking admin.",
        de: "Ja. Ich kann Dashboards und Auswertungen als Teil individueller Software bauen. Die Prototypen enthalten Support-Analysen, Zustellbewertung, eine Shop-Verwaltung und eine Buchungsverwaltung.",
        ar: "نعم. أقدر أبني لوحات وتحليلات ضمن برمجيات مخصصة. النماذج تتضمن تحليلات الدعم، وتقييم التوصيل، وإدارة المتجر، وإدارة الحجوزات.",
      }),
      { actions: [viewProjects(language)] },
      null,
      "custom-software",
    );
  }

  if (result.intent === "AUTOMATION") {
    return pack(
      "next",
      tr(language, {
        en: "Yes. I can automate business processes: classify an event, apply local rules, and hand the result to a person. The demos on this site use local logic, not an external model.",
        de: "Ja. Ich kann Geschäftsprozesse automatisieren: ein Ereignis einordnen, lokale Regeln anwenden und das Ergebnis einer Person übergeben. Die Demos nutzen lokale Logik, kein externes Modell.",
        ar: "نعم. أقدر أؤتمت عمليات العمل: تصنيف الحدث، وتطبيق قواعد محلية، وتسليم النتيجة لشخص. العروض هنا تستخدم منطقاً محلياً، وليس نموذجاً خارجياً.",
      }),
      { actions: [viewServices(language)] },
      null,
      "ai-automation",
    );
  }

  if (result.intent === "CAPABILITY") {
    return pack(
      "services",
      tr(language, {
        en: `I can build ${buildList("en")}.`,
        de: `Ich kann ${buildList("de")} bauen.`,
        ar: `أقدر أبني ${buildList("ar")}.`,
      }),
      { actions: [startAction(language)] },
      null,
      null,
    );
  }

  if (result.intent === "AI") {
    return pack(
      "ai",
      tr(language, {
        en: "I build AI applications, agents, automation, analytics, prediction, e-commerce, booking systems, and custom software. The five prototypes show those as working local demos.",
        de: "Ich baue KI-Anwendungen, Agenten, Automatisierung, Analysen, Vorhersagen, E-Commerce, Buchungssysteme und individuelle Software. Die fünf Prototypen zeigen das als lokale Demos.",
        ar: "أبني تطبيقات ذكاء اصطناعي، ووكلاء، وأتمتة، وتحليلات، وتوقعاً، وتجارة إلكترونية، وأنظمة حجز، وبرمجيات مخصصة. النماذج الخمسة تعرض ذلك كعروض محلية.",
      }),
      {
        actions: portfolioKnowledge.projects.map((project) => ({ label: project.name, href: project.href })),
      },
      null,
      "ai-applications",
    );
  }

  if (result.intent === "CUSTOM_SOFTWARE") {
    return pack(
      "next",
      tr(language, {
        en: "Yes. Custom software is one of the services listed: purpose-built applications around real business requirements.",
        de: "Ja. Individuelle Software ist aufgeführt: Anwendungen für konkrete Geschäftsanforderungen.",
        ar: "نعم. البرمجيات المخصصة خدمة مذكورة: تطبيقات تُبنى حول متطلبات العمل الفعلية.",
      }),
      { actions: [viewServices(language), startAction(language)] },
      null,
      "custom-software",
    );
  }

  if (result.intent === "SERVICES") {
    return pack(
      "services",
      tr(language, {
        en: `I can build ${buildList("en")}.`,
        de: `Ich kann ${buildList("de")} bauen.`,
        ar: `أقدر أبني ${buildList("ar")}.`,
      }),
      { actions: [startAction(language)] },
      null,
      null,
    );
  }

  if (result.intent === "ABOUT") {
    if (result.facet === "process") {
      const steps = portfolioKnowledge.about.process.map((step) => step.title.toLowerCase()).join(", ");
      return pack(
        "explore",
        tr(language, {
          en: `The process on this site has four steps: ${steps}.`,
          de: "Der Ablauf auf der Seite hat vier Schritte: verstehen, gestalten, bauen, verbessern.",
          ar: "طريقة العمل المذكورة أربع خطوات: افهم، صمّم، ابنِ، ثم حسّن.",
        }),
        { actions: [{ label: tr(language, { en: "About", de: "Über mich", ar: "نبذة" }), href: "/#about" }] },
        null,
        null,
      );
    }
    return pack(
      "explore",
      tr(language, {
        en: `${portfolioKnowledge.about.paragraphs[0]} The focus is AI engineering, software, and automation. I can build ${buildList("en")}.`,
        de: `Ich bin AI Engineer und baue praktische Software. Der Fokus liegt auf KI, Software und Automatisierung. Ich kann ${buildList("de")} bauen.`,
        ar: `أنا مهندس ذكاء اصطناعي وأبني برمجيات عملية. التركيز على الذكاء الاصطناعي والبرمجيات والأتمتة. أقدر أبني ${buildList("ar")}.`,
      }),
      { actions: [viewServices(language)] },
      null,
      null,
    );
  }

  if (result.intent === "GREETING") {
    return pack(
      "explore",
      tr(language, {
        en: "Hello. I can help you explore the services, the five projects, or what it would take to build something.",
        de: "Hallo. Ich kann die Leistungen, die fünf Projekte oder den Einstieg in ein neues System erklären.",
        ar: "مرحبا. أقدر أشرح الخدمات، أو المشاريع الخمسة، أو كيف نبدأ نظاماً جديداً.",
      }),
      {},
      null,
      null,
    );
  }

  if (result.need) {
    const matches = rankProjects(input.question);
    if (matches[0] && matches[0].score >= 0.45) return recommendationReply(matches, language, lastKey);
  }

  return pack(
    "listed",
    tr(language, {
      en: "I don't have information about that on this portfolio. You can ask me about my services, projects, technologies, capabilities, or working together.",
      de: "Dazu steht auf diesem Portfolio nichts. Fragen Sie gern nach Leistungen, Projekten, Technologien oder der Zusammenarbeit.",
      ar: "لا توجد لدي معلومة عن ذلك في هذا الموقع. يمكن السؤال عن الخدمات أو المشاريع أو التقنيات أو العمل معاً.",
    }),
    { actions: [viewServices(language)] },
    null,
    null,
  );
}
