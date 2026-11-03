/*
 * Bezoekregistratie: wie (de naam die bij het inloggen is opgegeven), wanneer en wat.
 * Drie soorten: een login, een bekeken pagina en een geopend document.
 * Bezoeken van beheerders (rol "admin") worden niet meegeteld.
 *
 * Opslag: Upstash Redis, in één lijst met de nieuwste bovenaan, begrensd op
 * MAX_VISITS. Zonder Redis-configuratie: lokaal in het geheugen (om te testen),
 * op Vercel alleen een regel in de logs. Een fout in de opslag mag een bezoek
 * nooit blokkeren, dus recordVisit gooit nooit.
 *
 * De client wordt pas bij het eerste gebruik opgebouwd, net als in
 * api/wishlist.js van untapd.nl.
 */
import type { Redis } from "@upstash/redis";

export type VisitKind = "login" | "page" | "document";
export type Visit = { at: string; name: string; kind: VisitKind; path: string };

// Met voorvoegsel, zodat dezelfde database ook voor untapd.nl gebruikt kan worden.
const KEY = "mom:visits";
const MAX_VISITS = 10_000;

const memory: Visit[] = [];
let client: Redis | null = null;

async function getRedis() {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const { Redis } = await import("@upstash/redis");
  client = new Redis({ url, token });
  return client;
}

/** Waar de bezoeken staan: "redis", "memory" (lokaal) of "none" (Vercel zonder Redis). */
async function storage() {
  if (await getRedis()) return "redis" as const;
  return process.env.VERCEL ? ("none" as const) : ("memory" as const);
}

export async function recordVisit(name: string, kind: VisitKind, path: string) {
  const visit: Visit = { at: new Date().toISOString(), name, kind, path: path.slice(0, 200) };
  try {
    const redis = await getRedis();
    if (redis) {
      await redis.lpush(KEY, visit);
      await redis.ltrim(KEY, 0, MAX_VISITS - 1);
    } else if (!process.env.VERCEL) {
      memory.unshift(visit);
      memory.length = Math.min(memory.length, MAX_VISITS);
    } else {
      console.info("visit", JSON.stringify(visit));
    }
  } catch (error) {
    console.error("visit: opslaan mislukt", error);
  }
}

export async function listVisits(): Promise<{ visits: Visit[]; stored: "redis" | "memory" | "none" }> {
  const stored = await storage();
  if (stored === "redis") return { visits: await (await getRedis())!.lrange<Visit>(KEY, 0, -1), stored };
  return { visits: stored === "memory" ? [...memory] : [], stored };
}
