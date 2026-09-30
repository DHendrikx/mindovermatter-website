/*
 * Het volledige rapport: de markdown van de stappen, opnieuw geordend in de
 * volgorde van de methodiek (secties 1-12), met de kerncijfers als bijlage.
 */
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PhaseName, Report } from "../../server/research/types";

interface Section {
  number: number | null;
  markdown: string;
}

const PHASE_ORDER: PhaseName[] = ["synthesis", "dossier", "bull", "bear", "committee", "valuation"];

/** Splitst markdown op "## N. Titel"-koppen. */
function splitSections(markdown: string): Section[] {
  const lines = markdown.split(/\r?\n/);
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const line of lines) {
    const heading = line.match(/^##\s+(\d{1,2})[.)]\s+/);
    const otherHeading = !heading && /^##\s+/.test(line);
    if (heading || otherHeading) {
      if (current) sections.push(current);
      current = { number: heading ? Number(heading[1]) : null, markdown: line };
    } else if (current) {
      current.markdown += `\n${line}`;
    } else if (line.trim()) {
      current = { number: null, markdown: line };
    }
  }
  if (current) sections.push(current);
  return sections;
}

export function assembleReport(report: Report): { numbered: Section[]; appendix: Section[] } {
  const numbered: Section[] = [];
  const appendix: Section[] = [];
  for (const phase of PHASE_ORDER) {
    const markdown = report.phases[phase]?.markdown;
    if (!markdown) continue;
    for (const section of splitSections(markdown)) {
      if (section.number !== null) numbered.push(section);
      else appendix.push(section);
    }
  }
  numbered.sort((a, b) => (a.number ?? 99) - (b.number ?? 99));
  return { numbered, appendix };
}

const components: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="report-table">
      <table>{children}</table>
    </div>
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

export default function ReportDocument({ report }: { report: Report }) {
  const { numbered, appendix } = assembleReport(report);
  const { meta } = report;
  if (!numbered.length && !appendix.length) {
    return <p className="text-muted-foreground">Nog geen rapporttekst. De eerste stap loopt nog.</p>;
  }
  return (
    <article className="report-prose" lang={meta.language}>
      <header className="report-titleblock">
        <p className="report-kicker">Analyst Research</p>
        <h1>
          {meta.displayName}
          {meta.ticker ? ` · ${meta.ticker}` : ""}
        </h1>
        <p className="report-meta">
          {new Date(meta.createdAt).toLocaleDateString(meta.language === "nl" ? "nl-NL" : "en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>
      {numbered.map((section, index) => (
        <section key={`n-${index}`}>
          <Markdown>{section.markdown}</Markdown>
        </section>
      ))}
      {appendix.length > 0 && (
        <section className="report-appendix">
          {appendix.map((section, index) => (
            <Markdown key={`a-${index}`}>{section.markdown}</Markdown>
          ))}
        </section>
      )}
      <p className="report-disclaimer">
        {meta.language === "nl"
          ? "Interne analyse, opgesteld met behulp van AI (Claude) op basis van openbare bronnen. Geen beleggingsadvies. Controleer cijfers vóór gebruik."
          : "Internal analysis prepared with the help of AI (Claude) from public sources. Not investment advice. Verify figures before use."}
      </p>
    </article>
  );
}
