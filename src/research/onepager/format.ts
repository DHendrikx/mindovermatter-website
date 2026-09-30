import type { Language } from "../../../server/research/types";

const localeOf = (lang: Language) => (lang === "nl" ? "nl-NL" : "en-US");

export function formatMoney(value: number, currency: string, lang: Language): string {
  // Ronde bedragen zonder decimalen (€ 58), anders vaste decimalen (€ 42,10).
  const abs = Math.abs(value);
  const digits = Number.isInteger(value) || abs >= 1000 ? 0 : abs >= 100 ? 1 : 2;
  try {
    return new Intl.NumberFormat(localeOf(lang), {
      style: "currency",
      currency,
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    }).format(value);
  } catch {
    return `${formatNumber(value, lang, digits)} ${currency}`;
  }
}

export function formatNumber(value: number, lang: Language, digits = 1): string {
  return new Intl.NumberFormat(localeOf(lang), { maximumFractionDigits: digits }).format(value);
}

export function formatPct(value: number, lang: Language): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatNumber(Math.abs(value), lang, 1)}%`;
}

export function formatDate(iso: string, lang: Language): string {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Ronde as-waarden: 0 / 50 / 100 in plaats van 0 / 47 / 94. */
export function niceTicks(min: number, max: number, count = 4): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) {
    const pad = Math.abs(min) * 0.1 || 1;
    min -= pad;
    max += pad;
  }
  const rawStep = (max - min) / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const step = (residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1) * magnitude;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Number(v.toPrecision(12)));
  return ticks;
}

/** Compacte asnotatie: 1.200 → 1,2K, 3.400.000 → 3,4M. */
export function compact(value: number, lang: Language): string {
  return new Intl.NumberFormat(localeOf(lang), { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
