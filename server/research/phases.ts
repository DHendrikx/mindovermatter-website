/*
 * De zeven stappen van de research-pipeline: welke instructie, welke eerdere
 * output, welke tools en welke effort per stap. Zie prompt.ts voor de
 * gedeelde methodiek.
 */
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { BetaTextBlockParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { MODEL, runStage, StageError, type Effort } from "./claude.js";
import { METHODOLOGY } from "./prompt.js";
import { ClassificationSchema, OnePagerSchema, type Classification } from "./schema.js";
import type { Language, PhaseEvent, PhaseName, PhaseResult, Report, ReportMeta } from "./types.js";

interface PhaseConfig {
  label: string;
  effort: Effort;
  maxTokens: number;
  webSearches?: number;
  webFetches?: number;
  /** Welke eerdere stappen als context worden meegestuurd. */
  uses: PhaseName[];
  instructions: (meta: ReportMeta) => string;
}

const STAGE_TITLES: Record<PhaseName, string> = {
  dossier: "RESEARCH DOSSIER",
  bull: "BULL ANALYST",
  bear: "BEAR ANALYST",
  valuation: "VALUATION AND WALL STREET REVIEW",
  committee: "INDEPENDENT ANALYST / INVESTMENT COMMITTEE",
  synthesis: "SYNTHESIS",
  onepager: "ONE-PAGE BRIEF DATA",
};

const isCompany = (meta: ReportMeta) => meta.template === "company";

export const PHASE_CONFIG: Record<PhaseName, PhaseConfig> = {
  dossier: {
    label: "Dossier",
    effort: "high",
    maxTokens: 32000,
    webSearches: 12,
    webFetches: 4,
    uses: [],
    instructions: (meta) => `Research the input thoroughly with web search, and use web fetch for primary documents (filings, earnings releases, investor presentations, official statistics) where it adds precision. This dossier is the shared fact base for the Bull, Bear and Valuation analysts, who run in parallel after you, so be complete and exact with numbers, dates and sources. Stop searching once you have what you need.

Write exactly these sections:

## 2. What the investment actually represents
Methodology section 2: what would need to happen for the investment to work, the drivers and exposures listed there${
      isCompany(meta) ? "" : ", the relevant subsectors (do not assume they all benefit from the same conditions)"
    }, and whether the thesis is structural, cyclical, tactical or a combination.

## 3. Current market situation
The latest dated facts: price action, recent results or data releases, news, guidance, macro/commodity context, and how the market is positioned.

## Key data
A table with columns: Item | Value | Date | Type (reported / guidance / consensus / market data / own calculation) | Source.
${
  isCompany(meta)
    ? "Include at least: current share price and date, market cap, shares outstanding, net debt/cash, revenue, EBITDA or operating income, net income, free cash flow (last fiscal year, TTM and next-year consensus), key multiples (EV/EBITDA, P/E, FCF yield), dividend/buyback, stock-based compensation, consensus rating and consensus price target with the number of analysts."
    : "Include the key market metrics for this theme (prices, inventories, supply/demand growth, rates or other relevant numbers) and a candidate list of 6-10 investable instruments across the value chain, including a broad benchmark ETF, each with ticker, current price and date, and consensus target where available."
}`,
  },

  bull: {
    label: "Bull-analist",
    effort: "medium",
    maxTokens: 32000,
    webSearches: 4,
    uses: ["dossier"],
    instructions: () => `You are the Bull Analyst (methodology section 3). Build the strongest evidence-based bull case from the dossier; use a few targeted searches only for evidence the dossier lacks. Quantify wherever possible and cite dates.

Write exactly one section:

## 4. Bull Analyst
The 4-8 strongest bullish arguments, then "BULL THESIS IN ONE SENTENCE" and "TOP 3 BULLISH CATALYSTS".`,
  },

  bear: {
    label: "Bear-analist",
    effort: "medium",
    maxTokens: 32000,
    webSearches: 4,
    uses: ["dossier"],
    instructions: (meta) => `You are the independent Bear Analyst (methodology section 4). You have not seen the bull case and you must not guess at it. Attack the thesis rather than listing generic risks, and test explicitly whether the bullish thesis is already priced in. Use a few targeted searches only for evidence the dossier lacks.${
      isCompany(meta)
        ? " Inspect GAAP results as well as adjusted metrics and say where adjusted EBITDA, adjusted EPS or FCF may overstate the economics accruing to shareholders."
        : ""
    }

Write exactly one section:

## 5. Bear Analyst
The 4-8 strongest bearish arguments, then "BEAR THESIS IN ONE SENTENCE" and "TOP 3 RISKS THAT COULD BREAK THE BULL CASE".`,
  },

  valuation: {
    label: "Waardering",
    effort: "high",
    maxTokens: 32000,
    webSearches: 8,
    webFetches: 2,
    uses: ["dossier"],
    instructions: (meta) =>
      isCompany(meta)
        ? `You are the valuation analyst. Build an independent intrinsic valuation (methodology section 6) and the Wall Street review (methodology section 8). Verify the latest share price and the most recent analyst targets with web search. Show your working in tables so the numbers can be checked.

Write exactly these sections:

## 7. Valuation
At least two methods. A table of BEAR / BASE / BULL cases with every key assumption (revenue, margin, tax, capex, working capital, FCF, net debt, dilution and SBC, share count, WACC, terminal growth or exit multiple). Then: current share price with date, bear / base / bull intrinsic value per share, the central reasonable valuation range, and the reverse-engineered market price ("what must be true for today's price to be fair").

## 8. Wall Street consensus
A table of 5-8 recent analysts (Analyst | Rating | Target | Date | Upside/downside), then consensus rating, consensus target, high and low target, and whether targets are RISING, STABLE or FALLING and why. Compare consensus with your own valuation.`
        : `You are the valuation analyst for a sector or theme (methodology sections 7 and 8). Do not produce a single intrinsic value. Verify current prices and the most recent analyst targets with web search.

Write exactly these sections:

## 7. Investable expressions
A table of 5-10 candidates across the value chain, including a broad benchmark ETF: Instrument | Ticker | Exposure | Current price (date) | Consensus target | Implied upside/downside | Key thesis | Main risk | Confidence /5. Include non-equity or direct-asset exposures where they represent the thesis more directly. Explain the confidence scores briefly below the table.

## 8. Wall Street review
For the main 5-8 candidates: consensus rating, consensus target, recent changes and whether targets are rising, stable or falling and why. Treat consensus as a cross-check, not as proof.`,
  },

  committee: {
    label: "Onafhankelijke analist",
    effort: "high",
    maxTokens: 24000,
    uses: ["dossier", "bull", "bear", "valuation"],
    instructions: () => `You are the Independent Analyst (methodology section 5). You did not construct either case. Review the bull case, the bear case and the valuation against the dossier. Do not simply average the two sides.

Write exactly one section:

## 6. Independent Analyst review
Which side has the stronger evidence, which arguments are strongest, which are weak or already priced in, what information would change the conclusion and what the market appears to be pricing today. Include one line exactly in the form "Bull XX% / Bear XX%" (relative strength of the evidence, not a price probability). Then STRONGEST BULL ARGUMENT, STRONGEST BEAR ARGUMENT, WHAT THE MARKET MAY BE MISSING, WHAT THE MARKET APPEARS TO ALREADY PRICE IN and MOST IMPORTANT UNKNOWN.`,
  },

  synthesis: {
    label: "Synthese",
    effort: "medium",
    maxTokens: 32000,
    uses: ["dossier", "bull", "bear", "valuation", "committee"],
    instructions: (meta) => `You write the remaining sections of the report from the earlier stages. Stay consistent with their numbers; do not introduce new data.

Write exactly these sections, in this order:

## 1. Executive summary
A short, decision-oriented summary a reader can understand without the rest of the report.

## 9. Investable alternatives / related opportunities
${
  isCompany(meta)
    ? "3-6 related or alternative instruments (peers, ETFs, suppliers, direct exposures) with one line each on why they are relevant."
    : "Refer to the candidates in section 7 and add the direct-asset and non-equity exposures (commodities, futures curves, infrastructure, physical assets, ETFs) worth watching."
}

## 10. Key risks
The key risks, ranked, each with what would signal that it is materialising.

## 11. Monitoring dashboard
A table INDICATOR | BULL THESIS STRENGTHENS IF | THESIS WEAKENS IF with 5-10 rows, then NEXT MAJOR CHECKPOINT.

## 12. Bottom line
What must go right, what could go wrong, what would change the thesis, and whether the opportunity is structural, cyclical or tactical. No BUY/SELL declarations.

End with three bold labels on their own lines: **CURRENT THESIS:** (one concise paragraph), **MOST IMPORTANT THING TO WATCH:** (one variable or event) and **NEXT REVIEW DATE / EVENT:** (next logical catalyst).`,
  },

  onepager: {
    label: "One-pager",
    effort: "medium",
    maxTokens: 16000,
    uses: ["dossier", "bull", "bear", "valuation", "committee", "synthesis"],
    instructions: (meta) => `Produce the data for the one-page A4 investment brief as JSON matching the schema. The brief is rendered by a fixed, professionally designed template, so you only supply content. It must be understandable by somebody who has not read the report.

Rules:
- Use only numbers that appear in the earlier stages. Do not invent or re-estimate anything.
- Keep intrinsic valuation strictly separate from analyst consensus.
- Balance the bull and bear points; take the percentages and the verdict from the Independent Analyst.
- Respect the approximate character limits in the schema descriptions; the page must fit on one A4 sheet. Short, concrete phrasing beats completeness.
- template must be "${meta.template}". ${
      isCompany(meta)
        ? 'Fill "company" and set "landscape" to null. Fundamentals: one metric, 3-6 periods, label actuals and estimates correctly.'
        : 'Fill "landscape" and set "company" to null. Candidates: 5-8, including the broad benchmark ETF where relevant.'
    }
- Text fields are written in the report language; enum values stay as defined.`,
  },
};

function languageInstruction(language: Language): string {
  return language === "nl"
    ? "Write everything in Dutch (Nederlands). Keep tickers, company names and standard financial terms and abbreviations (EBITDA, FCF, EPS, EV/EBITDA, DCF, WACC, ETF, GAAP) as they are. Translate the section titles but keep their numbers."
    : "Write everything in English.";
}

/*
 * Opbouw van het gebruikersbericht, ingericht op prompt caching.
 *
 * Volgorde: (1) rapportcontext, per rapport steeds byte-identiek; (2) de
 * uitkomsten van eerdere stappen, altijd in dezelfde vaste volgorde; (3) pas
 * als laatste de stap-specifieke opdracht. Stappen met dezelfde tools en
 * denkstand delen zo een identiek voorvoegsel en lezen dat uit de cache in
 * plaats van het opnieuw te betalen (bull en bear delen het dossier;
 * de one-pager leest alles tot en met de onafhankelijke analist mee van de
 * synthese). Het cachepunt staat op het laatste blok met eerdere uitkomsten.
 *
 * Let op: niets dynamisch (datum van vandaag, stapnummer, ids) vóór dat
 * cachepunt zetten. De datum komt daarom uit meta.createdAt.
 */
function contextBlock(meta: ReportMeta): string {
  return [
    "REPORT CONTEXT",
    `TODAY: ${meta.createdAt.slice(0, 10)}`,
    `INPUT: ${meta.input}`,
    `CLASSIFIED AS: ${meta.kind} — ${meta.displayName}${meta.ticker ? ` (${meta.ticker})` : ""}`,
    `OPTIONAL USER THESIS / CONTEXT: ${meta.context.trim() || "none"}`,
    `REPORT LANGUAGE: ${languageInstruction(meta.language)}`,
  ].join("\n");
}

const PRIOR_INTRO =
  "OUTPUT OF EARLIER STAGES (treat as the evidence base; do not repeat it verbatim). The task for this stage follows after them.";

function instructionsBlock(meta: ReportMeta, phase: PhaseName): string {
  const index = PHASES_IN_ORDER.indexOf(phase) + 1;
  return `STAGE ${index} of 7 — ${STAGE_TITLES[phase]}\n\nTASK:\n${PHASE_CONFIG[phase].instructions(meta)}`;
}

const PHASES_IN_ORDER = Object.keys(STAGE_TITLES) as PhaseName[];

export function buildUserContent(report: Report, phase: PhaseName): BetaTextBlockParam[] {
  const uses = PHASE_CONFIG[phase].uses;
  const blocks: BetaTextBlockParam[] = [{ type: "text", text: contextBlock(report.meta) }];

  if (uses.length) {
    blocks.push({ type: "text", text: PRIOR_INTRO });
    // `uses` staat in de vaste volgorde dossier, bull, bear, valuation, committee, synthesis.
    for (const prior of uses) {
      const result = report.phases[prior];
      if (!result?.markdown) throw new StageError(`De stap "${PHASE_CONFIG[prior].label}" is nog niet klaar.`);
      blocks.push({ type: "text", text: `<stage name="${prior}">\n${result.markdown}\n</stage>` });
    }
    blocks[blocks.length - 1] = { ...blocks[blocks.length - 1], cache_control: { type: "ephemeral" } };
  }

  blocks.push({ type: "text", text: instructionsBlock(report.meta, phase) });
  return blocks;
}

export async function executePhase(
  report: Report,
  phase: PhaseName,
  emit: (event: PhaseEvent) => void,
  signal: AbortSignal,
): Promise<PhaseResult> {
  const config = PHASE_CONFIG[phase];
  const started = Date.now();
  const user = buildUserContent(report, phase);

  const result = await runStage({
    system: METHODOLOGY,
    user,
    effort: config.effort,
    maxTokens: config.maxTokens,
    webSearches: config.webSearches,
    webFetches: config.webFetches,
    outputFormat: phase === "onepager" ? betaZodOutputFormat(OnePagerSchema) : undefined,
    signal,
    emit,
  });

  const base: PhaseResult = {
    phase,
    sources: result.sources,
    usage: result.usage,
    model: result.model,
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
  };

  if (phase === "onepager") {
    const candidate = result.parsed ?? safeJson(result.text);
    const parsed = OnePagerSchema.safeParse(candidate);
    if (!parsed.success) {
      throw new StageError("De one-pager-data voldeed niet aan het schema. Probeer de stap opnieuw.");
    }
    return { ...base, data: parsed.data };
  }

  if (!result.text) throw new StageError("De stap leverde geen tekst op. Probeer hem opnieuw.");
  return { ...base, markdown: result.text };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Bepaalt bij het aanmaken wat voor input het is en welk template past. */
export async function classifyInput(
  input: string,
  context: string,
  signal: AbortSignal,
): Promise<{ classification: Classification; costUsd: number }> {
  const result = await runStage({
    system:
      "You classify an investment research input. Decide whether it is a single listed company (stock), an ETF, a commodity or physical asset, an investment theme, or an industry/broad sector, and return a clean display name and primary ticker. If a company name is ambiguous, pick the most prominent listed company with that name.",
    user: `INPUT: ${input}\nOPTIONAL CONTEXT: ${context.trim() || "none"}`,
    effort: "low",
    maxTokens: 4000,
    outputFormat: betaZodOutputFormat(ClassificationSchema),
    signal,
    emit: () => undefined,
  });
  const parsed = ClassificationSchema.safeParse(result.parsed ?? safeJson(result.text));
  if (!parsed.success) throw new StageError("Kon de input niet classificeren. Probeer het opnieuw.");
  const classification = parsed.data;
  // Alleen een losse onderneming krijgt het bedrijfstemplate.
  classification.template = classification.kind === "stock" ? "company" : "landscape";
  return { classification, costUsd: result.usage.costUsd };
}

export { MODEL };
