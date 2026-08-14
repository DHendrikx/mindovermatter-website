/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Home: Full-viewport hero, three pillars, intro to philosophy, CTA sections
 */
import { Link } from "wouter";
import { ArrowRight, Shield, Target, Eye } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInChild, CyanLine } from "@/components/AnimatedSection";

const HERO_BG = "/images/hero-background.jpg";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.13_0.025_250_/_40%)] via-[oklch(0.13_0.025_250_/_20%)] to-[oklch(0.13_0.025_250_/_90%)]" />

        <div className="relative container text-center max-w-4xl mx-auto pt-32 pb-20">
          <FadeIn delay={0.1}>
            <img
              src="/logos/mom-logo-white.svg"
              alt="Mind over Matter"
              className="h-48 lg:h-72 mx-auto mb-6"
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Mind over Matter
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg sm:text-xl lg:text-2xl text-[oklch(0.75_0.01_250)] max-w-2xl mx-auto mb-4 font-light leading-relaxed">
              Value investing, gedisciplineerde analyse en consistente optimalisatie.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-10">
              Isle of Man &nbsp;|&nbsp; Vermogensbeheer
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/filosofie"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[oklch(0.82_0.17_195)] text-[oklch(0.13_0.025_250)] font-semibold rounded-lg hover:bg-[oklch(0.85_0.15_195)] transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.82_0.17_195_/_25%)]"
              >
                Ontdek onze filosofie
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/documentatie"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[oklch(0.30_0.02_250)] text-foreground font-medium rounded-lg hover:border-[oklch(0.82_0.17_195_/_40%)] hover:bg-[oklch(0.82_0.17_195_/_5%)] transition-all duration-300"
              >
                Documentatie
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 rounded-full border-2 border-[oklch(0.40_0.02_250)] flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-[oklch(0.82_0.17_195)] rounded-full animate-bounce motion-reduce:animate-none" />
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Onze kernwaarden
            </h2>
            <p className="text-muted-foreground max-w-2xl mb-14 text-lg">
              Drie principes vormen de basis van elk besluit dat wij nemen.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeInChild>
              <div className="glass-card rounded-xl p-8 transition-all duration-300 group h-full">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center mb-5 group-hover:bg-[oklch(0.82_0.17_195_/_15%)] transition-colors">
                  <Shield className="text-[oklch(0.82_0.17_195)]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Kapitaalbehoud</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Neerwaarts risico eerst begrijpen, daarna pas alloceren. Duurzaam rendement begint met bescherming van startkapitaal.
                </p>
              </div>
            </FadeInChild>

            <FadeInChild>
              <div className="glass-card rounded-xl p-8 transition-all duration-300 group h-full">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center mb-5 group-hover:bg-[oklch(0.82_0.17_195_/_15%)] transition-colors">
                  <Target className="text-[oklch(0.82_0.17_195)]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Discipline</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Selectieve uitvoering met een heldere, herhaalbare aanpak. Niet meer transacties, maar betere transacties met een duidelijke rationale.
                </p>
              </div>
            </FadeInChild>

            <FadeInChild>
              <div className="glass-card rounded-xl p-8 transition-all duration-300 group h-full">
                <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center mb-5 group-hover:bg-[oklch(0.82_0.17_195_/_15%)] transition-colors">
                  <Eye className="text-[oklch(0.82_0.17_195)]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Transparantie</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Uitlegbare keuzes en duidelijke communicatie richting beleggers. Keuzes en verwachtingen moeten begrijpelijk en uitlegbaar blijven.
                </p>
              </div>
            </FadeInChild>
          </FadeInStagger>
        </div>
      </section>

      {/* Philosophy Preview */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <FadeIn>
                <CyanLine className="mb-6" />
                <p className="text-sm font-medium tracking-wider uppercase text-[oklch(0.82_0.17_195)] mb-3">
                  Waarom beleggers moeten kunnen instappen met rust
                </p>
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Vertrouwen begint bij discipline
                </h2>
                <p className="text-lg text-[oklch(0.70_0.01_250)] leading-relaxed mb-8">
                  Kapitaal wordt niet toevertrouwd aan drukte of bravoure, maar aan een beheerder die selectief blijft, risico begrijpt en verwachtingen helder houdt.
                </p>
                <Link
                  href="/filosofie"
                  className="inline-flex items-center gap-2 text-[oklch(0.82_0.17_195)] font-medium hover:gap-3 transition-all duration-300"
                >
                  Lees meer over onze filosofie
                  <ArrowRight size={16} />
                </Link>
              </FadeIn>
            </div>

            <div className="lg:col-span-2">
              <FadeIn delay={0.2}>
                <div className="space-y-6">
                  <div className="glass-card rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-2">
                      Waarom dit vertrouwen verdient
                    </h4>
                    <p className="text-lg font-bold text-foreground mb-4">
                      Een beheerrelatie die rust geeft in plaats van extra onzekerheid.
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-[oklch(0.82_0.17_195)] mt-2 shrink-0" />
                        De focus ligt op neerwaarts risico voor rendement.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-[oklch(0.82_0.17_195)] mt-2 shrink-0" />
                        De aanpak blijft uitlegbaar, ook wanneer markten tegenzitten.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-[oklch(0.82_0.17_195)] mt-2 shrink-0" />
                        Verwachtingsmanagement is onderdeel van professioneel beheer.
                      </li>
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Target Return */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn>
              <CyanLine className="mb-6" />
              <p className="text-sm font-medium tracking-wider uppercase text-[oklch(0.82_0.17_195)] mb-3">
                Richting over de cyclus
              </p>
              <div className="text-7xl lg:text-9xl font-extrabold text-[oklch(0.82_0.17_195)] mb-4">
                10%+
              </div>
              <p className="text-lg text-[oklch(0.70_0.01_250)] leading-relaxed">
                Een rationeel anker voor compounding binnen bewaakte risicokaders. Het doelrendement is een kompas voor gecontroleerde groei — geen belofte, en zeker geen reden om extra risico te nemen.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-6">
                {[
                  { title: "Geen plafond", text: "Wanneer kwaliteit, prijs en timing samenvallen, blijft ruimte voor meer upside." },
                  { title: "Geen marketingbelofte", text: "Er wordt geen risico geforceerd om een target te halen." },
                  { title: "Wel een disciplinekader", text: "Kapitaalbehoud en drawdown-beperking blijven de eerste prioriteit." },
                ].map((item) => (
                  <div key={item.title} className="border-t border-[oklch(0.25_0.02_250)] pt-5">
                    <h4 className="text-lg font-bold text-foreground mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bruto Renderen */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <FadeIn>
                <CyanLine className="mb-6" />
                <p className="text-sm font-medium tracking-wider uppercase text-[oklch(0.82_0.17_195)] mb-3">
                  Structuurvoordeel
                </p>
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Het voordeel van bruto renderen
                </h2>
                <p className="text-lg text-[oklch(0.70_0.01_250)] leading-relaxed mb-6">
                  Naast een gedisciplineerde handelsstrategie biedt onze structuur op Isle of Man een krachtig wiskundig voordeel: <strong className="text-foreground">bruto renderen</strong>. Binnen het fonds is de winstbelasting 0%. Gerealiseerde winsten worden daardoor niet direct afgeroomd, maar volledig geherinvesteerd.
                </p>
                <p className="text-lg text-[oklch(0.70_0.01_250)] leading-relaxed">
                  Hierdoor ontstaat een maximaal rente-op-rente (compound) effect — de belastingclaim wordt uitgesteld tot het moment van uitkering.
                </p>
              </FadeIn>
            </div>

            <div className="lg:col-span-2">
              <FadeIn delay={0.2}>
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-4">
                    Waarom dit verschil maakt
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.82_0.17_195)] mt-2.5 shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="text-foreground font-medium">0% winstbelasting</span> binnen het fonds — elke euro winst blijft volledig behouden.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.82_0.17_195)] mt-2.5 shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="text-foreground font-medium">Maximaal compound effect</span> — het rente-op-rente effect werkt over 100% van het kapitaal.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.82_0.17_195)] mt-2.5 shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="text-foreground font-medium">Belastinguitstel</span> — de fiscale afrekening vindt pas plaats bij uitkering of beëindiging.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container text-center max-w-3xl mx-auto">
          <FadeIn>
            <CyanLine className="mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Gedisciplineerd kapitaalbeheer voor beleggers die waarde hechten aan vertrouwen
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Wanneer aanpak, verwachtingen en relatie op elkaar aansluiten, ontstaat er ruimte voor duurzaam vermogensbeheer met rust in uitvoering en helderheid in communicatie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[oklch(0.82_0.17_195)] text-[oklch(0.13_0.025_250)] font-semibold rounded-lg hover:bg-[oklch(0.85_0.15_195)] transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.82_0.17_195_/_25%)]"
              >
                Neem contact op
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[oklch(0.30_0.02_250)] text-foreground font-medium rounded-lg hover:border-[oklch(0.82_0.17_195_/_40%)] hover:bg-[oklch(0.82_0.17_195_/_5%)] transition-all duration-300"
              >
                Over het team
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
