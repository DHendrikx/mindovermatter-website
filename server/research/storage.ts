/*
 * Opslag van rapporten.
 *
 * Productie: Upstash Redis (via de Vercel Marketplace). Per rapport één hash met
 * losse velden per stap, zodat parallelle stappen elkaar niet overschrijven.
 * Lokaal zonder Redis: JSON-bestanden in .data/research/ (alleen voor ontwikkelen).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import {
  PHASES,
  type PhaseName,
  type PhaseResult,
  type PhaseStatus,
  type PhaseStatuses,
  type Report,
  type ReportMeta,
  type ReportSummary,
  type ReportSummaryExtra,
} from "./types.js";

export interface Store {
  kind: "redis" | "file";
  createReport(meta: ReportMeta): Promise<void>;
  listReports(limit: number): Promise<ReportSummary[]>;
  getReport(id: string): Promise<Report | null>;
  setStatus(id: string, phase: PhaseName, status: PhaseStatus): Promise<void>;
  setPhase(id: string, phase: PhaseName, result: PhaseResult): Promise<void>;
  setSummary(id: string, summary: ReportSummaryExtra): Promise<void>;
  deleteReport(id: string): Promise<void>;
  /** Zet een sleutel alleen als hij nog niet bestaat. true = gelukt. */
  acquireLock(key: string, ttlSeconds: number): Promise<boolean>;
  releaseLock(key: string): Promise<void>;
  /** Verhoogt een teller die na ttlSeconds verloopt en geeft de nieuwe waarde. */
  increment(key: string, ttlSeconds: number): Promise<number>;
}

function redisCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

export function storageConfigured(): boolean {
  return redisCredentials() !== null || !process.env.VERCEL;
}

const INDEX_KEY = "research:index";
const reportKey = (id: string) => `research:report:${id}`;

function parseJson<T>(value: unknown): T | null {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function statusesFromFields(fields: Record<string, unknown>): PhaseStatuses {
  const statuses: PhaseStatuses = {};
  for (const phase of PHASES) {
    const status = parseJson<PhaseStatus>(fields[`status:${phase}`]);
    if (status) statuses[phase] = status;
  }
  return statuses;
}

class RedisStore implements Store {
  kind = "redis" as const;
  private redis: Redis;

  constructor(url: string, token: string) {
    this.redis = new Redis({ url, token, automaticDeserialization: false });
  }

  async createReport(meta: ReportMeta): Promise<void> {
    await this.redis.hset(reportKey(meta.id), { meta: JSON.stringify(meta) });
    await this.redis.zadd(INDEX_KEY, { score: Date.parse(meta.createdAt), member: meta.id });
  }

  async listReports(limit: number): Promise<ReportSummary[]> {
    const ids = (await this.redis.zrange(INDEX_KEY, 0, limit - 1, { rev: true })) as string[];
    if (!ids.length) return [];
    const fieldNames = ["meta", "summary", ...PHASES.map((p) => `status:${p}`)];
    const pipeline = this.redis.pipeline();
    for (const id of ids) pipeline.hmget(reportKey(id), ...fieldNames);
    const rows = (await pipeline.exec()) as (Record<string, unknown> | null)[];
    const summaries: ReportSummary[] = [];
    rows.forEach((row) => {
      if (!row) return;
      const meta = parseJson<ReportMeta>(row.meta);
      if (!meta) return;
      summaries.push({
        meta,
        statuses: statusesFromFields(row),
        summary: parseJson<ReportSummaryExtra>(row.summary),
      });
    });
    return summaries;
  }

  async getReport(id: string): Promise<Report | null> {
    const fields = (await this.redis.hgetall(reportKey(id))) as Record<string, unknown> | null;
    if (!fields) return null;
    const meta = parseJson<ReportMeta>(fields.meta);
    if (!meta) return null;
    const phases: Report["phases"] = {};
    for (const phase of PHASES) {
      const result = parseJson<PhaseResult>(fields[`phase:${phase}`]);
      if (result) phases[phase] = result;
    }
    return {
      meta,
      statuses: statusesFromFields(fields),
      summary: parseJson<ReportSummaryExtra>(fields.summary),
      phases,
    };
  }

  async setStatus(id: string, phase: PhaseName, status: PhaseStatus): Promise<void> {
    await this.redis.hset(reportKey(id), { [`status:${phase}`]: JSON.stringify(status) });
  }

  async setPhase(id: string, phase: PhaseName, result: PhaseResult): Promise<void> {
    await this.redis.hset(reportKey(id), { [`phase:${phase}`]: JSON.stringify(result) });
  }

  async setSummary(id: string, summary: ReportSummaryExtra): Promise<void> {
    await this.redis.hset(reportKey(id), { summary: JSON.stringify(summary) });
  }

  async deleteReport(id: string): Promise<void> {
    await this.redis.del(reportKey(id));
    await this.redis.zrem(INDEX_KEY, id);
  }

  async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.redis.set(key, "1", { nx: true, ex: ttlSeconds });
    return result === "OK";
  }

  async releaseLock(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async increment(key: string, ttlSeconds: number): Promise<number> {
    const value = await this.redis.incr(key);
    if (value === 1) await this.redis.expire(key, ttlSeconds);
    return value;
  }
}

/** Alleen voor lokaal ontwikkelen: één JSON-bestand per rapport. */
class FileStore implements Store {
  kind = "file" as const;
  private dir = path.resolve(process.cwd(), ".data", "research");
  private queues = new Map<string, Promise<unknown>>();
  private locks = new Map<string, number>();
  private counters = new Map<string, { value: number; expires: number }>();

  private file(id: string): string {
    if (!/^[a-z0-9-]+$/i.test(id)) throw new Error("Ongeldig rapport-id.");
    return path.join(this.dir, `${id}.json`);
  }

  private async read(id: string): Promise<Report | null> {
    try {
      return JSON.parse(await fs.readFile(this.file(id), "utf8")) as Report;
    } catch {
      return null;
    }
  }

  /** Serialiseert schrijfacties per rapport binnen dit ene proces. */
  private update(id: string, mutate: (report: Report) => void): Promise<void> {
    const previous = this.queues.get(id) ?? Promise.resolve();
    const next = previous.then(async () => {
      const report = await this.read(id);
      if (!report) return;
      mutate(report);
      await fs.writeFile(this.file(id), JSON.stringify(report, null, 2), "utf8");
    });
    this.queues.set(id, next.catch(() => undefined));
    return next;
  }

  async createReport(meta: ReportMeta): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
    const report: Report = { meta, statuses: {}, summary: null, phases: {} };
    await fs.writeFile(this.file(meta.id), JSON.stringify(report, null, 2), "utf8");
  }

  async listReports(limit: number): Promise<ReportSummary[]> {
    let names: string[] = [];
    try {
      names = (await fs.readdir(this.dir)).filter((n) => n.endsWith(".json"));
    } catch {
      return [];
    }
    const reports = (await Promise.all(names.map((n) => this.read(n.replace(/\.json$/, ""))))).filter(
      (r): r is Report => r !== null,
    );
    return reports
      .sort((a, b) => b.meta.createdAt.localeCompare(a.meta.createdAt))
      .slice(0, limit)
      .map(({ meta, statuses, summary }) => ({ meta, statuses, summary }));
  }

  getReport(id: string): Promise<Report | null> {
    return this.read(id);
  }

  setStatus(id: string, phase: PhaseName, status: PhaseStatus): Promise<void> {
    return this.update(id, (r) => {
      r.statuses[phase] = status;
    });
  }

  setPhase(id: string, phase: PhaseName, result: PhaseResult): Promise<void> {
    return this.update(id, (r) => {
      r.phases[phase] = result;
    });
  }

  setSummary(id: string, summary: ReportSummaryExtra): Promise<void> {
    return this.update(id, (r) => {
      r.summary = summary;
    });
  }

  async deleteReport(id: string): Promise<void> {
    await fs.rm(this.file(id), { force: true });
  }

  async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
    const expires = this.locks.get(key);
    if (expires && expires > Date.now()) return false;
    this.locks.set(key, Date.now() + ttlSeconds * 1000);
    return true;
  }

  async releaseLock(key: string): Promise<void> {
    this.locks.delete(key);
  }

  async increment(key: string, ttlSeconds: number): Promise<number> {
    const now = Date.now();
    const current = this.counters.get(key);
    const next =
      current && current.expires > now
        ? { value: current.value + 1, expires: current.expires }
        : { value: 1, expires: now + ttlSeconds * 1000 };
    this.counters.set(key, next);
    return next.value;
  }
}

let store: Store | null = null;

export function getStore(): Store {
  if (store) return store;
  const credentials = redisCredentials();
  if (credentials) {
    store = new RedisStore(credentials.url, credentials.token);
  } else if (!process.env.VERCEL) {
    store = new FileStore();
  } else {
    throw new Error(
      "Geen opslag ingesteld: koppel Upstash Redis aan dit Vercel-project (Storage → Marketplace).",
    );
  }
  return store;
}
