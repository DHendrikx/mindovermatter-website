/*
 * Design: "Capital Discipline" — Dark Kinetic Finance (stille variant)
 * Holding page: één scherm, geen navigatie, geen fondsterminologie.
 * Bewust weggelaten: doelrendement, fiscale structuur, onboarding,
 * documentatie en elke verwijzing naar beleggers of participaties.
 *
 * Bewust ook géén animatie. De rest van de site fade't tekst in met
 * framer-motion, wat betekent dat de inhoud op opacity 0 staat tot JavaScript
 * de animatie draait. Op deze pagina moet de tekst er altijd staan — ook in
 * linkpreviews, screenshotbots en omgevingen waar requestAnimationFrame niet
 * loopt. Statisch is hier de veilige keuze.
 */
import { Mail } from "lucide-react";

const HERO_BG = "/images/hero-background.jpg";
const CONTACT_EMAIL = "contact@mindovermatter.limited";

export default function Holding() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Achtergrond in huisstijl */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[oklch(0.13_0.025_250_/_75%)] via-[oklch(0.13_0.025_250_/_88%)] to-[oklch(0.11_0.02_250)]"
        aria-hidden="true"
      />

      {/* Inhoud */}
      <main className="relative flex-1 flex items-center justify-center">
        <div className="container max-w-2xl py-24 text-center">
          <img
            src="/logos/mom-logo-white.svg"
            alt="Mind over Matter"
            className="h-32 sm:h-40 lg:h-48 mx-auto mb-8"
          />

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Mind over Matter
          </h1>

          <div className="h-[3px] w-12 bg-[oklch(0.82_0.17_195)] mx-auto mb-8" />

          <p className="text-base sm:text-lg text-[oklch(0.75_0.01_250)] leading-relaxed mb-4">
            Mind over Matter is een private onderneming gevestigd op de Isle of
            Man. Wij werken vanuit drie principes: kapitaalbehoud, discipline en
            transparantie.
          </p>
          <p className="text-base sm:text-lg text-[oklch(0.75_0.01_250)] leading-relaxed mb-10">
            Onze activiteiten worden op dit moment verder ingericht. Deze pagina
            wordt uitgebreid zodra dat is afgerond.
          </p>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-3 px-7 py-3.5 bg-[oklch(0.82_0.17_195_/_8%)] border border-[oklch(0.82_0.17_195_/_30%)] rounded-xl hover:bg-[oklch(0.82_0.17_195_/_15%)] hover:border-[oklch(0.82_0.17_195_/_50%)] transition-colors duration-300"
          >
            <Mail className="text-[oklch(0.82_0.17_195)]" size={18} />
            <span className="text-base font-semibold text-[oklch(0.82_0.17_195)]">
              {CONTACT_EMAIL}
            </span>
          </a>
        </div>
      </main>

      {/* Voettekst */}
      <footer className="relative border-t border-[oklch(0.25_0.02_250_/_50%)]">
        <div className="container max-w-3xl py-8 space-y-4 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Deze website is uitsluitend informatief. Zij bevat geen aanbod,
            uitnodiging of advies tot het aangaan van enige financiële transactie
            en richt zich niet tot het publiek.
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Mind over Matter &nbsp;&middot;&nbsp; Isle of Man
          </p>
        </div>
      </footer>
    </div>
  );
}
