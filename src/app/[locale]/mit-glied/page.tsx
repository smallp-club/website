import { PageStub } from '@/components/PageStub';

export const metadata = {
  title: 'mit-glied. auch ohne-glied. — small p club',
  description: 'magic-link-login. immer kostenlos, immer freiwillig, immer ohne paywall.',
};

export default function MitGliedPreLoginPage() {
  return (
    <PageStub
      eyebrow="mit-glied · eingang"
      title="mit-glied. auch ohne-glied."
      lead="immer kostenlos. immer freiwillig. immer ohne paywall. mehr nähe, nicht mehr zugang."
      skeleton={[
        { label: 'h1 als brand-schwelle', meta: '„mit-glied. auch ohne-glied." als großtypografie' },
        { label: 'drei wert-versprechen', meta: 'newsletter quartalsweise. werkstatt-zugang (drafts mitlesen, quellen-keller). sticker-voucher und vorab-zugang zu merch (sobald shop live)' },
        { label: 'was es nicht ist', meta: 'kein abo, kein paid tier, niemals. kontrast-block' },
        { label: 'magic-link-form plus newsletter-opt-in', meta: 'email-feld pflicht. checkbox für newsletter (default off, granularer dsgvo-consent). cloudflare turnstile vor dem submit' },
        { label: 'privacy-helper-link', meta: 'caption-skala. „du kannst alles ohne account nutzen."' },
        { label: 'sitefooter', meta: 'standard' },
      ]}
      phase="kommt mit phase 5 (member-bereich pre-launch-pflicht)."
      note="auth-stack: auth.js v5 mit all-inkl smtp (mit-glied@smallp.club), database-sessions für logout-on-all-devices, magic-link single-use 15-min-expiry."
    />
  );
}
