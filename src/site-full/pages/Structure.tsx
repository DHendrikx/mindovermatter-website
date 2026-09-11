/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Structure page: Partners, reporting, onboarding process
 * Fee structure intentionally omitted from the public site (only in documents)
 */
import { FadeIn, FadeInStagger, FadeInChild, CyanLine } from "@/components/AnimatedSection";
import { Link } from "wouter";
import { ArrowRight, Building2, Scale, Landmark, BarChart3 } from "lucide-react";
import TaxFlowDiagram from "@/site-full/components/TaxFlowDiagram";

const STRUCTURE_BG = "/images/structure-background.jpg";

const PARTNERS = [
  { icon: Building2, role: "Administrator & Accountant", name: "Affinity Co", desc: "Ondersteunt fondsadministratie, accounting, investor relations en compliance." },
  { icon: Scale, role: "Toezichthouder", name: "Financial Services Authority", desc: "Biedt het wettelijke kader waarbinnen de structuur functioneert." },
  { icon: Landmark, role: "Bank", name: "Lloyds Bank International", desc: "Verzorgt bancaire infrastructuur, transactieverwerking en multi-currency faciliteiten." },
  { icon: BarChart3, role: "Broker", name: "Interactive Brokers", desc: "Levert markttoegang, uitvoering, data en professionele handelsinfrastructuur." },
];

const REPORTING = [
  { label: "Kwartaalupdate", value: "Indicatie waarde aandelen" },
  { label: "Jaarlijkse rapportage", value: "Rapport via accountant" },
  { label: "Toelichting", value: "Doorlopend mogelijk" },
  { label: "Bereikbaarheid", value: "Onderdeel van de relatie" },
];

const ONBOARDING = [
  { step: 1, title: "Aanmelding", desc: "Eerste inventarisatie en start van het traject." },
  { step: 2, title: "Agreement", desc: "Ontvangst en zorgvuldige beoordeling van de overeenkomst." },
  { step: 3, title: "Verificatie", desc: "Administrateur toetst inschrijving en compliancevereisten." },
  { step: 4, title: "Overboeking", desc: "Na bevestiging volgt de instructie voor overmaking." },
  { step: 5, title: "Uitgifte", desc: "Inschrijving wordt omgezet in aandelen in het fonds." },
];

export default function Structure() {
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
              Operationele Structuur
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-2xl">
              Een professioneel ingericht kader met gevestigde partijen voor administratie, toezicht, bankrelatie en uitvoering — gebouwd voor continuïteit en controleerbaarheid.
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
              Trusted Partners
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
                        {p.role}
                      </span>
                      <h3 className="text-lg font-bold text-foreground mb-2">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeInChild>
            ))}
          </FadeInStagger>

          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                { title: "Structuurkeuze", text: "Een functionele inrichting met heldere scheiding van rollen." },
                { title: "Controleerbaarheid", text: "Duidelijke externe rollen verlagen operationeel risico." },
                { title: "Verificatie", text: "Aanvullende audit kan op verzoek worden georganiseerd." },
              ].map((item) => (
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
              Rapportage en communicatie
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              Heldere rapportage en bereikbaarheid ondersteunen vertrouwen, juist wanneer markten minder comfortabel aanvoelen.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeIn>
              <div className="glass-card rounded-xl p-8">
                <h3 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-6">
                  Rapportage en bereikbaarheid
                </h3>
                <div className="space-y-0">
                  {REPORTING.map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3.5 border-b border-[oklch(0.25_0.02_250_/_50%)] last:border-0">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-bold text-foreground text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Communicatie is onderdeel van professioneel beheer, niet alleen bij onboarding maar gedurende de gehele relatie.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="space-y-6">
                {[
                  { title: "Alignment", text: "Transparantie over voorwaarden en resultaatverdeling blijft uitgangspunt. Alle details zijn opgenomen in de fondsdocumentatie." },
                  { title: "Helderheid", text: "Voorwaarden moeten ook buiten rustige markten begrijpelijk blijven." },
                  { title: "Toegang", text: "Toelichting hoort bij beheer, niet alleen bij onboarding." },
                ].map((item) => (
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
              Instappen blijft overzichtelijk
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              Van eerste aanmelding tot uitgifte van aandelen: de route is helder ingericht en blijft ook bij latere extra inleg overzichtelijk.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ONBOARDING.map((s) => (
              <FadeInChild key={s.step}>
                <div className="glass-card rounded-xl p-6 h-full">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[oklch(0.82_0.17_195)] mb-2 block">
                    Stap {s.step}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </FadeInChild>
            ))}
          </FadeInStagger>

          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {[
                { title: "Aanvullende inleg", text: "Latere subscriptions kunnen volgens dezelfde route verlopen, zodat opschalen eenvoudig en consistent blijft." },
                { title: "Doorlopende rapportage", text: "Kwartaalupdates en jaarlijkse rapportage houden de ontwikkeling van de positie inzichtelijk." },
              ].map((item) => (
                <div key={item.title} className="glass-card rounded-xl p-6">
                  <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-10">
              Volledige transparantie blijft uitgangspunt gedurende de hele relatie.
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
              Fiscale efficiëntie
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Waarom Isle of Man?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              De keuze voor een fondsstructuur op Isle of Man is een bewuste en rationele beslissing om het rendement voor onze aandeelhouders te optimaliseren. Het kernwoord hierbij is <strong className="text-foreground">belastinguitstel (tax deferral)</strong>, wat leidt tot optimaal bruto renderen.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <FadeIn>
              <div className="glass-card rounded-xl p-8">
                <h3 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-5">
                  Hoe het werkt
                </h3>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  <p>
                    Wanneer een reguliere Nederlandse bv zelfstandig aandelen met winst verkoopt, is daar direct Vennootschapsbelasting (Vpb) over verschuldigd. De pot met kapitaal om verder mee te beleggen wordt daardoor na elke succesvolle transactie iets kleiner.
                  </p>
                  <p>
                    Binnen Mind over Matter betalen wij <strong className="text-foreground">0% belasting</strong> over gerealiseerde koerswinsten. Elke euro winst blijft volledig behouden in het fonds en wordt direct ingezet voor nieuwe investeringen.
                  </p>
                  <p>
                    Het rente-op-rente (compound) effect werkt hierdoor over <strong className="text-foreground">100% van het kapitaal</strong>. De belasting wordt pas relevant op het moment dat het fonds uitkeert of wanneer u uw aandelenbelang beëindigt.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="space-y-4">
                {[
                  { title: "0% winstbelasting", text: "Gerealiseerde koerswinsten worden niet afgeroomd. Elke euro winst blijft volledig in het fonds." },
                  { title: "Maximaal compound effect", text: "Het rente-op-rente effect werkt over het volledige kapitaal, niet over een restbedrag na belasting." },
                  { title: "Belastinguitstel", text: "De fiscale afrekening vindt pas plaats bij uitkering of beëindiging van de aandelenparticipatie." },
                ].map((item) => (
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
                <strong className="text-foreground not-italic">Let op:</strong> Dit is een algemene schets van de werking. Wij raden aandeelhouders altijd aan de eigen fiscale positie met een fiscaal adviseur af te stemmen.
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
              href="/documentatie"
              className="inline-flex items-center gap-2 text-[oklch(0.82_0.17_195)] font-medium text-lg hover:gap-3 transition-all duration-300"
            >
              Bekijk alle documentatie
              <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
