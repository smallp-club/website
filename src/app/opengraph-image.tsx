import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'small p club — no measure, no pressure';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const fontMedium = readFileSync(join(process.cwd(), 'public/fonts/Chillax-Medium.woff'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '80px',
          backgroundColor: '#0A0A0A',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7BDCB5', marginRight: '14px' }} />
          <span style={{ display: 'flex', color: '#6F6C63', fontSize: '13px', fontFamily: 'Chillax', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            small p club
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            color: '#F7F6F2',
            fontSize: '72px',
            fontFamily: 'Chillax',
            fontWeight: 500,
            lineHeight: 1.05,
            marginBottom: '40px',
            letterSpacing: '-0.01em',
          }}
        >
          no measure, no pressure.
        </div>
        <div style={{ display: 'flex', width: '56px', height: '2px', backgroundColor: '#7BDCB5' }} />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Chillax', data: fontMedium, weight: 500 }],
    }
  );
}
