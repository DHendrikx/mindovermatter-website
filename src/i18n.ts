/*
 * Tweetaligheid: Nederlands op de bestaande URL's, Engels onder /en.
 * De taal volgt uit de URL, zodat elke pagina in beide talen een eigen,
 * deelbare en indexeerbare link heeft.
 */
import { useLocation } from "wouter";

export type Lang = "nl" | "en";

export const PAGES = {
  home: { nl: "/", en: "/en" },
  philosophy: { nl: "/filosofie", en: "/en/philosophy" },
  team: { nl: "/team", en: "/en/team" },
  structure: { nl: "/structuur", en: "/en/structure" },
  documents: { nl: "/documentatie", en: "/en/documents" },
  contact: { nl: "/contact", en: "/en/contact" },
  disclaimer: { nl: "/disclaimer", en: "/en/disclaimer" },
} as const;

export type PageKey = keyof typeof PAGES;

// Oude adressen die nog naar een pagina wijzen
const ALIASES: Record<string, PageKey> = { "/fondsbeheerder": "team" };

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "").toLowerCase() : path;
}

export function langFromPath(path: string): Lang {
  const p = normalize(path);
  return p === "/en" || p.startsWith("/en/") ? "en" : "nl";
}

export function pageFromPath(path: string): PageKey | undefined {
  const p = normalize(path);
  const lang = langFromPath(p);
  return (Object.keys(PAGES) as PageKey[]).find((k) => PAGES[k][lang] === p) ?? ALIASES[p];
}

/** Dezelfde pagina in de andere taal; onbekende pagina's gaan naar de home van die taal. */
export function counterpartPath(path: string): string {
  const to: Lang = langFromPath(path) === "nl" ? "en" : "nl";
  const page = pageFromPath(path);
  return PAGES[page ?? "home"][to];
}

export function useLang(): Lang {
  const [location] = useLocation();
  return langFromPath(location);
}

/** Geeft een functie die de URL van een pagina in de huidige taal teruggeeft. */
export function usePath() {
  const lang = useLang();
  return (page: PageKey) => PAGES[page][lang];
}
