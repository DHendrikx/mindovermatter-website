/*
 * GET    /api/research/report?id=...  -> volledig rapport
 * DELETE /api/research/report?id=...  -> rapport verwijderen
 */
import { describeError } from "../../server/research/claude.js";
import { errorJson, json, requireAuth } from "../../server/research/http.js";
import { getStore } from "../../server/research/storage.js";

function reportId(request: Request): string | null {
  const id = new URL(request.url).searchParams.get("id");
  return id && /^[a-z0-9-]{8,64}$/i.test(id) ? id : null;
}

export async function GET(request: Request): Promise<Response> {
  const denied = requireAuth(request);
  if (denied) return denied;
  const id = reportId(request);
  if (!id) return errorJson("Ongeldig rapport-id.", 400);
  try {
    const report = await getStore().getReport(id);
    return report ? json({ report }) : errorJson("Rapport niet gevonden.", 404);
  } catch (error) {
    return errorJson(describeError(error), 500);
  }
}

export async function DELETE(request: Request): Promise<Response> {
  const denied = requireAuth(request);
  if (denied) return denied;
  const id = reportId(request);
  if (!id) return errorJson("Ongeldig rapport-id.", 400);
  try {
    await getStore().deleteReport(id);
    return json({ deleted: true });
  } catch (error) {
    return errorJson(describeError(error), 500);
  }
}
