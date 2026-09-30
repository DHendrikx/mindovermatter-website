/*
 * Gedeelde types voor de Analyst Research-module.
 * De client importeert dit bestand alleen met `import type`, zodat er geen
 * servercode in de browserbundel belandt.
 */

export type Language = "nl" | "en";

/** Welk one-pager-template past bij de input. */
export type Template = "company" | "landscape";

/** Wat voor soort input het is, zoals bepaald bij het aanmaken. */
export type InputKind = "stock" | "etf" | "commodity" | "theme" | "sector";

export const PHASES = [
  "dossier",
  "bull",
  "bear",
  "valuation",
  "committee",
  "synthesis",
  "onepager",
] as const;

export type PhaseName = (typeof PHASES)[number];

/** Van welke eerdere stappen elke stap afhangt. */
export const PHASE_DEPENDENCIES: Record<PhaseName, PhaseName[]> = {
  dossier: [],
  bull: ["dossier"],
  bear: ["dossier"],
  valuation: ["dossier"],
  committee: ["dossier", "bull", "bear", "valuation"],
  synthesis: ["dossier", "bull", "bear", "valuation", "committee"],
  onepager: ["dossier", "bull", "bear", "valuation", "committee", "synthesis"],
};

export function isPhaseName(value: unknown): value is PhaseName {
  return typeof value === "string" && (PHASES as readonly string[]).includes(value);
}

export interface ReportMeta {
  id: string;
  input: string;
  context: string;
  language: Language;
  kind: InputKind;
  template: Template;
  displayName: string;
  ticker: string | null;
  createdAt: string;
  model: string;
  /** Kosten van de classificatie bij het aanmaken. */
  setupCostUsd: number;
}

export interface Source {
  url: string;
  title: string;
  /** true als de tekst er expliciet naar verwijst (citation), anders alleen geraadpleegd. */
  cited: boolean;
}

export interface PhaseUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  webSearches: number;
  webFetches: number;
  costUsd: number;
}

export interface PhaseResult {
  phase: PhaseName;
  /** Markdown voor de tekststappen. */
  markdown?: string;
  /** Gestructureerde data voor de one-pager (alleen stap "onepager"). */
  data?: unknown;
  sources: Source[];
  usage: PhaseUsage;
  model: string;
  finishedAt: string;
  durationMs: number;
}

export type PhaseState = "running" | "done" | "error";

export interface PhaseStatus {
  state: PhaseState;
  startedAt: string;
  finishedAt?: string;
  error?: string;
}

export type PhaseStatuses = Partial<Record<PhaseName, PhaseStatus>>;

export interface ReportSummaryExtra {
  bull: number | null;
  bear: number | null;
  costUsd: number;
}

export interface ReportSummary {
  meta: ReportMeta;
  statuses: PhaseStatuses;
  summary: ReportSummaryExtra | null;
}

export interface Report extends ReportSummary {
  phases: Partial<Record<PhaseName, PhaseResult>>;
}

/** Events die de fase-endpoint als NDJSON naar de browser streamt. */
export type PhaseEvent =
  | { t: "start"; phase: PhaseName }
  | { t: "ping" }
  /** Het model is begonnen met antwoorden; de cache van deze stap is nu leesbaar. */
  | { t: "streaming" }
  | { t: "search"; query: string }
  | { t: "fetch"; url: string }
  | { t: "thinking"; d: string }
  | { t: "text"; d: string }
  | { t: "done"; phase: PhaseName; costUsd: number }
  | { t: "error"; message: string };
