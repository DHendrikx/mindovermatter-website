import { ExternalLink } from "lucide-react";
import { PHASES, type Report } from "../../server/research/types";
import { PHASE_LABELS } from "./labels";

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function SourcesPanel({ report }: { report: Report }) {
  const groups = PHASES.map((phase) => ({ phase, sources: report.phases[phase]?.sources ?? [] })).filter(
    (group) => group.sources.length > 0,
  );

  if (!groups.length) {
    return <p className="text-muted-foreground">Nog geen bronnen. Die verschijnen zodra een stap met webzoekopdrachten klaar is.</p>;
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Per stap de pagina's die de analist heeft gevonden. Bronnen waar de tekst expliciet naar verwijst zijn
        gemarkeerd als <span className="font-semibold text-[oklch(0.82_0.17_195)]">geciteerd</span>.
      </p>
      {groups.map(({ phase, sources }) => {
        const sorted = [...sources].sort((a, b) => Number(b.cited) - Number(a.cited));
        return (
          <section key={phase}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[oklch(0.82_0.17_195)]">
              {PHASE_LABELS[phase]} <span className="font-normal text-muted-foreground">({sources.length})</span>
            </h3>
            <ul className="divide-y divide-[oklch(0.25_0.02_250_/_60%)] rounded-xl border border-[oklch(0.25_0.02_250_/_60%)]">
              {sorted.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[oklch(0.18_0.025_250)] transition-colors"
                  >
                    <ExternalLink size={14} className="mt-1 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{source.title}</span>
                      <span className="block text-xs text-muted-foreground">{hostname(source.url)}</span>
                    </span>
                    {source.cited && (
                      <span className="shrink-0 rounded bg-[oklch(0.82_0.17_195_/_12%)] px-1.5 py-0.5 text-[11px] font-semibold text-[oklch(0.82_0.17_195)]">
                        geciteerd
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
