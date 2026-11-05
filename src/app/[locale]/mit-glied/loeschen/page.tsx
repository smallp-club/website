/**
 * /mit-glied/loeschen — Account-Löschung mit Klick-Bestätigung.
 *
 * Auth-gated. Zeigt einmal ruhig was passiert, ein-Klick-Bestätigung,
 * danach unwiderruflich. Brand-Voice (MEMBER_CONCEPT.md §6):
 * „diesen account löschen. sofort, ohne nachfrage." — die „nachfrage"
 * meint kein Bestätigungs-Modal mit „bist du dir sicher?", sondern
 * einen klaren Button auf einer ehrlichen Erklärungs-Page.
 *
 * V2: Wand-Kopf (compact), Erklärung und Formular auf dem Papierbogen.
 */

import { Notice, Page, PageHead, pageStyles } from '@/components/v2/Page';
import { SubmitButton } from '@/components/primitives/SubmitButton';
import { LinkButton } from '@/components/primitives/LinkButton';
import { requireMember } from '@/lib/members/auth';
import { makeExPseudonym } from '@/lib/members/pseudonym';
import { deleteAccountAction } from '../eingang/actions';
import styles from './loeschen.module.css';

export const metadata = {
  title: 'account löschen.',
  description: 'unwiderruflich, ohne nachfrage.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoeschenPage({ searchParams }: PageProps) {
  const { profile } = await requireMember();
  const { error } = await searchParams;
  const exPseudonym = makeExPseudonym(profile.pseudonym);

  return (
    <Page>
      <PageHead
        eyebrow="account löschen"
        title="weg ist weg."
        size="compact"
        lead="ein klick, dann bist du weg. wir fragen nicht warum, machen keine umfrage, kein „bist du dir sicher“."
      >
        <p>
          dein name <strong>{profile.pseudonym}</strong>, deine mail, alle berichte die du gerade
          schreibst: weg. wir behalten nichts von dir.
        </p>
        <p>
          was bleibt: deine veröffentlichten berichte. dein name wird zu{' '}
          <strong>{exPseudonym}</strong>, niemand kann dich mehr identifizieren. das bekenntnis
          bleibt, du gehst.
        </p>

        {error === 'delete_failed' && (
          <Notice eyebrow="hinweis" title="das hat gerade nicht geklappt.">
            probier es noch einmal, oder schreib uns an{' '}
            <a href="mailto:hello@smallp.club" className={pageStyles.link}>
              hello@smallp.club
            </a>
            .
          </Notice>
        )}

        <form action={deleteAccountAction} className={styles.actions}>
          <SubmitButton variant="destructive" loadingLabel="lösche …">
            ja, jetzt löschen
          </SubmitButton>
          <LinkButton href="/mit-glied/eingang" variant="ghost">
            nein, zurück
          </LinkButton>
        </form>

        <p className={pageStyles.fine}>
          du kannst dich danach jederzeit neu anmelden. das wird dann ein neuer account mit neuem
          namen.
        </p>
      </PageHead>
    </Page>
  );
}
