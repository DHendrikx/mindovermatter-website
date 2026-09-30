/*
 * Printen en exporteren.
 * - Printen: zet html[data-print] op "onepager" of "report"; research.css toont
 *   dan alleen die printversie. De browser biedt daarna "Opslaan als PDF".
 * - HTML-download: de A4-pagina als zelfstandig bestand met inline CSS en logo.
 */
import type { ReportMeta } from "../../server/research/types";
import onePagerCss from "./onepager/onepager.css?raw";
import { LOGO_SRC } from "./onepager/OnePager";

export type PrintTarget = "onepager" | "report";

export function printTarget(target: PrintTarget, title: string): void {
  const root = document.documentElement;
  const previousTitle = document.title;
  root.dataset.print = target;
  // De documenttitel wordt de voorgestelde bestandsnaam van de PDF.
  document.title = title;
  const cleanup = () => {
    delete root.dataset.print;
    document.title = previousTitle;
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  // Even wachten zodat de printversie de juiste stijl heeft voordat de dialoog opent.
  requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
}

export function fileBaseName(meta: ReportMeta, kind: "brief" | "rapport"): string {
  const date = meta.createdAt.slice(0, 10);
  const name = (meta.ticker || meta.displayName).replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  return `MoM-${kind}-${name}-${date}`;
}

async function inlineLogo(html: string): Promise<string> {
  try {
    const svg = await (await fetch(LOGO_SRC)).text();
    const dataUri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    return html.split(`src="${LOGO_SRC}"`).join(`src="${dataUri}"`);
  } catch {
    return html;
  }
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
}

export async function downloadOnePagerHtml(sheet: HTMLElement, meta: ReportMeta): Promise<void> {
  const clone = sheet.cloneNode(true) as HTMLElement;
  clone.classList.remove("op-sheet--fixed");
  const body = await inlineLogo(clone.outerHTML);
  const title = `${meta.displayName}${meta.ticker ? ` (${meta.ticker})` : ""} · Mind over Matter`;

  const html = `<!doctype html>
<html lang="${meta.language}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
${onePagerCss}
@page { size: A4 portrait; margin: 0; }
html, body { margin: 0; background: #e9ecf1; }
.op-wrap { display: flex; justify-content: center; padding: 24px 0; }
.op-wrap .op-sheet { box-shadow: 0 2px 18px rgba(15, 26, 51, 0.18); }
@media screen and (max-width: 820px) { .op-wrap { padding: 0; } .op-wrap .op-sheet { box-shadow: none; } }
@media print { html, body { background: #fff; } .op-wrap { padding: 0; display: block; } .op-wrap .op-sheet { box-shadow: none; } }
</style>
</head>
<body>
<div class="op-wrap">
${body}
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileBaseName(meta, "brief")}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
