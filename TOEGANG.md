# Toegang: holding page met login

Aanleiding: Legal en Affinity adviseren om niet in het openbaar marketing te
voeren. Publiek is daarom alleen een holding page te zien: *Mind over Matter,
Private Exempt Fund, Isle of Man*, met een inlogformulier. Wie het wachtwoord
heeft gekregen, vult een naam in en ziet daarna de volledige site zoals
die nu is, inclusief de documenten. Wie wanneer welke pagina's en documenten
bekijkt, staat in het bezoekersoverzicht.

## Hoe het werkt

| Bestand | Rol |
| --- | --- |
| `middleware.ts` | Poort voor elk verzoek (Vercel Routing Middleware). Zonder sessie: holding page of 401. |
| `public/holding.html` | De holding page. Los HTML-bestand, staat buiten de React-bundel. |
| `api/login.ts` | Controleert naam en wachtwoord, zet een ondertekende sessiecookie (30 dagen) en registreert de login. |
| `api/logout.ts` | Wist de cookie. De footer van de site heeft een link *Uitloggen*. |
| `api/visit.ts` | Hier meldt de site elke bekeken pagina, ook bij doorklikken binnen de site. |
| `api/bezoekers.ts` | Het bezoekersoverzicht, alleen met het beheerderswachtwoord. |
| `server/auth.ts` | Ondertekenen en controleren van de sessie, gedeeld door de bestanden hierboven. |
| `server/visits.ts` | Opslaan en ophalen van de bezoekregistratie (Upstash Redis). |
| `server/vite-dev-gate.ts` | Laat dit alles lokaal ook draaien in `npm run dev` en `npm run preview`. |

Belangrijke eigenschappen:

- **De beveiliging zit op de server, niet in de browser.** De JavaScript-bundel
  met alle teksten, de afbeeldingen en de PDF's in `/documents` worden zonder
  geldige sessie niet uitgeleverd. Een direct gedeelde PDF-link opent dus ook de
  holding page.
- **Standaard dicht.** Alleen wat in `PUBLIC` in `middleware.ts` staat is open:
  de holding page, het logo, de favicons, de achtergrondfoto en de login-routes.
  Een nieuwe pagina of een nieuw document is vanzelf afgeschermd.
- **Deep links blijven werken.** De holding page verschijnt op het adres dat
  iemand opvroeg. Na het inloggen komt die persoon direct op die pagina of dat
  document terecht.
- **Wachtwoord wijzigen logt iedereen uit.** De sessie is gekoppeld aan het
  wachtwoord waarmee is ingelogd. Na een nieuw `SITE_PASSWORD` en een redeploy
  moet iedereen het nieuwe wachtwoord invoeren.
- **Niet in zoekmachines.** De holding page heeft `noindex`. Wil je de naam wél
  vindbaar hebben, haal dan de `robots`-meta uit `public/holding.html` en de
  `X-Robots-Tag` uit `middleware.ts`.
- **Raden wordt afgeremd** met een seconde vertraging na elke foute poging. Dat
  is geen echte rate limit. Kies daarom een lange zin als wachtwoord en
  overweeg een rate-limitregel op `/api/login` in de Vercel Firewall.

## Bezoekersoverzicht

Open `/api/bezoekers` en log in met `ADMIN_PASSWORD` in plaats van het gedeelde
wachtwoord. Met dat wachtwoord zie je ook gewoon de hele site.

- **Per persoon**: aantal logins, bekeken pagina's, welke documenten geopend en
  het eerste en laatste bezoek.
- **Laatste activiteit**: de laatste 200 registraties met tijd, naam, soort en adres.

Goed om te weten:

- **De naam is wat de bezoeker zelf invult.** Die wordt niet gecontroleerd.
  Twee mensen met hetzelfde wachtwoord kunnen elkaars naam gebruiken. Pas met
  een eigen login per persoon (zie hieronder) weet je zeker wie het is.
- **Eigen bezoeken tellen niet mee**: wie met het beheerderswachtwoord inlogt,
  wordt niet geregistreerd.
- **Bewaard**: de laatste 10.000 registraties. Oudere vallen er vanzelf af.
- **Opslag**: Upstash Redis. Zonder gekoppelde database werkt de site gewoon,
  maar worden bezoeken niet bewaard. Het overzicht meldt dat dan.

## Instellen in Vercel

1. Project → **Settings → Environment Variables**. Zet voor *Production* en
   *Preview*:
   - `SITE_PASSWORD`: het wachtwoord dat je deelt.
   - `ADMIN_PASSWORD`: een ander wachtwoord, alleen voor jullie zelf.
   - `SESSION_SECRET`: willekeurig, minstens 32 tekens. Genereren met
     `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
2. **Storage → Upstash for Redis** (gratis tier) en koppel die aan dit project,
   net als bij untapd.nl. De variabelen daarvoor worden automatisch gezet. Let op:
   *Vercel Blob* is iets anders (opslag voor bestanden) en wordt hier niet
   gebruikt. De bestaande Upstash-database van untapd.nl koppelen kan ook: de
   bezoeken staan onder de sleutel `mom:visits` en zitten de verlanglijstjes niet
   in de weg.
3. Opnieuw deployen. Environment variables gelden pas vanaf de volgende deploy.
   Ontbreekt `SITE_PASSWORD` of `SESSION_SECRET`, dan blijft de site dicht en meldt
   het inlogformulier dat inloggen tijdelijk niet werkt.

## Eerst testen op een preview-deploy

Lokaal is alles getest, maar Vercel's eigen afhandeling nog niet. Push daarom
eerst naar een branch en controleer op de preview-URL:

- `/`, `/documentatie` en `/documents/InformationMemorandumEN.pdf` tonen zonder
  login de holding page.
- `/assets/index-….js` (de naam staat in de broncode van de pagina na inloggen)
  geeft zonder login een 401.
- Een fout wachtwoord geeft een melding, het juiste wachtwoord opent de pagina
  waar je was.
- *Uitloggen* in de footer brengt je terug naar de holding page.
- Na een testbezoek met het gedeelde wachtwoord staan login, pagina's en een
  geopende PDF in `/api/bezoekers` (ingelogd met het beheerderswachtwoord).

Pas daarna naar `main`/productie.

## Lokaal

```
cp .env.example .env.local   # en vul de wachtwoorden en het geheim in
npm run dev
```

`.env.local` staat niet in git. Lokaal staan bezoeken in het geheugen en
verdwijnen ze bij een herstart van de server.

## Dit document aanpassen

`TOEGANG.md` is gewone tekst in Markdown. Open het in een editor (VS Code,
Kladblok), schrijf erbij en sla op. De wijziging gaat mee met de volgende commit.
De opmaak die hier wordt gebruikt:

- `## Kop` voor een nieuwe sectie
- `- tekst` voor een opsommingsteken
- `**vet**` en `*cursief*`
- `` `code` `` voor bestandsnamen en variabelen

## Volgende stap: eigen login per belegger

De sessie heeft al een veld `sub` (nu altijd `"shared"`) en een `name`. Voor
eigen profielen wordt `sub` een gebruikers-id en komt de naam uit het account in
plaats van uit het formulier. Het bezoekersoverzicht blijft dan gewoon werken,
maar dan met geverifieerde namen. De poort in `middleware.ts` en de cookie blijven
hetzelfde. Wat erbij komt:

- **Een gebruikerslijst** met e-mailadres en rol, bijvoorbeeld in Upstash Redis
  zoals bij de verlanglijstjes op untapd.nl, of in een database.
- **Een andere manier van inloggen**: een inloglink per e-mail (magic link) of een
  eigen wachtwoord per persoon, in `api/login.ts`. Een externe dienst (Clerk,
  Auth0, WorkOS) kan ook. Die zet dan de sessie en `middleware.ts` leest die.
- **Profielpagina's** in de React-app, bijvoorbeeld `/profiel`, die via een
  `api/`-functie alleen de gegevens van de ingelogde `sub` ophalen.

Het gedeelde wachtwoord kan in die overgangsfase naast de persoonlijke logins
blijven bestaan.

## Na te lopen door Legal / Affinity

- De teksten op de holding page: de aanduiding *Private Exempt Fund*, de zin
  over uitnodiging, de disclaimer onderaan en of het contactadres erop mag.
- Of bij het inloggen een expliciet vinkje nodig is, bijvoorbeeld *ik ben
  persoonlijk uitgenodigd* of *ik ben professioneel belegger*. Nu staat het als
  zin onder de knop.
- **Privacy (AVG)**: de site legt naam, tijdstip en bekeken pagina's en
  documenten vast. De holding page meldt dat in één zin onder de knop. Laat
  nagaan of dat volstaat, of er een privacyverklaring bij moet en of de
  bewaartermijn (laatste 10.000 registraties) acceptabel is.
- De inhoud achter de login is ongewijzigd. Die is nog niet nagelopen op
  fondsterminologie (zie punt 7 in `MIGRATIE-NAAR-LIMITED.md`).
