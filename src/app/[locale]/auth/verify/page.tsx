import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'verify. — auth',
  robots: { index: false, follow: false },
};

export default function AuthVerifyPage() {
  return (
    <PageStub
      eyebrow="auth · verify"
      title="check deine mails."
      lead="bestätigungs-page nach magic-link-anforderung. ehrliche sackgasse mit hinweis was als nächstes passiert."
      skeleton={[
        { label: 'bildmarke klein', meta: 'auth-mini-shell, kein menu' },
        { label: 'h1 plus kurz-text', meta: '„check deine mails." plus „wir haben dir einen link geschickt"' },
        { label: 'wartezeit-hinweis', meta: '„dauert kurz. wenn nichts ankommt, schau im spam"' },
        { label: 'privacy-helper-link', meta: 'caption-skala, „anonym bleiben"' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="redirect-logik: nach klick auf magic-link in mail wird /auth/verify?token=... aufgerufen. server-side verify, dann 302 auf /mit-glied/eingang. token single-use, 15-min-expiry."
    />
  );
}
