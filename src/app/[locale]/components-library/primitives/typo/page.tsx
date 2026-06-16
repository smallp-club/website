import { HeadingDemo } from '@/components/primitives/Heading/Heading.demo';
import { EyebrowDemo } from '@/components/primitives/Eyebrow/Eyebrow.demo';
import { SourceDemo } from '@/components/primitives/Source/Source.demo';
import { TaglineDemo } from '@/components/primitives/Tagline/Tagline.demo';
import { BodyDemo } from '@/components/primitives/Body/Body.demo';
import { LeadDemo } from '@/components/primitives/Lead/Lead.demo';
import { CaptionDemo } from '@/components/primitives/Caption/Caption.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Typo-Primitives — Components Library',
  robots: { index: false, follow: false },
};

export default function TypoPrimitivesPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>primitives · typo</div>
        <h1 className={styles.title}>Tagline · Heading · Lead · Body · Eyebrow · Caption · Source</h1>
        <p className={styles.subtitle}>
          Sieben Typo-Primitives. Chillax trägt die Display-Statements (Tagline, Heading, Eyebrow).
          Inter trägt die Information (Lead, Body, Caption). Source ist strukturierte
          Quellenangabe mit Pflicht-Feldern.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Tagline</h2>
          <span className={styles.demoMeta}>hartkodiert · Brand-DNA</span>
        </div>
        <p className={styles.demoNote}>
          Nimmt keine <code>children</code> entgegen — der String ist Brand-Schutz. Default
          <code> level=1 variant=&quot;display&quot;</code> für Hero. Für Sub-Anker
          <code> level=2 variant=&quot;lede&quot;</code>.
        </p>
        <TaglineDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Heading</h2>
          <span className={styles.demoMeta}>level (Semantik) + variant (Visual) entkoppelt</span>
        </div>
        <p className={styles.demoNote}>
          Vier visuelle Variants: <code>display</code> (Hero-Statements), <code>lede</code>
          (Section-Aufmacher), <code>section</code> (Sub-Sections), <code>sub</code> (Card-Headlines).
          <code>display</code> und <code>lede</code> sind CSS-lowercase-locked — Brand-Doktrin.
          <code>text-wrap: balance</code> per Default an. Tone <code>strong</code> /
          <code>muted</code>.
        </p>
        <HeadingDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Lead</h2>
          <span className={styles.demoMeta}>Intro-Paragraph unter Heading</span>
        </div>
        <p className={styles.demoNote}>
          Inter Regular 19 px, line-height relaxed, max-width 60 ch. Eine Lead-Paragraph pro
          Section — etwas größer und straffer als Body. Danach übernimmt Body.
        </p>
        <LeadDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Body</h2>
          <span className={styles.demoMeta}>Standard-Fließtext</span>
        </div>
        <p className={styles.demoNote}>
          Inter Regular 17 px, line-height relaxed, max-width 68 ch. Tones <code>strong</code>,
          <code>body</code> (Default = Ink), <code>muted</code>, <code>faint</code>. Weight
          <code>regular</code> oder <code>medium</code> — Bold ist im Brand-Body verboten.
        </p>
        <BodyDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Eyebrow</h2>
          <span className={styles.demoMeta}>Chillax lowercase · brechen mit AI-Default-uppercase</span>
        </div>
        <p className={styles.demoNote}>
          14 px Chillax Light, lowercase, minimaler Tracking-Hauch. Tones: <code>default</code>
          (Dark Turquoise, Authority) und <code>muted</code> (Slate, leise). Polymorphisch via
          <code> as=&quot;span&quot;</code> (Default), <code>p</code> oder <code>time</code>.
        </p>
        <EyebrowDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Caption</h2>
          <span className={styles.demoMeta}>Hilfstexte, Bildunterschriften, kleine Hinweise</span>
        </div>
        <p className={styles.demoNote}>
          Inter Regular 13 px, Slate (Default), line-height snug. Polymorphisch via
          <code> as=&quot;span&quot;</code> (Default), <code>p</code>, <code>small</code>,
          <code>figcaption</code>.
        </p>
        <CaptionDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Source</h2>
          <span className={styles.demoMeta}>strukturiert · keine Freitext-Schlampigkeit</span>
        </div>
        <p className={styles.demoNote}>
          Pflicht-Felder <code>author</code>, <code>publication</code>, <code>year</code>; optional
          <code>n</code>, <code>doi</code>, <code>href</code>. Publication kursiv (
          <code>&lt;cite&gt;</code>). <code>n</code> wird locale-aware formatiert (DE 15.521 vs EN
          15,521). Bei <code>doi</code>/<code>href</code> wird die ganze Zeile zum Link mit
          underline-thickness-Hover.
        </p>
        <SourceDemo />
      </article>
    </>
  );
}
