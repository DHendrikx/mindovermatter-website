/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * TaxFlowDiagram: Visual comparison of NL BV (tax per transaction) vs MoM IoM (tax deferral)
 */

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLang } from "@/i18n";

const NL = {
  locale: "nl-NL",
  title: "Geldstroomvergelijking",
  bvBadge: "Reguliere Nederlandse BV",
  investor: "Investeerder",
  contribution: "Inleg kapitaal",
  deposit: "Inleg",
  bv: "BV (Nederland)",
  bvInvests: "Belegt in aandelen",
  profitRealised: "Winst gerealiseerd",
  taxOffice: "Belastingdienst",
  taxPerTrade: "Vpb ~25,8% per transactie",
  remainingProfit: "Resterende winst",
  reinvestedBv: "Herbelegd kapitaal",
  reinvestedBvSub: "Kleiner na elke transactie",
  bvCallout: <>Belasting wordt <strong>direct</strong> ingehouden na elke winstgevende transactie</>,
  momFund: "MoM Fonds (IoM)",
  momFundSub: "0% winstbelasting",
  fullProfit: "Volledige winst herbelegd",
  reinvestedMom: "Geherinvesteerd kapitaal",
  reinvestedMomSub: "100% van de winst blijft actief",
  distribution: "Uitkering / exit",
  taxOnDistribution: "Belasting bij uitkering",
  taxOnDistributionSub: "Pas dan fiscale afrekening",
  momCallout: <>Belasting wordt <strong>uitgesteld</strong> — compound effect werkt over 100% van het kapitaal</>,
  exampleTitle: "Rekenvoorbeeld — 10 jaar, 10% rendement p.j., €100.000 inleg",
  exampleNote: "Illustratief. Belastingdruk gebaseerd op Vpb-tarief ~25,8%. Persoonlijke fiscale situatie kan afwijken.",
  barBv: "Nederlandse BV",
  barBvSub: "Vpb per transactie",
  barMomNetSub: "Na belasting bij uitkering",
  barMomGrossSub: "Bruto fondswaarde vóór uitkering",
  deltaNet: "Verschil na 10 jaar (netto)",
  deltaNetSub: "MoM netto vs. NL BV",
  deltaGross: "Bruto fondswaarde voordeel",
  deltaGrossSub: "Vóór fiscale afrekening bij uitkering",
};

const EN: typeof NL = {
  locale: "en-GB",
  title: "Cash flow comparison",
  bvBadge: "Regular Dutch BV",
  investor: "Investor",
  contribution: "Capital contribution",
  deposit: "Contribution",
  bv: "BV (Netherlands)",
  bvInvests: "Invests in shares",
  profitRealised: "Profit realised",
  taxOffice: "Dutch Tax Administration",
  taxPerTrade: "Vpb ~25.8% per transaction",
  remainingProfit: "Remaining profit",
  reinvestedBv: "Reinvested capital",
  reinvestedBvSub: "Smaller after every trade",
  bvCallout: <>Tax is withheld <strong>immediately</strong> after every profitable trade</>,
  momFund: "MoM Fund (IoM)",
  momFundSub: "0% tax on profits",
  fullProfit: "Full profit reinvested",
  reinvestedMom: "Reinvested capital",
  reinvestedMomSub: "100% of the profit stays invested",
  distribution: "Distribution / exit",
  taxOnDistribution: "Tax on distribution",
  taxOnDistributionSub: "Only then is tax settled",
  momCallout: <>Tax is <strong>deferred</strong> — compounding works on 100% of the capital</>,
  exampleTitle: "Worked example — 10 years, 10% return p.a., €100,000 invested",
  exampleNote: "Illustrative. Tax burden based on a Vpb (Dutch corporate income tax) rate of ~25.8%. Personal tax circumstances may differ.",
  barBv: "Dutch BV",
  barBvSub: "Vpb per transaction",
  barMomNetSub: "After tax on distribution",
  barMomGrossSub: "Gross fund value before distribution",
  deltaNet: "Difference after 10 years (net)",
  deltaNetSub: "MoM net vs. Dutch BV",
  deltaGross: "Gross fund value advantage",
  deltaGrossSub: "Before tax settlement on distribution",
};

const COPY = { nl: NL, en: EN };

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, start = false, skip = false) {
  const [value, setValue] = useState(skip ? target : 0);
  useEffect(() => {
    if (!start || skip) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start, skip]);
  return value;
}

// ─── Comparison bar ──────────────────────────────────────────────────────────
function ComparisonBar({
  label,
  sublabel,
  value,
  max,
  color,
  animate,
  reducedMotion,
  locale,
}: {
  label: string;
  sublabel: string;
  value: number;
  max: number;
  color: string;
  animate: boolean;
  reducedMotion: boolean;
  locale: string;
}) {
  const pct = animate ? (value / max) * 100 : 0;
  const displayed = useCountUp(value, 1200, animate, reducedMotion);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground ml-2">{sublabel}</span>
        </div>
        <span className="text-lg font-bold" style={{ color }}>
          €{displayed.toLocaleString(locale)}
        </span>
      </div>
      <div className="h-3 rounded-full bg-[oklch(0.20_0.02_250)] overflow-hidden">
        <div
          className={`h-full rounded-full ${reducedMotion ? "" : "transition-all duration-[1200ms] ease-out"}`}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── Flow node ───────────────────────────────────────────────────────────────
function FlowNode({
  title,
  subtitle,
  accent = false,
  muted = false,
}: {
  title: string;
  subtitle: string;
  accent?: boolean;
  muted?: boolean;
}) {
  const border = accent
    ? "border-[oklch(0.82_0.17_195_/_50%)]"
    : muted
    ? "border-[oklch(0.30_0.02_250)] opacity-60"
    : "border-[oklch(0.30_0.02_250)]";
  const bg = accent ? "bg-[oklch(0.82_0.17_195_/_8%)]" : "bg-[oklch(0.16_0.02_250)]";

  return (
    <div className={`rounded-xl border ${border} ${bg} px-4 py-3 text-center`}>
      <p className={`text-sm font-bold ${accent ? "text-[oklch(0.82_0.17_195)]" : "text-foreground"}`}>
        {title}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>
    </div>
  );
}

// ─── Arrow SVG ───────────────────────────────────────────────────────────────
function Arrow({ label, color = "oklch(0.82 0.17 195)", dashed = false }: { label?: string; color?: string; dashed?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
        <line
          x1="12" y1="0" x2="12" y2="20"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray={dashed ? "4 3" : undefined}
        />
        <polygon points="6,18 18,18 12,28" fill={color} />
      </svg>
      {label && (
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{ color, background: `color-mix(in oklch, ${color} 12%, transparent)` }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function TaxFlowDiagram() {
  const t = COPY[useLang()];
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const transition = reducedMotion ? "" : "transition-all duration-700";
  const revealed = reducedMotion || visible;

  // Compound simulation: 10% annual return over 10 years, €100k start
  // NL BV: 25.8% Vpb on each year's gain before reinvesting
  // MoM IoM: 0% tax, full compounding, tax at end
  const START = 100_000;
  const YEARS = 10;
  const RETURN = 0.10;
  const VPB = 0.258;

  let nlBv = START;
  for (let i = 0; i < YEARS; i++) {
    const gain = nlBv * RETURN;
    nlBv += gain * (1 - VPB);
  }

  let momGross = START * Math.pow(1 + RETURN, YEARS);
  // Tax at end on total gain
  const momNet = momGross - (momGross - START) * VPB;

  const nlBvRounded = Math.round(nlBv);
  const momNetRounded = Math.round(momNet);
  const momGrossRounded = Math.round(momGross);
  const maxVal = momGrossRounded;

  return (
    <div ref={ref} className="space-y-10">

      {/* ── Section 1: Flow diagram ── */}
      <div>
        <h3 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-8 text-center">
          {t.title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NL BV column */}
          <div
            className={`rounded-2xl border border-[oklch(0.28_0.02_250)] bg-[oklch(0.14_0.02_250)] p-6 ${transition} ${
              revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: reducedMotion ? undefined : "0ms" }}
          >
            <div className="text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.55_0.01_250)] px-3 py-1 rounded-full border border-[oklch(0.28_0.02_250)]">
                {t.bvBadge}
              </span>
            </div>

            <FlowNode title={t.investor} subtitle={t.contribution} />
            <Arrow label={t.deposit} />
            <FlowNode title={t.bv} subtitle={t.bvInvests} />
            <Arrow label={t.profitRealised} color="oklch(0.75 0.15 30)" />
            <FlowNode title={t.taxOffice} subtitle={t.taxPerTrade} muted />
            <Arrow label={t.remainingProfit} color="oklch(0.75 0.15 30)" dashed />
            <FlowNode title={t.reinvestedBv} subtitle={t.reinvestedBvSub} />
            <div className="mt-4 rounded-lg bg-[oklch(0.75_0.15_30_/_8%)] border border-[oklch(0.75_0.15_30_/_20%)] p-3 text-center">
              <p className="text-xs text-[oklch(0.75_0.15_30)]">
                {t.bvCallout}
              </p>
            </div>
          </div>

          {/* MoM IoM column */}
          <div
            className={`rounded-2xl border border-[oklch(0.82_0.17_195_/_30%)] bg-[oklch(0.14_0.02_250)] p-6 ${transition} ${
              revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: reducedMotion ? undefined : "150ms" }}
          >
            <div className="text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.82_0.17_195)] px-3 py-1 rounded-full border border-[oklch(0.82_0.17_195_/_30%)]">
                Mind over Matter — Isle of Man
              </span>
            </div>

            <FlowNode title={t.investor} subtitle={t.contribution} />
            <Arrow label={t.deposit} />
            <FlowNode title={t.momFund} subtitle={t.momFundSub} accent />
            <Arrow label={t.fullProfit} />
            <FlowNode title={t.reinvestedMom} subtitle={t.reinvestedMomSub} accent />
            <Arrow label={t.distribution} />
            <FlowNode title={t.taxOnDistribution} subtitle={t.taxOnDistributionSub} />
            <div className="mt-4 rounded-lg bg-[oklch(0.82_0.17_195_/_6%)] border border-[oklch(0.82_0.17_195_/_20%)] p-3 text-center">
              <p className="text-xs text-[oklch(0.82_0.17_195)]">
                {t.momCallout}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Compound comparison ── */}
      <div
        className={`rounded-2xl border border-[oklch(0.25_0.02_250)] bg-[oklch(0.14_0.02_250)] p-6 lg:p-8 ${transition} ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: reducedMotion ? undefined : "300ms" }}
      >
        <h3 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-2">
          {t.exampleTitle}
        </h3>
        <p className="text-xs text-muted-foreground mb-8">
          {t.exampleNote}
        </p>

        <div className="space-y-6">
          <ComparisonBar
            label={t.barBv}
            sublabel={t.barBvSub}
            value={nlBvRounded}
            max={maxVal}
            color="oklch(0.65 0.12 30)"
            animate={revealed}
            reducedMotion={reducedMotion}
            locale={t.locale}
          />
          <ComparisonBar
            label="Mind over Matter (IoM)"
            sublabel={t.barMomNetSub}
            value={momNetRounded}
            max={maxVal}
            color="oklch(0.75 0.15 195)"
            animate={revealed}
            reducedMotion={reducedMotion}
            locale={t.locale}
          />
          <ComparisonBar
            label="Mind over Matter (IoM)"
            sublabel={t.barMomGrossSub}
            value={momGrossRounded}
            max={maxVal}
            color="oklch(0.82 0.17 195)"
            animate={revealed}
            reducedMotion={reducedMotion}
            locale={t.locale}
          />
        </div>

        {/* Delta callout */}
        <div
          className={`mt-8 flex flex-col sm:flex-row gap-4 ${transition} ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: reducedMotion ? undefined : "800ms" }}
        >
          <div className="flex-1 rounded-xl bg-[oklch(0.82_0.17_195_/_6%)] border border-[oklch(0.82_0.17_195_/_20%)] p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t.deltaNet}</p>
            <p className="text-2xl font-extrabold text-[oklch(0.82_0.17_195)]">
              +€{(momNetRounded - nlBvRounded).toLocaleString(t.locale)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t.deltaNetSub}</p>
          </div>
          <div className="flex-1 rounded-xl bg-[oklch(0.82_0.17_195_/_4%)] border border-[oklch(0.82_0.17_195_/_12%)] p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t.deltaGross}</p>
            <p className="text-2xl font-extrabold text-foreground">
              +€{(momGrossRounded - nlBvRounded).toLocaleString(t.locale)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t.deltaGrossSub}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
