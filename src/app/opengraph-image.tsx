import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'small p club — no measure, no pressure';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const fontMedium = readFileSync(
    join(process.cwd(), 'public/fonts/Chillax-Medium.woff')
  );
  // Foto (Schnappschuss aus dem Landing-Bild-Slot) als Full-Bleed-Grund.
  const photo = readFileSync(
    join(process.cwd(), 'public/imagery/steps-reden.jpg')
  ).toString('base64');
  // Off-White-Wordmark unter dem Claim.
  const wordmark = readFileSync(
    join(process.cwd(), 'public/brand/smallpclub-wordmark-offwhite.svg')
  ).toString('base64');

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        {/* Foto: Männer im Hintergrund */}
        <img
          src={`data:image/jpeg;base64,${photo}`}
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            objectFit: 'cover',
            objectPosition: 'center 40%',
          }}
        />
        {/* Grün-schwarzer Scrim: oben licht (Männer sichtbar), unten dunkel
            (Textkontrast). Brand-Farben Deep-Turquoise → Schwarz. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            display: 'flex',
            backgroundImage:
              'linear-gradient(160deg, rgba(10,10,10,0.28) 0%, rgba(18,59,60,0.55) 52%, rgba(10,10,10,0.9) 100%)',
          }}
        />
        {/* Textblock unten links */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              color: '#F7F6F2',
              fontSize: '76px',
              fontFamily: 'Chillax',
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              marginBottom: '34px',
            }}
          >
            no measure, no pressure.
          </div>
          <img
            src={`data:image/svg+xml;base64,${wordmark}`}
            height={40}
            style={{ height: '40px' }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Chillax', data: fontMedium, weight: 500 }],
    }
  );
}
