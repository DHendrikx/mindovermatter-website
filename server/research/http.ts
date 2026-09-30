/*
 * Kleine hulpfuncties voor de API-handlers: JSON-responses, sessiecookie en
 * de wachtwoordcontrole. Eén gedeeld teamwachtwoord (RESEARCH_PASSWORD); de
 * sessie is een HttpOnly-cookie met een HMAC-handtekening (RESEARCH_SESSION_SECRET).
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getStore } from "./storage.js";

const COOKIE_NAME = "mom_rs";
const SESSION_DAYS = 30;
const LOGIN_WINDOW_SECONDS = 15 * 60;
const LOGIN_MAX_ATTEMPTS = 8;

export function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      ...extraHeaders,
    },
  });
}

export function errorJson(message: string, status: number): Response {
  return json({ error: message }, status);
}

function sessionSecret(): string | null {
  const secret = process.env.RESEARCH_SESSION_SECRET?.trim();
  return secret && secret.length >= 16 ? secret : null;
}

function password(): string | null {
  const value = process.env.RESEARCH_PASSWORD;
  return value && value.length >= 8 ? value : null;
}

export function authConfigured(): boolean {
  return sessionSecret() !== null && password() !== null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function isAuthenticated(request: Request): boolean {
  const secret = sessionSecret();
  if (!secret) return false;
  const cookie = readCookie(request, COOKIE_NAME);
  if (!cookie) return false;
  const [expires, signature] = cookie.split(".");
  if (!expires || !signature) return false;
  if (!safeEqual(signature, sign(expires, secret))) return false;
  return Number(expires) > Date.now();
}

/** Geeft een 401-response terug als de gebruiker niet is ingelogd, anders null. */
export function requireAuth(request: Request): Response | null {
  if (!authConfigured()) {
    return errorJson("De interne omgeving is nog niet ingesteld (wachtwoord of sessiesleutel ontbreekt).", 503);
  }
  return isAuthenticated(request) ? null : errorJson("Niet ingelogd.", 401);
}

function cookieAttributes(request: Request, maxAgeSeconds: number): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${secure}`;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "local";
}

export async function login(request: Request, candidate: unknown): Promise<Response> {
  const secret = sessionSecret();
  const expected = password();
  if (!secret || !expected) {
    return errorJson("De interne omgeving is nog niet ingesteld (wachtwoord of sessiesleutel ontbreekt).", 503);
  }

  const attempts = await getStore().increment(`research:login:${clientIp(request)}`, LOGIN_WINDOW_SECONDS);
  if (attempts > LOGIN_MAX_ATTEMPTS) {
    return errorJson("Te veel inlogpogingen. Probeer het over een kwartier opnieuw.", 429);
  }

  if (typeof candidate !== "string" || !safeEqual(candidate, expected)) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return errorJson("Onjuist wachtwoord.", 401);
  }

  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const expires = String(Date.now() + maxAge * 1000);
  const value = `${expires}.${sign(expires, secret)}`;
  return json({ authenticated: true }, 200, {
    "Set-Cookie": `${COOKIE_NAME}=${encodeURIComponent(value)}; ${cookieAttributes(request, maxAge)}`,
  });
}

export function logout(request: Request): Response {
  return json({ authenticated: false }, 200, {
    "Set-Cookie": `${COOKIE_NAME}=; ${cookieAttributes(request, 0)}`,
  });
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
