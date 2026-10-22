/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Home: Full-viewport hero, three pillars, intro to philosophy, CTA sections
 */
import { Link } from "wouter";
import { ArrowRight, Shield, Target, Eye } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInChild, CyanLine } from "@/components/AnimatedSection";
import { useLang, usePath } from "@/i18n";

const HERO_BG = "/images/hero-background.jpg";

const NL = {
  tagline: "Value investing, gedisciplineerde analyse en consistente optimalisatie.",
  location: "Isle of Man  |  Vermogensbeheer",
  ctaPhilosophy: "Ontdek onze filosofie",
  ctaDocuments: "Documentatie",
  pillarsTitle: "Onze kernwaarden",
  pillarsIntro: "Drie principes vormen de basis van elk besluit dat wij nemen.",
  pillars: [
    { title: "Kapitaalbehoud", text: "Neerwaarts risico eerst begrijpen, daarna pas alloceren. Duurzaam rendement begint met bescherming van startkapitaal." },
    { title: "Discipline", text: "Selectieve uitvoering met een heldere, herhaalbare aanpak. Niet meer transacties, maar betere transacties met een duidelijke rationale." },
    { title: "Transparantie", text: "Uitlegbare keuzes en duidelijke communicatie richting beleggers. Keuzes en verwachtingen moeten begrijpelijk en uitlegbaar blijven." },
  ],
  trustEyebrow: "Waarom beleggers moeten kunnen instappen met rust",
  trustTitle: "Vertrouwen begint bij discipline",
  trustText: "Kapitaal wordt niet toevertrouwd aan drukte of bravoure, maar aan een beheerder die selectief blijft, risico begrijpt en verwachtingen helder houdt.",
  trustLink: "Lees meer over onze filosofie",
  trustCardEyebrow: "Waarom dit vertrouwen verdient",
  trustCardTitle: "Een beheerrelatie die rust geeft in plaats van extra onzekerheid.",
  trustCardPoints: [
    "De focus ligt op neerwaarts risico voor rendement.",
    "De aanpak blijft uitlegbaar, ook wanneer markten tegenzitten.",
    "Verwachtingsmanagement is onderdeel van professioneel beheer.",
  ],
  targetEyebrow: "Richting over de cyclus",
  targetText: "Een rationeel anker voor compounding binnen bewaakte risicokaders. Het doelrendement is een kompas voor gecontroleerde groei — geen belofte, en zeker geen reden om extra risico te nemen.",
  targetPoints: [
    { title: "Geen plafond", text: "Wanneer kwaliteit, prijs en timing samenvallen, blijft ruimte voor meer upside." },
    { title: "Geen marketingbelofte", text: "Er wordt geen risico geforceerd om een target te halen." },
    { title: "Wel een disciplinekader", text: "Kapitaalbehoud en drawdown-beperking blijven de eerste prioriteit." },
  ],
  grossEyebrow: "Structuurvoordeel",
  grossTitle: "Het voordeel van bruto renderen",
  grossText: (
    <>
      Naast een gedisciplineerde handelsstrategie biedt onze structuur op Isle of Man een krachtig wiskundig voordeel: <strong className="text-foreground">bruto renderen</strong>. Binnen het fonds is de winstbelasting 0%. Gerealiseerde winsten worden daardoor niet direct afgeroomd, maar volledig geherinvesteerd.
    </>
  ),
  grossText2: "Hierdoor ontstaat een maximaal rente-op-rente (compound) effect — de belastingclaim wordt uitgesteld tot het moment van uitkering.",
  grossCardTitle: "Waarom dit verschil maakt",
  grossPoints: [
    { strong: "0% winstbelasting", text: " binnen het fonds — elke euro winst blijft volledig behouden." },
    { strong: "Maximaal compound effect", text: " — het rente-op-rente effect werkt over 100% van het kapitaal." },
    { strong: "Belastinguitstel", text: " — de fiscale afrekening vindt pas plaats bij uitkering of beëindiging." },
  ],
  ctaTitle: "Gedisciplineerd kapitaalbeheer voor beleggers die waarde hechten aan vertrouwen",
  ctaText: "Wanneer aanpak, verwachtingen en relatie op elkaar aansluiten, ontstaat er ruimte voor duurzaam vermogensbeheer met rust in uitvoering en helderheid in communicatie.",
  ctaContact: "Neem contact op",
  ctaTeam: "Over het team",
};

const EN: typeof NL = {
  tagline: "Value investing, disciplined analysis and consistent optimisation.",
  location: "Isle of Man  |  Asset management",
  ctaPhilosophy: "Discover our philosophy",
  ctaDocuments: "Documentation",
  pillarsTitle: "Our core values",
  pillarsIntro: "Three principles underpin every decision we make.",
  pillars: [
    { title: "Capital preservation", text: "Understand downside risk first, allocate second. Sustainable returns begin with protecting the starting capital." },
    { title: "Discipline", text: "Selective execution with a clear, repeatable approach. Not more trades, but better trades with a clear rationale." },
    { title: "Transparency", text: "Explainable choices and clear communication with investors. Choices and expectations must remain understandable and explainable." },
  ],
  trustEyebrow: "Why investors should be able to invest with peace of mind",
  trustTitle: "Trust begins with discipline",
  trustText: "Capital is not entrusted to noise or bravado, but to a manager who stays selective, understands risk and keeps expectations clear.",
  trustLink: "Read more about our philosophy",
  trustCardEyebrow: "Why this deserves trust",
  trustCardTitle: "A management relationship that brings peace of mind rather than added uncertainty.",
  trustCardPoints: [
    "The focus is on downside risk before return.",
    "The approach remains explainable, even when markets turn against us.",
    "Managing expectations is part of professional management.",
  ],
  targetEyebrow: "Direction over the cycle",
  targetText: "A rational anchor for compounding within monitored risk limits. The target return is a compass for controlled growth — not a promise, and certainly no reason to take on extra risk.",
  targetPoints: [
    { title: "No ceiling", text: "When quality, price and timing align, there is room for more upside." },
    { title: "No marketing promise", text: "No risk is forced in order to hit a target." },
    { title: "But a framework for discipline", text: "Capital preservation and limiting drawdowns remain the first priority." },
  ],
  grossEyebrow: "Structural advantage",
  grossTitle: "The advantage of gross compounding",
  grossText: (
    <>
      Alongside a disciplined trading strategy, our structure on the Isle of Man offers a powerful mathematical advantage: <strong className="text-foreground">gross compounding</strong>. Within the fund, the tax on profits is 0%. Realised gains are therefore not skimmed off straight away, but reinvested in full.
    </>
  ),
  grossText2: "This creates a maximum compound interest effect — the tax liability is deferred until the moment of distribution.",
  grossCardTitle: "Why this makes a difference",
  grossPoints: [
    { strong: "0% tax on profits", text: " within the fund — every euro of profit is retained in full." },
    { strong: "Maximum compound effect", text: " — compounding works on 100% of the capital." },
    { strong: "Tax deferral", text: " — tax is only settled on distribution or termination." },
  ],
  ctaTitle: "Disciplined capital management for investors who value trust",
  ctaText: "When approach, expectations and relationship are aligned, there is room for sustainable asset management with calm execution and clear communication.",
  ctaContact: "Get in touch",
  ctaTeam: "About the team",
};

const COPY = { nl: NL, en: EN };
const PILLAR_ICONS = [Shield, Target, Eye];

export default function Home() {
  const t = COPY[useLang()];
  const path = usePath();

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
              {t.tagline}
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-10">
              {t.location}
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={path("philosophy")}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[oklch(0.82_0.17_195)] text-[oklch(0.13_0.025_250)] font-semibold rounded-lg hover:bg-[oklch(0.85_0.15_195)] transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.82_0.17_195_/_25%)]"
              >
                {t.ctaPhilosophy}
                <ArrowRight size={18} />
              </Link>
              <Link
                href={path("documents")}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[oklch(0.30_0.02_250)] text-foreground font-medium rounded-lg hover:border-[oklch(0.82_0.17_195_/_40%)] hover:bg-[oklch(0.82_0.17_195_/_5%)] transition-all duration-300"
              >
                {t.ctaDocuments}
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
              {t.pillarsTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mb-14 text-lg">
              {t.pillarsIntro}
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i];
              return (
                <FadeInChild key={pillar.title}>
                  <div className="glass-card rounded-xl p-8 transition-all duration-300 group h-full">
                    <div className="w-12 h-12 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center mb-5 group-hover:bg-[oklch(0.82_0.17_195_/_15%)] transition-colors">
                      <Icon className="text-[oklch(0.82_0.17_195)]" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.text}
                    </p>
                  </div>
                </FadeInChild>
              );
            })}
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
                  {t.trustEyebrow}
                </p>
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {t.trustTitle}
                </h2>
                <p className="text-lg text-[oklch(0.70_0.01_250)] leading-relaxed mb-8">
                  {t.trustText}
                </p>
                <Link
                  href={path("philosophy")}
                  className="inline-flex items-center gap-2 text-[oklch(0.82_0.17_195)] font-medium hover:gap-3 transition-all duration-300"
                >
                  {t.trustLink}
                  <ArrowRight size={16} />
                </Link>
              </FadeIn>
            </div>

            <div className="lg:col-span-2">
              <FadeIn delay={0.2}>
                <div className="space-y-6">
                  <div className="glass-card rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-2">
                      {t.trustCardEyebrow}
                    </h4>
                    <p className="text-lg font-bold text-foreground mb-4">
                      {t.trustCardTitle}
                    </p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {t.trustCardPoints.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-[oklch(0.82_0.17_195)] mt-2 shrink-0" />
                          {point}
                        </li>
                      ))}
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
                {t.targetEyebrow}
              </p>
              <div className="text-7xl lg:text-9xl font-extrabold text-[oklch(0.82_0.17_195)] mb-4">
                10%+
              </div>
              <p className="text-lg text-[oklch(0.70_0.01_250)] leading-relaxed">
                {t.targetText}
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-6">
                {t.targetPoints.map((item) => (
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
                  {t.grossEyebrow}
                </p>
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {t.grossTitle}
                </h2>
                <p className="text-lg text-[oklch(0.70_0.01_250)] leading-relaxed mb-6">
                  {t.grossText}
                </p>
                <p className="text-lg text-[oklch(0.70_0.01_250)] leading-relaxed">
                  {t.grossText2}
                </p>
              </FadeIn>
            </div>

            <div className="lg:col-span-2">
              <FadeIn delay={0.2}>
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-[oklch(0.82_0.17_195)] uppercase tracking-wider mb-4">
                    {t.grossCardTitle}
                  </h4>
                  <div className="space-y-4">
                    {t.grossPoints.map((point) => (
                      <div key={point.strong} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.82_0.17_195)] mt-2.5 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          <span className="text-foreground font-medium">{point.strong}</span>{point.text}
                        </p>
                      </div>
                    ))}
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
              {t.ctaTitle}
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              {t.ctaText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={path("contact")}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[oklch(0.82_0.17_195)] text-[oklch(0.13_0.025_250)] font-semibold rounded-lg hover:bg-[oklch(0.85_0.15_195)] transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.82_0.17_195_/_25%)]"
              >
                {t.ctaContact}
                <ArrowRight size={18} />
              </Link>
              <Link
                href={path("team")}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[oklch(0.30_0.02_250)] text-foreground font-medium rounded-lg hover:border-[oklch(0.82_0.17_195_/_40%)] hover:bg-[oklch(0.82_0.17_195_/_5%)] transition-all duration-300"
              >
                {t.ctaTeam}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
