import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, FileText, Search } from "lucide-react";
import { PHASES, type Language, type ReportSummary } from "../../server/research/types";
import { createReport, listReports } from "./api";
import { KIND_LABELS, LANGUAGE_LABELS } from "./labels";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusOf(summary: ReportSummary): { label: string; tone: "done" | "busy" | "error" | "idle" } {
  const states = PHASES.map((p) => summary.statuses[p]?.state);
  if (states.every((s) => s === "done")) return { label: "Klaar", tone: "done" };
  if (states.includes("error")) return { label: "Onderbroken", tone: "error" };
  const recentlyRunning = PHASES.some((p) => {
    const s = summary.statuses[p];
    return s?.state === "running" && Date.now() - Date.parse(s.startedAt) < 330_000;
  });
  if (recentlyRunning) return { label: "Bezig", tone: "busy" };
  const done = states.filter((s) => s === "done").length;
  return { label: `${done}/${PHASES.length} stappen`, tone: "idle" };
}

const TONE_CLASSES = {
  done: "bg-[oklch(0.82_0.17_195_/_12%)] text-[oklch(0.82_0.17_195)]",
  busy: "bg-[oklch(0.75_0.15_70_/_12%)] text-[oklch(0.85_0.1_80)]",
  error: "bg-[oklch(0.65_0.18_25_/_14%)] text-[oklch(0.8_0.12_25)]",
  idle: "bg-[oklch(0.30_0.02_250_/_50%)] text-muted-foreground",
};

function NewResearchForm() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [language, setLanguage] = useState<Language>("nl");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { id } = await createReport(input.trim(), context.trim(), language);
      navigate(`/${id}?start=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Het rapport kon niet worden aangemaakt.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass-card rounded-xl p-6 lg:p-8">
      <h2 className="mb-1 text-xl font-bold">Nieuwe analyse</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Een aandeel, ETF, grondstof, thema of sector. De analyse zoekt actuele bronnen, laat een bull- en
        bear-analist debatteren, laat een onafhankelijke analist oordelen en maakt een A4-brief.
      </p>

      <label htmlFor="research-input" className="mb-2 block text-sm font-medium">
        Richting of ticker
      </label>
      <div className="relative mb-5">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id="research-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={120}
          placeholder="Bijvoorbeeld: Energy, XLE, NVDA, uranium"
          className="w-full rounded-lg border border-[oklch(0.30_0.02_250)] bg-[oklch(0.11_0.02_250)] py-3 pl-9 pr-3 outline-none focus:border-[oklch(0.82_0.17_195_/_60%)] focus-visible:ring-2 focus-visible:ring-[oklch(0.82_0.17_195_/_40%)]"
        />
      </div>

      <label htmlFor="research-context" className="mb-2 block text-sm font-medium">
        Eigen these of context <span className="font-normal text-muted-foreground">(optioneel)</span>
      </label>
      <textarea
        id="research-context"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        maxLength={4000}
        rows={3}
        placeholder="Bijvoorbeeld: focus op midstream en LNG-exporteurs; horizon 3-5 jaar."
        className="mb-5 w-full rounded-lg border border-[oklch(0.30_0.02_250)] bg-[oklch(0.11_0.02_250)] px-3 py-2.5 text-sm outline-none focus:border-[oklch(0.82_0.17_195_/_60%)] focus-visible:ring-2 focus-visible:ring-[oklch(0.82_0.17_195_/_40%)]"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label htmlFor="research-language" className="mb-2 block text-sm font-medium">
            Taal van het rapport
          </label>
          <select
            id="research-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="rounded-lg border border-[oklch(0.30_0.02_250)] bg-[oklch(0.11_0.02_250)] px-3 py-2.5 text-sm outline-none focus:border-[oklch(0.82_0.17_195_/_60%)]"
          >
            {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_LABELS[lang]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[oklch(0.82_0.17_195)] px-6 py-3 font-semibold text-[oklch(0.13_0.025_250)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Voorbereiden…" : "Start analyse"}
          {!busy && <ArrowRight size={18} aria-hidden="true" />}
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Een analyse duurt meestal 8 tot 15 minuten en kost naar schatting $2 tot $5 aan API-gebruik. Het
        rapport wordt stap voor stap bewaard.
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[oklch(0.75_0.16_25)]">
          {error}
        </p>
      )}
    </form>
  );
}

function Archive() {
  const [reports, setReports] = useState<ReportSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listReports()
      .then(({ reports }) => setReports(reports))
      .catch((e) => setError(e instanceof Error ? e.message : "Archief kon niet worden geladen."));
  }, []);

  return (
    <section aria-labelledby="archive-title">
      <h2 id="archive-title" className="mb-4 text-xl font-bold">
        Archief
      </h2>
      {error && <p className="text-sm text-[oklch(0.75_0.16_25)]">{error}</p>}
      {!error && reports === null && <p className="text-sm text-muted-foreground">Laden…</p>}
      {reports && reports.length === 0 && (
        <p className="text-sm text-muted-foreground">Nog geen analyses. Start er links één.</p>
      )}
      {reports && reports.length > 0 && (
        <ul className="space-y-3">
          {reports.map((summary) => {
            const status = statusOf(summary);
            const { meta } = summary;
            return (
              <li key={meta.id}>
                <Link
                  href={`/${meta.id}`}
                  className="glass-card group flex items-start gap-4 rounded-xl p-4 transition-colors focus-visible:outline-2 focus-visible:outline-[oklch(0.82_0.17_195)]"
                >
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[oklch(0.82_0.17_195_/_10%)]">
                    <FileText size={18} className="text-[oklch(0.82_0.17_195)]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold group-hover:text-[oklch(0.82_0.17_195)]">
                        {meta.displayName}
                      </span>
                      {meta.ticker && <span className="text-sm text-muted-foreground">{meta.ticker}</span>}
                      <span className="rounded bg-[oklch(0.30_0.02_250_/_50%)] px-1.5 py-0.5 text-[11px] font-semibold text-[oklch(0.8_0.01_250)]">
                        {KIND_LABELS[meta.kind]}
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${TONE_CLASSES[status.tone]}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{formatDate(meta.createdAt)}</span>
                      {summary.summary?.bull != null && summary.summary?.bear != null && (
                        <span>
                          Bull {Math.round(summary.summary.bull)}% / Bear {Math.round(summary.summary.bear)}%
                        </span>
                      )}
                      {summary.summary && <span>${summary.summary.costUsd.toFixed(2)}</span>}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function ResearchHome() {
  return (
    <div className="container py-10 lg:py-14">
      <div className="mb-8">
        <div className="mb-4 h-[3px] w-12 bg-[oklch(0.82_0.17_195)]" />
        <h1 className="text-3xl font-bold lg:text-4xl">Analyst Research</h1>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <NewResearchForm />
        </div>
        <div className="lg:col-span-2">
          <Archive />
        </div>
      </div>
    </div>
  );
}
