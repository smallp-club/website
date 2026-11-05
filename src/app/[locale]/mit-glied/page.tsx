/**
 * /mit-glied — Pre-Login-Page (V2).
 *
 * Doktrin-Änderung V2 (entscheidungen.md #7): Das ThresholdGate („verstanden,
 * weiter") ist ersetzt durch die H1 „mit-glied. auch ohne-glied." direkt über
 * dem Formular. Das Brand-Statement bleibt als Selbst-Selektion (MEMBER_SECURITY
 * §3 Linie 2), nur der Klick fällt. Plan B: `ThresholdGate` liegt weiter in
 * `_components/` und kann wieder um den Inhalt gelegt werden.
 *
 * Eingeloggte Member werden wie bisher weitergeleitet.
 */

import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/lib/members/auth';
import {
  Chapter,
  Faq,
  JoinFine,
  Notice,
  Note,
  Page,
  PageHead,
  Points,
  SubHead,
} from '@/components/v2/Page';
import { JoinInline } from '@/components/v2/JoinInline';
import { Snapshot } from '@/components/v2/Snapshot';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/mit-glied',
  title: 'mit-glied.',
  description:
    'mit-glied. auch ohne-glied. kostenlos, kein abo, kein passwort.',
  indexable: false, // mitglieder-bereich bleibt draußen (IA §5)
});

interface MitGliedPageProps {
  searchParams: Promise<{ deleted?: string; error?: string }>;
}

const ERROR_VOICE: Record<string, { heading: string; body: string }> = {
  invalid_link: {
    heading: 'dieser link geht nicht.',
    body: 'fordere unten einen neuen an. der frische funktioniert.',
  },
  expired_link: {
    heading: 'der link ist abgelaufen.',
    body: 'jeder link gilt eine stunde. unten bekommst du einen neuen.',
  },
  profile_create: {
    heading: 'beim einrichten hat es gehakt.',
    body: 'probier es nochmal. wenn es wieder nicht klappt, schreib an hello@smallp.club.',
  },
  not_signed_in: {
    heading: 'du bist gerade nicht drin.',
    body: 'mail eingeben, link kommt, einmal klicken.',
  },
};

export default async function MitGliedPage({ searchParams }: MitGliedPageProps) {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const { deleted, error } = await searchParams;
  const errorVoice = error ? ERROR_VOICE[error] : undefined;

  // Eingeloggte User landen direkt im Mitgliederbereich. Ausnahmen: nach
  // Account-Löschung und bei Fehler-Redirects, da ist die Session meist weg.
  if (!deleted && !error) {
    const session = await getCurrentMember();
    if (session) {
      redirect(
        session.profile.onboarding_completed_at ? '/mit-glied/eingang' : '/mit-glied/willkommen',
      );
    }
  }

  const status =
    deleted === '1'
      ? {
          eyebrow: 'gelöscht',
          heading: 'weg. komplett.',
          body: 'dein konto und deine mail sind gelöscht. berichte, die schon erschienen sind, stehen ohne dich weiter da. wenn du wiederkommst, fängst du neu an.',
        }
      : errorVoice
        ? { eyebrow: 'hinweis', ...errorVoice }
        : null;

  return (
    <Page>
      <PageHead
        eyebrow="mit-glied"
        poster="act"
        title="mit-glied. auch ohne-glied."
        lead="kostenlos, für immer. du gibst uns eine mail, wir schicken dir einen link. mehr ist es nicht."
      >
        {status && (
          <Notice eyebrow={status.eyebrow} title={status.heading}>
            {status.body}
          </Notice>
        )}
        <p>du musst nichts von dir erzählen. dabei sein reicht.</p>
        <JoinInline tone="light" turnstileSiteKey={turnstileSiteKey} />
        <JoinFine />
      </PageHead>

      <Chapter
        nr="01"
        eyebrow="was du bekommst"
        title="was es heute schon gibt."
        aside={
          <Snapshot src="/imagery/plakat/karte-kuehlschrank.webp" ratio="3/2" tilt={-1.2} alt="eine ausgedruckte mit-glied-karte, mit klebeband an eine kühlschranktür geklebt, daneben ein einkaufszettel." />
        }
      >
        <Points
          items={[
            {
              lead: 'post von uns.',
              text: 'ein paarmal im jahr, wenn es etwas zu sagen gibt. dazwischen hörst du nichts von uns.',
            },
            {
              lead: 'einen ausgedachten namen.',
              text: 'gewürfelt aus rund 230 penis-synonymen aus 18 sprachen. du würfelst, bis einer passt, dann bleibt er.',
            },
            {
              lead: 'deine eigenen berichte.',
              text: 'ab dem zweiten tag kannst du aufschreiben, was du erlebt hast. kethe liest jeden text, ausgewählte erscheinen unter stimmen, mit deinem ausgedachten namen.',
            },
            {
              lead: 'die mit-glied-karte.',
              text: 'a6 quer, zum runterladen und ausdrucken. darauf dein name und der tag, an dem du dazugekommen bist.',
            },
          ]}
        />
        <SubHead>was im mit-glied-bereich gerade entsteht.</SubHead>
        <Points
          items={[
            {
              lead: 'werkstatt.',
              text: 'neue texte, bevor sie öffentlich sind, mit den stellen, an denen wir noch zweifeln.',
            },
            {
              lead: 'quellen-keller.',
              text: 'alle studien hinter unseren fakten, sortiert und in zwei sätzen eingeordnet.',
            },
            {
              lead: 'post-archiv.',
              text: 'alles, was wir je verschickt haben. wer später dazukommt, verpasst nichts.',
            },
          ]}
        />
        <Note>diese drei räume sind im aufbau. sie öffnen, sobald genug drinsteht.</Note>
        <SubHead>was mit dem shop kommt.</SubHead>
        <Points
          items={[
            { lead: 'ein sticker.', text: 'als einlöse-code, sobald der shop offen ist.' },
            {
              lead: '48 stunden vorher.',
              text: 'neue sticker und kleidung erfahren mit-glieder per mail, zwei tage bevor sie öffentlich sind.',
            },
          ]}
        />
      </Chapter>

      <Chapter nr="02" eyebrow="was es nicht ist" title="kein abo. auch später nicht.">
        <p>
          keine premium-stufe, keine paywall, keine bezahlte version. mit-glied kostet nichts und
          bleibt dabei.
        </p>
        <p>die seite lebt von stickern und kleidung. deine daten verkaufen wir an niemanden.</p>
        <p>
          es gibt hier kein forum, keine likes und keine nachrichten zwischen mit-gliedern. niemand
          kann dich finden.
        </p>
      </Chapter>

      <Chapter nr="03" eyebrow="was wir speichern" title="deine mail und einen ausgedachten namen.">
        <Points
          items={[
            {
              lead: 'was wir speichern:',
              text: 'deine mail, deinen ausgedachten namen und die berichte, die du selbst einreichst.',
            },
            {
              lead: 'was wir nicht speichern:',
              text: 'deinen echten namen, wo du wohnst, was du hier liest.',
            },
            { lead: 'wer es sieht:', text: 'nur wir. kein mit-glied sieht ein anderes.' },
            { lead: 'wie du gehst:', text: 'im mit-glied-bereich auf „konto löschen“. weg ist weg.' },
            {
              lead: 'was bleibt:',
              text: 'berichte, die schon erschienen sind, bleiben stehen. vor deinem namen steht dann „alter-“, „alte-“ oder „altes-“.',
            },
          ]}
        />
      </Chapter>

      <Chapter nr="04" eyebrow="bevor du dich einträgst" title="vier fragen, kurz beantwortet.">
        <Faq
          items={[
            {
              q: 'muss ich selbst betroffen sein?',
              a: 'nein. mit-glied heißt, du findest die haltung richtig. ob du selbst betroffen bist, fragt hier niemand, und es steht nirgends.',
            },
            {
              q: 'sieht jemand, dass ich hier bin?',
              a: 'in deinem postfach landet eine mail mit dem betreff „ohne passwort. ein klick.“ ein öffentliches profil gibt es nicht, eine liste der mit-glieder auch nicht.',
            },
            {
              q: 'muss ich etwas schreiben?',
              a: 'nein. lesen reicht. wer schreiben will, kann das jederzeit, und wer es nie tut, ist genauso dabei.',
            },
            {
              q: 'was kostet das?',
              a: 'nichts, auch später nicht. wir finanzieren uns über sticker und kleidung, sobald der shop offen ist.',
            },
          ]}
        />
      </Chapter>
    </Page>
  );
}
