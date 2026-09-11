/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Team page: About the three team members - Dolf, Sjors, Roy
 */
import { FadeIn, CyanLine } from "@/components/AnimatedSection";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Dolf Hendrikx",
    role: "Strategie & Ondernemerschap",
    photo: "/images/team-dolf-hendrikx.webp",
    bio: "Dolf is een gedreven serial entrepreneur met een bewezen staat van dienst in het opzetten en succesvol verkopen van ondernemingen. Zijn ervaring spreidt zich uit over uiteenlopende sectoren, van techniek en productie tot de educatieve reisindustrie. Door zijn werk met zowel startups als corporates beschikt hij over diepgaand inzicht in bedrijfswaarderingen, kapitaalstructuren en de operationele realiteit achter de cijfers.",
    detail: "Naast zijn ondernemerschap heeft Dolf jarenlange ervaring met het beheren van substantiële vermogens en het maken van strategische beslissingen onder druk.",
    strengths: [
      "Bedrijfswaarderingen & kapitaalstructuren",
      "Strategische besluitvorming onder druk",
      "Operationeel inzicht achter de cijfers",
    ],
  },
  {
    name: "Sjors Tromp",
    role: "Operations & Compliance",
    photo: "/images/team-sjors-tromp.png",
    bio: "Sjors, opererend vanuit Isle of Man, brengt specialistische expertise mee op het snijvlak van productontwikkeling en regelgeving. Als Principal Product Manager bij PokerStars is hij verantwoordelijk voor zowel de complexe game logic als de hardware- en softwarematige ondersteuning van grootschalige live events.",
    detail: "Zijn ervaring in deze zwaar gereguleerde internationale industrie maakt hem een expert in het vertalen van complexe compliance-eisen naar efficiënte operationele processen. Zijn achtergrond in de pokerwereld heeft zijn begrip van speltheorie en strategisch risicomanagement verder aangescherpt.",
    strengths: [
      "Compliance & regelgeving in gereguleerde industrie",
      "Operationele procesoptimalisatie",
      "Speltheorie & strategisch risicomanagement",
    ],
  },
  {
    name: "Roy Huts",
    role: "Analyse & Risicobeheersing",
    photo: "/images/team-roy-huts.png",
    bio: "Roy is de analytische spil van het team en is gespecialiseerd in het structureren van data tot bruikbare inzichten. Naast zijn jarenlange ervaring in de pokerwereld, waar hij zich bekwaamde in probabilistisch denken, fungeert hij als vervangend voorzitter van de Ondernemingsraad bij een grote overheidsorganisatie.",
    detail: "In deze rol is hij gewend om complexe belangen te wegen en rationele besluiten te nemen binnen een bestuurlijke context. Roy heeft een ongekende focus op 'min-maxing': het proces van het minimaliseren van risico's en het maximaliseren van resultaat door constante kritische evaluatie.",
    strengths: [
      "Data-analyse & probabilistisch denken",
      "Risicominimalisatie & resultaatmaximalisatie",
      "Bestuurlijke besluitvorming",
    ],
  },
];

export default function FundManager() {
  return (
    <div>
      {/* Hero */}
      <section className="section-bg pt-40 pb-16">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <p className="text-sm font-medium tracking-wider uppercase text-[oklch(0.82_0.17_195)] mb-3">
              Wie het kapitaal beheert
            </p>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Het Team
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-3xl mb-8">
              Het fonds wordt beheerd op Isle of Man door een team van beleggingsmanagers. Wij combineren value investing met diepgaande analytische discipline.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <blockquote className="border-l-2 border-[oklch(0.82_0.17_195)] pl-6 py-2 max-w-3xl">
              <p className="text-lg italic text-[oklch(0.75_0.01_250)] leading-relaxed">
                "Onze kracht is het zien van mogelijkheden waar anderen onzekerheid zien — discipline, analyse en emotionele controle vormen de bouwstenen voor lange termijn succes."
              </p>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* Team Members */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container">
          <div className="space-y-12">
            {TEAM_MEMBERS.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Left: Photo, Name, role, competencies */}
                      <div className="lg:w-1/3 flex-shrink-0">
                        {/* Photo */}
                        <div className="mb-6 flex justify-center lg:justify-start">
                          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-[oklch(0.82_0.17_195_/_40%)] shadow-[0_0_30px_oklch(0.82_0.17_195_/_10%)]">
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="text-center lg:text-left mb-6">
                          <h2 className="text-2xl font-bold text-foreground">
                            {member.name}
                          </h2>
                          <p className="text-[oklch(0.82_0.17_195)] font-medium text-sm mt-1">
                            {member.role}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.82_0.17_195)] mb-3">
                            Kerncompetenties
                          </h4>
                          {member.strengths.map((s) => (
                            <div
                              key={s}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="text-[oklch(0.82_0.17_195)] mt-1 flex-shrink-0">—</span>
                              <span>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Bio */}
                      <div className="lg:w-2/3 space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {member.bio}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          {member.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Shared Background */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Gezamenlijke basis
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mb-12 leading-relaxed">
              Onze gezamenlijke basis werd gelegd in de strategische wereld van professioneel poker, waar we complexe systemen ons meester maakten. In tegenstelling tot wat de meeste mensen geloven, gaat poker niet over geluk. Op de korte termijn kan geluk resultaten beïnvloeden, maar op de lange termijn worden resultaten behaald door logisch denken en het afwegen van momenten van risico en beloning.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Probabilistisch denken",
                text: "Beslissingen nemen op basis van verwachte waarde, niet op basis van emotie of intuïtie.",
              },
              {
                title: "Emotionele discipline",
                text: "Consistent presteren onder druk, ongeacht of de omstandigheden mee- of tegenzitten.",
              },
              {
                title: "Risico-beloning analyse",
                text: "Elke beslissing wordt gewogen op basis van de verhouding tussen potentieel verlies en potentiële winst.",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="glass-card rounded-xl p-6 h-full">
                  <div className="cyan-line mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Fit Section */}
      <section className="section-bg-alt py-20 lg:py-28">
        <div className="container">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Dit moet bij u passen
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-14">
              Niet iedereen hoeft in te stappen. Juist duidelijkheid over geschiktheid versterkt vertrouwen en samenwerking op de lange termijn.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeIn>
              <div className="glass-card rounded-xl p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Passend</h3>
                <div className="space-y-5">
                  {[
                    { title: "Kapitaalbehoud telt mee", text: "Voor beleggers die streven naar gecontroleerde groei en een weloverwogen risico." },
                    { title: "Rust en uitleg zijn belangrijk", text: "Voor families en ondernemers die discipline, inzicht en toelichting waarderen." },
                    { title: "Lange horizon", text: "Voor investeerders die begrijpen dat geduld vaak sterker is dan voortdurende rotatie." },
                  ].map((item) => (
                    <div key={item.title} className="border-t border-[oklch(0.25_0.02_250)] pt-4">
                      <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="glass-card rounded-xl p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Minder passend</h3>
                <div className="space-y-5">
                  {[
                    { title: "Korte-termijn focus", text: "Minder geschikt voor beleggers die snelle omloopsnelheid of continue activiteit zoeken." },
                    { title: "Maximaal rendement als enige maatstaf", text: "Minder passend wanneer winstmaximalisatie belangrijker is dan een gezonde bescherming van uw vermogen." },
                    { title: "Puur transactiegericht", text: "Minder passend voor wie enkel een snelle transactie zoekt en geen behoefte heeft aan persoonlijke toelichting of een langdurige relatie." },
                  ].map((item) => (
                    <div key={item.title} className="border-t border-[oklch(0.25_0.02_250)] pt-4">
                      <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <p className="text-muted-foreground mt-10 text-center max-w-2xl mx-auto">
              De relatie moet kloppen: een goede match is voor ons belangrijker dan een snelle start. Wij bouwen liever aan een duurzaam fundament dan aan een overhaaste eerste stap.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="section-bg py-16">
        <div className="container text-center">
          <FadeIn>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-[oklch(0.82_0.17_195)] font-medium text-lg hover:gap-3 transition-all duration-300"
            >
              Neem contact op voor een kennismaking
              <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
