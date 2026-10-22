/*
 * Design: "Capital Discipline" — Dark Kinetic Finance
 * 404 page: Branded dark theme, Dutch copy
 */
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { FadeIn, CyanLine } from "@/components/AnimatedSection";

export default function NotFound() {
  return (
    <div className="section-bg min-h-[80vh] flex items-center">
      <div className="container max-w-2xl mx-auto text-center py-20">
        <FadeIn>
          <CyanLine className="mx-auto mb-8" />
          <div className="text-8xl lg:text-9xl font-extrabold text-[oklch(0.82_0.17_195_/_20%)] mb-4">
            404
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Pagina niet gevonden
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            De pagina die u zoekt bestaat niet of is verplaatst.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[oklch(0.82_0.17_195)] text-[oklch(0.13_0.025_250)] font-semibold rounded-lg hover:bg-[oklch(0.85_0.15_195)] transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.82_0.17_195_/_25%)]"
          >
            <ArrowLeft size={18} />
            Terug naar home
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
