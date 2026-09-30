/*
 * GET    /api/research/session  -> { authenticated, setup? }
 * POST   /api/research/session  -> inloggen met { password }
 * DELETE /api/research/session  -> uitloggen
 */
import { anthropicConfigured } from "../../server/research/claude.js";
import { authConfigured, isAuthenticated, json, login, logout, readJson } from "../../server/research/http.js";
import { getStore, storageConfigured } from "../../server/research/storage.js";

export async function GET(request: Request): Promise<Response> {
  const authenticated = authConfigured() && isAuthenticated(request);
  if (!authenticated) return json({ authenticated: false, configured: authConfigured() });
  let storage: string = "missing";
  if (storageConfigured()) {
    try {
      storage = getStore().kind;
    } catch {
      storage = "missing";
    }
  }
  return json({
    authenticated: true,
    configured: true,
    setup: { anthropic: anthropicConfigured(), storage },
  });
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  return login(request, body?.password);
}

export function DELETE(request: Request): Response {
  return logout(request);
}
