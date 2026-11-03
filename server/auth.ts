/*
 * Toegang tot de site: een gedeeld wachtwoord plus een naam levert een ondertekende sessiecookie op.
 * Gebruikt door middleware.ts (de poort voor elk verzoek) en de functies in api/.
 *
 * De cookie zegt wie er is ingelogd (name, zoals zelf opgegeven), met welke rol
 * en tot wanneer (exp). De handtekening, een HMAC-SHA256 met SESSION_SECRET,
 * voorkomt dat iemand er zelf een maakt of de naam achteraf wijzigt.
 *
 * Er zijn twee wachtwoorden: SITE_PASSWORD voor bezoekers (rol "guest") en
 * ADMIN_PASSWORD voor jullie zelf (rol "admin", geeft ook het bezoekersoverzicht).
 * In pv zit een vingerafdruk van het wachtwoord waarmee is ingelogd: wordt een
 * wachtwoord gewijzigd, dan zijn de sessies die ermee zijn gemaakt direct ongeldig.
 *
 * Als er later eigen accounts per belegger komen, blijft dit formaat staan:
 * sub wordt dan een gebruikers-id in plaats van "shared", en alleen het
 * inloggen zelf verandert.
 */

export const SESSION_COOKIE = "mom_session";
const SESSION_DAYS = 30;

export type Role = "guest" | "admin";
export type Session = { sub: string; name: string; role: Role; exp: number; pv: string };

type Config = { secret: string; passwords: Record<Role, string> };

const enc = new TextEncoder();

function config(): Config | null {
  const password = process.env.SITE_PASSWORD ?? "";
  const secret = process.env.SESSION_SECRET ?? "";
  // Zonder wachtwoord of met een te kort geheim blijft de site dicht.
  if (!password || secret.length < 32) return null;
  // Zonder ADMIN_PASSWORD kan niemand als beheerder inloggen; een leeg wachtwoord matcht nooit.
  return { secret, passwords: { guest: password, admin: process.env.ADMIN_PASSWORD ?? "" } };
}

export function isConfigured() {
  return config() !== null;
}

/** Wat er aan de configuratie mankeert, voor in de logs. Alleen namen en lengtes, nooit waarden. */
export function configProblems() {
  const problems: string[] = [];
  const secret = process.env.SESSION_SECRET ?? "";
  if (!process.env.SITE_PASSWORD) problems.push("SITE_PASSWORD ontbreekt");
  if (!secret) problems.push("SESSION_SECRET ontbreekt");
  else if (secret.length < 32) problems.push(`SESSION_SECRET is ${secret.length} tekens, minimaal 32`);
  // Helpt bij een tikfout in de naam, zoals SITE_PASWORD of een spatie erachter.
  const names = Object.keys(process.env).filter((k) => /pas|secret|session|admin|site/i.test(k));
  problems.push("aanwezige namen: " + (names.map((k) => JSON.stringify(k)).join(", ") || "geen"));
  return problems;
}

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function toB64url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/** Vergelijkt in constante tijd, zodat de responstijd niets over de inhoud verraadt. */
function equal(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function passwordVersion(c: Config, role: Role) {
  return toB64url((await hmac(c.secret, "password:" + c.passwords[role])).slice(0, 12));
}

/** Geeft de rol die bij het wachtwoord hoort, of null bij een onjuist wachtwoord. */
export async function checkPassword(input: string): Promise<Role | null> {
  const c = config();
  if (!c || !input) return null;
  const given = await hmac(c.secret, "password:" + input);
  for (const role of ["admin", "guest"] as const) {
    if (c.passwords[role] && equal(given, await hmac(c.secret, "password:" + c.passwords[role]))) return role;
  }
  return null;
}

/** Naam zoals opgegeven bij het inloggen: één regel, zonder HTML-tekens, hooguit 80 tekens. */
export function cleanName(value: unknown) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export async function createSession(name: string, role: Role) {
  const c = config();
  if (!c) throw new Error("SITE_PASSWORD of SESSION_SECRET ontbreekt");
  const session: Session = {
    sub: "shared",
    name,
    role,
    exp: Date.now() + SESSION_DAYS * 86_400_000,
    pv: await passwordVersion(c, role),
  };
  const payload = toB64url(enc.encode(JSON.stringify(session)));
  return payload + "." + toB64url(await hmac(c.secret, "session:" + payload));
}

export async function readSession(request: Request): Promise<Session | null> {
  const c = config();
  if (!c) return null;

  const cookies = request.headers.get("cookie") ?? "";
  const token = cookies
    .split(/;\s*/)
    .find((part) => part.startsWith(SESSION_COOKIE + "="))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  try {
    if (!equal(fromB64url(signature), await hmac(c.secret, "session:" + payload))) return null;
    const session = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as Session;
    if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
    if (typeof session.name !== "string" || !session.name) return null;
    if (session.role !== "guest" && session.role !== "admin") return null;
    if (!c.passwords[session.role] || session.pv !== (await passwordVersion(c, session.role))) return null;
    return session;
  } catch {
    return null;
  }
}

function cookieFlags(request: Request) {
  // Secure alleen over https, anders werkt inloggen niet op http://localhost.
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Lax${secure}`;
}

export function sessionCookie(token: string, request: Request) {
  return `${SESSION_COOKIE}=${token}; Max-Age=${SESSION_DAYS * 86_400}; ${cookieFlags(request)}`;
}

export function clearedCookie(request: Request) {
  return `${SESSION_COOKIE}=; Max-Age=0; ${cookieFlags(request)}`;
}

/**
 * Het adres waar de bezoeker na het inloggen heen gaat. Alleen een pad op deze
 * site, nooit een ander domein, zodat het formulier niet als doorstuurlink voor
 * phishing te misbruiken is.
 */
export function safeNext(value: unknown) {
  const raw = typeof value === "string" ? value : "";
  if (!raw.startsWith("/")) return "/";
  const url = new URL(raw, "http://site.invalid");
  if (url.origin !== "http://site.invalid") return "/";
  url.searchParams.delete("login");
  const path = url.pathname + url.search + url.hash;
  return path.startsWith("//") || path.startsWith("/\\") || url.pathname === "/holding.html" ? "/" : path;
}
