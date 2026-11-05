import type { Metadata } from 'next';

import { Chapter, Page, PageHead, SubHead, pageStyles } from '@/components/v2/Page';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'datenschutz',
  description: 'wie wir mit deinen daten umgehen. ehrlich, brand-konform, dsgvo-erfüllend.',
  robots: { index: false, follow: false },
};

export default function DatenschutzPage() {
  return (
    <Page>
      <PageHead eyebrow="stand: 24. juni 2026" title="datenschutz" size="compact" />

      <Chapter eyebrow="haltung" title="was wir nicht tun">
        <p className={styles.brandBlock}>
          {`wir messen euch nicht.
wir tracken euch nicht.
wir verkaufen eure daten nicht.

kein google. nicht analytics, nicht ads, nicht fonts zur laufzeit.
kein meta. nicht ads, nicht pixel, nicht insights.
kein tiktok, kein linkedin, kein youtube-embed, kein vimeo-embed.
keine cookies, außer die nötig sind damit die seite läuft.`}
        </p>
        <p>
          das ist nicht versehen. das ist absicht. das ist der grund warum wir das hier so bauen.
        </p>
      </Chapter>

      <Chapter eyebrow="verantwortung" title="wer ist verantwortlich">
        <p>verantwortlicher im sinne der dsgvo ist:</p>
        <p>
          Kethe Theermann
          <br />
          Anschrift wie im{' '}
          <a href="/impressum" className={pageStyles.link}>
            impressum
          </a>
          <br />
          hello@smallp.club
        </p>
        <p>
          einen datenschutzbeauftragten haben wir nicht, wir sind dafür zu klein (unter 20 personen,
          keine verarbeitung sensibler daten in massenproduktion gemäß § 38 abs. 1 bdsg).
        </p>
      </Chapter>

      <Chapter eyebrow="dienstleister" title="was wir wo speichern">
        <p>
          die site läuft auf servern in deutschland und der eu. inhaltliche daten (deine
          mail-adresse, newsletter-eintragungen, erfahrungsberichte wenn du eingeloggt bist) bleiben
          in de oder eu. infrastruktur-anbieter (dns, hosting, datenbank-provider) sind teilweise
          us-firmen, die alle nach eu-us data privacy framework (dpf) zertifiziert sind und für
          unser setup in eu-regionen (frankfurt) konfiguriert sind.
        </p>

        <SubHead>hosting + edge</SubHead>

        <div className={styles.provider}>
          <p className={styles.providerName}>
            Vercel Inc. (San Francisco, USA, Region Frankfurt, DPF)
          </p>
          <p className={styles.providerDetail}>
            Was: stellt die Site bereit, sieht Anfragen und IP-Adressen kurz beim Routing.
          </p>
          <p className={styles.providerDetail}>
            Wie lange: Server-Logs werden nach 24 Stunden anonymisiert.
          </p>
          <p className={styles.providerDetail}>
            Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TTDSG + Art. 6 Abs. 1 lit. f DSGVO.
          </p>
          <p className={styles.providerDetail}>
            <a href="https://vercel.com/legal/privacy-policy" className={pageStyles.link}>
              vercel.com/legal/privacy-policy
            </a>
          </p>
        </div>

        <div className={styles.provider}>
          <p className={styles.providerName}>Cloudflare Inc. (San Francisco, USA, EU-Edge, DPF)</p>
          <p className={styles.providerDetail}>
            Was: DNS, DDoS-Schutz, Bot-Filterung. Sieht IP-Adressen kurz, behält sie nicht.
          </p>
          <p className={styles.providerDetail}>Wie lange: Edge-Logs typisch unter 24h.</p>
          <p className={styles.providerDetail}>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Sicherheit der Site).
          </p>
          <p className={styles.providerDetail}>
            <a href="https://cloudflare.com/privacypolicy" className={pageStyles.link}>
              cloudflare.com/privacypolicy
            </a>
          </p>
        </div>

        <div className={styles.provider}>
          <p className={styles.providerName}>GitHub Inc. (Microsoft, San Francisco, USA, DPF)</p>
          <p className={styles.providerDetail}>
            Was: lagert unseren Code. Sieht keine Besucher-Daten.
          </p>
          <p className={styles.providerDetail}>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
          <p className={styles.providerDetail}>
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies"
              className={pageStyles.link}
            >
              docs.github.com/en/site-policy/privacy-policies
            </a>
          </p>
        </div>

        <SubHead>datenbank</SubHead>

        <div className={styles.provider}>
          <p className={styles.providerName}>Supabase Inc. (US-Mutter, EU-Region Frankfurt, DPF)</p>
          <p className={styles.providerDetail}>
            Was: speichert (sobald Member-Bereich live ist) deine Mail-Adresse, dein Pseudonym,
            deine Erfahrungsberichte.
          </p>
          <p className={styles.providerDetail}>
            Wie lange: bis zu deiner Account-Löschung. Löschung mit einem Klick möglich.
          </p>
          <p className={styles.providerDetail}>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
          <p className={styles.providerDetail}>
            <a href="https://supabase.com/privacy" className={pageStyles.link}>
              supabase.com/privacy
            </a>
          </p>
        </div>

        <div className={styles.provider}>
          <p className={styles.providerName}>Upstash Inc. (US-Mutter, EU-Region Frankfurt, DPF)</p>
          <p className={styles.providerDetail}>
            Was: Rate-Limiting gegen Spam und Brute-Force. Speichert kurz IP-Adressen oder
            Email-Hashes zum Zählen.
          </p>
          <p className={styles.providerDetail}>Wie lange: maximal 24 Stunden.</p>
          <p className={styles.providerDetail}>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Sicherheit).
          </p>
          <p className={styles.providerDetail}>
            <a href="https://upstash.com/trust/privacy.pdf" className={pageStyles.link}>
              upstash.com/trust/privacy.pdf
            </a>
          </p>
        </div>

        <SubHead>mail</SubHead>

        <div className={styles.provider}>
          <p className={styles.providerName}>
            ALL-INKL.COM / Neue Medien Münnich (Friedersdorf, Deutschland)
          </p>
          <p className={styles.providerDetail}>
            Was: betreibt unseren Mail-Server. Verschickt Login-Magic-Links über
            mit-glied@smallp.club und nimmt Antworten an hello@ entgegen.
          </p>
          <p className={styles.providerDetail}>
            Wie lange: Mails werden so lange aufbewahrt wie nötig.
          </p>
          <p className={styles.providerDetail}>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Mitgliedschafts-Auth) + Art. 6 Abs. 1 lit.
            f DSGVO (Kontakt).
          </p>
          <p className={styles.providerDetail}>
            <a href="https://all-inkl.com/datenschutz/" className={pageStyles.link}>
              all-inkl.com/datenschutz
            </a>
          </p>
        </div>

        <div className={styles.provider}>
          <p className={styles.providerName}>Sendinblue SAS / Brevo (Paris, Frankreich)</p>
          <p className={styles.providerDetail}>
            Was: verschickt unseren Newsletter, aber nur wenn du beim Mit-Glied-Werden die
            Newsletter-Option ausdrücklich angehakt hast.
          </p>
          <p className={styles.providerDetail}>
            Wie lange: bis zu deiner Abmeldung. Link in jeder Mail.
          </p>
          <p className={styles.providerDetail}>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
          </p>
          <p className={styles.providerDetail}>
            <a href="https://brevo.com/legal/privacypolicy/" className={pageStyles.link}>
              brevo.com/legal/privacypolicy
            </a>
          </p>
        </div>

        <SubHead>zugang</SubHead>

        <div className={styles.provider}>
          <p className={styles.providerName}>
            Supabase Auth (Teil von Supabase, EU-Region Frankfurt, DPF)
          </p>
          <p className={styles.providerDetail}>
            Was: setzt Login-Sessions als httpOnly-Cookies. Verwaltet die Magic-Link-Tokens und die
            Refresh-Logik. Die eigentliche Mail-Zustellung läuft über all-inkl SMTP (siehe
            Mail-Block).
          </p>
          <p className={styles.providerDetail}>
            Wie lange: Login-Cookie 30 Tage, dann auto-Logout. Magic-Link selbst ist nach 1 Stunde
            abgelaufen und einmalig nutzbar.
          </p>
          <p className={styles.providerDetail}>
            Rechtsgrundlage: § 25 Abs. 2 TTDSG + Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </div>

        <div className={styles.provider}>
          <p className={styles.providerName}>
            Cloudflare Turnstile (Cloudflare Inc., EU-Edge, DPF)
          </p>
          <p className={styles.providerDetail}>
            Was: Bot-Schutz vor dem Login-Formular. Datenschutzfreundliche Alternative zu reCAPTCHA
            — kein Verhaltens-Tracking, kein Cookie zur Wiedererkennung über Sessions hinweg.
          </p>
          <p className={styles.providerDetail}>
            Wie lange: Token-Validierung passiert in Sekunden, danach wird nichts dauerhaft
            gespeichert.
          </p>
          <p className={styles.providerDetail}>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Sicherheit der Auth-Route gegen Bot-Spam).
          </p>
          <p className={styles.providerDetail}>
            <a href="https://cloudflare.com/privacypolicy" className={pageStyles.link}>
              cloudflare.com/privacypolicy
            </a>
          </p>
        </div>

        <SubHead>schriften</SubHead>

        <p>
          Chillax Variable: selbst gehostet, kein externer Call.
          <br />
          Inter: via next/font beim Build heruntergeladen, kein Runtime-Call an Google.
        </p>
        <p>
          wenn du die site lädst, wird keine einzige schrift von einem externen server geladen. alle
          fonts liegen auf unserem hosting.
        </p>

        <SubHead>was wir bewusst nicht nutzen</SubHead>

        <ul className={styles.list}>
          <li>Kein Google Analytics, Google Ads, Google Fonts zur Laufzeit</li>
          <li>Kein Meta (Facebook, Instagram), TikTok, LinkedIn, Pinterest, Snap</li>
          <li>Kein YouTube-Embed, kein Vimeo-Embed (Videos liegen direkt auf unserem Hosting)</li>
          <li>Kein Affiliate-Tracking, keine Werbung</li>
          <li>
            Keine Web-Analytics-Tools (kein Plausible, kein Umami, kein Posthog). wir messen euch
            absichtlich nicht
          </li>
          <li>Keine Heatmaps, kein Session-Replay</li>
          <li>Keine A/B-Tests die euer Verhalten tracken</li>
        </ul>
      </Chapter>

      <Chapter eyebrow="deine rechte" title="was du tun kannst">
        <p>du hast nach dsgvo folgende rechte:</p>

        <SubHead>auskunft (Art. 15)</SubHead>
        <p>
          du willst wissen was wir über dich gespeichert haben? schreib uns: hello@smallp.club. wir
          antworten innerhalb 30 tage, meistens schneller.
        </p>

        <SubHead>löschung (Art. 17)</SubHead>
        <p>du willst alles weg? zwei wege:</p>
        <ul className={styles.list}>
          <li>mit-glied: login → account → account löschen. sofort, ohne nachfrage.</li>
          <li>
            newsletter-subscriber: abmelde-link in jeder mail klicken, oder schreib uns
            hello@smallp.club.
          </li>
        </ul>
        <p>
          nach löschung speichern wir nichts mehr von dir, außer wenn wir gesetzlich müssen (z.b.
          rechnungen aus dem shop, gesetzliche aufbewahrungspflicht 10 jahre nach hgb).
        </p>

        <SubHead>berichtigung (Art. 16)</SubHead>
        <p>daten falsch? schreib uns. wir korrigieren.</p>

        <SubHead>einschränkung der verarbeitung (Art. 18)</SubHead>
        <p>
          du willst dass wir mit deinen daten erstmal nichts mehr tun, ohne sie zu löschen? schreib
          uns.
        </p>

        <SubHead>datenübertragbarkeit (Art. 20)</SubHead>
        <p>du willst deine daten als datei? wir schicken sie als json. schreib uns.</p>

        <SubHead>widerspruch (Art. 21)</SubHead>
        <p>
          du widersprichst der verarbeitung deiner daten basierend auf berechtigtem interesse?
          schreib uns mit begründung. wir prüfen.
        </p>

        <SubHead>widerruf der einwilligung (Art. 7 Abs. 3)</SubHead>
        <p>
          du hast in den newsletter eingewilligt und willst zurück? abmelde-link in jeder mail.
          sofort.
        </p>
      </Chapter>

      <Chapter eyebrow="cookies" title="cookies (die wenigen die wir setzen)">
        <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="cookie-tabelle, seitlich scrollbar">
          <table className={styles.cookieTable}>
            <caption>
              Übersicht aller von uns gesetzten Cookies (technisch notwendig, keine
              Tracking-Cookies).
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
        <p>
          mehr nicht. keine tracking-cookies. keine marketing-cookies. keine third-party-cookies.
        </p>
        <p>
          cookie-banner haben wir keinen, weil wir keine zustimmungspflichtigen cookies setzen. die
          drei oben sind alle technisch notwendig im sinne von § 25 abs. 2 ttdsg.
        </p>
      </Chapter>

      <Chapter eyebrow="beschwerde" title="wenn du dich beschweren willst">
        <p>du hast das recht, dich bei der aufsichtsbehörde zu beschweren.</p>
        <p>zuständig für uns:</p>
        <p>
          Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)
          <br />
          Kavalleriestr. 2–4, 40213 Düsseldorf
          <br />
          Tel. 0211 / 38424-0
          <br />
          poststelle@ldi.nrw.de
          <br />
          <a href="https://ldi.nrw.de" className={pageStyles.link}>
            ldi.nrw.de
          </a>
        </p>
        <p>wir hoffen aber, du schreibst uns vorher. vielleicht ist es schneller geklärt.</p>
      </Chapter>

      <Chapter eyebrow="änderungen" title="stand und änderungen">
        <p>diese datenschutzerklärung ist auf dem stand vom 17. juni 2026.</p>
        <p>
          wenn wir was ändern, aktualisieren wir das datum oben und die geänderte sektion. größere
          änderungen (z.b. neue dienstleister, neue datenkategorien) erwähnen wir im nächsten
          newsletter.
        </p>
        <p className={styles.signOff}>
          <em>— small p club</em>
          <br />
          <em>no measure, no pressure.</em>
        </p>
      </Chapter>
    </Page>
  );
}
