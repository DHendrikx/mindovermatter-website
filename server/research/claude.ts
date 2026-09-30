/*
 * Eén stap van de pipeline tegen de Claude API draaien.
 *
 * - Streaming, zodat lange antwoorden geen HTTP-timeout raken en de browser
 *   live kan meekijken (zoekvragen, tekst).
 * - `pause_turn` (de API pauzeert lange server-tool-beurten) wordt hervat door
 *   de gepauzeerde assistant-beurt terug te sturen.
 * - Server-side fallback staat aan: weigert een safety-classifier het verzoek,
 *   dan draait de API het op een aanbevolen ander model.
 */
import Anthropic from "@anthropic-ai/sdk";
import type {
  BetaContentBlock,
  BetaContentBlockParam,
  BetaMessageParam,
} from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { emptyUsage, priceUsage } from "./cost.js";
import type { PhaseEvent, PhaseUsage, Source } from "./types.js";

export const MODEL = process.env.RESEARCH_MODEL?.trim() || "claude-opus-5-5";

const FALLBACK_BETA = "server-side-fallback-2026-07-01";
const MAX_CONTINUATIONS = 8;

let client: Anthropic | null = null;

export function anthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

function getClient(): Anthropic {
  if (!anthropicConfigured()) {
    throw new StageError("ANTHROPIC_API_KEY ontbreekt in de omgevingsvariabelen.");
  }
  if (!client) client = new Anthropic({ maxRetries: 4 });
  return client;
}

export class StageError extends Error {}

export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export interface StageOptions {
  system: string;
  /** Tekst, of losse blokken (met cachepunten) zoals phases.ts ze opbouwt. */
  user: string | BetaContentBlockParam[];
  effort: Effort;
  maxTokens: number;
  webSearches?: number;
  webFetches?: number;
  /** Outputformaat voor structured outputs (stap "onepager" en de classificatie). */
  outputFormat?: Anthropic.Beta.Messages.BetaJSONOutputFormat;
  signal: AbortSignal;
  emit: (event: PhaseEvent) => void;
}

export interface StageResult {
  text: string;
  parsed: unknown;
  sources: Source[];
  usage: PhaseUsage;
  model: string;
}

function addUsage(total: PhaseUsage, usage: Anthropic.Beta.BetaUsage): void {
  total.inputTokens += usage.input_tokens ?? 0;
  total.outputTokens += usage.output_tokens ?? 0;
  total.cacheReadTokens += usage.cache_read_input_tokens ?? 0;
  total.cacheWriteTokens += usage.cache_creation_input_tokens ?? 0;
  total.webSearches += usage.server_tool_use?.web_search_requests ?? 0;
  total.webFetches += usage.server_tool_use?.web_fetch_requests ?? 0;
}

function collectSources(blocks: BetaContentBlock[], into: Map<string, Source>): void {
  for (const block of blocks) {
    if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
      for (const result of block.content) {
        if (result.type === "web_search_result" && !into.has(result.url)) {
          into.set(result.url, { url: result.url, title: result.title || result.url, cited: false });
        }
      }
    }
    if (block.type === "web_fetch_tool_result" && block.content.type === "web_fetch_result") {
      const url = block.content.url;
      const title = block.content.content.title || url;
      if (!into.has(url)) into.set(url, { url, title, cited: false });
    }
    if (block.type === "text" && block.citations) {
      for (const citation of block.citations) {
        if (citation.type === "web_search_result_location") {
          const existing = into.get(citation.url);
          into.set(citation.url, {
            url: citation.url,
            title: existing?.title || citation.title || citation.url,
            cited: true,
          });
        }
      }
    }
  }
}

export async function runStage(options: StageOptions): Promise<StageResult> {
  const anthropic = getClient();

  const tools: Anthropic.Beta.BetaToolUnion[] = [];
  if (options.webSearches) {
    tools.push({ type: "web_search_20260209", name: "web_search", max_uses: options.webSearches });
  }
  if (options.webFetches) {
    tools.push({ type: "web_fetch_20260209", name: "web_fetch", max_uses: options.webFetches });
  }

  const messages: BetaMessageParam[] = [{ role: "user", content: options.user }];
  const usage = emptyUsage();
  const sources = new Map<string, Source>();
  let text = "";
  let parsed: unknown = null;
  let servedBy = MODEL;

  for (let turn = 0; turn <= MAX_CONTINUATIONS; turn++) {
    const stream = anthropic.beta.messages.stream(
      {
        model: MODEL,
        max_tokens: options.maxTokens,
        betas: [FALLBACK_BETA],
        fallbacks: "default",
        thinking: { type: "adaptive", display: "summarized" },
        output_config: {
          effort: options.effort,
          ...(options.outputFormat ? { format: options.outputFormat } : {}),
        },
        system: [{ type: "text", text: options.system, cache_control: { type: "ephemeral" } }],
        ...(tools.length ? { tools } : {}),
        messages,
      },
      { signal: options.signal },
    );

    stream.on("text", (delta) => options.emit({ t: "text", d: delta }));
    stream.on("streamEvent", (event) => {
      // Vanaf het eerste streamevent is de cache van dit verzoek leesbaar voor andere stappen.
      if (event.type === "message_start" && turn === 0) options.emit({ t: "streaming" });
      if (event.type === "content_block_delta" && event.delta.type === "thinking_delta") {
        options.emit({ t: "thinking", d: event.delta.thinking });
      }
    });
    stream.on("contentBlock", (block) => {
      if (block.type === "server_tool_use") {
        const input = block.input as { query?: unknown; url?: unknown };
        if (block.name === "web_search" && typeof input.query === "string") {
          options.emit({ t: "search", query: input.query });
        }
        if (block.name === "web_fetch" && typeof input.url === "string") {
          options.emit({ t: "fetch", url: input.url });
        }
      }
    });

    const message = await stream.finalMessage();
    addUsage(usage, message.usage);
    collectSources(message.content, sources);
    servedBy = message.model || servedBy;

    for (const block of message.content) {
      if (block.type === "text") text += block.text;
    }
    if (message.parsed_output !== undefined && message.parsed_output !== null) {
      parsed = message.parsed_output;
    }

    if (message.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: message.content as BetaMessageParam["content"] });
      continue;
    }
    if (message.stop_reason === "refusal") {
      const category = message.stop_details?.category ?? "onbekend";
      throw new StageError(`Het model weigerde deze stap (categorie: ${category}).`);
    }
    if (message.stop_reason === "max_tokens") {
      throw new StageError("De output werd afgekapt (max_tokens). Probeer de stap opnieuw.");
    }
    usage.costUsd = priceUsage(servedBy, usage);
    return { text: text.trim(), parsed, sources: [...sources.values()], usage, model: servedBy };
  }

  throw new StageError("De stap bleef pauzeren en is gestopt. Probeer het opnieuw.");
}

/** Maakt een leesbare Nederlandse foutmelding van een willekeurige fout. */
export function describeError(error: unknown): string {
  if (error instanceof StageError) return error.message;
  if (error instanceof Anthropic.APIUserAbortError) {
    return "De stap duurde te lang en is afgebroken. Probeer hem opnieuw.";
  }
  if (error instanceof Anthropic.AuthenticationError) {
    return "De Anthropic API-key is ongeldig of ingetrokken.";
  }
  if (error instanceof Anthropic.PermissionDeniedError) {
    return "De API-key heeft geen toegang tot dit model.";
  }
  if (error instanceof Anthropic.RateLimitError) {
    return "Rate limit bij Anthropic bereikt. Wacht een minuut en probeer de stap opnieuw.";
  }
  if (error instanceof Anthropic.BadRequestError) {
    return `Ongeldig verzoek aan de API: ${error.message}`;
  }
  if (error instanceof Anthropic.APIError) {
    return `Fout bij de Claude API (${error.status ?? "?"}): ${error.message}`;
  }
  if (error instanceof Error) return error.message;
  return "Onbekende fout.";
}
