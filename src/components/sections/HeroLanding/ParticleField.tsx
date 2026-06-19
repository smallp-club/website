'use client';

/**
 * ParticleField — „Der Schwarm der Mit-Glieder", scroll-getrieben.
 *
 * 3-Akt-Choreografie:
 *   1. SCHWEBE: ~80–140 Brand-Marken in verschiedenen Größen schweben.
 *      Verschiedene Größen = „das Maß", das die Brand abschaffen will.
 *   2. STÖRUNG: Cursor stößt sie weg.
 *   3. KOLLAPS (scroll-driven): bei Scroll-Progress 0.2 → 0.7 werden alle
 *      Marken gleich groß und fliegen zur Mitte. Auflösung der Skala.
 *
 * Marken-Geometrie ist 1:1 die LogoMark-Primitive:
 *   - Hodensack-Kreis r=70 auf 200×200 viewBox → r=0.35*size
 *   - Stroke-Width 22 → 0.11*size
 *   - P-Stem: (88,38) → (50,168) mit round-linecap
 *
 * Scroll-Sense: per Scroll-Progress 0..1 über die Hero-Höhe.
 * Reduced-Motion: Schwarm statisch, kein Cursor-Effect, Kollaps trotzdem
 *   per Scroll (sonst kommt Tagline nie).
 */

import { useEffect, useRef } from 'react';

interface Mark {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  osize: number;
  phase: number;
  variant: 0 | 1;
}

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

const CURSOR_INFLUENCE = 200;
const CURSOR_FORCE = 0.22;
const RETURN_FORCE = 0.04;
const FRICTION = 0.88;
const FLOAT_AMP = 18;
const FLOAT_SPEED = 0.0006;
const TARGET_SIZE = 64;

const COLOR_DEEP = '#1D5556';
const COLOR_TURQ = '#7BDCB5';
const COLOR_OFFWHITE = '#F7F6F2';

/* Echte Bildmarke 1:1 aus public/brand/smallpclub-mark-deep.svg.
   Zwei Path-Strings, gefüllt (fillRule nonzero). viewBox: 433 0 162 147.
   Mark-Center: (433 + 162/2, 0 + 147/2) = (514, 73.5).
   Longest-Dimension der viewBox: 162. */
const MARK_VIEWBOX_W = 162;
const MARK_VIEWBOX_CX = 514;
const MARK_VIEWBOX_CY = 73.5;

const MARK_PATH_OUTER =
  'M587.44,71.18c0,1.6-.05,3.18-.16,4.74-.2,3.22-.64,6.4-1.26,9.49-.66,3.25-1.53,6.42-2.63,9.49-1.16,3.29-2.55,6.46-4.16,9.5-.4.78-.83,1.54-1.27,2.3-1.43,2.5-3.02,4.89-4.74,7.19-1.49,1.98-3.08,3.88-4.76,5.69-1.22,1.31-2.49,2.58-3.8,3.8-1.81,1.68-3.71,3.27-5.69,4.76-2.29,1.71-4.69,3.3-7.18,4.74-.76.44-1.53.87-2.31,1.27-3.04,1.61-6.21,3.01-9.5,4.16-3.07,1.09-6.24,1.97-9.49,2.63-3.09.63-6.26,1.06-9.49,1.26-1.57.11-3.15.16-4.74.16s-3.18-.05-4.75-.16c-3.22-.21-6.4-.64-9.49-1.26-3.25-.66-6.42-1.53-9.49-2.63-3.28-1.16-6.46-2.55-9.5-4.16-.78-.4-1.54-.83-2.3-1.27-2.5-1.43-4.89-3.02-7.19-4.74-.05-.04-.09-.07-.14-.11,0,0,0-.02,0-.03l.14-.29,2.1-4.33,4.6-9.49,2.79-5.76,1.81-3.73,2.21-4.56,2.4-4.94,3.09-6.37,1.51-3.12,4.6-9.49,3.38-6.97,1.22-2.53,4.6-9.49.62-1.27.31-.64.22-.46c.69-1.4,1.53-2.71,2.51-3.92.95-1.18,2.02-2.26,3.2-3.19,1.51-1.23,3.19-2.25,5.01-3.02h0c.42-.19.85-.35,1.29-.5,2.22-.79,4.62-1.22,7.12-1.22.8,0,1.6.05,2.37.13,3.48.38,6.71,1.6,9.49,3.47.53.36,1.05.74,1.55,1.15,3.05,2.45,5.4,5.73,6.73,9.49.79,2.22,1.22,4.62,1.22,7.12,0,.8-.05,1.59-.13,2.37-.39,3.49-1.61,6.72-3.47,9.5-1.55,2.33-3.56,4.33-5.89,5.89-2.78,1.86-6.01,3.09-9.49,3.47-.71.08-1.44.12-2.18.13h-7.44c-3.76,0-7.01,2.19-8.54,5.35v.02s-.82,1.7-.82,1.7l-1.16,2.42-4.54,9.5-2.91,6.09c2.75,1.13,5.63,2.01,8.61,2.6,1.91.38,3.85.65,5.84.79,1.16.09,2.34.13,3.53.13h.13c1.14,0,2.27-.05,3.4-.13,2.07-.15,4.11-.43,6.09-.84,3.3-.67,6.48-1.7,9.49-3.03,3.4-1.49,6.57-3.36,9.5-5.58.02,0,.03-.02.05-.03,3.57-2.71,6.74-5.91,9.42-9.5,0,0,.02-.02.02-.03,2.17-2.91,4.01-6.09,5.47-9.46,1.3-3.02,2.31-6.19,2.97-9.49.6-3.02.92-6.15.92-9.36v-.13c0-3.25-.34-6.43-.98-9.49-.67-3.3-1.7-6.48-3.03-9.49-1.44-3.28-3.24-6.36-5.36-9.2-.07-.1-.15-.19-.22-.29-2.64-3.5-5.77-6.62-9.26-9.26-.1-.08-.19-.15-.29-.22-2.84-2.12-5.92-3.91-9.2-5.36-3.01-1.33-6.19-2.36-9.49-3.03-3.06-.64-6.24-.97-9.49-.98h-.13l-9.36-.06-9.49-.06h-.06c-3.43,0-6.65.91-9.43,2.52-2.9,1.66-5.32,4.07-6.98,6.97l-.29.53c-.26.49-.5.99-.72,1.5l-.04.09-1.47,3.09-1.2,2.54-.83,1.74-2.16,4.55-2.34,4.95-1.93,4.07v.02s-1.03,2.15-1.03,2.15l-1.53,3.24-4.5,9.49-3.46,7.29-1.04,2.2-4.5,9.49-3.96,8.36-.53,1.13-2.65,5.59c-.83-1.82-1.58-3.68-2.25-5.59-.06-.16-.12-.32-.17-.47-1.01-2.92-1.84-5.93-2.46-9.02-.63-3.09-1.06-6.26-1.26-9.49-.11-1.57-.16-3.15-.16-4.74s.05-3.18.16-4.75c.21-3.22.64-6.4,1.26-9.49.66-3.25,1.53-6.42,2.63-9.49,1.16-3.29,2.55-6.46,4.16-9.5.4-.78.83-1.54,1.27-2.3,1.43-2.5,3.02-4.9,4.74-7.19,1.49-1.98,3.07-3.88,4.75-5.68,1.22-1.32,2.49-2.59,3.81-3.81,1.81-1.68,3.71-3.27,5.68-4.75,2.29-1.72,4.69-3.31,7.19-4.74.76-.44,1.53-.87,2.3-1.27,3.04-1.61,6.22-3.01,9.5-4.16,3.07-1.09,6.24-1.97,9.49-2.63,3.09-.63,6.26-1.05,9.49-1.26,1.57-.11,3.15-.16,4.75-.16s3.18.05,4.74.16c3.22.2,6.4.64,9.49,1.26,3.25.66,6.42,1.53,9.49,2.63,3.29,1.16,6.46,2.55,9.5,4.16.78.4,1.55.83,2.31,1.27,2.49,1.43,4.89,3.02,7.18,4.74,1.98,1.48,3.88,3.07,5.68,4.75,1.32,1.22,2.59,2.49,3.81,3.81,1.68,1.81,3.26,3.71,4.75,5.68,1.72,2.29,3.31,4.69,4.74,7.19.44.76.87,1.53,1.27,2.3,1.61,3.04,3.01,6.21,4.16,9.5,1.09,3.07,1.97,6.24,2.63,9.49.63,3.09,1.05,6.26,1.26,9.49.11,1.57.16,3.15.16,4.75Z';

const MARK_PATH_INNER =
  'M473.41,128.03c-.2,1.71-.67,3.34-1.36,4.84-1.61,3.53-4.46,6.38-7.98,8-1.99.92-4.2,1.46-6.53,1.49h-.56c-8.85-.15-15.99-7.37-15.99-16.26,0-2.49.57-4.84,1.57-6.95l.22-.45,8.61-18.2c.6,1.33,1.23,2.63,1.91,3.91,0,.02,0,.03.02.05.4.76.81,1.51,1.25,2.26.31.53.62,1.06.95,1.59.22.38.46.74.71,1.12.07.13.16.26.25.4,0,.02.02.03.03.05.44.69.9,1.37,1.37,2.05.16.23.33.47.5.7.3.43.62.87.94,1.29,1.49,1.98,3.08,3.88,4.76,5.69,1.22,1.31,2.49,2.58,3.8,3.8,1.65,1.53,3.38,2.99,5.18,4.36.12.09.24.19.36.28h0Z';

export interface ParticleFieldProps {
  /** Wird ausgelöst, wenn der Kollaps eine Schwelle überschreitet. */
  onProgressChange?: (progress: number) => void;
}

export function ParticleField({ onProgressChange }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const marksRef = useRef<Mark[]>([]);
  const pointerRef = useRef<PointerState>({ x: -9999, y: -9999, active: false });
  const scrollProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext('2d');
    if (!ctxEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reducedMotionRef.current = reduced;

    // Path2D-Instanzen einmal bauen, in jeder drawMark-Iteration wiederverwenden.
    const markPathOuter = new Path2D(MARK_PATH_OUTER);
    const markPathInner = new Path2D(MARK_PATH_INNER);

    function buildMarks(width: number, height: number) {
      const count = Math.min(140, Math.max(70, Math.floor((width * height) / 22000)));
      const marks: Mark[] = [];

      const cols = Math.ceil(Math.sqrt(count * (width / height)));
      const rows = Math.ceil(count / cols);
      const cellW = width / cols;
      const cellH = height / rows;
      const padding = Math.min(width, height) * 0.08;

      let i = 0;
      for (let row = 0; row < rows && i < count; row++) {
        for (let col = 0; col < cols && i < count; col++) {
          const baseX = padding + (col + 0.5) * cellW * ((width - padding * 2) / width);
          const baseY = padding + (row + 0.5) * cellH * ((height - padding * 2) / height);
          const jitterX = (Math.random() - 0.5) * cellW * 0.65;
          const jitterY = (Math.random() - 0.5) * cellH * 0.65;
          const size = 16 + Math.random() * 44;
          marks.push({
            ox: baseX + jitterX,
            oy: baseY + jitterY,
            x: baseX + jitterX,
            y: baseY + jitterY,
            vx: 0,
            vy: 0,
            size,
            osize: size,
            phase: Math.random() * Math.PI * 2,
            variant: Math.random() < 0.6 ? 0 : 1,
          });
          i++;
        }
      }

      marksRef.current = marks;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildMarks(w, h);
    }

    resize();
    window.addEventListener('resize', resize);

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
    }
    function onPointerLeave() {
      pointerRef.current.active = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    }

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);

    /** Scroll-Progress: 0 = Hero komplett im View, 1 = Hero komplett raus. */
    function updateScrollProgress() {
      const section = canvas.parentElement;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionH = rect.height || 1;
      // Progress wenn Top-Edge vom Hero über den Viewport-Top hinaus scrollt.
      const scrolled = -rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / sectionH));
      scrollProgressRef.current = raw;
      if (Math.abs(raw - lastProgressRef.current) > 0.01) {
        lastProgressRef.current = raw;
        onProgressChange?.(raw);
      }
    }

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    /** Zeichnet die echte Brand-Mark (zwei gefüllte Path2D-Instanzen).
        Transform-Sequenz: nach (x,y), Skalierung auf size, dann
        viewBox-Center-Offset, damit die Mark um (x,y) zentriert ist. */
    function drawMark(
      x: number,
      y: number,
      size: number,
      color: string
    ) {
      const scale = size / MARK_VIEWBOX_W;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.translate(-MARK_VIEWBOX_CX, -MARK_VIEWBOX_CY);

      ctx.fillStyle = color;
      ctx.fill(markPathOuter);
      ctx.fill(markPathInner);

      ctx.restore();
    }

    function frame() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const now = performance.now();

      ctx.fillStyle = COLOR_OFFWHITE;
      ctx.fillRect(0, 0, w, h);

      const marks = marksRef.current;
      const pointer = pointerRef.current;
      const reduced = reducedMotionRef.current;
      const scrollP = scrollProgressRef.current;

      // Kollaps-Phase: 0.15 (Start) bis 0.45 (Final).
      // Danach bleibt der Final-State bis Progress 1.0 — der User hat
      // 55 % der Hero-Höhe Zeit, die Tagline zu lesen und drüber zu schauen.
      const collapseStart = 0.15;
      const collapseEnd = 0.45;
      const rawCollapse =
        (scrollP - collapseStart) / (collapseEnd - collapseStart);
      const collapseProgress = Math.max(0, Math.min(1, rawCollapse));
      const ease = 1 - Math.pow(1 - collapseProgress, 3);

      const targetX = w / 2;
      const targetY = h / 2;

      for (let i = 0; i < marks.length; i++) {
        const m = marks[i];
        if (!m) continue;

        if (collapseProgress > 0) {
          // Kollaps: interpoliere Position UND Größe zum Target.
          const targetPosX = m.ox + (targetX - m.ox) * ease;
          const targetPosY = m.oy + (targetY - m.oy) * ease;
          const dx = targetPosX - m.x;
          const dy = targetPosY - m.y;
          m.vx += dx * 0.16;
          m.vy += dy * 0.16;
          m.size = m.osize + (TARGET_SIZE - m.osize) * ease;
        } else {
          // Schwebe.
          if (!reduced) {
            const floatX = Math.sin(now * FLOAT_SPEED + m.phase) * FLOAT_AMP;
            const floatY =
              Math.cos(now * FLOAT_SPEED * 0.7 + m.phase * 1.3) * FLOAT_AMP * 0.6;
            const dx = m.ox + floatX - m.x;
            const dy = m.oy + floatY - m.y;
            m.vx += dx * RETURN_FORCE;
            m.vy += dy * RETURN_FORCE;
          } else {
            m.x = m.ox;
            m.y = m.oy;
            m.vx = 0;
            m.vy = 0;
          }

          // Cursor-Repulsion.
          if (pointer.active && !reduced) {
            const ddx = m.x - pointer.x;
            const ddy = m.y - pointer.y;
            const dist2 = ddx * ddx + ddy * ddy;
            if (dist2 < CURSOR_INFLUENCE * CURSOR_INFLUENCE && dist2 > 0.1) {
              const dist = Math.sqrt(dist2);
              const force = (1 - dist / CURSOR_INFLUENCE) * CURSOR_FORCE;
              m.vx += (ddx / dist) * force * CURSOR_INFLUENCE;
              m.vy += (ddy / dist) * force * CURSOR_INFLUENCE;
            }
          }

          // Size-Reset wenn vom Kollaps zurück.
          if (m.size !== m.osize) {
            m.size += (m.osize - m.size) * 0.1;
          }
        }

        if (!reduced || collapseProgress > 0) {
          m.vx *= FRICTION;
          m.vy *= FRICTION;
          m.x += m.vx;
          m.y += m.vy;
        }

        // Kein End-Fade — der Final-State bleibt voll sichtbar bis Progress 1.0.
        const color = m.variant === 0 ? COLOR_DEEP : COLOR_TURQ;
        drawMark(m.x, m.y, m.size, color);
      }

      // Während Kollaps-Mitte: leichter Glow.
      if (collapseProgress > 0.4) {
        const glowAlpha = Math.min(1, (collapseProgress - 0.4) * 2) * 0.14;
        const radial = ctx.createRadialGradient(
          targetX,
          targetY,
          0,
          targetX,
          targetY,
          240
        );
        radial.addColorStop(0, `rgba(123, 220, 181, ${glowAlpha})`);
        radial.addColorStop(1, 'rgba(123, 220, 181, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateScrollProgress);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [onProgressChange]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="ein schwarm aus brand-marken — scrollt zur monumentalen mark zusammen"
      role="img"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        cursor: 'crosshair',
        touchAction: 'none',
      }}
    />
  );
}
