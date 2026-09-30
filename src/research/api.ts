import type {
  Language,
  PhaseEvent,
  PhaseName,
  Report,
  ReportMeta,
  ReportSummary,
} from "../../server/research/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : `Verzoek mislukt (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

export interface SessionInfo {
  authenticated: boolean;
  configured: boolean;
  setup?: { anthropic: boolean; storage: string };
}

export const getSession = () => request<SessionInfo>("/api/research/session");

export const login = (password: string) =>
  request<{ authenticated: boolean }>("/api/research/session", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

export const logout = () => request<{ authenticated: boolean }>("/api/research/session", { method: "DELETE" });

export const listReports = () => request<{ reports: ReportSummary[] }>("/api/research/reports");

export const createReport = (input: string, context: string, language: Language) =>
  request<{ id: string; meta: ReportMeta }>("/api/research/reports", {
    method: "POST",
    body: JSON.stringify({ input, context, language }),
  });

export const getReport = (id: string) =>
  request<{ report: Report }>(`/api/research/report?id=${encodeURIComponent(id)}`);

export const deleteReport = (id: string) =>
  request<{ deleted: boolean }>(`/api/research/report?id=${encodeURIComponent(id)}`, { method: "DELETE" });

/**
 * Start een stap en leest de NDJSON-stream. Resolvet als de stap klaar is
 * (of faalt); een verbroken verbinding geeft `interrupted` terug, waarna de
 * aanroeper de status via getReport kan nalopen.
 */
export async function runPhase(
  id: string,
  phase: PhaseName,
  onEvent: (event: PhaseEvent) => void,
  signal?: AbortSignal,
): Promise<"done" | "error" | "interrupted"> {
  let response: Response;
  try {
    response = await fetch("/api/research/phase", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, phase }),
      signal,
    });
  } catch {
    return "interrupted";
  }

  if (!response.ok || !response.body) {
    let message = `Stap kon niet starten (${response.status}).`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // geen JSON
    }
    // 409 "draait al" of "al klaar" is geen fout: de aanroeper pollt de status.
    if (response.status === 409) return "interrupted";
    onEvent({ t: "error", message });
    return "error";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let outcome: "done" | "error" | "interrupted" = "interrupted";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline = buffer.indexOf("\n");
      while (newline !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line) {
          try {
            const event = JSON.parse(line) as PhaseEvent;
            if (event.t === "done") outcome = "done";
            if (event.t === "error") outcome = "error";
            onEvent(event);
          } catch {
            // onvolledige regel; negeren
          }
        }
        newline = buffer.indexOf("\n");
      }
    }
  } catch {
    return outcome === "interrupted" ? "interrupted" : outcome;
  }
  return outcome;
}
