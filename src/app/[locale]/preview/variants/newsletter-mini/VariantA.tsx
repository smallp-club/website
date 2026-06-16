'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Input } from '@/components/primitives/Input';
import styles from './VariantA.module.css';

/**
 * VariantA — Newsletter Mini "Stiller Aufruf"
 *
 * Zentrierte Chillax-Lowercase-Headline, kurzer Untertitel, Inline-Form
 * (Email + Turquoise-Pill-Button). Section atmet wie der Hero. Scroll-In
 * via Opacity-Fade + 16px translateY. Reduced-motion: direkt sichtbar.
 */
export function VariantA() {
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
      aria-labelledby="newsletter-mini-a-headline"
    >
      <div className={styles.inner}>
        <Heading level={2} variant="display" className={styles.headline} id="newsletter-mini-a-headline">
          bleib dran.
        </Heading>

        <Body tone="muted" className={styles.subtitle}>
          ein paar mal im monat ein gedanke, eine quelle, ein satz.
        </Body>

        {status === 'idle' ? (
          <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
            <label htmlFor="newsletter-mini-a-email" className={styles.label}>
              deine email
            </label>
            <Input
              id="newsletter-mini-a-email"
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

        <p className={styles.echo} aria-hidden="true">
          no measure, no pressure
        </p>
      </div>
    </section>
  );
}
