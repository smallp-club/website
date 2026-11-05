import { Plakatnacht } from '@/components/v2/Plakat';

/**
 * Landing V2 — „Plakatnacht" (Branch v2-redesign). „Ein Satz" liegt in
 * src/components/_archive/v2-landing-ein-satz. Die bisherige immersive
 * Bühne `HeroTiefe` bleibt unangetastet im Repo (Revert: Import tauschen).
 *
 * Kein FAQPage-JSON-LD: die Fragen standen nirgends sichtbar auf der Seite
 * (Google-Richtlinie). Fragen und Antworten kommen, wenn überhaupt, als
 * sichtbarer Block auf eine eigene Seite. Audit 2026-11, K5.
 */
export default function HomePage() {
  return <Plakatnacht turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />;
}
