/*
 * Kostenschatting per stap op basis van de usage die de API teruggeeft.
 * Prijzen in USD per miljoen tokens (Anthropic API-tarieven, september 2026).
 * Een fallback naar een ander model wordt tegen dezelfde tarieven geschat.
 */
import type { PhaseUsage } from "./types.js";

interface Pricing {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

const PRICING: Record<string, Pricing> = {
  "claude-opus-5-5": { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 },
  "claude-fable-5-1": { input: 10, output: 50, cacheRead: 0.25, cacheWrite: 12.5 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
};

/** $10 per 1.000 zoekopdrachten; web fetch kost alleen tokens. */
const WEB_SEARCH_USD = 0.01;

export function emptyUsage(): PhaseUsage {
  return {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    webSearches: 0,
    webFetches: 0,
    costUsd: 0,
  };
}

export function priceUsage(model: string, usage: PhaseUsage): number {
  const p = PRICING[model] ?? PRICING["claude-opus-5-5"];
  const tokens =
    usage.inputTokens * p.input +
    usage.outputTokens * p.output +
    usage.cacheReadTokens * p.cacheRead +
    usage.cacheWriteTokens * p.cacheWrite;
  return tokens / 1_000_000 + usage.webSearches * WEB_SEARCH_USD;
}
