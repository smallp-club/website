'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Body } from '@/components/primitives/Body';
import { Caption } from '@/components/primitives/Caption';
import { Input } from '@/components/primitives/Input';
import styles from './VariantC.module.css';

/**
 * VariantC — Newsletter Mini "Zweispaltig mit Membership-Anker"
 *
 * Linke Spalte: dreizeiliges Chillax-Extralight-Statement, Tagline-Echo als Brand-Anker.
 * Rechte Spalte: kompakter Form-Block (Eyebrow, Sub-Zeile, Email, Pill-Button, Footnote).
 * Desktop: Grid 1.1fr / 1fr. Mobile (<=768px): vertikal gestackt, Display skaliert via clamp.
 * Scroll-Reveal: Opacity-Fade + 16px translateY, beide Spalten gemeinsam (kein Stagger).
 * Reduced-Motion: direkt sichtbar, keine Transition.
 */
export function VariantC() {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

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
      aria-labelledby="newsletter-mini-c-statement"
    >
      <div className={styles.inner}>
        {/* Linke Spalte: Tagline-Echo + Membership-Anker */}
        <div className={styles.statementCol}>
          <h2 id="newsletter-mini-c-statement" className={styles.statement}>
            <span className={styles.line}>no measure,</span>
            <span className={styles.line}>no pressure,</span>
            <span className={styles.line}>bleib dran.</span>
          </h2>
        </div>

        {/* Rechte Spalte: Form-Block */}
        <div className={styles.formCol}>
          <Eyebrow as="p" className={styles.eyebrow}>
            club beitritt
          </Eyebrow>

          <Body tone="muted" className={styles.sub}>
            ein paar mal im monat ein gedanke aus der bewegung. mehr nicht.
          </Body>

          {status === 'idle' ? (
            <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
              <label htmlFor="newsletter-mini-c-email" className={styles.srOnly}>
                deine email
              </label>
              <Input
                id="newsletter-mini-c-email"
                type="email"
                name="email"
                inputSize="lg"
                required
                placeholder="deine email"
                className={styles.input}
              />
              <button type="submit" className={styles.button}>
                dabei sein
              </button>
            </form>
          ) : (
            <p className={styles.success} role="status" aria-live="polite">
              angekommen.
            </p>
          )}

          <Caption as="p" tone="muted" className={styles.footnote}>
            kein spam, keine pflicht, keine paywall.
          </Caption>
        </div>
      </div>
    </section>
  );
}
