import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const SYSTEM = `You extract official product economics from a DepVest terms document.
Return ONLY a JSON object (no markdown) with exactly this shape:
{"apy":{"Cash":number|null,"Cloud":number|null,"Digital":number|null},
 "taskReward":{"min":number,"max":number}|null,
 "fees":{"deposit":string|null,"withdrawal":string|null,"performance":string|null,"rebalance":string|null},
 "faqs":[{"q":string,"a":string}],
 "notes":[string]}
Rules: Cash = treasury/cash vault APY, Cloud = AI cloud compute vault APY, Digital = blue-chip/staking vault APY, as percentages (5.2 means 5.2%).
taskReward = USD paid per verified micro-task. Fees are short human-readable strings quoted from the document.
Use null for anything not explicitly stated. Never guess or invent values. faqs: up to 12 question/answer pairs grounded only in the document.
notes: up to 6 short warnings about ambiguities or missing items.`;

export type Extracted = {
  apy: { Cash: number | null; Cloud: number | null; Digital: number | null };
  taskReward: { min: number; max: number } | null;
  fees: { deposit: string | null; withdrawal: string | null; performance: string | null; rebalance: string | null };
  faqs: Array<{ q: string; a: string }>;
  notes: string[];
};

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : null);

export async function extractTerms(document: string): Promise<Extracted> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this app.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  let failure: unknown = null;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: SYSTEM,
    prompt: document,
    onError: ({ error }) => { failure = error; },
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
    },
  });
  const text = await result.text;
  if (failure || !text) {
    const status = (failure as { statusCode?: number } | null)?.statusCode;
    if (status === 402) throw new Error("AI credits are used up. Add credits in workspace billing to continue.");
    if (status === 429) throw new Error("Too many requests right now. Please wait a minute and try again.");
    if (status === 403) throw new Error("AI access is blocked for this workspace.");
    console.error("terms extraction failed", failure);
    throw new Error("The AI could not read this document. Please try again.");
  }
  const raw = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as Record<string, any>;
  const tr = raw["taskReward"];
  return {
    apy: { Cash: num(raw["apy"]?.Cash), Cloud: num(raw["apy"]?.Cloud), Digital: num(raw["apy"]?.Digital) },
    taskReward: tr && num(tr.min) != null && num(tr.max) != null ? { min: tr.min, max: tr.max } : null,
    fees: { deposit: str(raw["fees"]?.deposit), withdrawal: str(raw["fees"]?.withdrawal), performance: str(raw["fees"]?.performance), rebalance: str(raw["fees"]?.rebalance) },
    faqs: (Array.isArray(raw["faqs"]) ? raw["faqs"] : []).filter((f: any) => str(f?.q) && str(f?.a)).slice(0, 12).map((f: any) => ({ q: String(f.q).slice(0, 200), a: String(f.a).slice(0, 1200) })),
    notes: (Array.isArray(raw["notes"]) ? raw["notes"] : []).filter((n: unknown) => typeof n === "string").slice(0, 6),
  };
}
