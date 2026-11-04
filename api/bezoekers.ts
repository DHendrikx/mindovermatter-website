/*
 * GET /api/bezoekers: overzicht van wie de site heeft bezocht en hoe vaak.
 * Alleen voor wie met ADMIN_PASSWORD is ingelogd. Bovenaan één regel per naam,
 * daaronder de laatste activiteit. Server-side HTML, geen deel van de React-app.
 */
import { readSession } from "../server/auth.js";
import { listVisits, storageEnvNames, type Visit } from "../server/visits.js";
import { DIVTALK_URL } from "../src/links.js";

const RECENT = 200;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const when = (iso: string) =>
  new Date(iso).toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam", dateStyle: "medium", timeStyle: "short" });

const KIND_LABEL: Record<Visit["kind"], string> = { login: "Login", page: "Pagina", document: "Document" };

type Person = { name: string; logins: number; pages: number; documents: Set<string>; first: string; last: string };

function perPerson(visits: Visit[]) {
  const people = new Map<string, Person>();
  // visits staat nieuwste eerst; de eerste keer dat een naam langskomt is dus het laatste bezoek.
  for (const v of visits) {
    const key = v.name.toLowerCase();
    let p = people.get(key);
    if (!p) people.set(key, (p = { name: v.name, logins: 0, pages: 0, documents: new Set(), first: v.at, last: v.at }));
    if (v.kind === "login") p.logins++;
    if (v.kind === "page") p.pages++;
    if (v.kind === "document") p.documents.add(v.path.replace(/^\/documents\//, ""));
    p.first = v.at;
  }
  return [...people.values()];
}

function page(body: string) {
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Bezoekers | Mind over Matter</title>
<link rel="icon" href="/logos/favicon.ico" sizes="any" />
<style>
  :root { color-scheme: dark; --bg: oklch(0.13 0.025 250); --fg: oklch(0.92 0.01 250); --muted: oklch(0.65 0.02 250); --border: oklch(0.25 0.02 250); --primary: oklch(0.82 0.17 195); }
  body { margin: 0; padding: 2rem 1rem 4rem; background: var(--bg); color: var(--fg); font: 15px/1.5 "Plus Jakarta Sans", system-ui, sans-serif; }
  main { max-width: 72rem; margin: 0 auto; }
  h1 { margin: 0 0 0.25rem; font-size: 1.75rem; }
  h2 { margin: 2.5rem 0 0.75rem; font-size: 1.1rem; color: var(--primary); }
  p { color: var(--muted); margin: 0 0 1rem; }
  .note { padding: 0.75rem 1rem; border: 1px solid oklch(0.75 0.15 25 / 50%); border-radius: 0.5rem; color: oklch(0.85 0.08 25); }
  .scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  th, td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
  th { color: var(--muted); font-weight: 600; white-space: nowrap; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.docs { color: var(--muted); }
  a { color: var(--primary); }
</style>
</head>
<body><main>${body}</main></body>
</html>`;
}

function html(body: string, status = 200) {
  return new Response(page(body), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

export async function GET(request: Request) {
  const session = await readSession(request);
  if (session?.role !== "admin") {
    return html(`<h1>Geen toegang</h1><p>Dit overzicht is alleen te zien na inloggen met het beheerderswachtwoord. <a href="/api/logout">Uitloggen</a> en opnieuw inloggen.</p>`, 403);
  }

  const { visits, stored } = await listVisits();
  const people = perPerson(visits);

  const note =
    stored === "none"
      ? `<p class="note">Er is geen Redis-opslag gekoppeld, dus bezoeken worden niet bewaard. Zie TOEGANG.md.
          Gevonden opslagvariabelen: ${storageEnvNames().map(esc).join(", ") || "geen"}.</p>`
      : stored === "memory"
        ? `<p class="note">Lokaal: bezoeken staan alleen in het geheugen en verdwijnen bij een herstart.</p>`
        : "";

  const peopleRows = people
    .map(
      (p) => `<tr>
  <td>${esc(p.name)}</td>
  <td class="num">${p.logins}</td>
  <td class="num">${p.pages}</td>
  <td class="docs">${[...p.documents].map(esc).join("<br>") || "–"}</td>
  <td>${when(p.first)}</td>
  <td>${when(p.last)}</td>
</tr>`
    )
    .join("");

  const recentRows = visits
    .slice(0, RECENT)
    .map((v) => `<tr><td>${when(v.at)}</td><td>${esc(v.name)}</td><td>${KIND_LABEL[v.kind]}</td><td>${esc(v.path)}</td></tr>`)
    .join("");

  const links = `<a href="/">Naar de site</a> · <a href="${DIVTALK_URL}" target="_blank" rel="noopener">Divtalk ↗</a> · <a href="/api/logout">Uitloggen</a>`;

  return html(`
<p class="links">${links}</p>
<h1>Bezoekers</h1>
<p>${people.length} ${people.length === 1 ? "persoon" : "personen"}, ${visits.length} registraties. Namen zijn zoals bezoekers ze zelf hebben ingevuld. Eigen bezoeken met het beheerderswachtwoord tellen niet mee.</p>
${note}
<h2>Per persoon</h2>
<div class="scroll"><table>
  <thead><tr><th>Naam</th><th>Logins</th><th>Pagina's</th><th>Documenten geopend</th><th>Eerste bezoek</th><th>Laatste bezoek</th></tr></thead>
  <tbody>${peopleRows || `<tr><td colspan="6">Nog geen bezoeken.</td></tr>`}</tbody>
</table></div>
<h2>Laatste activiteit</h2>
<div class="scroll"><table>
  <thead><tr><th>Tijd</th><th>Naam</th><th>Wat</th><th>Adres</th></tr></thead>
  <tbody>${recentRows || `<tr><td colspan="4">Nog geen bezoeken.</td></tr>`}</tbody>
</table></div>
<p style="margin-top:2rem">${links}</p>`);
}
