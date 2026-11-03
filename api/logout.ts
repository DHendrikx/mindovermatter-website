/*
 * GET of POST /api/logout: sessiecookie wissen en terug naar de holding page.
 */
import { clearedCookie } from "../server/auth.js";

export function GET(request: Request) {
  return new Response(null, {
    status: 303,
    headers: { Location: "/", "Cache-Control": "no-store", "Set-Cookie": clearedCookie(request) },
  });
}

export const POST = GET;
