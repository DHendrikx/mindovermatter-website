/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Disclaimer page: Legal disclaimers and risk warnings
 */
import { FadeIn, CyanLine } from "@/components/AnimatedSection";
import { useLang } from "@/i18n";

const NL = {
  intro: "Belangrijke juridische informatie over Mind over Matter en het gebruik van deze website.",
  sections: [
    {
      title: "Algemeen",
      paragraphs: [
        "Deze website is uitsluitend bedoeld voor informatieve doeleinden en vormt geen aanbod, uitnodiging of aanbeveling tot het kopen of verkopen van financiële instrumenten of het aangaan van enige transactie.",
        "De informatie op deze website is met zorg samengesteld, maar Mind over Matter garandeert niet de juistheid, volledigheid of actualiteit ervan. Aan de inhoud van deze website kunnen geen rechten worden ontleend.",
      ],
    },
    {
      title: "Risicowaarschuwing",
      paragraphs: [
        "Beleggen brengt risico's met zich mee. De waarde van uw belegging kan fluctueren. In het verleden behaalde resultaten bieden geen garantie voor de toekomst. U kunt uw inleg geheel of gedeeltelijk verliezen.",
        "Mind over Matter opereert als een particulier fonds en valt buiten het toezicht van de Autoriteit Financiële Markten (AFM). Er is geen vergunning vereist en er is geen prospectus opgesteld in de zin van de Wet op het financieel toezicht.",
      ],
    },
    {
      title: "Vertrouwelijkheid",
      paragraphs: [
        "De informatie op deze website en in de bijbehorende documentatie is vertrouwelijk en uitsluitend bedoeld voor de geadresseerde. Verspreiding, reproductie of gebruik door derden zonder voorafgaande schriftelijke toestemming is niet toegestaan.",
      ],
    },
    {
      title: "Toepasselijk recht",
      paragraphs: [
        "Het fonds is opgericht op het Isle of Man en opereert onder het daar geldende juridische kader. Op deze website en het gebruik ervan is het recht van het Isle of Man van toepassing.",
      ],
    },
  ],
  contactTitle: "Contact",
  contactText: "Voor vragen over deze disclaimer of de inhoud van deze website kunt u contact opnemen via",
};

const EN: typeof NL = {
  intro: "Important legal information about Mind over Matter and the use of this website.",
  sections: [
    {
      title: "General",
      paragraphs: [
        "This website is intended for information purposes only and does not constitute an offer, invitation or recommendation to buy or sell financial instruments or to enter into any transaction.",
        "The information on this website has been compiled with care, but Mind over Matter does not guarantee its accuracy, completeness or timeliness. No rights can be derived from the content of this website.",
      ],
    },
    {
      title: "Risk warning",
      paragraphs: [
        "Investing involves risk. The value of your investment may fluctuate. Past performance is no guarantee of future results. You may lose all or part of your investment.",
        "Mind over Matter operates as a private fund and falls outside the supervision of the Dutch Authority for the Financial Markets (AFM). No licence is required and no prospectus has been prepared within the meaning of the Dutch Financial Supervision Act (Wft).",
      ],
    },
    {
      title: "Confidentiality",
      paragraphs: [
        "The information on this website and in the accompanying documentation is confidential and intended solely for the addressee. Distribution, reproduction or use by third parties without prior written consent is not permitted.",
      ],
    },
    {
      title: "Governing law",
      paragraphs: [
        "The fund was established on the Isle of Man and operates under the legal framework that applies there. The laws of the Isle of Man govern this website and its use.",
      ],
    },
  ],
  contactTitle: "Contact",
  contactText: "For questions about this disclaimer or the content of this website, please contact us at",
};

const COPY = { nl: NL, en: EN };

export default function Disclaimer() {
  const t = COPY[useLang()];

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
              {t.intro}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container max-w-3xl mx-auto">
          <FadeIn>
            <div className="space-y-10">
              {t.sections.map((section, i) => (
                <div key={section.title} className={i > 0 ? "border-t border-[oklch(0.25_0.02_250)] pt-8" : undefined}>
                  <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {section.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-[oklch(0.25_0.02_250)] pt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">{t.contactTitle}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t.contactText}{" "}
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
