/*
 * Laat middleware.ts en de functies in api/ ook lokaal draaien, in `npm run dev`
 * en `npm run preview`. Op Vercel doet het platform dat zelf; Vite kent geen
 * Routing Middleware en geen /api-functies. Zo gedraagt de poort zich lokaal
 * hetzelfde als online, met dezelfde code.
 *
 * Het wachtwoord en het geheim komen lokaal uit .env.local (zie .env.example).
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { loadEnv, type Connect, type Plugin } from "vite";
import middleware from "../middleware.js";
import * as login from "../api/login.js";
import * as logout from "../api/logout.js";
import * as visit from "../api/visit.js";
import * as bezoekers from "../api/bezoekers.js";
import * as me from "../api/me.js";

type Handler = (request: Request) => Response | Promise<Response>;

// Elke nieuwe functie in api/ moet hier ook bij, anders bestaat hij lokaal niet.
const API: Record<string, Record<string, Handler>> = {
  "/api/login": { POST: login.POST },
  "/api/logout": { GET: logout.GET, POST: logout.POST },
  "/api/visit": { POST: visit.POST },
  "/api/bezoekers": { GET: bezoekers.GET },
  "/api/me": { GET: me.GET },
};

async function toRequest(req: Connect.IncomingMessage, withBody: boolean) {
  const url = new URL(req.originalUrl ?? req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined && !key.startsWith(":")) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  let body: Uint8Array<ArrayBuffer> | undefined;
  if (withBody) {
    const chunks: Buffer[] = [];
    for await (const chunk of req as IncomingMessage) chunks.push(chunk as Buffer);
    body = new Uint8Array(Buffer.concat(chunks));
  }

  return new Request(url, { method: req.method, headers, body });
}

async function send(res: ServerResponse, response: Response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

const gate: Connect.NextHandleFunction = async (req, res, nextHandler) => {
  try {
    const pathname = new URL(req.originalUrl ?? req.url ?? "/", "http://localhost").pathname;
    const api = API[pathname]?.[req.method ?? "GET"];
    const request = await toRequest(req, Boolean(api) && req.method !== "GET" && req.method !== "HEAD");

    const result = await middleware(request);
    const rewriteTo = result.headers.get("x-middleware-rewrite");

    if (rewriteTo) {
      result.headers.forEach((value, key) => key.startsWith("x-middleware-") || res.setHeader(key, value));
      req.url = new URL(rewriteTo).pathname;
      return nextHandler();
    }
    if (!result.headers.has("x-middleware-next")) return await send(res, result);
    if (api) return await send(res, await api(request));
    nextHandler();
  } catch (error) {
    nextHandler(error);
  }
};

export default function devGate(): Plugin {
  return {
    name: "mom-dev-gate",
    configResolved(config) {
      const env = loadEnv(config.mode, config.envDir || config.root, ["SITE_", "SESSION_", "ADMIN_", "UPSTASH_", "KV_"]);
      for (const [key, value] of Object.entries(env)) process.env[key] ??= value;
    },
    configureServer(server) {
      server.middlewares.use(gate);
    },
    configurePreviewServer(server) {
      server.middlewares.use(gate);
    },
  };
}
