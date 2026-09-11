/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Documentation page: Document downloads, organized by category
 */
import { FadeIn, FadeInStagger, FadeInChild, CyanLine } from "@/components/AnimatedSection";
import { FileText, Download, ExternalLink } from "lucide-react";

interface DocItem {
  title: string;
  description: string;
  language: string;
  category: string;
  url: string;
  available: boolean;
}

const DOCUMENTS: DocItem[] = [
  {
    title: "Informatie Memorandum (NL)",
    description: "Uitgebreide informatie over het fonds, de strategie en de voorwaarden.",
    language: "NL",
    category: "Fondsdocumenten",
    url: "/documents/InformationMemorandumNL.pdf",
    available: true,
  },
  {
    title: "Information Memorandum (EN)",
    description: "Comprehensive information about the fund, strategy and conditions.",
    language: "EN",
    category: "Fondsdocumenten",
    url: "/documents/InformationMemorandumEN.pdf",
    available: true,
  },
  {
    title: "Pitchdeck",
    description: "Beknopte presentatie van het fonds, de aanpak en de structuur.",
    language: "NL",
    category: "Fondsdocumenten",
    url: "/documents/MoM-Pitchdeck-09052026.pdf",
    available: true,
  },
  {
    title: "Investeerdersformulier",
    description: "Aanmeldingsformulier voor deelname aan het fonds (invulbare PDF).",
    language: "NL",
    category: "Inschrijving",
    url: "/documents/MindoverMatter-Investor-Application-NL-EN.pdf",
    available: true,
  },
  {
    title: "Oprichtingsaktes / Memorandum",
    description: "Juridische documenten met betrekking tot de oprichting van het fonds.",
    language: "EN",
    category: "Juridisch",
    url: "#",
    available: false,
  },
];

// Group documents by category
const categories = DOCUMENTS.reduce<Record<string, DocItem[]>>((acc, doc) => {
  if (!acc[doc.category]) acc[doc.category] = [];
  acc[doc.category].push(doc);
  return acc;
}, {});

export default function Documentation() {
  return (
    <div>
      {/* Hero */}
      <section className="section-bg pt-40 pb-16">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              Documentatie
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-2xl">
              Vertrouwen is een van de kernwaarden waarop Mind over Matter relaties bouwt met beleggers. Transparantie is een voorwaarde voor vertrouwen. Wij streven naar maximale openheid en stellen daarom onderstaande documenten beschikbaar.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Documents */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container max-w-4xl mx-auto">
          {Object.entries(categories).map(([category, docs]) => (
            <div key={category} className="mb-14 last:mb-0">
              <FadeIn>
                <h2 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-6">
                  {category}
                </h2>
              </FadeIn>

              <FadeInStagger className="space-y-3">
                {docs.map((doc) => (
                  <FadeInChild key={doc.title}>
                    {doc.available ? (
                      <button
                        onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}
                        className="glass-card rounded-xl p-5 flex items-start gap-4 group transition-all duration-300 w-full text-left hover:border-[oklch(0.82_0.17_195_/_30%)]"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center shrink-0 group-hover:bg-[oklch(0.82_0.17_195_/_15%)] transition-colors">
                          <FileText className="text-[oklch(0.82_0.17_195)]" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground group-hover:text-[oklch(0.82_0.17_195)] transition-colors">
                              {doc.title}
                            </h3>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(0.82_0.17_195_/_10%)] text-[oklch(0.82_0.17_195)]">
                              {doc.language}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                        <div className="shrink-0 mt-1">
                          <Download size={18} className="text-muted-foreground group-hover:text-[oklch(0.82_0.17_195)] transition-colors" />
                        </div>
                      </button>
                    ) : (
                      <div className="glass-card rounded-xl p-5 flex items-start gap-4 opacity-50">
                        <div className="w-10 h-10 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center shrink-0">
                          <FileText className="text-[oklch(0.82_0.17_195)]" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground">
                              {doc.title}
                            </h3>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(0.82_0.17_195_/_10%)] text-[oklch(0.82_0.17_195)]">
                              {doc.language}
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(0.50_0.05_250_/_20%)] text-[oklch(0.60_0.01_250)]">
                              Binnenkort beschikbaar
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                        <div className="shrink-0 mt-1">
                          <ExternalLink size={18} className="text-muted-foreground opacity-40" />
                        </div>
                      </div>
                    )}
                  </FadeInChild>
                ))}
              </FadeInStagger>
            </div>
          ))}

          <FadeIn>
            <div className="glass-card rounded-xl p-6 mt-10">
              <p className="text-sm text-muted-foreground">
                Heeft u vragen over de documentatie of wenst u aanvullende informatie? Neem dan gerust{" "}
                <a href="/contact" className="text-[oklch(0.82_0.17_195)] hover:underline">
                  contact
                </a>{" "}
                met ons op. Documenten worden regelmatig bijgewerkt. De meest recente versies zijn altijd beschikbaar op deze pagina.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
