import { AlertTriangle, Check, Circle, Loader2 } from "lucide-react";
import { PHASES, type PhaseName, type Report } from "../../server/research/types";
import { PHASE_LABELS } from "./labels";
import { isFreshRunning, type LiveState } from "./usePipeline";

function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  return seconds < 60 ? `${seconds} s` : `${Math.floor(seconds / 60)} min ${seconds % 60} s`;
}

function PhaseRow({ report, phase, live }: { report: Report; phase: PhaseName; live?: LiveState }) {
  const status = report.statuses[phase];
  const result = report.phases[phase];
  const running = isFreshRunning(report, phase);
  const state = status?.state === "done" ? "done" : status?.state === "error" ? "error" : running ? "running" : "pending";

  return (
    <li className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 shrink-0" aria-hidden="true">
        {state === "done" && <Check size={18} className="text-[oklch(0.82_0.17_195)]" />}
        {state === "running" && <Loader2 size={18} className="animate-spin text-[oklch(0.85_0.1_80)] motion-reduce:animate-none" />}
        {state === "error" && <AlertTriangle size={18} className="text-[oklch(0.75_0.16_25)]" />}
        {state === "pending" && <Circle size={18} className="text-[oklch(0.40_0.02_250)]" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className={state === "pending" ? "text-muted-foreground" : "font-medium"}>{PHASE_LABELS[phase]}</span>
          <span className="text-xs text-muted-foreground">
            {state === "done" && result && (
              <>
                {formatDuration(result.durationMs)}
                {result.usage.webSearches > 0 && ` · ${result.usage.webSearches} zoekopdrachten`}
                {` · $${result.usage.costUsd.toFixed(2)}`}
              </>
            )}
            {state === "running" && "bezig…"}
            {state === "error" && "mislukt"}
          </span>
        </div>
        {state === "error" && status?.error && <p className="mt-1 text-sm text-[oklch(0.8_0.12_25)]">{status.error}</p>}
        {state === "running" && live && live.searches.length > 0 && (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            Zoekt: {live.searches[live.searches.length - 1]}
          </p>
        )}
      </div>
    </li>
  );
}

export default function ProgressPanel({
  report,
  live,
  running,
  error,
  onStart,
  onRetry,
  onStop,
}: {
  report: Report;
  live: Partial<Record<PhaseName, LiveState>>;
  running: boolean;
  error: string | null;
  onStart: () => void;
  onRetry: () => void;
  onStop: () => void;
}) {
  const doneCount = PHASES.filter((p) => report.statuses[p]?.state === "done").length;
  const hasError = PHASES.some((p) => report.statuses[p]?.state === "error");
  const activePhases = PHASES.filter((p) => isFreshRunning(report, p));
  const activeLive = activePhases.map((p) => ({ phase: p, state: live[p] })).filter((x) => x.state?.text);

  return (
    <section aria-label="Voortgang" className="glass-card rounded-xl p-6 no-print">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Voortgang</h2>
          <p className="text-sm text-muted-foreground">
            {doneCount} van {PHASES.length} stappen klaar. Bull-, bear- en waarderingsanalist werken tegelijk.
          </p>
        </div>
        <div className="flex gap-2">
          {running ? (
            <button
              type="button"
              onClick={onStop}
              className="rounded-lg border border-[oklch(0.30_0.02_250)] px-4 py-2 text-sm hover:border-[oklch(0.82_0.17_195_/_40%)]"
            >
              Niet meer volgen
            </button>
          ) : hasError ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg bg-[oklch(0.82_0.17_195)] px-4 py-2 text-sm font-semibold text-[oklch(0.13_0.025_250)] hover:opacity-90"
            >
              Mislukte stap opnieuw proberen
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="rounded-lg bg-[oklch(0.82_0.17_195)] px-4 py-2 text-sm font-semibold text-[oklch(0.13_0.025_250)] hover:opacity-90"
            >
              {doneCount === 0 ? "Analyse starten" : "Analyse hervatten"}
            </button>
          )}
        </div>
      </div>

      {error && !running && (
        <p role="alert" className="mb-3 rounded-md bg-[oklch(0.65_0.18_25_/_12%)] px-3 py-2 text-sm text-[oklch(0.85_0.1_25)]">
          {error}
        </p>
      )}

      <ol className="divide-y divide-[oklch(0.25_0.02_250_/_50%)]">
        {PHASES.map((phase) => (
          <PhaseRow key={phase} report={report} phase={phase} live={live[phase]} />
        ))}
      </ol>

      {activeLive.length > 0 && (
        <div className="mt-4 space-y-3">
          {activeLive.map(({ phase, state }) => (
            <div key={phase} className="rounded-lg border border-[oklch(0.25_0.02_250_/_60%)] bg-[oklch(0.11_0.02_250)] p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[oklch(0.82_0.17_195)]">
                {PHASE_LABELS[phase]} schrijft
              </p>
              <p className="live-tail whitespace-pre-wrap text-xs leading-relaxed text-[oklch(0.78_0.01_250)]">
                {state!.text.slice(-700)}
              </p>
            </div>
          ))}
        </div>
      )}
      {running && (
        <p className="mt-4 text-xs text-muted-foreground">
          Je kunt dit tabblad sluiten: een lopende stap maakt zich op de server af en wordt bewaard. Kom later terug en
          klik op "Analyse hervatten" voor de resterende stappen.
        </p>
      )}
    </section>
  );
}
