/*
 * POST /api/research/phase  { id, phase, retry? }
 *
 * Draait één stap van de pipeline en streamt de voortgang als NDJSON
 * (één JSON-object per regel, zie PhaseEvent). Het resultaat wordt opgeslagen
 * zodra de stap klaar is, ook als de browser tussentijds de verbinding verbreekt.
 *
 * Eén stap moet binnen de maximale functieduur van Vercel blijven (300 s op
 * Hobby, ingesteld in vercel.json). De stap breekt zichzelf daarom na 285 s af.
 */
import { waitUntil } from "@vercel/functions";
import { describeError } from "../../server/research/claude.js";
import { errorJson, readJson, requireAuth } from "../../server/research/http.js";
import { executePhase } from "../../server/research/phases.js";
import type { OnePagerData } from "../../server/research/schema.js";
import { getStore } from "../../server/research/storage.js";
import {
  isPhaseName,
  PHASE_DEPENDENCIES,
  PHASES,
  type PhaseEvent,
  type Report,
} from "../../server/research/types.js";

const STAGE_DEADLINE_MS = 285_000;
const LOCK_TTL_SECONDS = 320;
const HEARTBEAT_MS = 10_000;

function totalCost(report: Report): number {
  let total = report.meta.setupCostUsd ?? 0;
  for (const phase of PHASES) total += report.phases[phase]?.usage.costUsd ?? 0;
  return total;
}

export async function POST(request: Request): Promise<Response> {
  const denied = requireAuth(request);
  if (denied) return denied;

  const body = await readJson(request);
  const id = typeof body?.id === "string" ? body.id : "";
  const phase = body?.phase;
  if (!/^[a-z0-9-]{8,64}$/i.test(id) || !isPhaseName(phase)) {
    return errorJson("Ongeldig rapport-id of onbekende stap.", 400);
  }

  const store = getStore();
  const report = await store.getReport(id);
  if (!report) return errorJson("Rapport niet gevonden.", 404);

  const missing = PHASE_DEPENDENCIES[phase].filter((dep) => report.statuses[dep]?.state !== "done");
  if (missing.length) return errorJson(`Eerst moeten deze stappen klaar zijn: ${missing.join(", ")}.`, 409);
  if (report.statuses[phase]?.state === "done") return errorJson("Deze stap is al klaar.", 409);

  const lockKey = `research:lock:${id}:${phase}`;
  if (!(await store.acquireLock(lockKey, LOCK_TTL_SECONDS))) {
    return errorJson("Deze stap draait al.", 409);
  }

  const startedAt = new Date().toISOString();
  await store.setStatus(id, phase, { state: "running", startedAt });

  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
  let clientGone = false;
  const send = (event: PhaseEvent) => {
    if (clientGone || !controller) return;
    try {
      controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
    } catch {
      clientGone = true;
    }
  };

  const body$ = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
    cancel() {
      // De browser is weg; de stap loopt door en wordt gewoon opgeslagen.
      clientGone = true;
    },
  });

  const abort = new AbortController();
  const deadline = setTimeout(() => abort.abort(), STAGE_DEADLINE_MS);
  const heartbeat = setInterval(() => send({ t: "ping" }), HEARTBEAT_MS);

  const work = (async () => {
    send({ t: "start", phase });
    try {
      const result = await executePhase(report, phase, send, abort.signal);
      await store.setPhase(id, phase, result);
      await store.setStatus(id, phase, { state: "done", startedAt, finishedAt: result.finishedAt });

      if (phase === "onepager") {
        const data = result.data as OnePagerData;
        const withResult: Report = { ...report, phases: { ...report.phases, onepager: result } };
        await store.setSummary(id, {
          bull: data.balance?.bull ?? null,
          bear: data.balance?.bear ?? null,
          costUsd: totalCost(withResult),
        });
      }
      send({ t: "done", phase, costUsd: result.usage.costUsd });
    } catch (error) {
      const message = describeError(error);
      await store
        .setStatus(id, phase, { state: "error", startedAt, finishedAt: new Date().toISOString(), error: message })
        .catch(() => undefined);
      send({ t: "error", message });
    } finally {
      clearTimeout(deadline);
      clearInterval(heartbeat);
      await store.releaseLock(lockKey).catch(() => undefined);
      try {
        (controller as ReadableStreamDefaultController<Uint8Array> | null)?.close();
      } catch {
        // stream al gesloten
      }
    }
  })();

  try {
    waitUntil(work);
  } catch {
    // Buiten Vercel (lokaal) bestaat er geen request-context; de promise loopt dan gewoon door.
  }

  return new Response(body$, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Accel-Buffering": "no",
    },
  });
}
