/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * 404 page: Branded dark theme, Dutch and English copy
 */
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { FadeIn, CyanLine } from "@/components/AnimatedSection";
import { useLang, usePath } from "@/i18n";

const COPY = {
  nl: {
    title: "Pagina niet gevonden",
    text: "De pagina die u zoekt bestaat niet of is verplaatst.",
    back: "Terug naar home",
  },
  en: {
    title: "Page not found",
    text: "The page you are looking for does not exist or has been moved.",
    back: "Back to home",
  },
};

export default function NotFound() {
  const t = COPY[useLang()];
  const path = usePath();

  return (
    <div className="section-bg min-h-[80vh] flex items-center">
      <div className="container max-w-2xl mx-auto text-center py-20">
        <FadeIn>
          <CyanLine className="mx-auto mb-8" />
          <div className="text-8xl lg:text-9xl font-extrabold text-[oklch(0.82_0.17_195_/_20%)] mb-4">
            404
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            {t.text}
          </p>
          <Link
            href={path("home")}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[oklch(0.82_0.17_195)] text-[oklch(0.13_0.025_250)] font-semibold rounded-lg hover:bg-[oklch(0.85_0.15_195)] transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.82_0.17_195_/_25%)]"
          >
            <ArrowLeft size={18} />
            {t.back}
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
