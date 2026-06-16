'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Heading } from '@/components/primitives/Heading';
import { Input } from '@/components/primitives/Input';
import { Caption } from '@/components/primitives/Caption';
import styles from './VariantB.module.css';

/**
 * VariantB — Newsletter Mini "Manifest-Card"
 *
 * Off-White-Karte auf Off-White-Section. Die Karte trägt das Obround-Motiv
 * (--radius-2xl, 48px) und hebt sich nur durch eine feine Hairline ab — kein
 * Schatten-Gewicht, kein Hintergrund-Kontrast. Innen vertikal gestackt:
 * Eyebrow "membership" (Dark Turquoise, uppercase, --tracking-overline),
 * 1-Satz-Manifest in Chillax (Sentence Case, Heading Medium), Inline-Form
 * (Email + Turquoise-Pill-Button), Caption-Zeile mit zwei Negationen.
 *
 * Membership steht als Faktum, nicht als Aufruf — die Bewegung lebt von
 * denen die mitlesen, niemand wird beigetreten. Einziger Akzent: der
 * Turquoise-Button (COLOR_CONCEPT, "Bewegungs-Signal"-Sektion).
 *
 * Motion: Hover-Lift translateY(-1px) + shadow-md, --duration-base.
 * Scroll-Reveal: Opacity-Fade + 16px translateY, --duration-slow.
 * prefers-reduced-motion: kein Hover-Lift, kein Reveal — direkt sichtbar.
 */
export function VariantB() {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const headlineId = useId();
  const emailId = useId();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setRevealed(true);
      return;
    }
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('success');
  }

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-revealed={revealed ? 'true' : undefined}
      aria-labelledby={headlineId}
    >
      <div className={styles.card}>
        <span className={styles.eyebrow}>membership</span>

        <Heading level={2} variant="section" className={styles.headline} id={headlineId}>
          Die Bewegung lebt von denen die mitlesen.
        </Heading>

        {status === 'idle' ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor={emailId} className={styles.visuallyHidden}>
              deine email
            </label>
            <Input
              id={emailId}
              type="email"
              name="email"
              inputSize="md"
              required
              placeholder="deine email"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              mitlesen
            </button>
          </form>
        ) : (
          <p className={styles.success} role="status" aria-live="polite">
            angemeldet.
          </p>
        )}

        <Caption tone="muted" as="p" className={styles.fineprint}>
          jederzeit kündbar, kein spam.
        </Caption>
      </div>
    </section>
  );
}
