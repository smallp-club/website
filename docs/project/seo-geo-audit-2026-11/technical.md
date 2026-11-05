# Technisches SEO-Audit: small p club (V2, Branch v2-redesign)

Stand: 2026-11-03. Prüfobjekt: Produktions-Build auf http://localhost:3100 und Code in /Users/kethe.theermann/smallpclub. Es wurde nichts im Repo geändert.
Beleg-Kürzel: `H:` = HTTP-Antwort, `C:` = Code. Im Build, dessen Ausgabe ich geprüft habe, sind alle Seiten absichtlich noindex. Bewertet wird deshalb: "Was bricht in dem Moment, in dem noindex und robots-Sperre fallen?"

**Technischer Score (Launch-Tauglichkeit heute): 52/100.** Nach Umsetzung der Critical- und High-Punkte sind realistisch 85+ erreichbar.

| Kategorie | Status | Anmerkung |
|---|---|---|
| Crawlability | FAIL (Launch) | Launch-robots.ts hat Lücken. Sitemap und X-Robots-Tag widersprechen sich bei /mit-glied. |
| Indexierbarkeit | FAIL | Globaler canonical zeigt auf die Startseite. Zusätzlich liegt noindex auf Seitenebene (siehe C1). |
| Security-Header | PASS | CSP mit Nonce, COOP/CORP, no-referrer, X-Frame-Options. HSTS fehlt im lokalen Build und kommt in Produktion von Vercel/Cloudflare. Verifizieren. |
| URL-Struktur | PASS mit Mängeln | Saubere, kurze Slugs. Trailing Slash wird mit 308 aufgelöst, /de wird mit 307 auf / geleitet. /en liefert deutschen Inhalt. |
| Mobile | PASS (aus Source) | viewport korrekt gesetzt. Kein Befund aus dem HTML. |
| CWV (aus Source) | Teilweise | Alles dynamisch gerendert. Hero-Bild in 3840 w ohne sichtbares priority-Signal geprüft: nur ein `<img>` im SSR-HTML. Keine Lab-Messung durchgeführt. |
| Structured Data | PASS mit Mängeln | Organization, WebSite, FAQPage, Article, ScholarlyArticle und BreadcrumbList sind vorhanden. Details unten. |
| JS-Rendering | PASS | Inhalt steht im SSR-HTML. Jede Seite hat genau ein `<h1>`. |
| IndexNow | nicht implementiert | Low. Bing/Yandex/Naver sind für die Zielgruppe zweitrangig. Optional. |

---

## CRITICAL (Launch-Blocker)

### C1. Globaler canonical auf die Startseite, plus noindex auf Seitenebene, die der Launch-Switch NICHT löst
- Beleg C: `src/app/layout.tsx` Zeilen 14-21 setzen `robots: {index:false}` und `alternates.canonical: siteUrl`. Metadata wird vererbt, deshalb trägt jede Seite `<link rel="canonical" href="https://smallp.club"/>`.
- Beleg H: `pages/mythen_koerper-als-bauplan.html`, `shop.html`, `mit-glied.html`, `stimmen.html`, `unterstuetzen.html` und weitere haben alle `canonical=https://smallp.club`. Auch `og:url` ist überall `https://smallp.club`.
- Wirkung: Google behandelt das als Signal, alle Unterseiten auf die Startseite zu konsolidieren. Ergebnis wäre faktisch "nur die Startseite im Index".
- Zusätzlich ist `robots: {index:false}` nicht nur global gesetzt, sondern auch einzeln in diesen Dateien. Wer nur das Root-Layout umstellt, lässt diese Seiten auf noindex:
  - `src/app/[locale]/mythen/[slug]/page.tsx` Z. 85 und 91. Das sind alle 6 Mythen-Detailseiten, also der Kerninhalt.
  - `src/app/[locale]/datenschutz/page.tsx` Z. 10
  - `src/app/[locale]/impressum/page.tsx` Z. 10
  - `src/app/[locale]/kontakt/page.tsx` Z. 10
  - `src/app/[locale]/privacy/anonym-bleiben/page.tsx` Z. 12
  - `src/app/[locale]/partner/[slug]/page.tsx` Z. 7 und `magazin/[slug]/page.tsx` Z. 7 (Detailseiten, voraussichtlich bewusst noch noindex)
- Fix:
  1. Aus dem Root-Layout `canonical` entfernen. In jeder Seite per `generateMetadata` setzen: `alternates: { canonical: <locale === 'de' ? '/pfad' : '/en/pfad'>, languages: {...} }`. Mit `metadataBase` genügen relative Pfade.
  2. Eine zentrale Konstante `INDEXABLE = process.env.NEXT_PUBLIC_LAUNCHED === '1'` einführen. Root-Layout und die oben gelisteten Seiten lesen sie. Sonst muss man beim Launch 8 Dateien einzeln anfassen.
  3. Legal-Seiten (Impressum, Datenschutz, Kontakt) dürfen indexierbar sein. Impressum und Datenschutz sind für die Auffindbarkeit nicht kritisch, aber kein Schaden. noindex ist hier ebenfalls vertretbar. Entscheidung bewusst treffen, die Sitemap listet sie jedoch derzeit (Widerspruch, siehe H2).
  4. Als Test nach dem Switch `curl -s URL | grep -E 'canonical|robots'` auf allen Routen aus `urls.txt`.

### C2. Launch-robots.ts: Variante ist nicht launch-tauglich, so wie sie unter dem `return` steht
Die Baustellen-Variante (`Disallow: /`) ist als Baustelle korrekt. H: `robots.txt` liefert `User-agent: *` / `Disallow: /`. Die auskommentierte Launch-Variante hat diese Mängel:
- **Locale-Präfix fehlt.** Die Disallow-Pfade gelten nur für `/mit-glied/...`, `/auth/` usw. ohne Präfix. `/en/mit-glied/eingang`, `/en/auth/` und `/en/api` bleiben crawlbar. Fix: jeden Pfad zusätzlich mit `/en`-Präfix eintragen, z. B. per `flatMap(p => [p, '/en' + p])`.
- **`/mit-glied/willkommen`, `/mit-glied/post`, `/mit-glied/werkstatt`, `/mit-glied/keller`, `/mit-glied/stories` fehlen** (laut ROADMAP geplant, teils vorhanden). Sauberer: `Disallow: /mit-glied/` zusammen mit `Allow: /mit-glied$` für die öffentliche Pre-Login-Seite. Das schließt auch künftige Unterseiten automatisch aus. Wichtig: Googles längste Regel gewinnt, `Allow: /mit-glied$` ist deshalb spezifischer als `Disallow: /mit-glied/`.
- **`/auth/einloggen`** liegt unter `/auth/`. In der Liste vorhanden, aber ohne `/en/`.
- **Doppelte Regelgruppen für 12 Bots** sind redundant. Ein Bot, der eine eigene Gruppe hat, ignoriert `*`. Das ist hier harmlos, weil die Listen identisch sind. Eine spätere Änderung an `*` wird aber leicht vergessen. Fix: Eine Gruppe mit `userAgent: [...]` als Array. Next.js unterstützt Arrays.
- **`host: baseUrl`** ist eine Yandex-Direktive, die längst veraltet ist. Google ignoriert sie. Entfernen.
- **`Bingbot` und `Applebot` in der "AI-Bot"-Liste** sind klassische Suchcrawler. Sie brauchen keine Sonderbehandlung, sind aber unschädlich. `Google-Extended` ist KEIN Crawler-User-Agent, sondern ein reiner robots.txt-Token. Der Eintrag ist korrekt und wirkt wie gewünscht.
- **Cloudflare-Hinweis:** Cloudflare kann bei aktivem "Managed robots.txt" / AI-Crawl-Control eigene Regeln voranstellen und so die Brand-Entscheidung "AI-Bots erlaubt" überschreiben. Nach dem Launch die ausgelieferte `https://smallp.club/robots.txt` prüfen (H: es soll genau der Inhalt aus robots.ts erscheinen).
- **Konflikt mit noindex:** Disallow und noindex gleichzeitig verhindern, dass Google das noindex je sieht. Für URLs, die schon verlinkt sind, kann ein "Indexiert, obwohl durch robots.txt blockiert"-Eintrag ohne Snippet entstehen. Für /mit-glied/* ist das akzeptabel (Outing-Schutz geht vor). Bewusst so lassen und dokumentieren.
- Fix-Skizze:
```ts
const disallow = ['/mit-glied/', '/auth/', '/api/', '/preview/', '/components-library/']
  .flatMap(p => [p, `/en${p}`]);
return {
  rules: [{ userAgent: '*', allow: ['/', '/mit-glied$', '/en/mit-glied$'], disallow }],
  sitemap: 'https://smallp.club/sitemap.xml',
};
```
  (Bots ohne Sonderregel brauchen keine eigene Gruppe. Wenn Cloudflare-Bot-Fight blockiert, ist das in Cloudflare zu lösen, nicht in robots.txt.)

### C3. Sprachvarianten: /en liefert deutschen Inhalt, hreflang zeigt darauf
Korrektur zur Annahme "/en/* gibt 404":
- H: `/en` = 200, `/en/club` = 200, `/en/mythen` = 200. Die Seiten haben `<html lang="en">`, der Inhalt ist aber DEUTSCH (H1 auf `/en/club`: "ein club ohne maßband."; Title auf `/en` identisch zur deutschen Startseite).
- H: `/en/myths` = 404. Ein `pathnames`-Mapping fehlt in `src/i18n/routing.ts`, das IA.md vorsieht (`/mythen` -> `/myths`). Englische Pfade existieren also nicht, nur deutsche Pfade unter `/en`.
- hreflang im HTML: `de-DE` -> `https://smallp.club`, `en-US` -> `https://smallp.club/en`, `x-default` -> `https://smallp.club`. Dasselbe steht in `src/app/layout.tsx` Z. 17-20. Es ist für alle Unterseiten gleich, zeigt also immer auf die Startseite. Das ist falsch, weil hreflang pro Seite auf die jeweilige Gegenstück-URL zeigen muss.
- H: HTTP-Link-Header (von next-intl, `alternateLinks`) nennt `hreflang="de"` und `hreflang="en"` mit Host aus der Request (lokal `localhost:3100`; in Produktion `smallp.club`). Er widerspricht dem HTML (`de-DE`/`en-US` gegen `de`/`en`). Widersprüchliche Signale führen dazu, dass Google beides ignoriert.
- Zusatz: `Accept-Language: en-US` auf `/` ergibt 307 nach `/en`. Cookie `NEXT_LOCALE=en` ergibt 307 nach `/en/club`. Besucher mit englischem Browser sehen also deutschen Inhalt unter `/en`. Das widerspricht auch der IA-Doktrin "keine automatischen Sprach-Redirects" (IA.md §4).
- Fix, Option A (empfohlen bis EN-Texte fertig sind): EN ausschalten. `locales: ['de']`, in `routing.ts` `localeDetection: false`, hreflang komplett entfernen, `/en` entfernt oder 404. Dann gibt es kein Duplicate-Content-Problem und kein Cookie.
- Fix, Option B: EN erst mit echter Übersetzung aktivieren. `pathnames` ergänzen, pro Seite `alternates.languages` mit `de` und `en` auf die jeweilige URL setzen, `localeDetection: false`, `x-default` auf die deutsche Seite. Next-intl-`alternateLinks` abschalten (`alternateLinks: false`), damit nur ein Signal übrig bleibt.
- Nicht indexieren, was nicht übersetzt ist: `/en/*` mit deutschem Inhalt darf nicht in die Sitemap und braucht noindex, bis es übersetzt ist.

---

## HIGH

### H1. Titel-Template doppelt, Mythen-Seiten haben identische Titel und Beschreibungen
- Beleg C: `src/app/layout.tsx` Z. 10 `template: '%s — small p club'`. Seiten setzen zusätzlich `title: 'club. · small p club'`.
- Beleg H: `<title>club. · small p club — small p club</title>`. Ebenso `mythen.`, `magazin.`, `partner.`, `shop.`, `mit-glied.`, `stimmen.`, `unterstützen.`. Nur `kontakt — small p club` ist korrekt.
- Beleg H: Alle sechs Mythen-Detailseiten haben `<title>mythos. · small p club — small p club</title>` und dieselbe Description "no measure, no pressure. ein mythos, ein fakt, eine quelle." (`mythen/[slug]/page.tsx` Z. 84-94). Die Variable `myth` wird abgefragt, aber nicht benutzt.
- Fix: Seiten-Titel ohne Suffix setzen (`title: 'club.'`) und das Template den Rest machen lassen. Für Mythen: Nach Launch zählt jede Seite einzeln in der Suche. Der Outing-Schutz (neutrale Slugs, generisches OG-Bild) betrifft Link-Vorschauen und Browserverlauf. Der `<title>` landet ebenfalls im Browserverlauf. Empfehlung: Titel neutral, aber eindeutig, z. B. `mythos 1 von 6. · small p club`, Description aus dem Feld `teaser` der Daten. Das ist ein Kompromiss zwischen Eindeutigkeit und Privatsphäre. Die Entscheidung liegt bei Kethe.
- Großschreibung und Punkt im Title ("club.") sind Markenstil. Für SERP-Titel akzeptabel, aber "mythos." ist als Snippet kaum aussagekräftig.

### H2. Sitemap: Widersprüche, Lücken, lastmod
- Beleg C: `src/app/sitemap.ts`. H: `sitemap.xml` liefert 17 URLs.
- **/mit-glied** steht in der Sitemap, bekommt aber `X-Robots-Tag: noindex, nofollow` (H: `curl -I /mit-glied`; Regex in `src/proxy.ts` Z. 72-76 trifft den Präfix `mit-glied`, also auch die öffentliche Seite). Eine Sitemap-URL mit noindex wird in der Search Console als Fehler gemeldet. Entscheiden:
  - Soll /mit-glied indexierbar sein (laut IA.md ja: "public + Login-Form"), dann Regex auf `/mit-glied/` mit Slash umstellen (`^\/(?:en\/)?mit-glied\/`) und die Seite selbst nicht blocken.
  - Soll sie nicht indexiert werden, dann aus der Sitemap entfernen. Die CLAUDE.md-Aussage "/mit-glied/* noindex" lässt beides zu. Die Roadmap nennt /mit-glied selbst als indexierbar.
- **Legal-Seiten** (`/datenschutz`, `/impressum`, `/kontakt`, `/privacy/anonym-bleiben`) stehen in der Sitemap, sind aber per `robots: {index:false}` markiert (siehe C1). Entweder noindex entfernen oder aus der Sitemap nehmen.
- **/unterstuetzen und /shop fehlen** (H: beide 200). /shop ist ein Platzhalter ("der shop ist noch nicht offen"). Weglassen ist richtig, solange er keinen Inhalt hat (Thin Content). /unterstuetzen laut FUNDING_CONCEPT erst nach Empfänger-Freigabe. Beide bewusst entscheiden und im Kommentar des Codes festhalten.
- **/agb**: nicht gelistet, passt (post-Shop).
- **lastModified = `new Date()` auf Modulebene (`const now`, Z. 22)**: In H zeigt jede URL denselben Zeitstempel (2026-11-03T19:48:55Z). Google lernt, dass lastmod unzuverlässig ist, und ignoriert es. Fix: statische ISO-Daten pro Seite (aus Content-Daten, z. B. `myth.updatedAt`), oder lastmod weglassen. Falsch ist schlimmer als fehlend. `changefreq` und `priority` ignoriert Google; entfernen oder ignorieren.
- **/magazin** ist laut llms.txt "noch leer". Dünne Seite mit `weekly` in der Sitemap. Bis zum ersten Essay entweder noindex oder aus der Sitemap.
- Keine hreflang-Alternates in der Sitemap. Nur nötig, wenn EN kommt (siehe C3).
- Die Sitemap-Route selbst wird dynamisch ausgeliefert (siehe M1). Sie sollte statisch sein (`export const dynamic = 'force-static'`), da sie keine Request-Daten braucht.

### H3. Alle Routen dynamisch, `Cache-Control: no-store`
- Beleg H: `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` auf `/` und allen Seiten. Build zeigt ƒ (dynamic).
- Ursache C: `src/app/[locale]/layout.tsx` Z. 103 `(await headers()).get('x-nonce')` im Layout. Dazu `export const dynamic = 'force-dynamic'` auf `mythen/[slug]/page.tsx` Z. 75-78 (Kommentar dort: Layout liest Cookies, Mitglieds-Pille).
- Wirkung: Kein CDN-Caching (weder Vercel noch Cloudflare). Jeder Request läuft als Funktion in fra1. Der TTFB ist lokal gut (8-13 ms, Startseite 211 ms bei Kaltstart), in Produktion aber Serverless plus Supabase-Aufruf für die Mitgliedsabfrage (`getCurrentMember`) in der Nav. Das trifft jeden anonymen Besucher und Crawler. Bei Crawl-Spitzen und Traffic durch Social-Shares kostet das Latenz (LCP/TTFB) und Free-Tier-Kontingent. Die Seiten sind inhaltlich statisch.
- Fix (Aufwand mittel, großer Effekt):
  1. Die Mitglieds-Pille aus dem Server-Render lösen: statische Hülle, Mitgliedsstatus clientseitig oder per kleinem, gecachtem `/api/me` nachladen. Die Anonymen-Seiten bleiben dann statisch.
  2. Das Nonce ist nur für Next-eigene Inline-Skripte nötig. JSON-LD (`type="application/ld+json"`) wird von CSP nicht als Skript ausgeführt und braucht kein Nonce. Für statische Seiten: hash-basierte CSP über `experimental.sri` in next.config oder eine Pfad-getrennte Strategie (statische Marketing-Seiten mit hash-CSP, Member-Bereich mit Nonce-CSP). Das ist die eigentliche Voraussetzung für Caching.
  3. Wenn das vor Launch nicht machbar ist: mindestens `s-maxage`-Caching für die anonyme Variante testen ist mit Nonce nicht möglich (jeder Response hat ein anderes Nonce, gecachtes HTML hätte ein ungültiges). Dann bewusst akzeptieren und TTFB in Produktion messen.
- Einstufung High statt Critical, weil es kein Indexierungsfehler ist, aber der größte Performance-Hebel.

### H4. Strukturierte Daten: Fehler und Lücken
- FAQPage auf der Startseite: Google zeigt FAQ-Rich-Results seit 2023 nur noch für staatliche und Gesundheitsseiten. Kein Schaden, aber kein Nutzen. Der Inhalt (85 %/55 %, 9,8-16,4 cm) deckt sich mit RESEARCH.md. Gut, dass die 91-%-Zahl entfernt wurde. Beachten: Die FAQ-Fragen "Bin ich zu klein?" und "Was ist die durchschnittliche Penisgröße?" stehen im JSON-LD, sind aber auf der Seite nicht sichtbar (H1 ist `sr-only`, Inhalt ist Plakatgrafik). Google verlangt, dass FAQ-Markup dem sichtbaren Inhalt entspricht. Fix: FAQPage entfernen oder die Fragen sichtbar machen. Empfehlung: entfernen.
- `Article` auf Mythen-Seiten hat `headline: myth.fact` (ganzer Faktsatz, oft über 110 Zeichen, Google schneidet ab), aber kein `datePublished`/`dateModified` und kein `image`. Pflicht für Article-Rich-Results sind sie nicht, aber `dateModified` ist für Aktualität nützlich. Die `ScholarlyArticle`-Einträge setzen `datePublished: String(s.year)` (nur Jahr). Das ist als ISO-Teilformat gültig.
- `Organization.logo` ist eine SVG (`smallpclub-mark-black.svg`). Google akzeptiert für Logos in Organization SVG, empfiehlt aber ein Raster-Logo mind. 112x112 px. Low.
- `sameAs` verweist auf Instagram. Muss existieren und zur Marke gehören. Prüfen.
- `WebSite` ohne `potentialAction` (kein SearchAction) ist korrekt, da keine Suche existiert.
- `Organization.knowsAbout` enthält "Penisgröße". Unkritisch.
- BreadcrumbList auf Mythen-Seiten vorhanden, gut. Auf `/mythen`, `/club`, `/magazin` nicht nötig.

---

## MEDIUM

### M1. Cookie `NEXT_LOCALE`: Bewertung
- H: `set-cookie: NEXT_LOCALE=de; Path=/; SameSite=lax` auf der ersten Antwort, sogar auf der Baustellen-Startseite. Kein Secure/HttpOnly-Flag. Datenschutzseite führt das Cookie ausdrücklich auf: "merkt sich deine Sprache", 1 Jahr (`src/app/[locale]/datenschutz/page.tsx` Z. 329-334). Die Offenlegung ist also korrekt.
- Bewertung: Technisch notwendig im Sinne § 25 TDDDG ist ein Sprachcookie streitbar. Die Marke wirbt mit "keine Cookies außer technisch nötigen". Ein Cookie, das bei einem rein deutschen Angebot ungefragt gesetzt wird, schwächt dieses Versprechen. Es ist außerdem überflüssig, weil die Sprache aus der URL folgt (`localePrefix: 'as-needed'`).
- SEO-Folge: Das Cookie triggert den 307-Redirect auf `/en/...` (siehe C3), also aktiv schädlich.
- Fix: in `src/i18n/routing.ts` `localeCookie: false` und `localeDetection: false` setzen (beides next-intl-Optionen). Dann kein Cookie, keine Redirects, und der Datenschutz-Abschnitt kann gestrichen werden. Marken-Versprechen "wir setzen keine Cookies" wird für anonyme Besucher wahr. Das Supabase-Session-Cookie existiert nur für angemeldete Mitglieder (bei `refreshSupabaseSession` prüfen, dass es für Anonyme nichts setzt: im Header der Startseite ist kein weiteres Cookie, gut).

### M2. Redirects und URL-Kanonisierung
- H: `/club/` -> 308 nach `/club` (gut). `/de` -> 307 nach `/` (temporär, sollte 308 sein; in next-intl nicht direkt konfigurierbar, hat aber nur Wirkung für nie verlinkte URLs). `/de/club` ebenfalls prüfen.
- Kein www/Non-www-Test lokal möglich. Beim Launch prüfen: `www.smallp.club` -> 301 `smallp.club` (Cloudflare Redirect Rule oder Vercel-Domain-Setting). Laut ROADMAP ist `www` als A-Record proxied vorhanden, aber nicht, dass es weiterleitet. Sonst Duplicate Content.
- Mythen-Slugs sind lowercase, stabil, ohne Dateiendungen. Gut.
- `/index.html` ergibt 404, korrekt.

### M3. 404-Verhalten
- H: `/nonexist` -> 404 mit `<meta name="robots" content="noindex, nofollow">`. Korrekt als echtes 404, kein Soft-404. Titel entspricht der Marke. Gut.

### M4. OG-Image
- H: `og:image` = `https://smallp.club/opengraph-image?<hash>` 1200x630 PNG, 200 OK. Brand-generisch, Absicht. Es fehlt `og:image:alt`. `twitter:card=summary_large_image` korrekt. Pro Seite identisch, `og:title` ebenfalls (Absicht: Outing-Schutz). `og:url` ist auf allen Seiten die Startseite (Teil von C1, mit-fixen).
- `og:locale` ist immer `de_DE`, auch auf `/en`. Mit C3 lösen.

### M5. Hero-Bild / LCP-Risiko
- H: Das Hero-Bild `wall-night.webp` wird mit `sizes="100vw"` ausgeliefert, im Quelltext bis `w=3840`. Das Standard-`src` zeigt auf `w=3840&q=75`. Ein Browser ohne srcset-Unterstützung lädt die größte Variante. Moderne Browser wählen per srcset passend. Prüfen, dass das Bild `priority` (fetchpriority=high) trägt. Im HTML sind nur ein bis zwei `<img>` vorhanden, die übrigen Plakatbilder werden vermutlich per CSS/JS nachgeladen. Eine Lab-Messung (Lighthouse mobil, Produktions-URL) steht noch aus. Das Rohmaterial-Verzeichnis `lh/` war leer. Ohne Messung keine Aussage zu LCP/INP/CLS. Erwartung: Das dunkle Vollflächenbild mit 3840 w ist der LCP-Kandidat.
- `style-src 'unsafe-inline'` ist in der CSP aktiv. Kein SEO-Thema, aber ein Security-Hinweis: wegen Framer-Motion/Inline-Styles akzeptiert.

### M6. llms.txt
- H: `/llms.txt` = 200, inhaltlich passend, Quellen genannt. `Disallow: /` in robots.txt blockiert aktuell alles, die Datei ist erst nach Launch relevant. Sie nennt "/magazin ... noch leer" und `/mit-glied` als Pre-Login. Vor Launch gegen die tatsächliche Seitenstruktur abgleichen. Enthält Em-Dashes im Fließtext (Marken-Doktrin: kein Em-Dash im Body). Reine Stilfrage, Low.

---

## LOW

- L1. `Cross-Origin-Resource-Policy: same-origin` auf allen Antworten blockiert Einbettung von Bildern und Schriften auf anderen Origins. Das gilt auch für das OG-Bild. Facebook, WhatsApp und Slack laden es serverseitig und sind von CORP nicht betroffen. Beim Launch mit dem Facebook Sharing Debugger und einem WhatsApp-Test bestätigen.
- L2. `Link`-Header (Preload für Fonts/CSS/SVG) ist umfangreich (Nonce im Preload-Header ist unüblich, aber harmlos). Header-Größe unkritisch.
- L3. IndexNow nicht vorhanden. Optional nach Launch (Brevo/Bing-Sichtbarkeit). Würde einen Schlüssel im Root erfordern (`/<key>.txt`), vereinbar mit der Privacy-Doktrin, da nur URLs gemeldet werden.
- L4. `<link rel="icon">` mit Dark-Media-Query und ICO vorhanden. Zusätzlich `apple-icon-dark.png` im public-Verzeichnis, aber kein heller `apple-touch-icon` geprüft. Low.
- L5. Nach Launch in Search Console und Bing Webmaster über DNS-TXT verifizieren (Doktrin), Sitemap einreichen, Abdeckungsbericht auf "Alternative Seite mit richtiger kanonischer Seite" prüfen.
- L6. Security-Header HSQ: `Strict-Transport-Security` fehlt in der lokalen Antwort. Vercel setzt HSTS für `*.vercel.app`; für `smallp.club` hinter Cloudflare dort "Always Use HTTPS" (laut ROADMAP aktiv) und HSTS im Cloudflare-Dashboard aktivieren und per `curl -I https://smallp.club` verifizieren.

---

## Bestätigung der vorab bekannten Punkte

| Bekannter Punkt | Ergebnis |
|---|---|
| canonical überall = https://smallp.club | Bestätigt. `src/app/layout.tsx` Z. 17. Betrifft auch `og:url`. Critical (C1). |
| hreflang en-US -> /en, aber /en/* 404 | Teilweise falsch: `/en`, `/en/club`, `/en/mythen` = 200 mit deutschem Inhalt. Nur `/en/myths` (englische Pfade) = 404. Schlimmer als gedacht: Duplicate Content plus Redirect per Accept-Language. Critical (C3). |
| Link-Header mit hreflang | Bestätigt. Er widerspricht dem HTML (`de`/`en` gegen `de-DE`/`en-US`, und die Alternates sind seitenweit identisch). C3. |
| Titel doppelt "· small p club — small p club" | Bestätigt auf allen Seiten außer /kontakt. High (H1). |
| Alle Routen dynamisch, no-store | Bestätigt. Ursache `headers()` im Locale-Layout (Nonce) und Mitglieds-Pille. High (H3). |
| Cookie NEXT_LOCALE | Bestätigt. Wird in der Datenschutzerklärung offengelegt, widerspricht aber dem Marken-Versprechen und ist vermeidbar. Medium (M1). |
| Sitemap fehlt /unterstuetzen und /shop | Bestätigt. Für /shop richtig (Platzhalter), für /unterstuetzen bewusste Entscheidung nötig. Wichtiger sind die Widersprüche (/mit-glied, Legal-Seiten). High (H2). |
| Sitemap lastModified = Build-Zeit | Bestätigt. Alle URLs haben denselben Zeitstempel. High (H2). |

Absichtliches (kein Fehler, nur Launch-Check): globales noindex und Disallow vor Launch sind korrekt. Neutrale Slugs und generisches OG-Bild sind in Ordnung, haben aber Folgen für Titel und Beschreibung (H1). `/mit-glied/*` und `/auth/*` noindex sind richtig; der Regex trifft jedoch `/mit-glied` selbst (H2).

## Empfohlene Reihenfolge vor Launch
1. C1: canonical pro Seite, zentrale `INDEXABLE`-Konstante, alle page-level noindex-Stellen anbinden.
2. C3 plus M1: EN abschalten (oder sauber bauen), `localeDetection: false`, `localeCookie: false`.
3. C2: robots.ts neu schreiben (Locale-Präfixe, Gruppen zusammenfassen, `host` entfernen), danach Live-Check inkl. Cloudflare-Overlay.
4. H2: Sitemap bereinigen (konsistent mit noindex-Entscheidungen, echte lastmod, force-static).
5. H1: Titel und Descriptions pro Seite eindeutig machen.
6. H3: Caching-Architektur klären, Lighthouse-Messung auf Produktions-URL.
7. H4: FAQPage entfernen oder sichtbar machen, Article um Datum ergänzen.
