/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Philosophy page: Investment approach, 5-step process, practical example
 */
import { FadeIn, FadeInStagger, FadeInChild, CyanLine } from "@/components/AnimatedSection";
import { useLang } from "@/i18n";

const PHILOSOPHY_BG = "/images/philosophy-background.jpg";

const NL = {
  heroEyebrow: "Selectief vermogensbeheer met lange horizon",
  heroTitle: "Onze beleggingsfilosofie",
  heroText: "Het proces moet herhaalbaar zijn, rustig uitgevoerd kunnen worden en voor beleggers begrijpelijk blijven.",
  coreTitle: "Vertrouwen begint bij discipline",
  coreText: [
    "Kapitaal wordt niet toevertrouwd aan drukte of bravoure, maar aan een beheerder die selectief blijft, risico begrijpt en verwachtingen helder houdt.",
    "Wij geloven dat duurzaam rendement voortkomt uit een gedisciplineerde aanpak: alleen handelen wanneer risico en potentiële beloning aantoonbaar in balans zijn, niet meer transacties maar betere transacties, en keuzes die begrijpelijk en uitlegbaar blijven.",
  ],
  corePoints: [
    { title: "Kapitaalbehoud eerst", text: "Alleen handelen wanneer risico en potentiële beloning aantoonbaar in balans zijn." },
    { title: "Selectiviteit", text: "Niet meer transacties, maar betere transacties met een duidelijke rationale." },
    { title: "Open communicatie", text: "Keuzes en verwachtingen moeten begrijpelijk en uitlegbaar blijven." },
  ],
  processTitle: "Onze aanpak is concreet",
  processText: "Het proces moet herhaalbaar zijn, rustig uitgevoerd kunnen worden en voor beleggers begrijpelijk blijven.",
  step: "Stap",
  steps: [
    { title: "Selectie", desc: "Alleen kansen met onderwaardering, balanssterkte en een begrijpelijk model komen door de eerste filter." },
    { title: "Analyse", desc: "Kasstromen, managementkwaliteit en downside-scenario's bepalen of een idee belegbaar wordt." },
    { title: "Weging", desc: "Posities worden gedoseerd opgebouwd op basis van risico, liquiditeit en overtuiging." },
    { title: "Monitoring", desc: "Resultaten, waardering en de originele these worden continu opnieuw getoetst." },
    { title: "Exit", desc: "Er wordt afgebouwd zodra waardering is ingelopen of het risico aantoonbaar verandert." },
  ],
  processPoints: [
    { title: "Herhaalbaar", text: "Geen opportunisme, maar een vaste manier van kijken en handelen." },
    { title: "Rustig", text: "Liever een gemiste kans dan geforceerd risico." },
    { title: "Uitlegbaar", text: "Elke allocatie moet logisch te verantwoorden zijn." },
  ],
  exampleTitle: "Zo werkt de aanpak in praktijk",
  exampleIntro: "Een illustratieve fictieve casus laat zien hoe een idee van prijsverschil naar concrete allocatie en exit-discipline beweegt.",
  exampleCase: "Een winstgevend nichebedrijf wordt tijdelijk lager gewaardeerd door sectorzwakte, terwijl balans en kasstroom intact blijven.",
  exampleQuestion: "De kernvraag is dan niet of de markt onrustig is, maar of de onderliggende waarde duurzaam overeind staat en de korting rationeel benut kan worden.",
  exampleSteps: [
    { title: "Analyse", text: "Kasstromen, schuld, managementincentives en intrinsieke waarde worden opnieuw getoetst." },
    { title: "Opbouw", text: "De positie wordt gefaseerd opgebouwd zolang de these intact blijft." },
    { title: "Risicobewaking", text: "Omvang blijft begrensd; cijfers en liquiditeit worden actief gevolgd." },
    { title: "Exit", text: "Er wordt afgebouwd zodra de korting verdwijnt of de uitgangspunten verslechteren." },
  ],
  exampleNote: "Illustratieve fictieve casus, uitsluitend bedoeld om het besluitvormingsproces en de risicodiscipline te verduidelijken. Geen beleggingsadvies of prestatieclaim.",
};

const EN: typeof NL = {
  heroEyebrow: "Selective asset management with a long horizon",
  heroTitle: "Our investment philosophy",
  heroText: "The process must be repeatable, able to be carried out calmly and remain understandable for investors.",
  coreTitle: "Trust begins with discipline",
  coreText: [
    "Capital is not entrusted to noise or bravado, but to a manager who stays selective, understands risk and keeps expectations clear.",
    "We believe that sustainable returns come from a disciplined approach: only acting when risk and potential reward are demonstrably in balance, not more trades but better trades, and choices that remain understandable and explainable.",
  ],
  corePoints: [
    { title: "Capital preservation first", text: "Only act when risk and potential reward are demonstrably in balance." },
    { title: "Selectivity", text: "Not more trades, but better trades with a clear rationale." },
    { title: "Open communication", text: "Choices and expectations must remain understandable and explainable." },
  ],
  processTitle: "Our approach is concrete",
  processText: "The process must be repeatable, able to be carried out calmly and remain understandable for investors.",
  step: "Step",
  steps: [
    { title: "Selection", desc: "Only opportunities with undervaluation, balance-sheet strength and an understandable business model pass the first filter." },
    { title: "Analysis", desc: "Cash flows, management quality and downside scenarios determine whether an idea becomes investable." },
    { title: "Position sizing", desc: "Positions are built up gradually based on risk, liquidity and conviction." },
    { title: "Monitoring", desc: "Results, valuation and the original thesis are continuously re-tested." },
    { title: "Exit", desc: "Positions are reduced once the valuation gap has closed or the risk demonstrably changes." },
  ],
  processPoints: [
    { title: "Repeatable", text: "No opportunism, but a consistent way of looking and acting." },
    { title: "Calm", text: "Better a missed opportunity than forced risk." },
    { title: "Explainable", text: "Every allocation must be logically justifiable." },
  ],
  exampleTitle: "How the approach works in practice",
  exampleIntro: "An illustrative, fictional case shows how an idea moves from a price discrepancy to a concrete allocation and exit discipline.",
  exampleCase: "A profitable niche company is temporarily valued lower because of sector weakness, while its balance sheet and cash flow remain intact.",
  exampleQuestion: "The key question then is not whether the market is restless, but whether the underlying value holds up sustainably and the discount can be used rationally.",
  exampleSteps: [
    { title: "Analysis", text: "Cash flows, debt, management incentives and intrinsic value are re-tested." },
    { title: "Build-up", text: "The position is built up in phases for as long as the thesis remains intact." },
    { title: "Risk monitoring", text: "Position size remains capped; figures and liquidity are actively tracked." },
    { title: "Exit", text: "The position is reduced once the discount disappears or the underlying assumptions deteriorate." },
  ],
  exampleNote: "Illustrative, fictional case, intended solely to clarify the decision-making process and risk discipline. Not investment advice or a performance claim.",
};

const COPY = { nl: NL, en: EN };

export default function Philosophy() {
  const t = COPY[useLang()];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${PHILOSOPHY_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.13_0.025_250)] via-[oklch(0.13_0.025_250_/_70%)] to-[oklch(0.13_0.025_250_/_30%)]" />
        <div className="relative container pb-16 pt-40">
          <FadeIn>
            <CyanLine className="mb-6" />
            <p className="text-sm font-medium tracking-wider uppercase text-[oklch(0.82_0.17_195)] mb-3">
              {t.heroEyebrow}
            </p>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-2xl">
              {t.heroText}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <FadeIn>
                <CyanLine className="mb-6" />
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  {t.coreTitle}
                </h2>
                <div className="space-y-5 text-[oklch(0.75_0.01_250)] text-lg leading-relaxed">
                  {t.coreText.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-2">
              <FadeIn delay={0.2}>
                <div className="glass-card rounded-xl p-6 space-y-5">
                  {t.corePoints.map((item) => (
                    <div key={item.title} className="border-t border-[oklch(0.25_0.02_250)] pt-4 first:border-0 first:pt-0">
                      <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Process */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.processTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              {t.processText}
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t.steps.map((s, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {t.processPoints.map((item) => (
                <div key={item.title} className="border-t border-[oklch(0.25_0.02_250)] pt-5">
                  <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Practical Example */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <FadeIn>
              <CyanLine className="mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                {t.exampleTitle}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t.exampleIntro}
              </p>
              <div className="glass-card rounded-xl p-6">
                <p className="text-lg font-semibold text-foreground leading-relaxed">
                  {t.exampleCase}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  {t.exampleQuestion}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-5">
                {t.exampleSteps.map((item, i) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center text-sm font-bold text-[oklch(0.82_0.17_195)] shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[oklch(0.40_0.02_250)] mt-6 italic">
                {t.exampleNote}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
