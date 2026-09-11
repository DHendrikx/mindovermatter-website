# Migratie mindovermatter.fund → mindovermatter.limited

Aanleiding: brokers lazen de uitingen op de site als die van een beleggingsfonds,
terwijl Mind over Matter technisch geen fonds is. De site staat daarom tijdelijk
in "stille" modus en verhuist naar een domein zonder `.fund`-extensie.

## Wat er in de code is gebeurd

- **Stille homepage**: `src/pages/Holding.tsx` — één scherm in huisstijl met
  logo, drie principes, contactadres en een regel dat de site geen aanbod of
  uitnodiging bevat. Geen navigatie, geen rendement, geen structuur.
- **Volledige site geparkeerd**: alles staat in `src/site-full/`. Die map wordt
  nergens geïmporteerd en zit daardoor niet in de gebouwde bundel — de teksten
  zijn niet op te vragen door bezoekers. Zie `src/site-full/README.md`.
- **Oude URL's**: `/filosofie`, `/team`, `/structuur`, `/documentatie`,
  `/contact`, `/disclaimer` en `/fondsbeheerder` sturen door naar `/`.
- **PDF's offline**: `public/documents/` → `assets-private/documents/`. Deze
  stonden publiek op `/documents/*.pdf` en waren rechtstreeks op te vragen —
  ook zonder link vanaf de site. Het gaat om het Information Memorandum (NL/EN),
  de Investor Application en het pitchdeck.
- **E-mail**: overal `contact@mindovermatter.limited`.
- **Metadata**: `index.html` heeft een neutrale beschrijving, canonical en
  og-tags op `https://mindovermatter.limited/`.
- **Geen animatie op de holding page**: de rest van de site fade't tekst in met
  framer-motion, waardoor de inhoud op `opacity: 0` staat tot JavaScript de
  animatie draait. Voor een pagina die het in linkpreviews en screenshots altijd
  moet doen is dat een onnodig risico, dus deze pagina is statisch. Daarmee is
  framer-motion volledig uit de bundel: 328 kB → 204 kB (gzip 106 → 65 kB).

## Wat er buiten de code nog moet gebeuren

Het domein staat bij **Porkbun**, de hosting bij **Vercel**.

1. **`mindovermatter.limited` registreren bij Porkbun** (naast de bestaande
   `.fund`, die je nog even aanhoudt voor de redirect).
2. **Mailbox aanmaken**: `contact@mindovermatter.limited`. Dit adres staat nu
   op de site — zolang de mailbox niet bestaat, bouncen berichten. Doe dit
   vóór of gelijk met de livegang.
3. **Vercel — nieuw domein**: bij dit project → Settings → Domains →
   `mindovermatter.limited` toevoegen en als *primair* domein instellen.
   Vercel geeft de records die je bij Porkbun onder *DNS Records* zet:
   - `A` op `@` (root) → het IP dat Vercel noemt, meestal `76.76.21.21`
   - `CNAME` op `www` → `cname.vercel-dns.com`
4. **Porkbun — 301 vanaf `.fund`**: dit kan op twee manieren. Doe het in
   Vercel, niet met Porkbuns eigen URL Forwarding: Porkbun forward't standaard
   met een 302 en dat vertelt Google niet dat de verhuizing permanent is.
   Houd `mindovermatter.fund` dus in Vercel gekoppeld aan hetzelfde project en
   zet er "Redirect to mindovermatter.limited" op, met status **301**.
5. **Let op het subdomein**: `divtalk.mindovermatter.fund` draait op hetzelfde
   domein en breekt zodra `.fund` wordt doorgestuurd of losgekoppeld. Beslis
   eerst of die meeverhuist naar `divtalk.mindovermatter.limited`.
6. **Google Search Console**: `mindovermatter.limited` toevoegen en de
   adreswijziging melden, zodat de oude fondsteksten sneller uit de index gaan.
7. **Overige uitingen nalopen** op `.fund` en fondsterminologie: e-mail-
   handtekeningen, LinkedIn, visitekaartjes, pitchdeck, brokeraanvragen en de
   documenten in `assets-private/documents/`.

## Ontwikkelen

```
npm install
npm run dev      # lokaal bekijken
npm run check    # TypeScript
npm run build    # productiebuild
```
