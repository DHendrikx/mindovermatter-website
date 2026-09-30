/*
 * De A4 one-pager. Eén component, twee varianten:
 * - "print": vaste A4-maat, staat buiten beeld klaar voor printen/HTML-export
 *   en meet zelf hoe ver de letter omlaag moet om op één pagina te passen;
 * - "screen": dezelfde pagina op het scherm (op smalle schermen gestapeld),
 *   met de schaal die de print-variant heeft bepaald.
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import type { OnePagerData } from "../../../server/research/schema";
import type { ReportMeta } from "../../../server/research/types";
import { BRIEF_TEXT, type BriefText } from "../labels";
import { AnalystTargetsChart, BalanceBar, ConfidenceDots, FundamentalsChart, UpsideChart, ValuationChart } from "./charts";
import { formatDate, formatMoney, formatPct } from "./format";
import "./onepager.css";

export const LOGO_SRC = "/logos/mom-logo-dark.svg";
const SCALES = [1, 0.96, 0.92, 0.88, 0.85, 0.82, 0.79, 0.76, 0.73, 0.7];
const HALF_CHART = 328;
const FULL_CHART = 690;

type Company = NonNullable<OnePagerData["company"]>;
type Landscape = NonNullable<OnePagerData["landscape"]>;
type ChartWidths = { half: number; full: number };

/** Breedte van een element volgen (alleen voor de schermvariant). */
function useWidth(ref: React.RefObject<HTMLElement | null>, enabled: boolean): number | null {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled]);
  return width;
}

function PanelTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="op-paneltitle">
      <h2 className="op-h">{children}</h2>
      {aside && <span className="op-aside">{aside}</span>}
    </div>
  );
}

function BullBear({ data, t }: { data: OnePagerData; t: BriefText }) {
  return (
    <section className="op-grid2 op-bullbear">
      <div className="op-case op-case--bull">
        <h2 className="op-h op-h--dot">
          <i aria-hidden="true" />
          {t.bullCase}
        </h2>
        <ul>
          {data.bullPoints.slice(0, 4).map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
      <div className="op-case op-case--bear">
        <h2 className="op-h op-h--dot">
          <i aria-hidden="true" />
          {t.bearCase}
        </h2>
        <ul>
          {data.bearPoints.slice(0, 4).map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CompanyBody({ data, company, meta, t, widths }: { data: OnePagerData; company: Company; meta: ReportMeta; t: BriefText; widths: ChartWidths }) {
  const lang = meta.language;
  const { fundamentals, valuation } = company;
  return (
    <>
      <section className="op-grid2">
        <div className="op-panel">
          <PanelTitle>{t.fundamentals}</PanelTitle>
          <div className="op-subrow">
            <p className="op-sub">
              {fundamentals.metric} ({fundamentals.unit})
            </p>
            <span className="op-key">
              <i className="op-key-solid" aria-hidden="true" />
              {t.actual}
              <i className="op-key-dashed" aria-hidden="true" />
              {t.estimate}
            </span>
          </div>
          <FundamentalsChart
            points={fundamentals.points}
            lang={lang}
            actualLabel={t.actual}
            estimateLabel={t.estimate}
            width={widths.half}
          />
        </div>
        <div className="op-panel">
          <PanelTitle>{t.valuation}</PanelTitle>
          <p className="op-sub">{valuation.method}</p>
          <ValuationChart
            bear={valuation.bear}
            base={valuation.base}
            bull={valuation.bull}
            current={company.currentPrice}
            currency={company.currency}
            lang={lang}
            labels={{ bear: t.bear, base: t.base, bull: t.bull, current: t.current }}
            width={widths.half}
          />
        </div>
      </section>

      {company.analysts.length > 0 && (
        <section className="op-panel">
          <PanelTitle aside={`${t.consensus}: ${t.trend[company.targetTrend]}`}>{t.analystTargets}</PanelTitle>
          <AnalystTargetsChart
            analysts={company.analysts}
            current={company.currentPrice}
            consensus={company.consensusTarget}
            currency={company.currency}
            lang={lang}
            labels={{ current: t.current, consensus: t.consensus }}
            width={widths.full}
          />
        </section>
      )}

      <BullBear data={data} t={t} />
    </>
  );
}

function LandscapeBody({ data, landscape, meta, t, widths }: { data: OnePagerData; landscape: Landscape; meta: ReportMeta; t: BriefText; widths: ChartWidths }) {
  const lang = meta.language;
  const candidates = landscape.candidates.slice(0, 8);
  return (
    <>
      <BullBear data={data} t={t} />

      <section className="op-panel">
        <PanelTitle>{t.marketMap}</PanelTitle>
        <div className="op-grid2 op-map">
          <div>
            <p className="op-maplabel">{t.tactical}</p>
            <ul className="op-chips">
              {landscape.tactical.slice(0, 5).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="op-maplabel">{t.structural}</p>
            <ul className="op-chips op-chips--structural">
              {landscape.structural.slice(0, 5).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="op-panel">
        <PanelTitle>{t.opportunities}</PanelTitle>
        <table className="op-table op-candidates">
          <thead>
            <tr>
              <th>{t.ticker}</th>
              <th>{t.exposure}</th>
              <th className="num">{t.price}</th>
              <th className="num">{t.target}</th>
              <th className="num">{t.upside}</th>
              <th>{t.confidence}</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr key={`${c.ticker}-${i}`}>
                <td>
                  <strong>{c.ticker}</strong>
                </td>
                <td>
                  <span className="op-cellname">{c.name}</span>
                  <span className="op-cellsub">{c.exposure}</span>
                </td>
                <td className="num" data-label={t.price}>{c.price !== null ? formatMoney(c.price, c.currency, lang) : "–"}</td>
                <td className="num" data-label={t.target}>{c.target !== null ? formatMoney(c.target, c.currency, lang) : "–"}</td>
                <td className="num" data-label={t.upside}>{c.upsidePct !== null ? formatPct(c.upsidePct, lang) : "–"}</td>
                <td data-label={t.confidence}>
                  <ConfidenceDots value={c.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="op-grid2">
        <div className="op-panel">
          <PanelTitle>{t.upsideChart}</PanelTitle>
          <UpsideChart
            rows={candidates.map((c) => ({ ticker: c.ticker, upsidePct: c.upsidePct }))}
            lang={lang}
            noTargetLabel="–"
            width={widths.half}
          />
        </div>
        <div className="op-panel">
          <PanelTitle>{t.watchlist}</PanelTitle>
          {landscape.watchlist.length ? (
            <ul className="op-watch">
              {landscape.watchlist.slice(0, 5).map((item, i) => (
                <li key={i}>
                  <strong>{item.asset}</strong>
                  <span>{item.note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="op-empty">–</p>
          )}
        </div>
      </section>
    </>
  );
}

export interface OnePagerHandle {
  sheet: HTMLDivElement | null;
}

interface OnePagerProps {
  data: OnePagerData;
  meta: ReportMeta;
  variant: "screen" | "print";
  scale?: number;
  onScale?: (scale: number, overflow: boolean) => void;
}

const OnePager = forwardRef<OnePagerHandle, OnePagerProps>(function OnePager(
  { data, meta, variant, scale = 1, onScale },
  ref,
) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({ sheet: sheetRef.current }), []);
  const t = BRIEF_TEXT[meta.language];
  const lang = meta.language;
  // Op smalle schermen tekenen de grafieken op de werkelijke breedte, zodat de tekst leesbaar blijft.
  const measured = useWidth(innerRef, variant === "screen");
  const narrow = measured !== null && measured < 600;
  const widths: ChartWidths = narrow
    ? { half: Math.round(measured - 24), full: Math.round(measured - 24) }
    : { half: HALF_CHART, full: FULL_CHART };

  const fit = useCallback(() => {
    const sheet = sheetRef.current;
    const inner = innerRef.current;
    if (!sheet || !inner || variant !== "print") return;
    let chosen = SCALES[SCALES.length - 1];
    for (const s of SCALES) {
      sheet.style.setProperty("--op-scale", String(s));
      if (inner.scrollHeight <= inner.clientHeight + 1) {
        chosen = s;
        break;
      }
    }
    sheet.style.setProperty("--op-scale", String(chosen));
    onScale?.(chosen, inner.scrollHeight > inner.clientHeight + 1);
  }, [variant, onScale]);

  useLayoutEffect(() => {
    fit();
  }, [fit, data]);

  useEffect(() => {
    if (variant !== "print") return;
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });
    return () => {
      cancelled = true;
    };
  }, [fit, variant]);

  const horizon = data.horizon.map((h) => t.horizon[h]).join(" · ");
  const bull = Math.round(data.balance.bull);
  const bear = Math.round(data.balance.bear);

  return (
    <div
      ref={sheetRef}
      className={`op-sheet${variant === "print" ? " op-sheet--fixed" : ""}`}
      lang={lang}
      style={variant === "screen" ? ({ "--op-scale": String(scale) } as React.CSSProperties) : undefined}
    >
      <div ref={innerRef} className="op-inner">
        <header className="op-header">
          <div className="op-brand">
            <img src={LOGO_SRC} alt="Mind over Matter" className="op-logo" />
            <div>
              <p className="op-kicker">{data.template === "company" ? t.investmentBrief : t.landscape}</p>
              <h1 className="op-title">
                {data.title}
                {data.ticker && <span className="op-ticker">{data.ticker}</span>}
              </h1>
            </div>
          </div>
          <div className="op-date">
            <strong>{formatDate(meta.createdAt, lang)}</strong>
            <span>
              {t.pricesAsOf} {formatDate(data.asOf, lang)}
            </span>
          </div>
        </header>

        <p className="op-thesis">{data.thesis}</p>

        <section className="op-balance">
          <div className="op-balance-figures">
            <span className="op-label">{t.independentReview}</span>
            <p className="op-balance-numbers">
              <span className="op-bull">Bull {bull}%</span>
              <span className="op-sep" aria-hidden="true">
                |
              </span>
              <span className="op-bear">Bear {bear}%</span>
            </p>
            <BalanceBar bull={bull} bear={bear} />
            <span className="op-note">{t.balanceNote}</span>
          </div>
          <div className="op-balance-verdict">
            <p className="op-verdict">“{data.balance.verdict}”</p>
            {horizon && <p className="op-horizon">{horizon}</p>}
          </div>
        </section>

        <section className="op-metrics">
          {data.headlineMetrics.slice(0, 4).map((metric, i) => (
            <div key={i} className="op-metric">
              <span className="op-metric-label">{metric.label}</span>
              <span className="op-metric-value">{metric.value}</span>
              <span className="op-metric-note">{metric.note}</span>
            </div>
          ))}
        </section>

        {data.template === "company" && data.company ? (
          <CompanyBody data={data} company={data.company} meta={meta} t={t} widths={widths} />
        ) : data.landscape ? (
          <LandscapeBody data={data} landscape={data.landscape} meta={meta} t={t} widths={widths} />
        ) : (
          <BullBear data={data} t={t} />
        )}

        <section className="op-panel op-dashboard">
          <PanelTitle aside={`${t.nextCheckpoint}: ${data.nextCheckpoint}`}>{t.dashboard}</PanelTitle>
          <table className="op-table">
            <thead>
              <tr>
                <th>{t.metric}</th>
                <th>{t.strengthens}</th>
                <th>{t.weakens}</th>
              </tr>
            </thead>
            <tbody>
              {data.dashboard.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  <td>
                    <strong>{row.indicator}</strong>
                  </td>
                  <td data-label={t.strengthens}>{row.bull}</td>
                  <td data-label={t.weakens}>{row.bear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="op-conclusion">
          <span className="op-label">{data.template === "company" ? t.coreThesis : t.conclusion}</span>
          <p>{data.conclusion}</p>
        </section>

        <footer className="op-footer">
          <span>{t.footer}</span>
          <span className="op-footer-brand">Mind over Matter · Analyst Research</span>
        </footer>
      </div>
    </div>
  );
});

export default OnePager;
