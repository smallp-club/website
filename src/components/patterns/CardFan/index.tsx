'use client';

import { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { ChevronArrow } from '@/components/icons/ChevronArrow';
import { EASE_OUT } from '@/lib/motion';
import styles from './CardFan.module.css';

export interface CardFanItem {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
}

export interface CardFanProps {
  items: readonly CardFanItem[];
  label?: string;
  id?: string;
}

type FanCfg = {
  rotateY: number;
  translateX: number;
  scale: number;
  opacity: number;
  zIndex: number;
  translateZ: number;
};

const desktopFanConfig: Record<number, FanCfg> = {
  0: { rotateY: 0,    translateX: 0,    scale: 1.00, opacity: 1.00, zIndex: 4, translateZ: 0    },
  1: { rotateY: -18,  translateX: -180, scale: 0.88, opacity: 0.55, zIndex: 3, translateZ: -120 },
  2: { rotateY: -30,  translateX: -290, scale: 0.78, opacity: 0.30, zIndex: 2, translateZ: -220 },
  3: { rotateY: 18,   translateX: 180,  scale: 0.88, opacity: 0.55, zIndex: 3, translateZ: -120 },
};

const mobileFanConfig: Record<number, FanCfg> = {
  0: { rotateY: 0,    translateX: 0,    scale: 1.00, opacity: 1.00, zIndex: 4, translateZ: 0    },
  1: { rotateY: -10,  translateX: -50,  scale: 0.92, opacity: 0.40, zIndex: 3, translateZ: -60  },
  2: { rotateY: -16,  translateX: -90,  scale: 0.85, opacity: 0.18, zIndex: 2, translateZ: -110 },
  3: { rotateY: 10,   translateX: 50,   scale: 0.92, opacity: 0.40, zIndex: 3, translateZ: -60  },
};

/**
 * CardFan — 3D-Fan-Karussell mit generischem Item-Schema.
 * Desktop: Hot-Zones links/rechts mit Glass-Bubble-Custom-Cursor.
 * Mobile: Hot-Zones aus, Swipe via Drag + sichtbare Nav-Pfeile, Peek-Edge der Nachbarkarten.
 */
export function CardFan({ items, label, id }: CardFanProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const [hoverZone, setHoverZone] = useState<'left' | 'right' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 480, damping: 38, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 480, damping: 38, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const fanConfig = isMobile ? mobileFanConfig : desktopFanConfig;

  function goTo(index: number) {
    if (items.length === 0) return;
    const next = (index + items.length) % items.length;
    setActiveIndex(next);
  }

  function handlePrev() { goTo(activeIndex - 1); }
  function handleNext() { goTo(activeIndex + 1); }

  function handleStageKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (items.length === 0) return;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handlePrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNext();
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(items.length - 1);
        break;
    }
  }

  function handleZoneMove(e: React.MouseEvent, zone: 'left' | 'right') {
    cursorX.set(e.clientX - 55);
    cursorY.set(e.clientY - 55);
    if (hoverZone !== zone) setHoverZone(zone);
  }

  function handleZoneEnter(e: React.MouseEvent, zone: 'left' | 'right') {
    const x = e.clientX - 55;
    const y = e.clientY - 55;
    cursorX.jump(x);
    cursorY.jump(y);
    springX.jump(x);
    springY.jump(y);
    setHoverZone(zone);
  }

  function handleZoneLeave() {
    setHoverZone(null);
  }

  if (reducedMotion) {
    return (
      <section id={id} className={styles.section}>
        {label && <h2 className={styles.label}>{label}</h2>}
        <div className={styles.reducedList}>
          {items.map((item, i) => (
            <article key={item.id} className={styles.reducedItem}>
              <div className={`${styles.image} ${styles[`imageTone${i % 4}`] ?? ''}`} aria-hidden="true" />
              <span className={styles.eyebrow}>{item.eyebrow}</span>
              <h3 className={styles.headline}>{item.headline}</h3>
              <p className={styles.body}>{item.body}</p>
              <a className={styles.cta} href={item.href}>{item.cta}</a>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={styles.section}>
      {label && <h2 className={styles.label}>{label}</h2>}

      {/* Maus-only Hot-Zones — Tab-Flow nutzt die Stage + Nav-Buttons */}
      <button
        type="button"
        tabIndex={-1}
        className={`${styles.hotZone} ${styles.hotZoneLeft}`}
        onMouseEnter={(e) => handleZoneEnter(e, 'left')}
        onMouseMove={(e) => handleZoneMove(e, 'left')}
        onMouseLeave={handleZoneLeave}
        onClick={handlePrev}
        aria-hidden="true"
      />
      <button
        type="button"
        tabIndex={-1}
        className={`${styles.hotZone} ${styles.hotZoneRight}`}
        onMouseEnter={(e) => handleZoneEnter(e, 'right')}
        onMouseMove={(e) => handleZoneMove(e, 'right')}
        onMouseLeave={handleZoneLeave}
        onClick={handleNext}
        aria-hidden="true"
      />

      <AnimatePresence>
        {hoverZone && (
          <motion.div
            className={styles.cursorBubble}
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            aria-hidden="true"
          >
            <ChevronArrow direction={hoverZone} className={styles.cursorArrow} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={styles.stage}
        role="group"
        aria-roledescription="Karten-Stapel"
        aria-label={label ?? 'Karten'}
        tabIndex={0}
        onKeyDown={handleStageKeyDown}
      >
        <motion.div
          className={styles.fanContainer}
          drag={isMobile ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -40 || info.velocity.x < -300) handleNext();
            else if (info.offset.x > 40 || info.velocity.x > 300) handlePrev();
          }}
        >
          {items.map((item, i) => {
            const offset = ((i - activeIndex) % items.length + items.length) % items.length;
            const cfg = fanConfig[offset];
            if (!cfg) return null;
            const isActive = offset === 0;
            const toneClass = styles[`imageTone${i % 4}`] ?? '';

            return (
              <motion.div
                key={item.id}
                className={`${styles.card} ${isActive ? styles.cardActive : styles.cardInactive}`}
                style={{ zIndex: cfg.zIndex }}
                animate={{
                  rotateY: cfg.rotateY,
                  x: cfg.translateX,
                  scale: cfg.scale,
                  opacity: cfg.opacity,
                  z: cfg.translateZ,
                }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                onClick={() => { if (!isActive) goTo(i); }}
                aria-hidden={!isActive}
                aria-current={isActive ? 'true' : undefined}
                aria-label={isActive ? undefined : `Karte: ${item.headline}`}
              >
                <div className={styles.cardInner}>
                  <div className={`${styles.image} ${toneClass}`} aria-hidden="true" />
                  <div className={styles.content}>
                    <span className={styles.eyebrow}>{item.eyebrow}</span>
                    <h3 className={styles.headline}>{item.headline}</h3>
                    {isActive && (
                      <>
                        <p className={styles.body}>{item.body}</p>
                        <a
                          className={styles.cta}
                          href={item.href}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.cta}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handlePrev}
            aria-label="Vorherige Karte"
          >
            <ChevronArrow direction="left" />
          </button>
          <span className={styles.navCounter} aria-hidden="true">
            {activeIndex + 1} / {items.length}
          </span>
          <span className={styles.srOnly} aria-live="polite" aria-atomic="true">
            Karte {activeIndex + 1} von {items.length}{items[activeIndex] ? `: ${items[activeIndex].headline}` : ''}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleNext}
            aria-label="Nächste Karte"
          >
            <ChevronArrow direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
