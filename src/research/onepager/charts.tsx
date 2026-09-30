/*
 * SVG-grafieken voor de one-pager. Gemaakt voor wit papier en print:
 * dunne marks, haarlijn-rasters, labels in inkt (nooit in de datakleur),
 * selectieve directe labels. De viewBox-breedte is gelijk aan de gerenderde
 * breedte in px, zodat 10 eenheden tekst ook ~10 px op papier is.
 *
 * Kleuren (gevalideerd met de dataviz-validator, licht oppervlak):
 * teal #16719a (bull / enkele reeks) en oranje #d97a2b (bear) als polariteitspaar.
 */
import type { Language } from "../../../server/research/types";
import { compact, formatMoney, formatNumber, formatPct, niceTicks } from "./format";

const COLORS = {
  teal: "#16719a",
  orange: "#d97a2b",
  neutral: "#7b8599",
  ink: "#0f1a33",
  ink2: "#3b4760",
  muted: "#667085",
  grid: "#e3e7ee",
  surface: "#ffffff",
};

const FONT = 10;

/** Horizontale balk met afgeronde data-kant (4px) en vlakke basislijn. */
function hBarPath(x0: number, x1: number, yTop: number, height: number): string {
  const r = Math.min(4, Math.abs(x1 - x0) / 2, height / 2);
  if (x1 >= x0) {
    return `M${x0},${yTop} H${x1 - r} Q${x1},${yTop} ${x1},${yTop + r} V${yTop + height - r} Q${x1},${
      yTop + height
    } ${x1 - r},${yTop + height} H${x0} Z`;
  }
  return `M${x0},${yTop} H${x1 + r} Q${x1},${yTop} ${x1},${yTop + r} V${yTop + height - r} Q${x1},${
    yTop + height
  } ${x1 + r},${yTop + height} H${x0} Z`;
}

const approxTextWidth = (text: string, size = FONT) => text.length * size * 0.56;

/* ─── Fundamentele ontwikkeling: lijn, gerealiseerd doorgetrokken, schatting gestippeld ─── */

export interface FundamentalPoint {
  period: string;
  value: number;
  basis: "actual" | "estimate" | "guidance";
}

export function FundamentalsChart({
  points,
  lang,
  actualLabel,
  estimateLabel,
  width = 344,
}: {
  points: FundamentalPoint[];
  lang: Language;
  actualLabel: string;
  estimateLabel: string;
  width?: number;
}) {
  if (points.length < 2) return <p className="op-empty">—</p>;
  const W = width;
  const H = 118;
  const m = { top: 16, right: 12, bottom: 20, left: 38 };
  const values = points.map((p) => p.value);
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values), 4);
  const lo = ticks[0];
  const hi = ticks[ticks.length - 1];
  const band = (W - m.left - m.right) / points.length;
  const x = (i: number) => m.left + band * (i + 0.5);
  const y = (v: number) => m.top + ((hi - v) / (hi - lo || 1)) * (H - m.top - m.bottom);

  const firstEstimate = points.findIndex((p) => p.basis !== "actual");
  const lastActual = firstEstimate === -1 ? points.length - 1 : firstEstimate - 1;
  const actualPts = points.slice(0, lastActual + 1).map((p, i) => `${x(i)},${y(p.value)}`);
  const estimateStart = Math.max(lastActual, 0);
  const estimatePts =
    firstEstimate === -1 ? [] : points.slice(estimateStart).map((p, i) => `${x(i + estimateStart)},${y(p.value)}`);
  const labelled = new Set([lastActual, points.length - 1].filter((i) => i >= 0));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="op-chart" role="img" aria-label="Fundamentele ontwikkeling">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={m.left} x2={W - m.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? COLORS.muted : COLORS.grid} strokeWidth={1} />
          <text x={m.left - 6} y={y(t) + 3.5} fontSize={FONT - 1} fill={COLORS.muted} textAnchor="end" className="op-tabular">
            {compact(t, lang)}
          </text>
        </g>
      ))}

      {actualPts.length > 1 && (
        <polyline points={actualPts.join(" ")} fill="none" stroke={COLORS.teal} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      )}
      {estimatePts.length > 1 && (
        <polyline
          points={estimatePts.join(" ")}
          fill="none"
          stroke={COLORS.teal}
          strokeWidth={2}
          strokeDasharray="5 4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {points.map((p, i) => {
        const estimate = p.basis !== "actual";
        return (
          <g key={`${p.period}-${i}`}>
            <circle
              cx={x(i)}
              cy={y(p.value)}
              r={4}
              fill={estimate ? COLORS.surface : COLORS.teal}
              stroke={estimate ? COLORS.teal : COLORS.surface}
              strokeWidth={2}
            >
              <title>{`${p.period}: ${formatNumber(p.value, lang, 2)} (${estimate ? estimateLabel : actualLabel})`}</title>
            </circle>
            {labelled.has(i) && (
              <text x={x(i)} y={y(p.value) - 9} fontSize={FONT} fontWeight={600} fill={COLORS.ink} textAnchor="middle">
                {compact(p.value, lang)}
              </text>
            )}
            <text x={x(i)} y={H - 5} fontSize={FONT - 1} fill={COLORS.muted} textAnchor="middle">
              {p.period}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Waardering: bear / base / bull als balken, koers als referentielijn ─── */

export function ValuationChart({
  bear,
  base,
  bull,
  current,
  currency,
  lang,
  labels,
  width = 344,
}: {
  bear: number;
  base: number;
  bull: number;
  current: number;
  currency: string;
  lang: Language;
  labels: { bear: string; base: string; bull: string; current: string };
  width?: number;
}) {
  const W = width;
  const rows = [
    { key: "bear", label: labels.bear, value: bear, color: COLORS.orange },
    { key: "base", label: labels.base, value: base, color: COLORS.neutral },
    { key: "bull", label: labels.bull, value: bull, color: COLORS.teal },
  ];
  const rowH = 24;
  const m = { top: 22, right: 12, bottom: 18, left: 42 };
  const H = m.top + rows.length * rowH + m.bottom;
  const ticks = niceTicks(0, Math.max(bull, base, bear, current) * 1.05, 4);
  const hi = ticks[ticks.length - 1];
  const x = (v: number) => m.left + (Math.max(v, 0) / hi) * (W - m.left - m.right);
  const barH = 13;
  const xc = x(current);
  const currentText = `${labels.current} ${formatMoney(current, currency, lang)}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="op-chart" role="img" aria-label="Intrinsieke waarde per aandeel">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={m.top - 4} y2={H - m.bottom} stroke={t === 0 ? COLORS.muted : COLORS.grid} strokeWidth={1} />
          <text x={x(t)} y={H - 6} fontSize={FONT - 1} fill={COLORS.muted} textAnchor="middle" className="op-tabular">
            {compact(t, lang)}
          </text>
        </g>
      ))}

      {rows.map((row, i) => {
        const yTop = m.top + i * rowH + (rowH - barH) / 2;
        return (
          <g key={row.key}>
            <text x={m.left - 8} y={yTop + barH / 2 + 3.5} fontSize={FONT} fontWeight={600} fill={COLORS.ink2} textAnchor="end">
              {row.label}
            </text>
            <path d={hBarPath(x(0), x(row.value), yTop, barH)} fill={row.color}>
              <title>{`${row.label}: ${formatMoney(row.value, currency, lang)}`}</title>
            </path>
          </g>
        );
      })}

      <line x1={xc} x2={xc} y1={m.top - 6} y2={H - m.bottom} stroke={COLORS.ink} strokeWidth={1.5} />

      {rows.map((row, i) => {
        const yTop = m.top + i * rowH + (rowH - barH) / 2;
        const x1 = x(row.value);
        const diff = current ? ((row.value - current) / current) * 100 : 0;
        const text = `${formatMoney(row.value, currency, lang)} · ${formatPct(diff, lang)}`;
        const textWidth = approxTextWidth(text);
        // Label naast de balk; valt de koerslijn erdoorheen, dan voorbij de lijn.
        let start = x1 + 6;
        if (xc >= start - 3 && xc <= start + textWidth + 3) start = xc + 6;
        const outside = start + textWidth <= W - m.right;
        return (
          <text
            key={`${row.key}-label`}
            x={outside ? start : x1 - 6}
            y={yTop + barH / 2 + 3.5}
            fontSize={FONT}
            fontWeight={600}
            fill={outside ? COLORS.ink : COLORS.surface}
            textAnchor={outside ? "start" : "end"}
            className="op-tabular"
          >
            {text}
          </text>
        );
      })}

      <text
        x={xc > W / 2 ? xc - 5 : xc + 5}
        y={m.top - 10}
        fontSize={FONT}
        fontWeight={600}
        fill={COLORS.ink}
        textAnchor={xc > W / 2 ? "end" : "start"}
      >
        {currentText}
      </text>
    </svg>
  );
}

/* ─── Koersdoelen analisten: één stip per analist, koers en consensus als lijnen ─── */

export interface AnalystTarget {
  firm: string;
  rating: string;
  target: number;
  date: string;
}

export function AnalystTargetsChart({
  analysts,
  current,
  consensus,
  currency,
  lang,
  labels,
  width = 710,
}: {
  analysts: AnalystTarget[];
  current: number;
  consensus: number | null;
  currency: string;
  lang: Language;
  labels: { current: string; consensus: string };
  width?: number;
}) {
  if (!analysts.length) return <p className="op-empty">—</p>;
  const rows = [...analysts].sort((a, b) => a.target - b.target).slice(0, 8);
  const W = width;
  // Smal (mobiel): geen rating in het label, kortere labelkolom, iets hogere rijen.
  const narrow = W < 500;
  const rowH = narrow ? 16 : 13;
  const m = { top: 22, right: 16, bottom: 18, left: narrow ? Math.round(W * 0.46) : 210 };
  const H = m.top + rows.length * rowH + m.bottom;
  const all = [...rows.map((r) => r.target), current, ...(consensus ? [consensus] : [])];
  const ticks = niceTicks(Math.min(...all) * 0.96, Math.max(...all) * 1.03, 5);
  const lo = ticks[0];
  const hi = ticks[ticks.length - 1];
  const x = (v: number) => m.left + ((v - lo) / (hi - lo || 1)) * (W - m.left - m.right);
  const xc = x(current);
  const xk = consensus ? x(consensus) : null;
  const plotBottom = H - m.bottom;

  // Labels boven de plot: koers en consensus naar tegenovergestelde kanten, zodat ze niet botsen.
  const currentLeft = xk !== null && xk > xc;
  const currentText = `${labels.current} ${formatMoney(current, currency, lang)}`;
  const consensusText = consensus ? `${labels.consensus} ${formatMoney(consensus, currency, lang)}` : "";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="op-chart" role="img" aria-label="Koersdoelen analisten">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={m.top - 4} y2={plotBottom} stroke={COLORS.grid} strokeWidth={1} />
          <text x={x(t)} y={H - 6} fontSize={FONT - 1} fill={COLORS.muted} textAnchor="middle" className="op-tabular">
            {compact(t, lang)}
          </text>
        </g>
      ))}

      {rows.map((row, i) => {
        const cy = m.top + i * rowH + rowH / 2;
        return (
          <g key={`${row.firm}-${i}`}>
            <text x={8} y={cy + 3.5} fontSize={FONT} fill={COLORS.ink2}>
              <tspan fontWeight={600}>{row.firm}</tspan>
              {!narrow && <tspan fill={COLORS.muted}>{`  ${row.rating}`}</tspan>}
            </text>
            <text x={m.left - 10} y={cy + 3.5} fontSize={FONT} fontWeight={600} fill={COLORS.ink} textAnchor="end" className="op-tabular">
              {formatMoney(row.target, currency, lang)}
            </text>
            <line x1={m.left} x2={W - m.right} y1={cy} y2={cy} stroke={COLORS.grid} strokeWidth={1} />
            <circle cx={x(row.target)} cy={cy} r={4.5} fill={COLORS.teal} stroke={COLORS.surface} strokeWidth={2}>
              <title>{`${row.firm} (${row.rating}), ${row.date}: ${formatMoney(row.target, currency, lang)}`}</title>
            </circle>
          </g>
        );
      })}

      <line x1={xc} x2={xc} y1={m.top - 6} y2={plotBottom} stroke={COLORS.ink} strokeWidth={1.5} />
      <text x={currentLeft ? xc - 5 : xc + 5} y={m.top - 10} fontSize={FONT} fontWeight={600} fill={COLORS.ink} textAnchor={currentLeft ? "end" : "start"}>
        {currentText}
      </text>
      {xk !== null && (
        <>
          <line x1={xk} x2={xk} y1={m.top - 6} y2={plotBottom} stroke={COLORS.teal} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={currentLeft ? xk + 5 : xk - 5} y={m.top - 10} fontSize={FONT} fontWeight={600} fill={COLORS.ink} textAnchor={currentLeft ? "start" : "end"}>
            {consensusText}
          </text>
        </>
      )}
    </svg>
  );
}

/* ─── Upside volgens consensus: divergerende balken rond nul ─── */

export interface UpsideRow {
  ticker: string;
  upsidePct: number | null;
}

export function UpsideChart({
  rows,
  lang,
  noTargetLabel,
  width = 344,
}: {
  rows: UpsideRow[];
  lang: Language;
  noTargetLabel: string;
  width?: number;
}) {
  if (!rows.length) return <p className="op-empty">—</p>;
  const W = width;
  const rowH = 16;
  const m = { top: 6, right: 14, bottom: 18, left: 56 };
  const H = m.top + rows.length * rowH + m.bottom;
  const values = rows.map((r) => r.upsidePct).filter((v): v is number => v !== null);
  const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values, 5), 4);
  const lo = ticks[0];
  const hi = ticks[ticks.length - 1];
  const x = (v: number) => m.left + ((v - lo) / (hi - lo || 1)) * (W - m.left - m.right - 34);
  const x0 = x(0);
  const barH = 10;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="op-chart" role="img" aria-label="Upside volgens consensus">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={m.top} y2={H - m.bottom} stroke={t === 0 ? COLORS.muted : COLORS.grid} strokeWidth={1} />
          <text x={x(t)} y={H - 6} fontSize={FONT - 1} fill={COLORS.muted} textAnchor="middle" className="op-tabular">
            {`${formatNumber(t, lang, 0)}%`}
          </text>
        </g>
      ))}
      {rows.map((row, i) => {
        const cy = m.top + i * rowH + rowH / 2;
        const v = row.upsidePct;
        return (
          <g key={`${row.ticker}-${i}`}>
            <text x={m.left - 8} y={cy + 3.5} fontSize={FONT} fontWeight={600} fill={COLORS.ink2} textAnchor="end">
              {row.ticker}
            </text>
            {v === null ? (
              <text x={x0 + 6} y={cy + 3.5} fontSize={FONT - 1} fill={COLORS.muted}>
                {noTargetLabel}
              </text>
            ) : (
              <>
                <path d={hBarPath(x0, x(v), cy - barH / 2, barH)} fill={v >= 0 ? COLORS.teal : COLORS.orange}>
                  <title>{`${row.ticker}: ${formatPct(v, lang)}`}</title>
                </path>
                {/* Negatieve waarden: label rechts van de nullijn, zodat het niet over de ticker valt. */}
                <text
                  x={v >= 0 ? x(v) + 5 : x0 + 5}
                  y={cy + 3.5}
                  fontSize={FONT}
                  fontWeight={600}
                  fill={COLORS.ink}
                  textAnchor="start"
                  className="op-tabular"
                >
                  {formatPct(v, lang)}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Kleine HTML-onderdelen ─── */

export function BalanceBar({ bull, bear }: { bull: number; bear: number }) {
  const total = bull + bear || 100;
  const bullPct = Math.max(0, Math.min(100, (bull / total) * 100));
  return (
    <div className="op-balancebar" role="img" aria-label={`Bull ${Math.round(bull)}%, Bear ${Math.round(bear)}%`}>
      <span style={{ width: `${bullPct}%`, background: COLORS.teal }} />
      <span style={{ width: `${100 - bullPct}%`, background: COLORS.orange }} />
    </div>
  );
}

export function ConfidenceDots({ value }: { value: number }) {
  const score = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="op-dots" role="img" aria-label={`${score} van 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= score ? "on" : ""} />
      ))}
    </span>
  );
}
