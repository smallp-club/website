/**
 * /auth/einloggen — Zwischenschritt vor dem Einlösen des Magic-Links.
 *
 * Firmen-Mailfilter (Outlook SafeLinks u. a.) rufen Links aus Mails vorab auf.
 * Würde schon dieser Aufruf den Einmal-Link einlösen, wäre er verbraucht, bevor
 * der Mensch klickt. Deshalb löst erst ein POST von dieser Seite den Link ein
 * (Security-Audit L8). Der POST startet per JavaScript automatisch, der Knopf
 * bleibt als Rückfall.
 */

import { Page, PageHead, pageStyles } from '@/components/v2/Page';
import { Button } from '@/components/primitives/Button';
import { AutoSubmitForm } from './AutoSubmitForm';
import styles from './einloggen.module.css';

export const metadata = {
  title: 'einloggen. — small p club',
  description: 'ein klick, dann bist du drin.',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}

export default async function EinloggenPage({ searchParams }: PageProps) {
  const { token_hash: tokenHash, type } = await searchParams;
  const valid = Boolean(tokenHash && type);

  return (
    <Page>
      <PageHead
        eyebrow="einloggen"
        title={valid ? 'du kommst rein.' : 'der link ist unvollständig.'}
        size="compact"
        lead={
          valid
            ? 'einen moment. falls nichts passiert, drück den knopf.'
            : 'fordere einfach einen neuen an, das dauert eine minute.'
        }
      >
        {valid ? (
          <AutoSubmitForm className={styles.actions}>
            <input type="hidden" name="token_hash" value={tokenHash} />
            <input type="hidden" name="type" value={type} />
            <Button type="submit" variant="accent">
              jetzt einloggen
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
