import type { Metadata } from 'next';

import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'datenschutz',
  description:
    'wie wir mit deinen daten umgehen. ehrlich, brand-konform, dsgvo-erfüllend.',
  robots: { index: false, follow: false },
};

export default function DatenschutzPage() {
  return (
    <main id="main-content" className={styles.main}>
      <Section tone="light" rhythm="standard" firstOfPage>
        <Container width="prose">
          <header className={styles.header}>
            <Heading level={1} variant="lede">
              datenschutz
            </Heading>
            <p className={styles.stand}>stand: 17. juni 2026</p>
          </header>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              was wir nicht tun
            </Heading>
            <p className={styles.brandBlock}>
              {`wir messen euch nicht.
wir tracken euch nicht.
wir verkaufen eure daten nicht.

kein google. nicht analytics, nicht ads, nicht fonts zur laufzeit.
kein meta. nicht ads, nicht pixel, nicht insights.
kein tiktok, kein linkedin, kein youtube-embed, kein vimeo-embed.
keine cookies, außer die nötig sind damit die seite läuft.`}
            </p>
            <p className={styles.lead}>
              das ist nicht versehen. das ist absicht. das ist der grund warum
              wir das hier so bauen.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              wer ist verantwortlich
            </Heading>
            <p className={styles.lead}>
              verantwortlicher im sinne der dsgvo ist:
            </p>
            <p className={styles.lead}>
              Kevin Theermann
              <br />
              Anschrift wie im{' '}
              <a href="/impressum" className={styles.providerDetail}>
                impressum
              </a>
              <br />
              hello@smallp.club
            </p>
            <p className={styles.lead}>
              einen datenschutzbeauftragten haben wir nicht, wir sind dafür zu
              klein (unter 20 personen, keine verarbeitung sensibler daten in
              massenproduktion gemäß § 38 abs. 1 bdsg).
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              was wir wo speichern
            </Heading>
            <p className={styles.lead}>
              die site läuft auf servern in deutschland und der eu. inhaltliche
              daten (deine mail-adresse, newsletter-eintragungen,
              erfahrungsberichte wenn du eingeloggt bist) bleiben in de oder
              eu. infrastruktur-anbieter (dns, hosting, datenbank-provider)
              sind teilweise us-firmen, die alle nach eu-us data privacy
              framework (dpf) zertifiziert sind und für unser setup in
              eu-regionen (frankfurt) konfiguriert sind.
            </p>

            <Heading level={3} variant="sub">
              hosting + edge
            </Heading>

            <div className={styles.provider}>
              <p className={styles.providerName}>
                Vercel Inc. (San Francisco, USA, Region Frankfurt, DPF)
              </p>
              <p className={styles.providerDetail}>
                Was: stellt die Site bereit, sieht Anfragen und IP-Adressen
                kurz beim Routing.
              </p>
              <p className={styles.providerDetail}>
                Wie lange: Server-Logs werden nach 24 Stunden anonymisiert.
              </p>
              <p className={styles.providerDetail}>
                Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TTDSG + Art. 6 Abs. 1 lit. f
                DSGVO.
              </p>
              <p className={styles.providerDetail}>
                <a href="https://vercel.com/legal/privacy-policy">
                  vercel.com/legal/privacy-policy
                </a>
              </p>
            </div>

            <div className={styles.provider}>
              <p className={styles.providerName}>
                Cloudflare Inc. (San Francisco, USA, EU-Edge, DPF)
              </p>
              <p className={styles.providerDetail}>
                Was: DNS, DDoS-Schutz, Bot-Filterung. Sieht IP-Adressen kurz,
                behält sie nicht.
              </p>
              <p className={styles.providerDetail}>
                Wie lange: Edge-Logs typisch unter 24h.
              </p>
              <p className={styles.providerDetail}>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Sicherheit der
                Site).
              </p>
              <p className={styles.providerDetail}>
                <a href="https://cloudflare.com/privacypolicy">
                  cloudflare.com/privacypolicy
                </a>
              </p>
            </div>

            <div className={styles.provider}>
              <p className={styles.providerName}>
                GitHub Inc. (Microsoft, San Francisco, USA, DPF)
              </p>
              <p className={styles.providerDetail}>
                Was: lagert unseren Code. Sieht keine Besucher-Daten.
              </p>
              <p className={styles.providerDetail}>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
              </p>
              <p className={styles.providerDetail}>
                <a href="https://docs.github.com/en/site-policy/privacy-policies">
                  docs.github.com/en/site-policy/privacy-policies
                </a>
              </p>
            </div>

            <Heading level={3} variant="sub">
              datenbank
            </Heading>

            <div className={styles.provider}>
              <p className={styles.providerName}>
                Supabase Inc. (US-Mutter, EU-Region Frankfurt, DPF)
              </p>
              <p className={styles.providerDetail}>
                Was: speichert (sobald Member-Bereich live ist) deine
                Mail-Adresse, dein Pseudonym, deine Erfahrungsberichte.
              </p>
              <p className={styles.providerDetail}>
                Wie lange: bis zu deiner Account-Löschung. Löschung mit einem
                Klick möglich.
              </p>
              <p className={styles.providerDetail}>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
              </p>
              <p className={styles.providerDetail}>
                <a href="https://supabase.com/privacy">supabase.com/privacy</a>
              </p>
            </div>

            <div className={styles.provider}>
              <p className={styles.providerName}>
                Upstash Inc. (US-Mutter, EU-Region Frankfurt, DPF)
              </p>
              <p className={styles.providerDetail}>
                Was: Rate-Limiting gegen Spam und Brute-Force. Speichert kurz
                IP-Adressen oder Email-Hashes zum Zählen.
              </p>
              <p className={styles.providerDetail}>
                Wie lange: maximal 24 Stunden.
              </p>
              <p className={styles.providerDetail}>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Sicherheit).
              </p>
              <p className={styles.providerDetail}>
                <a href="https://upstash.com/trust/privacy.pdf">
                  upstash.com/trust/privacy.pdf
                </a>
              </p>
            </div>

            <Heading level={3} variant="sub">
              mail
            </Heading>

            <div className={styles.provider}>
              <p className={styles.providerName}>
                ALL-INKL.COM / Neue Medien Münnich (Friedersdorf, Deutschland)
              </p>
              <p className={styles.providerDetail}>
                Was: betreibt unseren Mail-Server. Verschickt Login-Magic-Links
                über mit-glied@smallp.club und nimmt Antworten an hello@ entgegen.
              </p>
              <p className={styles.providerDetail}>
                Wie lange: Mails werden so lange aufbewahrt wie nötig.
              </p>
              <p className={styles.providerDetail}>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Mitgliedschafts-Auth)
                + Art. 6 Abs. 1 lit. f DSGVO (Kontakt).
              </p>
              <p className={styles.providerDetail}>
                <a href="https://all-inkl.com/datenschutz/">
                  all-inkl.com/datenschutz
                </a>
              </p>
            </div>

            <div className={styles.provider}>
              <p className={styles.providerName}>
                Sendinblue SAS / Brevo (Paris, Frankreich)
              </p>
              <p className={styles.providerDetail}>
                Was: verschickt unseren Newsletter, aber nur wenn du beim
                Mit-Glied-Werden die Newsletter-Option ausdrücklich angehakt
                hast.
              </p>
              <p className={styles.providerDetail}>
                Wie lange: bis zu deiner Abmeldung. Link in jeder Mail.
              </p>
              <p className={styles.providerDetail}>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
              </p>
              <p className={styles.providerDetail}>
                <a href="https://brevo.com/legal/privacypolicy/">
                  brevo.com/legal/privacypolicy
                </a>
              </p>
            </div>

            <Heading level={3} variant="sub">
              zugang
            </Heading>

            <div className={styles.provider}>
              <p className={styles.providerName}>
                Auth.js (Code in unserer App, läuft auf Vercel)
              </p>
              <p className={styles.providerDetail}>
                Was: setzt Login-Sessions als Cookies. Speichert nichts auf
                externen Servern.
              </p>
              <p className={styles.providerDetail}>
                Wie lange: Login-Cookie 30 Tage, dann auto-Logout.
              </p>
              <p className={styles.providerDetail}>
                Rechtsgrundlage: § 25 Abs. 2 TTDSG + Art. 6 Abs. 1 lit. b
                DSGVO.
              </p>
            </div>

            <Heading level={3} variant="sub">
              schriften
            </Heading>

            <p className={styles.lead}>
              Chillax Variable: selbst gehostet, kein externer Call.
              <br />
              Inter: via next/font beim Build heruntergeladen, kein
              Runtime-Call an Google.
            </p>
            <p className={styles.lead}>
              wenn du die site lädst, wird keine einzige schrift von einem
              externen server geladen. alle fonts liegen auf unserem hosting.
            </p>

            <Heading level={3} variant="sub">
              was wir bewusst nicht nutzen
            </Heading>

            <ul className={styles.lead}>
              <li>
                Kein Google Analytics, Google Ads, Google Fonts zur Laufzeit
              </li>
              <li>
                Kein Meta (Facebook, Instagram), TikTok, LinkedIn, Pinterest, Snap
              </li>
              <li>
                Kein YouTube-Embed, kein Vimeo-Embed (Videos liegen direkt auf
                unserem Hosting)
              </li>
              <li>Kein Affiliate-Tracking, keine Werbung</li>
              <li>
                Keine Web-Analytics-Tools (kein Plausible, kein Umami, kein
                Posthog). wir messen euch absichtlich nicht
              </li>
              <li>Keine Heatmaps, kein Session-Replay</li>
              <li>
                Keine A/B-Tests die euer Verhalten tracken
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              was du tun kannst
            </Heading>
            <p className={styles.lead}>
              du hast nach dsgvo folgende rechte:
            </p>

            <Heading level={3} variant="sub">
              auskunft (Art. 15)
            </Heading>
            <p className={styles.lead}>
              du willst wissen was wir über dich gespeichert haben? schreib
              uns: hello@smallp.club. wir antworten innerhalb 30 tage,
              meistens schneller.
            </p>

            <Heading level={3} variant="sub">
              löschung (Art. 17)
            </Heading>
            <p className={styles.lead}>
              du willst alles weg? zwei wege:
            </p>
            <ul className={styles.lead}>
              <li>
                mit-glied: login → account → account löschen. sofort, ohne
                nachfrage.
              </li>
              <li>
                newsletter-subscriber: abmelde-link in jeder mail klicken, oder
                schreib uns hello@smallp.club.
              </li>
            </ul>
            <p className={styles.lead}>
              nach löschung speichern wir nichts mehr von dir, außer wenn wir
              gesetzlich müssen (z.b. rechnungen aus dem shop, gesetzliche
              aufbewahrungspflicht 10 jahre nach hgb).
            </p>

            <Heading level={3} variant="sub">
              berichtigung (Art. 16)
            </Heading>
            <p className={styles.lead}>
              daten falsch? schreib uns. wir korrigieren.
            </p>

            <Heading level={3} variant="sub">
              einschränkung der verarbeitung (Art. 18)
            </Heading>
            <p className={styles.lead}>
              du willst dass wir mit deinen daten erstmal nichts mehr tun, ohne
              sie zu löschen? schreib uns.
            </p>

            <Heading level={3} variant="sub">
              datenübertragbarkeit (Art. 20)
            </Heading>
            <p className={styles.lead}>
              du willst deine daten als datei? wir schicken sie als json.
              schreib uns.
            </p>

            <Heading level={3} variant="sub">
              widerspruch (Art. 21)
            </Heading>
            <p className={styles.lead}>
              du widersprichst der verarbeitung deiner daten basierend auf
              berechtigtem interesse? schreib uns mit begründung. wir prüfen.
            </p>

            <Heading level={3} variant="sub">
              widerruf der einwilligung (Art. 7 Abs. 3)
            </Heading>
            <p className={styles.lead}>
              du hast in den newsletter eingewilligt und willst zurück?
              abmelde-link in jeder mail. sofort.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              cookies (die wenigen die wir setzen)
            </Heading>
            <div className={styles.tableWrap}>
              <table className={styles.cookieTable}>
                <caption>
                  Übersicht aller von uns gesetzten Cookies (technisch
                  notwendig, keine Tracking-Cookies).
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Cookie</th>
                    <th scope="col">Zweck</th>
                    <th scope="col">Dauer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>NEXT_LOCALE</code>
                    </td>
                    <td>merkt sich deine Sprache (Deutsch oder Englisch)</td>
                    <td>1 Jahr</td>
                  </tr>
                  <tr>
                    <td>
                      <code>authjs.session-token</code>
                    </td>
                    <td>dein Login-Cookie wenn du mit-glied bist</td>
                    <td>30 Tage</td>
                  </tr>
                  <tr>
                    <td>
                      <code>__cf_bm</code>
                    </td>
                    <td>Cloudflare Bot-Schutz</td>
                    <td>30 Minuten</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.lead}>
              mehr nicht. keine tracking-cookies. keine marketing-cookies.
              keine third-party-cookies.
            </p>
            <p className={styles.lead}>
              cookie-banner haben wir keinen, weil wir keine
              zustimmungspflichtigen cookies setzen. die drei oben sind alle
              technisch notwendig im sinne von § 25 abs. 2 ttdsg.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              wenn du dich beschweren willst
            </Heading>
            <p className={styles.lead}>
              du hast das recht, dich bei der aufsichtsbehörde zu beschweren.
            </p>
            <p className={styles.lead}>zuständig für uns:</p>
            <p className={styles.lead}>
              Landesbeauftragte für Datenschutz und Informationsfreiheit
              Nordrhein-Westfalen (LDI NRW)
              <br />
              Kavalleriestr. 2–4, 40213 Düsseldorf
              <br />
              Tel. 0211 / 38424-0
              <br />
              poststelle@ldi.nrw.de
              <br />
              <a href="https://ldi.nrw.de">ldi.nrw.de</a>
            </p>
            <p className={styles.lead}>
              wir hoffen aber, du schreibst uns vorher. vielleicht ist es
              schneller geklärt.
            </p>
          </section>

          <section className={styles.section}>
            <Heading level={2} variant="section">
              stand und änderungen
            </Heading>
            <p className={styles.lead}>
              diese datenschutzerklärung ist auf dem stand vom 17. juni 2026.
            </p>
            <p className={styles.lead}>
              wenn wir was ändern, aktualisieren wir das datum oben und die
              geänderte sektion. größere änderungen (z.b. neue dienstleister,
              neue datenkategorien) erwähnen wir im nächsten newsletter.
            </p>
            <p className={styles.signOff}>
              <em>— small p club</em>
              <br />
              <em>no measure, no pressure.</em>
            </p>
          </section>
        </Container>
      </Section>
    </main>
  );
}
