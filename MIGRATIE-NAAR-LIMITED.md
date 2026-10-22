# Migratie mindovermatter.fund → mindovermatter.limited

Aanleiding: brokers lazen de uitingen op de site als die van een beleggingsfonds,
terwijl Mind over Matter technisch geen fonds is. De site verhuist daarom naar
een domein zonder `.fund`-extensie.

## Wat er in de code is gebeurd

- **Volledige site terug**: de tijdelijke holding page is weer weg. Alle pagina's
  staan weer in `src/pages/` en `src/components/`, gelijk aan de versie die op
  mindovermatter.fund live stond. De teksten zijn nog niet nagelopen op
  fondsterminologie (zie punt 7 hieronder).
- **PDF's**: staan weer in `public/documents/` en zijn dus publiek op te vragen
  via `/documents/*.pdf`, zoals voorheen.
- **E-mail**: overal `contact@mindovermatter.limited`.
- **Metadata**: `index.html` heeft de oorspronkelijke beschrijving, met
  canonical en og-tags op `https://mindovermatter.limited/`.

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
