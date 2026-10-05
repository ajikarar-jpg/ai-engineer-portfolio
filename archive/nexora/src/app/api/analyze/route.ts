import {
  buildFallbackInsight,
  isAnalysisSnapshot,
  parseInsight,
} from "@/lib/insights";
import type { AnalysisSnapshot } from "@/lib/types";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The request body must be JSON." }, { status: 400 });
  }

  if (!isAnalysisSnapshot(body)) {
    return Response.json(
      { error: "Dashboard data is missing or malformed." },
      { status: 400 },
    );
  }

  const snapshot = normalizeSnapshot(body);
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return Response.json({
      insight: buildFallbackInsight(snapshot),
      source: "fallback",
    });
  }

  try {
    const insight = await requestAnalysis(apiKey, snapshot);
    return Response.json({ insight, source: "openai" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed.";
    return Response.json({ error: message }, { status: 502 });
  }
}

function normalizeSnapshot(snapshot: AnalysisSnapshot): AnalysisSnapshot {
  return {
    ...snapshot,
    monthlyRevenue: snapshot.monthlyRevenue.slice(0, 24),
    salesByCategory: snapshot.salesByCategory.slice(0, 12),
    preferences: snapshot.preferences,
  };
}

async function requestAnalysis(apiKey: string, snapshot: AnalysisSnapshot) {
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(25000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You are the business analyst inside Nexora, a commercial analytics product.",
            "Use only the JSON metrics in the user message. Do not invent campaigns, channels, or customers.",
            "Return JSON with keys summary (string), findings (3 to 5 strings), recommendations (exactly 3 strings), and risk (one string).",
            "Mention specific numbers. Amounts in the data are euros.",
            "If the headline revenue and the monthly series look inconsistent, say so plainly.",
            "Honor preferences.focus and preferences.detail when present. Detailed may use slightly longer sentences. Concise stays tight.",
          ].join(" "),
        },
        { role: "user", content: JSON.stringify(snapshot) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`The analysis service returned ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("The analysis service returned an empty response.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("The analysis service returned an unreadable response.");
  }

  const insight = parseInsight(parsed);
  if (!insight) throw new Error("The analysis service returned an incomplete response.");
  return insight;
}
