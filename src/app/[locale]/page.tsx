import { HeroTiefe } from '@/components/sections/HeroTiefe';

/**
 * Landing — die immersive Tiefen-Bühne ist der erste Eindruck.
 *
 * `HeroTiefe` rendert den vollen narrativen Flug (Hero → Wiedererkennung →
 * menschlicher Moment → Mythos → Fakt → 91%→2%-Partikel → Bewegung) als ein
 * einziges scroll-getriebenes Erlebnis und trägt selbst das <main>-Landmark.
 * Nav + Footer kommen aus dem LocaleLayout; der Footer gleitet am Ende über
 * den letzten Frame (Stacking-Context in HeroTiefe.module.css).
 *
 * Die frühere sektionsbasierte Landing liegt unter
 * `_archive/page.landing-sections.tsx.bak` (Revert-Referenz).
 */
export default function HomePage() {
  return <HeroTiefe />;
}
