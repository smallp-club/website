'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Section } from '@/components/primitives/Section';
import { Container } from '@/components/primitives/Container';
import { Stack } from '@/components/primitives/Stack';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Body } from '@/components/primitives/Body';
import { Button } from '@/components/primitives/Button';
import styles from './ThresholdGate.module.css';

interface ThresholdGateProps {
  /**
   * Alles, was nach der Selbst-Selektions-Schwelle sichtbar werden soll
   * (drei-säulen-wert-versprechen, „was es nicht ist", Magic-Link-Form,
   * shop-hinweis).
   */
  children: ReactNode;
}

/**
 * Brand-Statement-Schwelle vor der Magic-Link-Form.
 *
 * Selbst-Selektion: wer den Bindestrich-Witz versteht oder die Haltung
 * teilt, klickt durch. Wer nicht, geht von selbst. Kein Quiz, kein
 * Predigt-Text. Brand-Voice trägt die ganze Bedeutung.
 *
 * Doktrin: docs/project/MEMBER_SECURITY.md §3 Linie 2.
 */
export function ThresholdGate({ children }: ThresholdGateProps) {
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!revealed || !revealedRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    revealedRef.current.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [revealed]);

  return (
    <>
      <Section tone="light" rhythm="loose" aria-label="schwelle">
        <Container width="prose">
          <Stack gap={6}>
            <Stack gap={4}>
              <Eyebrow>mit-glied</Eyebrow>
              <Heading level={1} variant="display">
                mit-glied. auch ohne-glied.
              </Heading>
              <Body>
                kein abo, kein passwort, kein konto im klassischen sinn. eine
                mail genügt. magic-link kommt rein, klick, drin.
              </Body>
            </Stack>

            {!revealed && (
              <div className={styles.gate}>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setRevealed(true)}
                  aria-expanded={false}
                  aria-controls="mit-glied-revealed"
                >
                  verstanden, weiter
                </Button>
              </div>
            )}
          </Stack>
        </Container>
      </Section>

      {revealed && (
        <div
          ref={revealedRef}
          id="mit-glied-revealed"
          className={styles.revealed}
        >
          {children}
        </div>
      )}
    </>
  );
}
