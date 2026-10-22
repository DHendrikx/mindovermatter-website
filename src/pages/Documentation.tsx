/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Documentation page: Document downloads, organized by category
 */
import { FadeIn, FadeInStagger, FadeInChild, CyanLine } from "@/components/AnimatedSection";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useLang, usePath, type Lang } from "@/i18n";

type Text = Record<Lang, string>;
type Category = "fund" | "subscription" | "legal";

interface DocItem {
  title: Text;
  description: Text;
  language: string;
  category: Category;
  url: string;
  available: boolean;
}

const CATEGORIES: Record<Category, Text> = {
  fund: { nl: "Fondsdocumenten", en: "Fund documents" },
  subscription: { nl: "Inschrijving", en: "Subscription" },
  legal: { nl: "Juridisch", en: "Legal" },
};

const DOCUMENTS: DocItem[] = [
  {
    title: { nl: "Informatie Memorandum (NL)", en: "Information Memorandum (NL)" },
    description: {
      nl: "Uitgebreide informatie over het fonds, de strategie en de voorwaarden.",
      en: "Comprehensive information about the fund, strategy and terms (in Dutch).",
    },
    language: "NL",
    category: "fund",
    url: "/documents/InformationMemorandumNL.pdf",
    available: true,
  },
  {
    title: { nl: "Information Memorandum (EN)", en: "Information Memorandum (EN)" },
    description: {
      nl: "Comprehensive information about the fund, strategy and conditions.",
      en: "Comprehensive information about the fund, strategy and conditions.",
    },
    language: "EN",
    category: "fund",
    url: "/documents/InformationMemorandumEN.pdf",
    available: true,
  },
  {
    title: { nl: "Pitchdeck", en: "Pitch deck" },
    description: {
      nl: "Beknopte presentatie van het fonds, de aanpak en de structuur.",
      en: "A concise presentation of the fund, its approach and its structure (in Dutch).",
    },
    language: "NL",
    category: "fund",
    url: "/documents/MoM-Pitchdeck-09052026.pdf",
    available: true,
  },
  {
    title: { nl: "Investment Policy Statement (IPS)", en: "Investment Policy Statement (IPS)" },
    description: {
      nl: "Het beleggingsbeleid: doelstellingen, risicokader, portefeuille-indeling en kosten.",
      en: "The investment policy: objectives, risk framework, portfolio allocation and costs.",
    },
    language: "EN",
    category: "fund",
    url: "/documents/MoM-Investment-Policy-Statement-01072026.pdf",
    available: true,
  },
  {
    title: { nl: "Investeerdersformulier", en: "Investor application form" },
    description: {
      nl: "Aanmeldingsformulier voor deelname aan het fonds (invulbare PDF).",
      en: "Application form for participation in the fund (fillable PDF).",
    },
    language: "NL/EN",
    category: "subscription",
    url: "/documents/MindoverMatter-Investor-Application-NL-EN.pdf",
    available: true,
  },
  {
    title: { nl: "Memorandum & Articles of Association (statuten)", en: "Memorandum & Articles of Association" },
    description: {
      nl: "De statuten van Mind over Matter Limited, vastgesteld bij de oprichting op 29 mei 2026.",
      en: "The constitution of Mind over Matter Limited, adopted on incorporation on 29 May 2026.",
    },
    language: "EN",
    category: "legal",
    url: "/documents/MoM-Memorandum-and-Articles-29052026.pdf",
    available: true,
  },
  {
    title: { nl: "Certificate of Good Standing", en: "Certificate of Good Standing" },
    description: {
      nl: "Verklaring van het Isle of Man Companies Registry dat de vennootschap ingeschreven staat en in goede orde is (2 juli 2026).",
      en: "Confirmation from the Isle of Man Companies Registry that the company is registered and in good standing (2 July 2026).",
    },
    language: "EN",
    category: "legal",
    url: "/documents/MoM-Certificate-of-Good-Standing-02072026.pdf",
    available: true,
  },
];

const COPY = {
  nl: {
    title: "Documentatie",
    intro: "Vertrouwen is een van de kernwaarden waarop Mind over Matter relaties bouwt met beleggers. Transparantie is een voorwaarde voor vertrouwen. Wij streven naar maximale openheid en stellen daarom onderstaande documenten beschikbaar.",
    comingSoon: "Binnenkort beschikbaar",
    questionsBefore: "Heeft u vragen over de documentatie of wenst u aanvullende informatie? Neem dan gerust",
    questionsLink: "contact",
    questionsAfter: "met ons op. Documenten worden regelmatig bijgewerkt. De meest recente versies zijn altijd beschikbaar op deze pagina.",
  },
  en: {
    title: "Documentation",
    intro: "Trust is one of the core values on which Mind over Matter builds its relationships with investors. Transparency is a precondition for trust. We strive for maximum openness and therefore make the documents below available.",
    comingSoon: "Coming soon",
    questionsBefore: "Do you have questions about the documentation or would you like additional information? Feel free to",
    questionsLink: "get in touch",
    questionsAfter: "with us. Documents are updated regularly. The most recent versions are always available on this page.",
  },
};

// Group documents by category
const categories = DOCUMENTS.reduce<Partial<Record<Category, DocItem[]>>>((acc, doc) => {
  (acc[doc.category] ??= []).push(doc);
  return acc;
}, {});

export default function Documentation() {
  const lang = useLang();
  const path = usePath();
  const t = COPY[lang];

  return (
    <div>
      {/* Hero */}
      <section className="section-bg pt-40 pb-16">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-2xl">
              {t.intro}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Documents */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container max-w-4xl mx-auto">
          {(Object.entries(categories) as [Category, DocItem[]][]).map(([category, docs]) => (
            <div key={category} className="mb-14 last:mb-0">
              <FadeIn>
                <h2 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-6">
                  {CATEGORIES[category][lang]}
                </h2>
              </FadeIn>

              <FadeInStagger className="space-y-3">
                {docs.map((doc) => (
                  <FadeInChild key={doc.url}>
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
                              {doc.title[lang]}
                            </h3>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(0.82_0.17_195_/_10%)] text-[oklch(0.82_0.17_195)]">
                              {doc.language}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description[lang]}</p>
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
                              {doc.title[lang]}
                            </h3>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(0.82_0.17_195_/_10%)] text-[oklch(0.82_0.17_195)]">
                              {doc.language}
                            </span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(0.50_0.05_250_/_20%)] text-[oklch(0.60_0.01_250)]">
                              {t.comingSoon}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description[lang]}</p>
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
                {t.questionsBefore}{" "}
                <Link href={path("contact")} className="text-[oklch(0.82_0.17_195)] hover:underline">
                  {t.questionsLink}
                </Link>{" "}
                {t.questionsAfter}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
