/*
 * POST /api/visit: de site meldt hier elke bekeken pagina (zie usePageViews in
 * src/components/Layout.tsx). Nodig omdat de React-app tussen pagina's wisselt
 * zonder de server te vragen, dus de middleware ziet die bezoeken niet.
 */
import { readSession } from "../server/auth.js";
import { recordVisit } from "../server/visits.js";

export async function POST(request: Request) {
  const session = await readSession(request);
  if (!session) return new Response(null, { status: 401 });

  let path: unknown;
  try {
    ({ path } = (await request.json()) as { path?: unknown });
  } catch {
    return new Response(null, { status: 400 });
  }

  if (typeof path === "string" && path.startsWith("/") && session.role === "guest") {
    await recordVisit(session.name, "page", path);
  }
  return new Response(null, { status: 204 });
}
