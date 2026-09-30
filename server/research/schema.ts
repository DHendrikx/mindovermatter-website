/*
 * Zod-schema's voor de gestructureerde output (structured outputs).
 * Lengtebeperkingen staan bewust in de beschrijvingen en niet als harde
 * constraints: een paar tekens te veel mag een rapport niet laten mislukken.
 * Het A4-template kort te lange tekst zelf in en schaalt de letter terug.
 */
import { z } from "zod";

export const ClassificationSchema = z.object({
  kind: z
    .enum(["stock", "etf", "commodity", "theme", "sector"])
    .describe("What the input is. 'stock' is a single listed company."),
  template: z
    .enum(["company", "landscape"])
    .describe("'company' only for a single listed company; everything else is 'landscape'."),
  displayName: z
    .string()
    .describe("Clean display name, e.g. 'NVIDIA Corporation', 'Energy', 'Uranium', 'Energy Select Sector SPDR Fund'."),
  ticker: z
    .string()
    .nullable()
    .describe("Primary ticker with exchange suffix if not US, e.g. 'NVDA', 'ASML.AS', 'XLE'. Null for sectors, themes and commodities."),
});

export type Classification = z.infer<typeof ClassificationSchema>;

const HeadlineMetric = z.object({
  label: z.string().describe("Short label, max ~26 characters."),
  value: z.string().describe("Formatted value, max ~14 characters, e.g. '$84.20', '12.4x', '+3.1%'."),
  note: z
    .string()
    .describe("Basis and date, max ~40 characters, e.g. 'close 29 Sep 2026', 'consensus', 'own estimate'."),
});

const DashboardRow = z.object({
  indicator: z.string().describe("Max ~32 characters."),
  bull: z.string().describe("Bull thesis strengthens if..., max ~70 characters."),
  bear: z.string().describe("Thesis weakens if..., max ~70 characters."),
});

const CompanyData = z.object({
  currency: z.string().describe("ISO currency of the share price, e.g. 'USD', 'EUR'."),
  currentPrice: z.number().describe("Latest share price from the research, same date as asOf."),
  fundamentals: z.object({
    metric: z.string().describe("The one metric that best shows the fundamental trajectory, e.g. 'Free cash flow', 'Revenue', 'EPS'."),
    unit: z.string().describe("Unit for the values, e.g. 'USD bn', 'EUR m', 'USD per share'."),
    points: z
      .array(
        z.object({
          period: z.string().describe("e.g. '2023', 'FY24', '2026E'."),
          value: z.number(),
          basis: z.enum(["actual", "estimate", "guidance"]),
        }),
      )
      .describe("3 to 6 points in chronological order, actuals first, then estimates/guidance."),
  }),
  valuation: z.object({
    bear: z.number().describe("Bear-case intrinsic value per share."),
    base: z.number().describe("Base-case intrinsic value per share."),
    bull: z.number().describe("Bull-case intrinsic value per share."),
    method: z.string().describe("Methods used, max ~70 characters, e.g. 'DCF + EV/EBITDA, WACC 9%'."),
  }),
  analysts: z
    .array(
      z.object({
        firm: z.string().describe("Max ~22 characters."),
        rating: z.string().describe("Max ~12 characters."),
        target: z.number(),
        date: z.string().describe("YYYY-MM-DD"),
      }),
    )
    .describe("5 to 8 recent analyst targets from the research. Empty if none were found."),
  consensusTarget: z.number().nullable(),
  targetTrend: z.enum(["rising", "stable", "falling", "unknown"]),
});

const LandscapeData = z.object({
  tactical: z
    .array(z.string())
    .describe("Tactical / cyclical exposures, 2 to 5 items, max ~40 characters each."),
  structural: z
    .array(z.string())
    .describe("Structural / long-duration exposures, 2 to 5 items, max ~40 characters each."),
  candidates: z
    .array(
      z.object({
        ticker: z.string().describe("Max ~8 characters."),
        name: z.string().describe("Max ~26 characters."),
        exposure: z.string().describe("Max ~34 characters."),
        currency: z.string(),
        price: z.number().nullable(),
        target: z.number().nullable().describe("Analyst consensus target, null if not available."),
        upsidePct: z
          .number()
          .nullable()
          .describe("Implied analyst upside in percent, e.g. 12.5 or -4. Null if no target."),
        confidence: z.number().describe("Confidence score 1-5 as defined in the methodology."),
      }),
    )
    .describe("5 to 8 investable candidates, including a broad benchmark ETF where relevant."),
  watchlist: z
    .array(
      z.object({
        asset: z.string().describe("Max ~28 characters."),
        note: z.string().describe("Max ~60 characters."),
      }),
    )
    .describe("0 to 5 direct-asset / non-equity items (commodities, futures curves, infrastructure, physical assets)."),
});

export const OnePagerSchema = z.object({
  template: z.enum(["company", "landscape"]),
  title: z.string().describe("Company name or sector/theme, max ~40 characters."),
  ticker: z.string().nullable(),
  asOf: z.string().describe("YYYY-MM-DD date of the market prices used."),
  thesis: z.string().describe("One-sentence core thesis, max ~200 characters."),
  horizon: z
    .array(z.enum(["structural", "cyclical", "tactical"]))
    .describe("Which of these characterise the opportunity."),
  balance: z.object({
    bull: z.number().describe("Bull percentage from the Independent Analyst."),
    bear: z.number().describe("Bear percentage from the Independent Analyst; bull + bear = 100."),
    verdict: z.string().describe("One-line quote from the Independent Analyst, max ~150 characters."),
  }),
  headlineMetrics: z
    .array(HeadlineMetric)
    .describe(
      "Exactly 4 cards. Company: current price, base intrinsic value, analyst consensus target, one key operating metric. Landscape: four key market numbers.",
    ),
  bullPoints: z.array(z.string()).describe("3 to 4 strongest bull arguments, max ~120 characters each."),
  bearPoints: z.array(z.string()).describe("3 to 4 strongest bear arguments, max ~120 characters each."),
  dashboard: z.array(DashboardRow).describe("3 to 5 indicators from the monitoring dashboard."),
  nextCheckpoint: z.string().describe("Next major checkpoint with date if known, max ~80 characters."),
  conclusion: z
    .string()
    .describe(
      "Company: one prominent concluding sentence. Landscape: one paragraph (max ~420 characters) on the strongest part, the weakest part and where the most durable opportunity sits.",
    ),
  company: CompanyData.nullable().describe("Filled for template 'company', otherwise null."),
  landscape: LandscapeData.nullable().describe("Filled for template 'landscape', otherwise null."),
});

export type OnePagerData = z.infer<typeof OnePagerSchema>;
