/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Layout: Transparent navbar that compacts on scroll, full-width sections, professional footer
 * Colors: Navy background, cyan accents, white text
 */
import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/filosofie", label: "Filosofie" },
  { href: "/team", label: "Het Team" },
  { href: "/structuur", label: "Structuur" },
  { href: "/documentatie", label: "Documentatie" },
  { href: "/contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

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
          Let op: deze belegging valt buiten AFM-toezicht. Geen vergunning en geen prospectus vereist voor deze activiteit.
        </p>
      </div>

      <nav className="container flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="flex items-center gap-3 group">
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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                location === item.href
                  ? "text-[oklch(0.82_0.17_195)]"
                  : "text-[oklch(0.70_0.01_250)] hover:text-foreground"
              }`}
            >
              {item.label}
              {location === item.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="h-0.5 bg-[oklch(0.82_0.17_195)] mt-0.5 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    location === item.href
                      ? "text-[oklch(0.82_0.17_195)] bg-[oklch(0.82_0.17_195_/_8%)]"
                      : "text-[oklch(0.70_0.01_250)] hover:text-foreground hover:bg-[oklch(0.20_0.02_250)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
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
              Value investing, gedisciplineerde analyse en consistente optimalisatie.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider">
              Navigatie
            </h4>
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
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
                href="mailto:contact@mindovermatter.fund"
                className="hover:text-[oklch(0.82_0.17_195)] transition-colors"
              >
                contact@mindovermatter.fund
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[oklch(0.25_0.02_250_/_30%)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Mind over Matter. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6">
            <Link
              href="/disclaimer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Disclaimer
            </Link>
            <Link
              href="/documentatie"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentatie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
