'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { caveat } from './fonts';
import styles from './Plakat.module.css';

export type VoiceNote =
  | { kind: 'story'; id: string; body: string; pseudonym: string }
  | { kind: 'prompt'; id: string; prompt: string };

const PAPERS = ['notePaper', 'noteKraft', 'noteAct', 'noteLined', 'noteCream'] as const;
const TILTS = [-2.2, 1.6, -0.8, 2.4, -1.4, 1];
const SPRING = { type: 'spring', stiffness: 160, damping: 24 } as const;

/**
 * Section 5 — Stimmen als Zettel an der Wand.
 *
 * Echte, freigegebene Berichte stehen als Handschrift-Zettel mit Pseudonym.
 * Solange es zu wenige gibt, füllen leere Zettel mit den fünf Schreib-
 * Prompts die Wand. Es werden nie Stimmen erfunden (keine Fake-Testimonials).
 */
export function Voices({ notes }: { notes: ReadonlyArray<VoiceNote> }) {
  const firstPrompt = notes.findIndex((n) => n.kind === 'prompt');

  return (
    <section className={`${styles.voices} ${caveat.variable}`} aria-labelledby="plakat-voices">
      <div className={styles.voicesHead}>
        <h2 id="plakat-voices" className={styles.h2}>
          stimmen.
        </h2>
        <p className={styles.body}>
          mit-glieder schreiben hier, was sie sonst keinem sagen. unter ausgedachtem namen, gelesen
          von uns, bevor es an die wand kommt.
        </p>
      </div>

      <ul className={styles.notes}>
        {notes.map((n, i) => (
          <motion.li
            key={n.id}
            className={`${styles.note} ${styles[PAPERS[i % PAPERS.length]!]}`}
            initial={{ y: -40, scale: 0.94, rotate: TILTS[i % TILTS.length]! * 3 }}
            whileInView={{ y: 0, scale: 1, rotate: TILTS[i % TILTS.length]! }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...SPRING, delay: i * 0.08 }}
          >
            <span className={styles.tape} aria-hidden="true" />
            {n.kind === 'story' ? (
              <figure className={styles.noteFigure}>
                <blockquote className={styles.noteHand}>{n.body}</blockquote>
                <figcaption className={styles.noteName}>{n.pseudonym}</figcaption>
              </figure>
            ) : (
              // Leerer Zettel = Einladung. Führt zum Beitritt, dort geht das Schreiben los.
              <Link href="/mit-glied" className={styles.notePrompt}>
                <span className={styles.notePromptLabel}>{n.prompt}</span>
                <span className={styles.notePromptBlank}>
                  {i === firstPrompt ? 'dein satz. unter ausgedachtem namen.' : '\u00a0'}
                </span>
              </Link>
            )}
          </motion.li>
        ))}
      </ul>

      <div className={styles.voicesFoot}>
        <Link href="/stimmen" className={styles.inlineLinkDark}>
          alle stimmen lesen <span aria-hidden="true">→</span>
        </Link>
        <Link href="/mit-glied" className={styles.inlineLinkDark}>
          deine stimme dazukleben <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
