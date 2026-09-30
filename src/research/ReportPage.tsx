import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Download, FileText, Printer, RefreshCw, Trash2 } from "lucide-react";
import type { OnePagerData } from "../../server/research/schema";
import { PHASES } from "../../server/research/types";
import { createReport, deleteReport } from "./api";
import { KIND_LABELS, LANGUAGE_LABELS } from "./labels";
import OnePager, { type OnePagerHandle } from "./onepager/OnePager";
import { downloadOnePagerHtml, fileBaseName, printTarget } from "./print";
import ProgressPanel from "./ProgressPanel";
import ReportDocument from "./ReportDocument";
import SourcesPanel from "./SourcesPanel";
import { isComplete, isFreshRunning, usePipeline } from "./usePipeline";

type Tab = "onepager" | "report" | "sources";

const buttonClass =
  "inline-flex items-center gap-2 rounded-lg border border-[oklch(0.30_0.02_250)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-[oklch(0.82_0.17_195_/_45%)] hover:bg-[oklch(0.82_0.17_195_/_6%)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[oklch(0.30_0.02_250)] disabled:hover:bg-transparent";

export default function ReportPage({ id }: { id: string }) {
  const [, navigate] = useLocation();
  const { report, loadError, running, error, live, drive, stop } = usePipeline(id);
  const [tab, setTab] = useState<Tab | null>(null);
  const [scale, setScale] = useState(1);
  const [overflow, setOverflow] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const printSheet = useRef<OnePagerHandle>(null);
  const autostarted = useRef(false);

  // Automatisch starten na het aanmaken (?start=1), of meekijken als er al een stap loopt.
  useEffect(() => {
    if (!report || autostarted.current) return;
    const params = new URLSearchParams(window.location.search);
    const wantsStart = params.get("start") === "1";
    if (wantsStart) {
      params.delete("start");
      const query = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    }
    const someoneRunning = PHASES.some((p) => isFreshRunning(report, p));
    if (!isComplete(report) && (wantsStart || someoneRunning)) {
      autostarted.current = true;
      void drive();
    }
  }, [report, drive]);

  const onScale = useCallback((value: number, tooLong: boolean) => {
    setScale(value);
    setOverflow(tooLong);
  }, []);

  if (loadError && !report) {
    return (
      <div className="container py-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} aria-hidden="true" /> Terug naar het archief
        </Link>
        <p className="text-[oklch(0.75_0.16_25)]">{loadError}</p>
      </div>
    );
  }

  if (!report) {
    return <div className="container py-10 text-muted-foreground">Rapport laden…</div>;
  }

  const { meta } = report;
  const onePagerData = (report.phases.onepager?.data ?? null) as OnePagerData | null;
  const complete = isComplete(report);
  const hasText = PHASES.some((p) => report.phases[p]?.markdown);
  const activeTab: Tab = tab ?? (onePagerData ? "onepager" : "report");
  const totalCost =
    (meta.setupCostUsd ?? 0) + PHASES.reduce((sum, p) => sum + (report.phases[p]?.usage.costUsd ?? 0), 0);
  const created = new Date(meta.createdAt).toLocaleString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const rerun = async () => {
    setBusy("rerun");
    setActionError(null);
    try {
      const { id: newId } = await createReport(meta.input, meta.context, meta.language);
      navigate(`/${newId}?start=1`);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Opnieuw analyseren is mislukt.");
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    setBusy("delete");
    setActionError(null);
    try {
      stop();
      await deleteReport(meta.id);
      navigate("/");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Verwijderen is mislukt.");
      setBusy(null);
    }
  };

  const downloadHtml = async () => {
    const sheet = printSheet.current?.sheet;
    if (!sheet) return;
    setBusy("html");
    try {
      await downloadOnePagerHtml(sheet, meta);
    } finally {
      setBusy(null);
    }
  };

  const tabs: { key: Tab; label: string; enabled: boolean }[] = [
    { key: "onepager", label: "One-pager", enabled: Boolean(onePagerData) },
    { key: "report", label: "Volledig rapport", enabled: true },
    { key: "sources", label: "Bronnen", enabled: true },
  ];

  return (
    <div className="container py-8 lg:py-10">
      <div className="no-print">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} aria-hidden="true" /> Terug naar het archief
        </Link>

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded bg-[oklch(0.30_0.02_250_/_50%)] px-1.5 py-0.5 font-semibold">{KIND_LABELS[meta.kind]}</span>
              <span className="text-muted-foreground">{created}</span>
              <span className="text-muted-foreground">· {LANGUAGE_LABELS[meta.language]}</span>
              {totalCost > 0 && <span className="text-muted-foreground">· ${totalCost.toFixed(2)} API-kosten</span>}
            </div>
            <h1 className="text-3xl font-bold lg:text-4xl">
              {meta.displayName}
              {meta.ticker && <span className="ml-3 text-xl font-semibold text-muted-foreground lg:text-2xl">{meta.ticker}</span>}
            </h1>
            {meta.context && <p className="mt-2 max-w-3xl text-sm text-muted-foreground">These: {meta.context}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={buttonClass}
              disabled={!onePagerData}
              onClick={() => printTarget("onepager", fileBaseName(meta, "brief"))}
            >
              <Printer size={16} aria-hidden="true" /> One-pager als PDF
            </button>
            <button type="button" className={buttonClass} disabled={!onePagerData || busy === "html"} onClick={downloadHtml}>
              <Download size={16} aria-hidden="true" /> HTML
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={!hasText}
              onClick={() => printTarget("report", fileBaseName(meta, "rapport"))}
            >
              <FileText size={16} aria-hidden="true" /> Rapport als PDF
            </button>
            <button type="button" className={buttonClass} disabled={busy === "rerun"} onClick={rerun}>
              <RefreshCw size={16} aria-hidden="true" /> {busy === "rerun" ? "Voorbereiden…" : "Opnieuw analyseren"}
            </button>
            {confirmDelete ? (
              <span className="inline-flex items-center gap-2 rounded-lg border border-[oklch(0.65_0.18_25_/_50%)] px-2 py-1 text-sm">
                Rapport verwijderen?
                <button
                  type="button"
                  onClick={remove}
                  disabled={busy === "delete"}
                  className="rounded-md bg-[oklch(0.62_0.19_25)] px-2.5 py-1 font-semibold text-white hover:opacity-90"
                >
                  Ja, verwijderen
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-md px-2 py-1 hover:bg-[oklch(0.20_0.02_250)]">
                  Annuleren
                </button>
              </span>
            ) : (
              <button type="button" className={buttonClass} onClick={() => setConfirmDelete(true)}>
                <Trash2 size={16} aria-hidden="true" /> Verwijderen
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <p role="alert" className="mb-4 text-sm text-[oklch(0.75_0.16_25)]">
            {actionError}
          </p>
        )}

        {(!complete || running) && (
          <div className="mb-8">
            <ProgressPanel
              report={report}
              live={live}
              running={running}
              error={error}
              onStart={() => void drive()}
              onRetry={() => void drive(true)}
              onStop={stop}
            />
          </div>
        )}

        <div role="tablist" aria-label="Weergave" className="mb-6 flex gap-1 border-b border-[oklch(0.25_0.02_250_/_60%)]">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={activeTab === t.key}
              disabled={!t.enabled}
              onClick={() => setTab(t.key)}
              className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 sm:px-4 ${
                activeTab === t.key
                  ? "border-[oklch(0.82_0.17_195)] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "onepager" && onePagerData && (
          <div>
            {overflow && (
              <p className="mb-3 text-sm text-[oklch(0.85_0.1_80)]">
                Let op: de inhoud past ook op de kleinste letter niet helemaal op één A4. De onderkant wordt afgesneden bij het printen.
              </p>
            )}
            <div className="onepager-stage">
              <OnePager data={onePagerData} meta={meta} variant="screen" scale={scale} />
            </div>
          </div>
        )}
        {activeTab === "report" && (
          <div className="report-stage">
            <ReportDocument report={report} />
          </div>
        )}
        {activeTab === "sources" && <SourcesPanel report={report} />}
      </div>

      {/* Printversies: buiten beeld, zichtbaar gemaakt door research.css bij printen. */}
      {createPortal(
        <>
          {onePagerData && (
            <div className="print-root print-root--onepager" aria-hidden="true">
              <OnePager ref={printSheet} data={onePagerData} meta={meta} variant="print" onScale={onScale} />
            </div>
          )}
          {hasText && (
            <div className="print-root print-root--report" aria-hidden="true">
              <ReportDocument report={report} />
            </div>
          )}
        </>,
        document.body,
      )}
    </div>
  );
}
