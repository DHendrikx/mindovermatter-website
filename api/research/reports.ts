/*
 * GET  /api/research/reports  -> archief (laatste 100)
 * POST /api/research/reports  -> nieuw rapport { input, context?, language? }
 */
import { randomUUID } from "node:crypto";
import { describeError, MODEL } from "../../server/research/claude.js";
import { errorJson, json, readJson, requireAuth } from "../../server/research/http.js";
import { classifyInput } from "../../server/research/phases.js";
import { getStore } from "../../server/research/storage.js";
import type { Language, ReportMeta } from "../../server/research/types.js";

export async function GET(request: Request): Promise<Response> {
  const denied = requireAuth(request);
  if (denied) return denied;
  try {
    const reports = await getStore().listReports(100);
    return json({ reports });
  } catch (error) {
    return errorJson(describeError(error), 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  const denied = requireAuth(request);
  if (denied) return denied;

  const body = await readJson(request);
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  const context = typeof body?.context === "string" ? body.context.trim() : "";
  const language: Language = body?.language === "en" ? "en" : "nl";

  if (input.length < 1 || input.length > 120) {
    return errorJson("Vul een richting of ticker in (maximaal 120 tekens).", 400);
  }
  if (context.length > 4000) {
    return errorJson("De toelichting is te lang (maximaal 4000 tekens).", 400);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000);
    const { classification, costUsd } = await classifyInput(input, context, controller.signal).finally(() =>
      clearTimeout(timer),
    );

    const meta: ReportMeta = {
      id: randomUUID(),
      input,
      context,
      language,
      kind: classification.kind,
      template: classification.template,
      displayName: classification.displayName,
      ticker: classification.ticker,
      createdAt: new Date().toISOString(),
      model: MODEL,
      setupCostUsd: costUsd,
    };
    await getStore().createReport(meta);
    return json({ id: meta.id, meta }, 201);
  } catch (error) {
    return errorJson(describeError(error), 502);
  }
}
