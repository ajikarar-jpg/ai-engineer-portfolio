import type { AssistantLanguage } from "@/lib/portfolioAssistantTypes";

export function normalizeQuestion(input: string) {
  return input
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/['’`]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string) {
  return new Set(text.split(" ").filter(Boolean));
}

export function detectLanguage(original: string, normalized: string): AssistantLanguage {
  const arabic = original.replace(/[\u064B-\u0652\u0670\u0640\u060C\u061B\u061F]/g, "").match(/[\u0600-\u06FF]/g)?.length ?? 0;
  const latin = original.match(/[A-Za-zÄÖÜäöüß]/g)?.length ?? 0;
  const german =
    /\b(kannst|koennen|koennt|konnt|baut|bauen|bau|mir|macht|ihr|nicht|projekte|leistungen|hallo|kosten|preis|ich|fuer|moechte|brauche|entwickel|erstell|termin|buchung)\b/.test(
      normalized,
    );
  if (arabic === 0) return german ? "de" : "en";
  if (latin === 0) return "ar";
  if (german && latin >= arabic) return "de";
  return arabic > latin ? "ar" : "en";
}

export function looksLikeQuestion(normalized: string, original: string) {
  if (original.includes("?")) return true;
  return /^(do you|can you|could you|would you|are you|what |how |tell me|show |which |who |kannst |konnen |koennen |koennt |baut |macht |baust |was |wie |welche |habt |هل |شو |ايش |ما |ماذا )/.test(
    normalized,
  );
}
