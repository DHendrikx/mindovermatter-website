# Analyst Research (interne module)

Een interne omgeving op `/research` die de analyst-prompt automatisch uitvoert voor een
richting of ticker (bijvoorbeeld "Energy", "XLE", "NVDA"). Het resultaat is een volledig
rapport, een A4 one-pager (printbaar als PDF, downloadbaar als HTML) en een archief.

De module is **niet publiek**. Er staat geen link naar op de holdingpagina, `/research` en
`/api` krijgen een noindex-header, alle API-routes vereisen het teamwachtwoord, en de
rapportinhoud komt nooit in de publieke JavaScript-bundel (de module wordt lazy geladen).
Dat hoort zo te blijven: de publieke site staat bewust stil, zie `MIGRATIE-NAAR-LIMITED.md`.

## Eenmalig instellen op Vercel

1. **Anthropic API-key**: maak een key aan op console.anthropic.com en zet er tegoed op
   (ongeveer $40–50 geeft hogere rate limits). Zet hem in Vercel → Project → Settings →
   Environment Variables als `ANTHROPIC_API_KEY`, voor Production en Preview.
2. **Opslag**: Vercel → Storage → Marketplace → *Upstash for Redis* → aanmaken en koppelen
   aan dit project. De variabelen (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) komen er
   automatisch bij.
3. **Toegang**: voeg `RESEARCH_PASSWORD` (teamwachtwoord, minimaal 8 tekens) en
   `RESEARCH_SESSION_SECRET` (willekeurig, minimaal 16 tekens) toe. Een geheim genereren:
   `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
4. **Opnieuw deployen** zodat de variabelen actief worden.

Optioneel: `RESEARCH_MODEL` om een ander model te gebruiken (standaard `claude-opus-5-5`).

## Gebruik

- Ga naar `https://<domein>/research`, log in met het teamwachtwoord.
- Vul een richting of ticker in, eventueel een eigen these, kies de taal en start.
- De analyse loopt in zeven stappen; bull-, bear- en waarderingsanalist werken tegelijk.
  Duur meestal 8–15 minuten, kosten naar schatting $2–5. De werkelijke kosten staan bij
  het rapport.
- Je kunt het tabblad sluiten: een lopende stap maakt zich op de server af en wordt
  bewaard. Open het rapport later en klik op *Analyse hervatten*.
- *One-pager als PDF* en *Rapport als PDF* openen het printvenster; kies daar
  "Opslaan als PDF". *HTML* downloadt de one-pager als zelfstandig bestand.
- *Opnieuw analyseren* maakt een nieuw rapport met dezelfde input; het oude blijft staan,
  zodat je ontwikkelingen in de tijd kunt vergelijken.

## Hoe het werkt

| Stap | Wat | Webzoekopdrachten |
|---|---|---|
| Classificatie | aandeel, ETF, grondstof, thema of sector; kiest het template | geen |
| 1 Dossier | wat de belegging is, marktsituatie, kerncijfers met datum en bron | max. 12 (+4 fetch) |
| 2 Bull | sterkste bull-case | max. 4 |
| 3 Bear | onafhankelijke bear-case (ziet de bull-case niet) | max. 4 |
| 4 Waardering | DCF/multiples/reverse-engineering en Wall Street, of investable expressions | max. 8 (+2 fetch) |
| 5 Onafhankelijke analist | oordeel, Bull XX% / Bear XX% | geen |
| 6 Synthese | samenvatting, alternatieven, risico's, dashboard, conclusie | geen |
| 7 One-pager | gestructureerde data voor het A4-template | geen |

- Elke stap is één Vercel Function-aanroep (`api/research/phase.ts`) van maximaal 300 s,
  het maximum op het Hobby-plan. De stap streamt voortgang naar de browser en slaat het
  resultaat daarna op in Redis.
- Model: Claude via de Anthropic API, met web search en web fetch. Als een
  safety-classifier een stap weigert, draait de API hem automatisch op een aanbevolen
  ander model (server-side fallback).
- De one-pager is een vast template (`src/research/onepager/`). De lettergrootte schaalt
  automatisch terug tot alles op één A4 past; op mobiel wordt de inhoud gestapeld.

## De methodiek aanpassen

De prompt staat in `server/research/prompt.ts` (de gedeelde methodiek) en
`server/research/phases.ts` (de instructies en limieten per stap). Houd `prompt.ts`
stabiel en zonder datums of variabelen: die tekst wordt gecachet, wat kosten bespaart.

## Lokaal ontwikkelen

```
npm install
cp .env.example .env.local   # vul RESEARCH_PASSWORD, RESEARCH_SESSION_SECRET en ANTHROPIC_API_KEY in
npm run dev                  # http://localhost:5173/research
npm run check
npm run build
```

Zonder Redis-variabelen bewaart de lokale versie rapporten in `.data/research/`
(staat in `.gitignore`).
