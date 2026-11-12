/**
 * /auth/einloggen — Zwischenschritt vor dem Einlösen des Magic-Links.
 *
 * Firmen-Mailfilter (Outlook SafeLinks u. a.) rufen Links aus Mails vorab auf.
 * Würde schon dieser Aufruf den Einmal-Link einlösen, wäre er verbraucht, bevor
 * der Mensch klickt. Deshalb löst erst ein POST von dieser Seite den Link ein
 * (Security-Audit L8). Der POST startet nur automatisch, wenn dieser Browser
 * den Link selbst angefordert hat (Login-CSRF, lib/members/login-pending.ts).
 * Sonst fragt die Seite „ja, das war ich" ab. Der Knopf bleibt immer als Rückfall.
 */

import { Page, PageHead, pageStyles } from '@/components/v2/Page';
import { Button } from '@/components/primitives/Button';
import { cookies } from 'next/headers';
import { LOGIN_PENDING_COOKIE } from '@/lib/members/login-pending';
import { AutoSubmitForm } from './AutoSubmitForm';
import styles from './einloggen.module.css';

export const metadata = {
  title: 'einloggen.',
  description: 'ein klick, dann bist du drin.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}

export default async function EinloggenPage({ searchParams }: PageProps) {
  const { token_hash: tokenHash, type } = await searchParams;
  const valid = Boolean(tokenHash && type);
  // Hat dieser Browser den Link angefordert? Nur dann automatisch einlösen.
  const requestedHere = (await cookies()).has(LOGIN_PENDING_COOKIE);

  const title = !valid ? 'der link ist unvollständig.' : requestedHere ? 'du kommst rein.' : 'nur ein klick.';
  const lead = !valid
    ? 'fordere einfach einen neuen an, das dauert eine minute.'
    : requestedHere
      ? 'einen moment. falls nichts passiert, drück den knopf.'
      : 'hast du diesen link gerade selbst angefordert? dann drück den knopf. wenn nicht, schließ die seite einfach.';

  return (
    <Page>
      <PageHead eyebrow="einloggen" title={title} size="compact" lead={lead}>
        {valid ? (
          <AutoSubmitForm auto={requestedHere} className={styles.actions}>
            <input type="hidden" name="token_hash" value={tokenHash} />
            <input type="hidden" name="type" value={type} />
            <Button type="submit" variant="accent">
              {requestedHere ? 'jetzt einloggen' : 'ja, das war ich'}
            </Button>
          </AutoSubmitForm>
        ) : (
          <p>
            <a href="/mit-glied" className={pageStyles.link}>
              neuen link anfordern
            </a>
          </p>
        )}
      </PageHead>
    </Page>
  );
}
