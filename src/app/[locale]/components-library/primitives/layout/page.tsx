import { ContainerDemo } from '@/components/primitives/Container/Container.demo';
import { StackDemo } from '@/components/primitives/Stack/Stack.demo';
import { SectionDemo } from '@/components/primitives/Section/Section.demo';
import styles from '../../library.module.css';

export const metadata = {
  title: 'Layout-Primitives — Components Library',
  robots: { index: false, follow: false },
};

export default function LayoutPrimitivesPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.eyebrow}>primitives · layout</div>
        <h1 className={styles.title}>Container · Section · Stack</h1>
        <p className={styles.subtitle}>
          Drei strukturelle Bausteine mit klaren Verantwortlichkeiten. Section ownt Background +
          Padding-Y, Container ownt Max-Width + Gutter, Stack ownt Inner-Rhythm.
        </p>
      </header>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Container</h2>
          <span className={styles.demoMeta}>strukturelles Max-Width-Wrapper</span>
        </div>
        <p className={styles.demoNote}>
          Vier Width-Varianten: <code>prose</code> (~680 px Reading-Width), <code>default</code>{' '}
          (1200 px Editorial), <code>wide</code> (1440 px Galerien), <code>bleed</code> (100 % ohne
          Gutter). Container hat NIE einen Background — das ist Section-Verantwortung.
        </p>
        <ContainerDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Section</h2>
          <span className={styles.demoMeta}>vollflächige Story-Sektion</span>
        </div>
        <p className={styles.demoNote}>
          Tone: <code>light</code> (Off-White, Default), <code>inverse</code> (Black, max 1×/Page),{' '}
          <code>deep</code> (Dark Turquoise, nur Footer). Rhythm: <code>tight | standard | loose
          | flush</code>, responsive Padding-Y. <code>firstOfPage</code> entfernt nur das obere
          Padding. <code>minHeight=&quot;screen&quot;</code> = 100 dvh (iOS-safe).
        </p>
        <SectionDemo />
      </article>

      <article className={styles.demoBlock}>
        <div className={styles.demoHead}>
          <h2 className={styles.demoName}>Stack</h2>
          <span className={styles.demoMeta}>Inner-Rhythm via Flex-Gap</span>
        </div>
        <p className={styles.demoNote}>
          <code>gap</code> ist Pflicht (1–11 → <code>--space-1</code> … <code>--space-11</code>) —
          kein Default, erzwingt bewusste Rhythmus-Entscheidung. <code>direction</code>{' '}
          <code>column</code> (Default) / <code>row</code>, plus <code>align</code>,{' '}
          <code>justify</code>, <code>wrap</code>. <code>as=&quot;ul&quot;</code> für semantische
          Listen.
        </p>
        <StackDemo />
      </article>
    </>
  );
}
