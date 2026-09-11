# Geparkeerde volledige site

De site draait op dit moment in "stille" modus: alleen `src/pages/Holding.tsx` is
bereikbaar. Alles in deze map is de volledige site zoals die live stond op
mindovermatter.fund.

**Deze map wordt door geen enkel bestand geïmporteerd.** Vite bundelt alleen wat
vanaf `src/main.tsx` bereikbaar is, dus deze pagina's staan niet in `dist/` en
zijn niet op te vragen door bezoekers — ook niet via de browserconsole of de
bron van de JS-bundel. De code blijft wel gewoon in de repo staan.

## Weer aanzetten (na de brokerrelatie)

1. In `src/App.tsx`: vervang de `Router`-component door
   `import FullSiteRouter from "./site-full/Router"` en render die. Zet
   tegelijk de `<MotionConfig reducedMotion="user">`-wrapper terug — die is
   verwijderd omdat de holding page niet animeert, en zonder hem draaien de
   fade-ins van deze pagina's niet zoals bedoeld.
2. Zet de PDF's terug: `git mv assets-private/documents public/documents`.
   Zolang dat niet gebeurt zijn de downloadlinks op
   `site-full/pages/Documentation.tsx` dood (`/documents/*.pdf`).
3. Loop de teksten na vóór publicatie — dit is de content die brokers als
   fondsuiting lazen. In elk geval:
   - `pages/Home.tsx` — "10%+" doelrendement, "0% winstbelasting binnen het
     fonds", "bruto renderen".
   - `pages/Structure.tsx` — onboarding met "uitgifte van aandelen in het fonds",
     partneroverzicht.
   - `pages/Documentation.tsx` — Information Memorandum, Investor Application.
   - `components/Layout.tsx` — de AFM-balk bovenin en de navigatie
     ("Fondsbeheerder", "Documentatie").
4. `npm run check && npm run build` om te controleren dat alles nog compileert.

## Wat er al is aangepast

- Alle e-mailadressen staan al op `contact@mindovermatter.limited`.
- `pages/Structure.tsx` importeert `TaxFlowDiagram` nu vanaf
  `@/site-full/components/TaxFlowDiagram`.
- `components/AnimatedSection.tsx` is blijven staan in `src/components/` en
  wordt door deze pagina's gebruikt; die is nu nergens anders in gebruik.
