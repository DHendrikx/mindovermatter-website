import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import type { IncomingMessage, ServerResponse } from "node:http";

/*
 * Lokaal ontwikkelen: serveert de Vercel Functions in api/research/*.ts via de
 * Vite dev-server, zodat `npm run dev` de hele Analyst Research-module draait.
 * Op Vercel wordt dit niet gebruikt; daar worden de bestanden in api/ zelf
 * functies.
 */
function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

type Handler = (request: Request) => Response | Promise<Response>;

function researchApiDev(): Plugin {
  return {
    name: "research-api-dev",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const match = url.pathname.match(/^\/api\/research\/([a-z]+)\/?$/);
        if (!match) return next();
        try {
          const mod = (await server.ssrLoadModule(`/api/research/${match[1]}.ts`)) as Record<string, Handler | undefined>;
          const handler = mod[req.method ?? "GET"];
          if (!handler) {
            res.statusCode = 405;
            res.end();
            return;
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
            else if (value !== undefined) headers.set(key, value);
          }
          const hasBody = req.method !== "GET" && req.method !== "HEAD";
          const request = new Request(`http://${req.headers.host ?? "localhost"}${req.url}`, {
            method: req.method,
            headers,
            body: hasBody ? new Uint8Array(await readBody(req)) : undefined,
          });
          const response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() !== "set-cookie") res.setHeader(key, value);
          });
          const cookies = response.headers.getSetCookie();
          if (cookies.length) res.setHeader("Set-Cookie", cookies);
          if (!response.body) {
            res.end();
            return;
          }
          const reader = response.body.getReader();
          res.on("close", () => void reader.cancel().catch(() => undefined));
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch (error) {
          server.config.logger.error(`[research-api] ${String(error instanceof Error ? error.stack : error)}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
          }
          res.end(JSON.stringify({ error: "Interne fout in de lokale API (zie terminal)." }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Maak .env / .env.local beschikbaar voor de servercode tijdens `npm run dev`.
  // Alleen variabelen met een VITE_-prefix kunnen in de browserbundel komen; die gebruiken we niet.
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [react(), tailwindcss(), researchApiDev()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
