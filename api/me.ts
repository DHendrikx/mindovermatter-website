/*
 * GET /api/me: wie er is ingelogd (naam en rol). De sessiecookie is HttpOnly,
 * dus de React-app kan hem zelf niet lezen; hiermee weet de site of hij de
 * beheerlinks moet tonen (AdminBar in src/components/Layout.tsx).
 */
import { readSession } from "../server/auth.js";

export async function GET(request: Request) {
  const session = await readSession(request);
  return new Response(JSON.stringify(session ? { name: session.name, role: session.role } : null), {
    status: session ? 200 : 401,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
