/*
 * Stuurt de pipeline aan vanuit de browser: start de stappen waarvan de
 * afhankelijkheden klaar zijn (bull, bear en waardering parallel), toont live
 * voortgang, en wacht netjes als een stap al ergens anders draait.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PHASE_DEPENDENCIES,
  PHASES,
  type PhaseEvent,
  type PhaseName,
  type Report,
} from "../../server/research/types";
import { getReport, runPhase } from "./api";

export interface LiveState {
  text: string;
  thinking: string;
  searches: string[];
}

const RUNNING_STALE_MS = 330_000;
/** Maximaal zo lang wacht een volger op zijn "leider" voordat hij toch start. */
const LEADER_WAIT_MS = 45_000;
/** Stappen met een identiek voorvoegsel (zelfde tools, denkstand en eerdere uitkomsten). */
const CACHE_LEADER: Partial<Record<PhaseName, PhaseName>> = { bear: "bull" };
const POLL_MS = 6_000;
const TAIL_CHARS = 5_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function isFreshRunning(report: Report, phase: PhaseName): boolean {
  const status = report.statuses[phase];
  return status?.state === "running" && Date.now() - Date.parse(status.startedAt) < RUNNING_STALE_MS;
}

export function isComplete(report: Report): boolean {
  return PHASES.every((phase) => report.statuses[phase]?.state === "done");
}

export function usePipeline(id: string) {
  const [report, setReport] = useState<Report | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState<Partial<Record<PhaseName, LiveState>>>({});

  const driving = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const liveBuffer = useRef<Partial<Record<PhaseName, LiveState>>>({});
  const dirty = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const { report: fresh } = await getReport(id);
      setReport(fresh);
      setLoadError(null);
      return fresh;
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Rapport kon niet worden geladen.");
      return null;
    }
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Live-tekst in één keer per 250 ms naar React sturen in plaats van per token.
  useEffect(() => {
    const timer = setInterval(() => {
      if (!dirty.current) return;
      dirty.current = false;
      setLive({ ...liveBuffer.current });
    }, 250);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => () => abort.current?.abort(), []);

  const onEvent = useCallback((phase: PhaseName, event: PhaseEvent) => {
    const current = liveBuffer.current[phase] ?? { text: "", thinking: "", searches: [] };
    let next = current;
    if (event.t === "text") next = { ...current, text: (current.text + event.d).slice(-TAIL_CHARS) };
    else if (event.t === "thinking") next = { ...current, thinking: (current.thinking + event.d).slice(-1_500) };
    else if (event.t === "search") next = { ...current, searches: [...current.searches, event.query] };
    else if (event.t === "fetch") next = { ...current, searches: [...current.searches, `Bron openen: ${event.url}`] };
    else if (event.t === "start") next = { text: "", thinking: "", searches: [] };
    else return;
    liveBuffer.current = { ...liveBuffer.current, [phase]: next };
    dirty.current = true;
  }, []);

  const drive = useCallback(
    async (retryErrors = false) => {
      if (driving.current) return;
      driving.current = true;
      abort.current = new AbortController();
      setRunning(true);
      setError(null);
      let allowErrored = retryErrors;
      try {
        for (let guard = 0; guard < 400; guard++) {
          const current = await refresh();
          if (!current) break;
          const pending = PHASES.filter((p) => current.statuses[p]?.state !== "done");
          if (!pending.length) break;

          const errored = pending.filter((p) => current.statuses[p]?.state === "error");
          if (errored.length && !allowErrored) {
            setError(current.statuses[errored[0]]?.error ?? "Een stap is mislukt.");
            break;
          }
          allowErrored = false;

          const ready = pending.filter(
            (p) =>
              !isFreshRunning(current, p) &&
              PHASE_DEPENDENCIES[p].every((dep) => current.statuses[dep]?.state === "done"),
          );
          if (!ready.length) {
            if (pending.some((p) => isFreshRunning(current, p))) {
              await sleep(POLL_MS);
              continue;
            }
            break;
          }

          // Een stap die hetzelfde voorvoegsel heeft als een andere (bear en bull delen
          // tools, denkstand en dossier) start pas als die andere begint te streamen:
          // dan leest hij het dossier uit de cache in plaats van het opnieuw te betalen.
          const started = new Map<PhaseName, Promise<void>>();
          const markStarted = new Map<PhaseName, () => void>();
          for (const phase of ready) {
            started.set(
              phase,
              new Promise<void>((resolve) => {
                markStarted.set(phase, resolve);
                setTimeout(resolve, LEADER_WAIT_MS);
              }),
            );
          }
          const outcomes = await Promise.all(
            ready.map(async (phase) => {
              const leader = CACHE_LEADER[phase];
              if (leader && started.has(leader)) await started.get(leader);
              const outcome = await runPhase(
                id,
                phase,
                (event) => {
                  if (event.t === "streaming" || event.t === "error") markStarted.get(phase)?.();
                  onEvent(phase, event);
                },
                abort.current?.signal,
              );
              markStarted.get(phase)?.();
              return outcome;
            }),
          );
          if (abort.current?.signal.aborted) break;
          if (outcomes.includes("error")) {
            const after = await refresh();
            const failed = after && PHASES.find((p) => after.statuses[p]?.state === "error");
            setError((failed && after?.statuses[failed]?.error) || "Een stap is mislukt.");
            break;
          }
          // "interrupted": verbinding weg; de volgende ronde leest de status opnieuw.
        }
      } finally {
        driving.current = false;
        setRunning(false);
        await refresh();
      }
    },
    [id, onEvent, refresh],
  );

  const stop = useCallback(() => {
    abort.current?.abort();
  }, []);

  return { report, loadError, running, error, live, drive, stop, refresh };
}
