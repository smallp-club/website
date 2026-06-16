import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** SVG-Größe in Pixeln. Default 18 (passt in Button neben Label). */
  size?: number;
  /** Optional zusätzliche className. */
  className?: string;
  /** Optional `aria-label` für standalone-Spinner. In Button wird Spinner via `aria-hidden` versteckt. */
  label?: string;
}

/**
 * Spinner — 3/4-Kreis-Stroke, rotiert. Brand-DNA via Kreis (Bildmarke-Primitive).
 * Reduced-Motion: statisches Icon ohne Rotation.
 *
 * Default-Verwendung: intern im `Button` als Loading-Indikator (aria-hidden).
 * Standalone: `label` setzen für Screen-Reader-Status.
 */
export function Spinner({ size = 18, className, label }: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, className].filter(Boolean).join(' ')}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="42 56"
        />
      </svg>
    </span>
  );
}
