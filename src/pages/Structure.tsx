/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Structure page: Partners, reporting, onboarding process
 * Fee structure intentionally omitted from the public site (only in documents)
 */
import { FadeIn, FadeInStagger, FadeInChild, CyanLine } from "@/components/AnimatedSection";
import { Link } from "wouter";
import { ArrowRight, Building2, Scale, Landmark, BarChart3 } from "lucide-react";
import TaxFlowDiagram from "@/components/TaxFlowDiagram";
import { useLang, usePath } from "@/i18n";

const STRUCTURE_BG = "/images/structure-background.jpg";

const PARTNERS = [
  { id: "administrator", icon: Building2, name: "Affinity Co" },
  { id: "regulator", icon: Scale, name: "Financial Services Authority" },
  { id: "bank", icon: Landmark, name: "RBS International" },
  { id: "broker", icon: BarChart3, name: "Exante" },
] as const;

const NL = {
  heroTitle: "Operationele Structuur",
  heroText: "Een professioneel ingericht kader met gevestigde partijen voor administratie, toezicht, bankrelatie en uitvoering — gebouwd voor continuïteit en controleerbaarheid.",
  partnersTitle: "Trusted Partners",
  partners: {
    administrator: { role: "Administrator & Accountant", desc: "Ondersteunt fondsadministratie, accounting, investor relations en compliance." },
    regulator: { role: "Toezichthouder", desc: "Biedt het wettelijke kader waarbinnen de structuur functioneert." },
    bank: { role: "Bank", desc: "Verzorgt bancaire infrastructuur, transactieverwerking en multi-currency faciliteiten." },
    broker: { role: "Broker", desc: "Levert markttoegang, uitvoering, data en professionele handelsinfrastructuur." },
  },
  partnerPoints: [
    { title: "Structuurkeuze", text: "Een functionele inrichting met heldere scheiding van rollen." },
    { title: "Controleerbaarheid", text: "Duidelijke externe rollen verlagen operationeel risico." },
    { title: "Verificatie", text: "Aanvullende audit kan op verzoek worden georganiseerd." },
  ],
  reportingTitle: "Rapportage en communicatie",
  reportingText: "Heldere rapportage en bereikbaarheid ondersteunen vertrouwen, juist wanneer markten minder comfortabel aanvoelen.",
  reportingCardTitle: "Rapportage en bereikbaarheid",
  reporting: [
    { label: "Kwartaalupdate", value: "Indicatie waarde aandelen" },
    { label: "Jaarlijkse rapportage", value: "Rapport via accountant" },
    { label: "Toelichting", value: "Doorlopend mogelijk" },
    { label: "Bereikbaarheid", value: "Onderdeel van de relatie" },
  ],
  reportingNote: "Communicatie is onderdeel van professioneel beheer, niet alleen bij onboarding maar gedurende de gehele relatie.",
  reportingPoints: [
    { title: "Alignment", text: "Transparantie over voorwaarden en resultaatverdeling blijft uitgangspunt. Alle details zijn opgenomen in de fondsdocumentatie." },
    { title: "Helderheid", text: "Voorwaarden moeten ook buiten rustige markten begrijpelijk blijven." },
    { title: "Toegang", text: "Toelichting hoort bij beheer, niet alleen bij onboarding." },
  ],
  onboardingTitle: "Instappen blijft overzichtelijk",
  onboardingText: "Van eerste aanmelding tot uitgifte van aandelen: de route is helder ingericht en blijft ook bij latere extra inleg overzichtelijk.",
  step: "Stap",
  onboarding: [
    { title: "Aanmelding", desc: "Eerste inventarisatie en start van het traject." },
    { title: "Verificatie", desc: "Administrateur toetst het inschrijfformulier en de compliancevereisten." },
    { title: "Agreement", desc: "Ontvangst en zorgvuldige beoordeling van de overeenkomst." },
    { title: "Overboeking", desc: "Na bevestiging volgt de instructie voor overmaking." },
    { title: "Uitgifte", desc: "Inschrijving wordt omgezet in aandelen in het fonds." },
  ],
  onboardingPoints: [
    { title: "Aanvullende inleg", text: "Latere subscriptions kunnen volgens dezelfde route verlopen, zodat opschalen eenvoudig en consistent blijft." },
    { title: "Doorlopende rapportage", text: "Kwartaalupdates en jaarlijkse rapportage houden de ontwikkeling van de positie inzichtelijk." },
  ],
  onboardingClosing: "Volledige transparantie blijft uitgangspunt gedurende de hele relatie.",
  taxEyebrow: "Fiscale efficiëntie",
  taxTitle: "Waarom Isle of Man?",
  taxText: (
    <>
      De keuze voor een fondsstructuur op Isle of Man is een bewuste en rationele beslissing om het rendement voor onze aandeelhouders te optimaliseren. Het kernwoord hierbij is <strong className="text-foreground">belastinguitstel (tax deferral)</strong>, wat leidt tot optimaal bruto renderen.
    </>
  ),
  taxHowTitle: "Hoe het werkt",
  taxHow: [
    <>
      Wanneer een reguliere Nederlandse bv zelfstandig aandelen met winst verkoopt, is daar direct Vennootschapsbelasting (Vpb) over verschuldigd. De pot met kapitaal om verder mee te beleggen wordt daardoor na elke succesvolle transactie iets kleiner.
    </>,
    <>
      Binnen Mind over Matter betalen wij <strong className="text-foreground">0% belasting</strong> over gerealiseerde koerswinsten. Elke euro winst blijft volledig behouden in het fonds en wordt direct ingezet voor nieuwe investeringen.
    </>,
    <>
      Het rente-op-rente (compound) effect werkt hierdoor over <strong className="text-foreground">100% van het kapitaal</strong>. De belasting wordt pas relevant op het moment dat het fonds uitkeert of wanneer u uw aandelenbelang beëindigt.
    </>,
  ],
  taxPoints: [
    { title: "0% winstbelasting", text: "Gerealiseerde koerswinsten worden niet afgeroomd. Elke euro winst blijft volledig in het fonds." },
    { title: "Maximaal compound effect", text: "Het rente-op-rente effect werkt over het volledige kapitaal, niet over een restbedrag na belasting." },
    { title: "Belastinguitstel", text: "De fiscale afrekening vindt pas plaats bij uitkering of beëindiging van de aandelenparticipatie." },
  ],
  taxNoteLabel: "Let op:",
  taxNote: "Dit is een algemene schets van de werking. Wij raden aandeelhouders altijd aan de eigen fiscale positie met een fiscaal adviseur af te stemmen.",
  cta: "Bekijk alle documentatie",
};

const EN: typeof NL = {
  heroTitle: "Operational Structure",
  heroText: "A professionally organised framework with established parties for administration, supervision, banking and execution — built for continuity and verifiability.",
  partnersTitle: "Trusted Partners",
  partners: {
    administrator: { role: "Administrator & Accountant", desc: "Supports fund administration, accounting, investor relations and compliance." },
    regulator: { role: "Regulator", desc: "Provides the legal framework within which the structure operates." },
    bank: { role: "Bank", desc: "Provides banking infrastructure, transaction processing and multi-currency facilities." },
    broker: { role: "Broker", desc: "Provides market access, execution, data and professional trading infrastructure." },
  },
  partnerPoints: [
    { title: "Choice of structure", text: "A functional set-up with a clear separation of roles." },
    { title: "Verifiability", text: "Clearly defined external roles reduce operational risk." },
    { title: "Verification", text: "An additional audit can be arranged on request." },
  ],
  reportingTitle: "Reporting and communication",
  reportingText: "Clear reporting and accessibility support trust, especially when markets feel less comfortable.",
  reportingCardTitle: "Reporting and accessibility",
  reporting: [
    { label: "Quarterly update", value: "Indicative share value" },
    { label: "Annual reporting", value: "Report via accountant" },
    { label: "Explanation", value: "Available at any time" },
    { label: "Accessibility", value: "Part of the relationship" },
  ],
  reportingNote: "Communication is part of professional management, not only during onboarding but throughout the entire relationship.",
  reportingPoints: [
    { title: "Alignment", text: "Transparency about terms and profit sharing remains the starting point. All details are set out in the fund documentation." },
    { title: "Clarity", text: "Terms must remain understandable outside calm markets too." },
    { title: "Access", text: "Explanation is part of management, not just of onboarding." },
  ],
  onboardingTitle: "Getting started stays straightforward",
  onboardingText: "From the first application to the issue of shares: the route is clearly set up and stays straightforward for later additional investments too.",
  step: "Step",
  onboarding: [
    { title: "Application", desc: "Initial assessment and start of the process." },
    { title: "Verification", desc: "The administrator checks the application form and the compliance requirements." },
    { title: "Agreement", desc: "Receipt and careful review of the agreement." },
    { title: "Transfer", desc: "Once confirmed, the instructions for the transfer follow." },
    { title: "Issue", desc: "The subscription is converted into shares in the fund." },
  ],
  onboardingPoints: [
    { title: "Additional investment", text: "Later subscriptions can follow the same route, so scaling up stays simple and consistent." },
    { title: "Ongoing reporting", text: "Quarterly updates and annual reporting keep the development of the position transparent." },
  ],
  onboardingClosing: "Full transparency remains the principle throughout the entire relationship.",
  taxEyebrow: "Tax efficiency",
  taxTitle: "Why the Isle of Man?",
  taxText: (
    <>
      Choosing a fund structure on the Isle of Man is a deliberate and rational decision to optimise returns for our shareholders. The key concept here is <strong className="text-foreground">tax deferral</strong>, which leads to optimal gross compounding.
    </>
  ),
  taxHowTitle: "How it works",
  taxHow: [
    <>
      When a regular Dutch BV (private limited company) sells shares at a profit on its own account, corporate income tax (Vpb) is due immediately. The pot of capital available for further investment therefore becomes slightly smaller after every successful trade.
    </>,
    <>
      Within Mind over Matter we pay <strong className="text-foreground">0% tax</strong> on realised capital gains. Every euro of profit is retained in full within the fund and immediately deployed for new investments.
    </>,
    <>
      As a result, compounding works on <strong className="text-foreground">100% of the capital</strong>. Tax only becomes relevant when the fund makes a distribution or when you end your shareholding.
    </>,
  ],
  taxPoints: [
    { title: "0% tax on profits", text: "Realised capital gains are not skimmed off. Every euro of profit stays in the fund in full." },
    { title: "Maximum compound effect", text: "Compounding works on the full capital, not on a remainder after tax." },
    { title: "Tax deferral", text: "Tax is only settled on distribution or when the shareholding ends." },
  ],
  taxNoteLabel: "Please note:",
  taxNote: "This is a general outline of how it works. We always advise shareholders to discuss their own tax position with a tax adviser.",
  cta: "View all documentation",
};

const COPY = { nl: NL, en: EN };

export default function Structure() {
  const t = COPY[useLang()];
  const path = usePath();

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STRUCTURE_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.13_0.025_250)] via-[oklch(0.13_0.025_250_/_70%)] to-[oklch(0.13_0.025_250_/_30%)]" />
        <div className="relative container pb-16 pt-40">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-2xl">
              {t.heroText}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Partners */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-14">
              {t.partnersTitle}
            </h2>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNERS.map((p) => (
              <FadeInChild key={p.name}>
                <div className="glass-card rounded-xl p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center shrink-0">
                      <p.icon className="text-[oklch(0.82_0.17_195)]" size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold tracking-wider uppercase text-[oklch(0.82_0.17_195)] block mb-1">
                        {t.partners[p.id].role}
                      </span>
                      <h3 className="text-lg font-bold text-foreground mb-2">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{t.partners[p.id].desc}</p>
                    </div>
                  </div>
                </div>
              </FadeInChild>
            ))}
          </FadeInStagger>

          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {t.partnerPoints.map((item) => (
                <div key={item.title} className="border-t border-[oklch(0.25_0.02_250)] pt-5">
                  <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Reporting & Communication */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.reportingTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              {t.reportingText}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeIn>
              <div className="glass-card rounded-xl p-8">
                <h3 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-6">
                  {t.reportingCardTitle}
                </h3>
                <div className="space-y-0">
                  {t.reporting.map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3.5 border-b border-[oklch(0.25_0.02_250_/_50%)] last:border-0">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-bold text-foreground text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  {t.reportingNote}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="space-y-6">
                {t.reportingPoints.map((item) => (
                  <div key={item.title} className="glass-card rounded-xl p-6">
                    <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Onboarding Process */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.onboardingTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              {t.onboardingText}
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t.onboarding.map((s, i) => (
              <FadeInChild key={s.title}>
                <div className="glass-card rounded-xl p-6 h-full">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[oklch(0.82_0.17_195)] mb-2 block">
                    {t.step} {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </FadeInChild>
            ))}
          </FadeInStagger>

          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {t.onboardingPoints.map((item) => (
                <div key={item.title} className="glass-card rounded-xl p-6">
                  <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-10">
              {t.onboardingClosing}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Fiscale Efficiëntie */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <p className="text-sm font-medium tracking-wider uppercase text-[oklch(0.82_0.17_195)] mb-3">
              {t.taxEyebrow}
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.taxTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              {t.taxText}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <FadeIn>
              <div className="glass-card rounded-xl p-8">
                <h3 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-5">
                  {t.taxHowTitle}
                </h3>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  {t.taxHow.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="space-y-4">
                {t.taxPoints.map((item) => (
                  <div key={item.title} className="glass-card rounded-xl p-6">
                    <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Tax Flow Diagram */}
          <FadeIn>
            <TaxFlowDiagram />
          </FadeIn>

          <FadeIn>
            <div className="border border-[oklch(0.82_0.17_195_/_15%)] rounded-xl p-6 bg-[oklch(0.82_0.17_195_/_4%)]">
              <p className="text-sm text-muted-foreground italic">
                <strong className="text-foreground not-italic">{t.taxNoteLabel}</strong> {t.taxNote}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="section-bg py-16">
        <div className="container text-center">
          <FadeIn>
            <Link
              href={path("documents")}
              className="inline-flex items-center gap-2 text-[oklch(0.82_0.17_195)] font-medium text-lg hover:gap-3 transition-all duration-300"
            >
              {t.cta}
              <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
