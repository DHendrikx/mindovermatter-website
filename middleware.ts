/*
 * Toegangspoort voor de hele site (Vercel Routing Middleware, draait vóór elk verzoek).
 *
 * Zonder geldige sessie is alleen de holding page te zien: elke pagina-URL en
 * elke PDF-link toont public/holding.html met het inlogformulier, op het adres
 * dat de bezoeker opvroeg. Na het inloggen komt die dus direct op de juiste plek.
 * Al het andere (de JavaScript-bundel met alle teksten, de afbeeldingen) krijgt
 * een 401.
 *
 * Alleen wat in PUBLIC staat is open. Een nieuw bestand of een nieuwe pagina is
 * dus automatisch afgeschermd, zonder dat iemand eraan hoeft te denken.
 *
 * Met een geldige sessie gaat elk verzoek gewoon door naar de site zoals die is.
 * Het openen van een document wordt dan geregistreerd (server/visits.ts).
 * Lokaal draait dit bestand via server/vite-dev-gate.ts.
 */
import { next, rewrite, waitUntil } from "@vercel/functions";
import { readSession } from "./server/auth.js";
import { recordVisit } from "./server/visits.js";

const PUBLIC = new Set([
  "/holding.html",
  "/api/login",
  "/api/logout",
  "/images/hero-background.jpg",
  "/logos/mom-logo-white.svg",
  "/logos/favicon.ico",
  "/logos/favicon-192.png",
]);

// Bijvoorbeeld /, /team, /en/documents, maar ook /documents/x.pdf
function isPageRequest(request: Request, pathname: string) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  return !/\.[a-z0-9]+$/i.test(pathname) || pathname.endsWith(".html") || pathname.startsWith("/documents/");
}

// Een PDF-viewer haalt grote bestanden in stukken op; alleen het eerste stuk telt als openen.
function isDocumentOpen(request: Request, pathname: string) {
  const range = request.headers.get("range");
  return request.method === "GET" && pathname.startsWith("/documents/") && (!range || range.startsWith("bytes=0-"));
}

export default async function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  if (PUBLIC.has(pathname)) return next();

  const session = await readSession(request);
  if (session) {
    if (session.role === "guest" && isDocumentOpen(request, pathname)) {
      waitUntil(recordVisit(session.name, "document", pathname));
    }
    return next();
  }

  if (isPageRequest(request, pathname)) {
    return rewrite(new URL("/holding.html", request.url), {
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  return new Response("Login required", {
    status: 401,
    headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
  });
}
