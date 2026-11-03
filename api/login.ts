/*
 * POST /api/login: hier post het formulier op de holding page naartoe.
 *
 * Naam en goed wachtwoord: sessiecookie zetten, de login registreren en door
 * naar het adres waar de bezoeker vandaan kwam. Anders terug naar datzelfde
 * adres met ?login=failed (of =name), waarop de holding page een melding toont.
 * Een gewoon HTML-formulier, dus het werkt ook zonder JavaScript.
 */
import { checkPassword, cleanName, configProblems, createSession, isConfigured, safeNext, sessionCookie } from "../server/auth.js";
import { recordVisit } from "../server/visits.js";

function redirect(location: string, headers: Record<string, string> = {}) {
  return new Response(null, { status: 303, headers: { Location: location, "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const target = safeNext(form.get("next"));

  const back = (status: "failed" | "name" | "unavailable") => {
    const url = new URL(target, request.url);
    url.searchParams.set("login", status);
    return url.pathname + url.search;
  };

  if (!isConfigured()) {
    console.error("login: niet ingesteld: " + configProblems().join("; "));
    return redirect(back("unavailable"));
  }

  const name = cleanName(form.get("name"));
  if (name.length < 2) return redirect(back("name"));

  const role = await checkPassword(String(form.get("password") ?? ""));
  if (!role) {
    console.warn("login: onjuist wachtwoord");
    // Remt het raden van het wachtwoord af.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return redirect(back("failed"));
  }

  if (role === "guest") await recordVisit(name, "login", target);
  return redirect(target, { "Set-Cookie": sessionCookie(await createSession(name, role), request) });
}
