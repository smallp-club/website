'use client';

import { useState } from 'react';
import { LogoMark } from '@/components/primitives/LogoMark';

export default function LogoStandDemoPage() {
  const [angle, setAngle] = useState(90);
  const [tuneKey, setTuneKey] = useState(0);

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'var(--surface-bg)',
        padding: '48px',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-strong)',
      }}
    >
      <header style={{ marginBottom: 56, maxWidth: 720 }}>
        <p
          style={{
            fontSize: 13,
            color: 'var(--spc-slate)',
            letterSpacing: '0.04em',
            marginBottom: 12,
          }}
        >
          preview · logo-stand · nicht öffentlich
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 200,
            fontSize: 'clamp(40px, 6vw, 64px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'lowercase',
            margin: 0,
          }}
        >
          aufstehen.
        </h1>
        <p
          style={{
            marginTop: 24,
            fontSize: 17,
            color: 'var(--spc-slate)',
            lineHeight: 1.6,
            maxWidth: 600,
          }}
        >
          Drei trigger-modi nebeneinander. Bei mount läuft die animation nach
          280&nbsp;ms automatisch. Bei hover/click steuerst du sie selbst.
          Nur der Penis-Pfad (Path 2) rotiert um seinen Anschlusspunkt am
          Hodensack. Spring: <code>stiffness 80, damping 14, mass 1.4</code>.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32,
          maxWidth: 1100,
          marginBottom: 80,
        }}
      >
        <DemoTile label="Mount — Page-Load-Reveal">
          <LogoMark key={`mount-${tuneKey}`} trigger="mount" size={140} standAngle={angle} />
        </DemoTile>
        <DemoTile label="Hover — Nav-Pattern">
          <LogoMark trigger="hover" size={140} standAngle={angle} />
        </DemoTile>
        <DemoTile label="Click — Toggle">
          <LogoMark trigger="click" size={140} standAngle={angle} />
        </DemoTile>
      </section>

      <section
        style={{
          maxWidth: 720,
          padding: 28,
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: 14,
          background: 'var(--surface-bg)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 22,
            margin: '0 0 8px',
            textTransform: 'lowercase',
          }}
        >
          live-tuning
        </h2>
        <p style={{ fontSize: 13, color: 'var(--spc-slate)', margin: '0 0 20px' }}>
          Hodensack ist ein Vollkreis. Penis-Stem + Eichel rotieren als Gruppe
          um den Anschlusspunkt am Hodensack-Top.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Slider label={`Standwinkel — ${angle}°`} value={angle} min={-270} max={90} onChange={setAngle} />
          <button
            onClick={() => setTuneKey((k) => k + 1)}
            style={{
              alignSelf: 'flex-start',
              padding: '10px 22px',
              borderRadius: 999,
              border: '1.5px solid var(--text-strong)',
              background: 'transparent',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            mount-animation neu starten
          </button>
        </div>
      </section>
    </main>
  );
}

function DemoTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--surface-bg)',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 22,
        padding: 32,
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
      <p style={{ fontSize: 13, color: 'var(--spc-slate)', textAlign: 'center', margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
      <span style={{ color: 'var(--spc-slate)' }}>{label}</span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{ width: '100%' }}
      />
    </label>
  );
}
