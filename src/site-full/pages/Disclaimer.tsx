/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Disclaimer page: Legal disclaimers and risk warnings
 */
import { FadeIn, CyanLine } from "@/components/AnimatedSection";

export default function Disclaimer() {
  return (
    <div>
      {/* Hero */}
      <section className="section-bg pt-40 pb-16">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Disclaimer
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-2xl">
              Belangrijke juridische informatie over Mind over Matter en het gebruik van deze website.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container max-w-3xl mx-auto">
          <FadeIn>
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Algemeen</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Deze website is uitsluitend bedoeld voor informatieve doeleinden en vormt geen aanbod, uitnodiging of aanbeveling tot het kopen of verkopen van financiële instrumenten of het aangaan van enige transactie.
                  </p>
                  <p>
                    De informatie op deze website is met zorg samengesteld, maar Mind over Matter garandeert niet de juistheid, volledigheid of actualiteit ervan. Aan de inhoud van deze website kunnen geen rechten worden ontleend.
                  </p>
                </div>
              </div>

              <div className="border-t border-[oklch(0.25_0.02_250)] pt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Risicowaarschuwing</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Beleggen brengt risico's met zich mee. De waarde van uw belegging kan fluctueren. In het verleden behaalde resultaten bieden geen garantie voor de toekomst. U kunt uw inleg geheel of gedeeltelijk verliezen.
                  </p>
                  <p>
                    Mind over Matter opereert als een particulier fonds en valt buiten het toezicht van de Autoriteit Financiële Markten (AFM). Er is geen vergunning vereist en er is geen prospectus opgesteld in de zin van de Wet op het financieel toezicht.
                  </p>
                </div>
              </div>

              <div className="border-t border-[oklch(0.25_0.02_250)] pt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Vertrouwelijkheid</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    De informatie op deze website en in de bijbehorende documentatie is vertrouwelijk en uitsluitend bedoeld voor de geadresseerde. Verspreiding, reproductie of gebruik door derden zonder voorafgaande schriftelijke toestemming is niet toegestaan.
                  </p>
                </div>
              </div>

              <div className="border-t border-[oklch(0.25_0.02_250)] pt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Toepasselijk recht</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Het fonds is opgericht op het Isle of Man en opereert onder het daar geldende juridische kader. Op deze website en het gebruik ervan is het recht van het Isle of Man van toepassing.
                  </p>
                </div>
              </div>

              <div className="border-t border-[oklch(0.25_0.02_250)] pt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Voor vragen over deze disclaimer of de inhoud van deze website kunt u contact opnemen via{" "}
                  <a
                    href="mailto:contact@mindovermatter.limited"
                    className="text-[oklch(0.82_0.17_195)] hover:underline"
                  >
                    contact@mindovermatter.limited
                  </a>
                  .
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
