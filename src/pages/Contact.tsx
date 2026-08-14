/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * Contact page: Simple contact info with email only
 */
import { FadeIn, CyanLine } from "@/components/AnimatedSection";
import { Mail, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const CONTACT_BG = "/images/contact-background.jpg";

export default function Contact() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${CONTACT_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.13_0.025_250)] via-[oklch(0.13_0.025_250_/_70%)] to-[oklch(0.13_0.025_250_/_30%)]" />
        <div className="relative container pb-16 pt-40">
          <FadeIn>
            <CyanLine className="mb-6" />
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              Contact
            </h1>
            <p className="text-lg text-[oklch(0.70_0.01_250)] max-w-2xl">
              Transparantie en bereikbaarheid staan centraal — neem gerust contact op voor toelichting, inzicht of vragen.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-bg py-20 lg:py-28">
        <div className="container max-w-3xl">
          <FadeIn>
            <div className="glass-card rounded-xl p-10 lg:p-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[oklch(0.82_0.17_195_/_10%)] flex items-center justify-center mx-auto mb-8">
                <Mail className="text-[oklch(0.82_0.17_195)]" size={28} />
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Neem contact met ons op
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                Voor vragen over het fonds, de structuur of het aanmeldproces kunt u ons bereiken via onderstaand e-mailadres. Wij streven ernaar om binnen twee werkdagen te reageren.
              </p>

              <a
                href="mailto:contact@mindovermatter.fund"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[oklch(0.82_0.17_195_/_8%)] border border-[oklch(0.82_0.17_195_/_30%)] rounded-xl hover:bg-[oklch(0.82_0.17_195_/_15%)] hover:border-[oklch(0.82_0.17_195_/_50%)] transition-all duration-300 group"
              >
                <Mail className="text-[oklch(0.82_0.17_195)]" size={20} />
                <span className="text-lg font-semibold text-[oklch(0.82_0.17_195)]">
                  contact@mindovermatter.fund
                </span>
              </a>

              <div className="mt-12 pt-8 border-t border-[oklch(0.25_0.02_250_/_50%)]">
                <p className="text-sm text-muted-foreground mb-4">
                  Bekijk ook onze documentatie voor gedetailleerde informatie over het fonds en de structuur.
                </p>
                <Link
                  href="/documentatie"
                  className="inline-flex items-center gap-2 text-[oklch(0.82_0.17_195)] font-medium hover:gap-3 transition-all duration-300"
                >
                  Naar documentatie
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
