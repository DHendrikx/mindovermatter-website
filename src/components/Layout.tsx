/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Layout: Transparent navbar that compacts on scroll, full-width sections, professional footer
 * Colors: Navy background, cyan accents, white text
 */
import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PAGES, counterpartPath, langFromPath, pageFromPath, useLang, usePath, type Lang, type PageKey } from "@/i18n";

const SITE_URL = "https://mindovermatter.limited";

const NAV_ITEMS: { page: PageKey; label: Record<Lang, string> }[] = [
  { page: "home", label: { nl: "Home", en: "Home" } },
  { page: "philosophy", label: { nl: "Filosofie", en: "Philosophy" } },
  { page: "team", label: { nl: "Het Team", en: "The Team" } },
  { page: "structure", label: { nl: "Structuur", en: "Structure" } },
  { page: "documents", label: { nl: "Documentatie", en: "Documentation" } },
  { page: "contact", label: { nl: "Contact", en: "Contact" } },
];

const COPY = {
  nl: {
    announcement: "Let op: deze belegging valt buiten AFM-toezicht. Geen vergunning en geen prospectus vereist voor deze activiteit.",
    tagline: "Value investing, gedisciplineerde analyse en consistente optimalisatie.",
    navigation: "Navigatie",
    rights: "Alle rechten voorbehouden.",
    disclaimer: "Disclaimer",
    documents: "Documentatie",
    switchTo: "Bekijk deze pagina in het Engels",
    description: "Mind over Matter - Doelgericht vermogensbeheer met focus op kapitaalbehoud, discipline en transparantie.",
  },
  en: {
    announcement: "Please note: this investment falls outside AFM supervision. No licence and no prospectus are required for this activity.",
    tagline: "Value investing, disciplined analysis and consistent optimisation.",
    navigation: "Navigation",
    rights: "All rights reserved.",
    disclaimer: "Disclaimer",
    documents: "Documentation",
    switchTo: "View this page in Dutch",
    description: "Mind over Matter - Purposeful asset management focused on capital preservation, discipline and transparency.",
  },
};

function isActive(location: string, href: string) {
  return (location.replace(/\/+$/, "") || "/").toLowerCase() === href;
}

function LanguageSwitcher() {
  const [location] = useLocation();
  const lang = useLang();
  const other = counterpartPath(location);

  return (
    <div className="flex items-center rounded-md border border-[oklch(0.30_0.02_250)] p-0.5 text-xs font-semibold">
      {(["nl", "en"] as const).map((code) =>
        code === lang ? (
          <span
            key={code}
            aria-current="true"
            className="px-2 py-1 rounded bg-[oklch(0.82_0.17_195_/_12%)] text-[oklch(0.82_0.17_195)]"
          >
            {code.toUpperCase()}
          </span>
        ) : (
          <Link
            key={code}
            href={other}
            hrefLang={code}
            aria-label={COPY[lang].switchTo}
            className="px-2 py-1 rounded text-[oklch(0.70_0.01_250)] hover:text-foreground transition-colors"
          >
            {code.toUpperCase()}
          </Link>
        )
      )}
    </div>
  );
}

/** Houdt taal, beschrijving, canonical en hreflang in de <head> gelijk met de huidige pagina. */
function useDocumentMeta() {
  const [location] = useLocation();

  useEffect(() => {
    const lang = langFromPath(location);
    const page = pageFromPath(location) ?? "home";
    const url = (path: string) => SITE_URL + (path === "/" ? "/" : path);

    document.documentElement.lang = lang;

    const setMeta = (selector: string, attr: string, value: string) => {
      document.head.querySelector(selector)?.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", COPY[lang].description);
    setMeta('meta[property="og:description"]', "content", COPY[lang].description.replace(/^Mind over Matter - /, ""));
    setMeta('meta[property="og:url"]', "content", url(PAGES[page][lang]));
    setMeta('link[rel="canonical"]', "href", url(PAGES[page][lang]));

    for (const code of ["nl", "en", "x-default"] as const) {
      let link = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${code}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = code;
        document.head.appendChild(link);
      }
      link.href = url(PAGES[page][code === "x-default" ? "nl" : code]);
    }
  }, [location]);
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const lang = useLang();
  const path = usePath();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[oklch(0.13_0.025_250_/_92%)] backdrop-blur-md border-b border-[oklch(0.25_0.02_250_/_50%)]"
          : "bg-transparent"
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-[oklch(0.82_0.17_195_/_10%)] border-b border-[oklch(0.82_0.17_195_/_20%)] text-center py-1.5 px-4">
        <p className="text-xs tracking-wide text-[oklch(0.82_0.17_195)]">
          {COPY[lang].announcement}
        </p>
      </div>

      <nav className="container flex items-center justify-between h-16 lg:h-20">
        <Link href={path("home")} className="flex items-center gap-3 group">
          <img
            src="/logos/mom-logo-white.svg"
            alt="Mind over Matter"
            className="h-8 lg:h-10 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-lg lg:text-xl font-semibold tracking-tight text-foreground">
            Mind over Matter
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const href = path(item.page);
            const active = isActive(location, href);
            return (
              <Link
                key={item.page}
                href={href}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                  active
                    ? "text-[oklch(0.82_0.17_195)]"
                    : "text-[oklch(0.70_0.01_250)] hover:text-foreground"
                }`}
              >
                {item.label[lang]}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="h-0.5 bg-[oklch(0.82_0.17_195)] mt-0.5 rounded-full"
                  />
                )}
              </Link>
            );
          })}
          <div className="ml-3">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile: language + menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[oklch(0.13_0.025_250_/_98%)] backdrop-blur-lg border-b border-[oklch(0.25_0.02_250)]"
          >
            <div className="container py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const href = path(item.page);
                return (
                  <Link
                    key={item.page}
                    href={href}
                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive(location, href)
                        ? "text-[oklch(0.82_0.17_195)] bg-[oklch(0.82_0.17_195_/_8%)]"
                        : "text-[oklch(0.70_0.01_250)] hover:text-foreground hover:bg-[oklch(0.20_0.02_250)]"
                    }`}
                  >
                    {item.label[lang]}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const lang = useLang();
  const path = usePath();
  const t = COPY[lang];

  return (
    <footer className="border-t border-[oklch(0.25_0.02_250_/_50%)] bg-[oklch(0.10_0.02_250)]">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logos/mom-logo-white.svg" alt="Mind over Matter" className="h-8" />
              <span className="text-lg font-semibold text-foreground">
                Mind over Matter
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider">
              {t.navigation}
            </h4>
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.page}
                  href={path(item.page)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label[lang]}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Mind over Matter</p>
              <p>Isle of Man</p>
              <a
                href="mailto:contact@mindovermatter.limited"
                className="hover:text-[oklch(0.82_0.17_195)] transition-colors"
              >
                contact@mindovermatter.limited
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[oklch(0.25_0.02_250_/_30%)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Mind over Matter. {t.rights}
          </p>
          <div className="flex gap-6">
            <Link
              href={path("disclaimer")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.disclaimer}
            </Link>
            <Link
              href={path("documents")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.documents}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  useDocumentMeta();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
