const replacements: Record<string, string> = {
  u: "you",
  ur: "your",
  bild: "build",
  biuld: "build",
  buld: "build",
  bld: "build",
  stor: "store",
  stors: "stores",
  stoer: "store",
  shpo: "shop",
  shp: "shop",
  shopp: "shop",
  ecomerce: "ecommerce",
  ecommmerce: "ecommerce",
  ecom: "ecommerce",
  commerse: "ecommerce",
  onlineshop: "online shop",
  onlineshops: "online shops",
  onlineshp: "online shop",
  onlinesh: "online shop",
  webshop: "webshop",
  buchungsystem: "buchungssystem",
  buchungsysteme: "buchungssystem",
  chatgtp: "chatgpt",
  appoitment: "appointment",
  appointmnt: "appointment",
  suport: "support",
  suppport: "support",
  custmer: "customer",
  costumer: "customer",
  tcket: "ticket",
  tikcet: "ticket",
};

const lexicon = [
  "store",
  "stores",
  "shop",
  "shops",
  "build",
  "ecommerce",
  "dashboard",
  "dashboards",
  "online",
  "website",
  "software",
  "project",
  "projects",
  "service",
  "services",
  "contact",
  "delivery",
  "automation",
  "custom",
  "mobile",
  "agent",
  "agents",
  "assistant",
  "appointment",
  "booking",
  "support",
  "ticket",
  "tickets",
  "helpdesk",
  "schedule",
  "chatgpt",
  "buchungssystem",
  "saas",
  "bauen",
  "entwickeln",
  "كتروني",
  "متجر",
  "اونلاين",
  "بيع",
  "تجاره",
  "مشاريع",
  "خدمات",
];

function damerau(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 2) return 3;
  const rows: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) rows[i][0] = i;
  for (let j = 0; j <= n; j++) rows[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }
  }
  return rows[m][n];
}

const keep = new Set([
  "show",
  "me",
  "your",
  "you",
  "the",
  "what",
  "can",
  "do",
  "an",
  "for",
  "this",
  "that",
  "with",
  "and",
  "are",
  "how",
  "have",
  "has",
  "not",
  "about",
  "tell",
  "more",
  "like",
  "want",
  "need",
  "from",
  "page",
  "work",
  "data",
  "team",
  "ihr",
  "baut",
  "macht",
  "einen",
  "eine",
  "und",
  "ich",
  "was",
  "wie",
  "kannst",
  "شو",
  "هل",
  "ما",
  "ماذا",
  "ايش",
]);

function stemArabic(token: string) {
  if (!/[\u0600-\u06FF]/.test(token)) return token;
  let next = token;
  while (next.startsWith("ال") && next.length > 4) next = next.slice(2);
  next = next.replace(/(ون|ين|وا|ات)$/, "");
  if (next.endsWith("و") && next.length > 3) next = next.slice(0, -1);
  if (next.endsWith("ه") && lexicon.includes(next.slice(0, -1))) next = next.slice(0, -1);
  return next.length >= 2 ? next : token;
}

function closestWord(token: string) {
  const limit = token.length <= 5 ? 1 : 2;
  let best = token;
  let bestDistance = limit + 1;
  let bestGap = 99;
  for (const word of lexicon) {
    if (Math.abs(word.length - token.length) > 2) continue;
    const distance = damerau(token, word);
    const gap = Math.abs(word.length - token.length);
    if (distance > 0 && distance <= limit && (distance < bestDistance || (distance === bestDistance && gap < bestGap))) {
      best = word;
      bestDistance = distance;
      bestGap = gap;
    }
  }
  return best;
}

export function correctTypos(normalized: string) {
  return normalized
    .split(" ")
    .filter(Boolean)
    .map((token) => {
      if (replacements[token]) return replacements[token];
      const stemmed = stemArabic(token);
      if (keep.has(stemmed) || lexicon.includes(stemmed)) return stemmed;
      if (stemmed.length < 4) return stemmed;
      return closestWord(stemmed);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenClose(token: string, expected: string) {
  if (token === expected) return true;
  if (expected.length < 6 || token.length < 4) return false;
  if (Math.abs(token.length - expected.length) > 2) return false;
  const limit = Math.max(token.length, expected.length) <= 5 ? 1 : 2;
  return damerau(token, expected) <= limit;
}
