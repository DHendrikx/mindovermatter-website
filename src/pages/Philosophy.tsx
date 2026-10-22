/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Philosophy page: Investment approach, 5-step process, practical example
 */
import { FadeIn, FadeInStagger, FadeInChild, CyanLine } from "@/components/AnimatedSection";

const PHILOSOPHY_BG = "/images/philosophy-background.jpg";

const STEPS = [
  { step: 1, title: "Selectie", desc: "Alleen kansen met onderwaardering, balanssterkte en een begrijpelijk model komen door de eerste filter." },
  { step: 2, title: "Analyse", desc: "Kasstromen, managementkwaliteit en downside-scenario's bepalen of een idee belegbaar wordt." },
  { step: 3, title: "Weging", desc: "Posities worden gedoseerd opgebouwd op basis van risico, liquiditeit en overtuiging." },
  { step: 4, title: "Monitoring", desc: "Resultaten, waardering en de originele these worden continu opnieuw getoetst." },
  { step: 5, title: "Exit", desc: "Er wordt afgebouwd zodra waardering is ingelopen of het risico aantoonbaar verandert." },
];

export default function Philosophy() {
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
              Selectief vermogensbeheer met lange horizon
            </p>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              Onze beleggingsfilosofie
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-2xl">
              Het proces moet herhaalbaar zijn, rustig uitgevoerd kunnen worden en voor beleggers begrijpelijk blijven.
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
                  Vertrouwen begint bij discipline
                </h2>
                <div className="space-y-5 text-[oklch(0.75_0.01_250)] text-lg leading-relaxed">
                  <p>
                    Kapitaal wordt niet toevertrouwd aan drukte of bravoure, maar aan een beheerder die selectief blijft, risico begrijpt en verwachtingen helder houdt.
                  </p>
                  <p>
                    Wij geloven dat duurzaam rendement voortkomt uit een gedisciplineerde aanpak: alleen handelen wanneer risico en potentiële beloning aantoonbaar in balans zijn, niet meer transacties maar betere transacties, en keuzes die begrijpelijk en uitlegbaar blijven.
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-2">
              <FadeIn delay={0.2}>
                <div className="glass-card rounded-xl p-6 space-y-5">
                  {[
                    { title: "Kapitaalbehoud eerst", text: "Alleen handelen wanneer risico en potentiële beloning aantoonbaar in balans zijn." },
                    { title: "Selectiviteit", text: "Niet meer transacties, maar betere transacties met een duidelijke rationale." },
                    { title: "Open communicatie", text: "Keuzes en verwachtingen moeten begrijpelijk en uitlegbaar blijven." },
                  ].map((item) => (
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
              Onze aanpak is concreet
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              Het proces moet herhaalbaar zijn, rustig uitgevoerd kunnen worden en voor beleggers begrijpelijk blijven.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEPS.map((s) => (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                { title: "Herhaalbaar", text: "Geen opportunisme, maar een vaste manier van kijken en handelen." },
                { title: "Rustig", text: "Liever een gemiste kans dan geforceerd risico." },
                { title: "Uitlegbaar", text: "Elke allocatie moet logisch te verantwoorden zijn." },
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

      {/* Practical Example */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <FadeIn>
              <CyanLine className="mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Zo werkt de aanpak in praktijk
              </h2>
              <p className="text-muted-foreground mb-6">
                Een illustratieve fictieve casus laat zien hoe een idee van prijsverschil naar concrete allocatie en exit-discipline beweegt.
              </p>
              <div className="glass-card rounded-xl p-6">
                <p className="text-lg font-semibold text-foreground leading-relaxed">
                  Een winstgevend nichebedrijf wordt tijdelijk lager gewaardeerd door sectorzwakte, terwijl balans en kasstroom intact blijven.
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  De kernvraag is dan niet of de markt onrustig is, maar of de onderliggende waarde duurzaam overeind staat en de korting rationeel benut kan worden.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-5">
                {[
                  { n: "1", title: "Analyse", text: "Kasstromen, schuld, managementincentives en intrinsieke waarde worden opnieuw getoetst." },
                  { n: "2", title: "Opbouw", text: "De positie wordt gefaseerd opgebouwd zolang de these intact blijft." },
                  { n: "3", title: "Risicobewaking", text: "Omvang blijft begrensd; cijfers en liquiditeit worden actief gevolgd." },
                  { n: "4", title: "Exit", text: "Er wordt afgebouwd zodra de korting verdwijnt of de uitgangspunten verslechteren." },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-lg bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center text-sm font-bold text-[oklch(0.82_0.17_195)] shrink-0">
                      {item.n}
                    </span>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[oklch(0.40_0.02_250)] mt-6 italic">
                Illustratieve fictieve casus, uitsluitend bedoeld om het besluitvormingsproces en de risicodiscipline te verduidelijken. Geen beleggingsadvies of prestatieclaim.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
