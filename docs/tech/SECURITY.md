# Security & Privacy — small p club

Sensibles Thema. Vertrauen ist das Produkt. Security ist nicht optional.

## Nicht verhandelbare Prinzipien

### Tracking & Analytics
- **Kein Google Analytics** — Besuche dürfen nicht an Google durchsickern
- **Keine Social Pixel** — kein Meta, kein LinkedIn, kein TikTok Pixel
- **Kein Social Login** auf öffentlichen Seiten (Google/FB erfahren sonst vom Besuch)
- **Referrer-Policy: no-referrer** — andere Sites sehen nicht woher User kommen
- Analytics nur via Umami (self-hosted, kein Cookie)

### Auth
- **Magic Links only** — kein Passwort = nichts zu klauen
- `AUTH_SECRET` (nicht NEXTAUTH_SECRET)
- Callback URLs validieren (kein Open Redirect)
- Magic Link Expiry ≤ 24h

### Daten
- **Row Level Security** in Supabase — User sieht nur eigene Daten
- Service Role Key: niemals im Client-Bundle, niemals `NEXT_PUBLIC_`
- `NEXT_PUBLIC_` nur für genuinely öffentliche Werte (Supabase URL + Anon Key)

### Newsletter
- **Double Opt-In** — DSGVO-Pflicht in DE, Beehiiv macht das automatisch
- Beehiiv: nur API-Integration, niemals JS-Embed

### Headers (aktiv in middleware.ts + next.config.ts)
- `Content-Security-Policy` — nonce-basiert, per Request generiert
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Rate Limiting
- Upstash Redis auf: Login, Newsletter-Signup, alle Mutation-Endpoints

### API Keys
- **Keine Keys im Code** — immer Vercel Environment Variables
- `.env.local` niemals committen (in .gitignore)
- `.env.example` immer aktuell halten (ohne echte Werte)

### DSGVO
- Kein Cookie-Banner nötig wenn kein Tracking — so gebaut
- Privacy Policy in Klartext, kein Juristendeutsch
- Vercel DPA muss signiert werden (Vercel Dashboard → Settings → Legal)
