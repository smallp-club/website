# AVV-Sammelmappe — small p club

DSGVO-Audit-Spur. Alle Auftragsverarbeitungs-Verträge (AVV / DPA), Privacy-Policies
und Subprocessor-Listen unserer Drittdienste, gesammelt am **24. Juni 2026**.

Bei einer DSGVO-Behörden-Anfrage (z.B. nach Art. 28 Abs. 3, Art. 30 oder Art. 32)
musst du diese Mappe binnen 14 Tagen vorzeigen können. Liegt **außerhalb** des
Git-Repos (siehe `.gitignore`) und wird nicht öffentlich.

## Inventar

| Provider     | Dokumente                                          | Was sie machen                                      |
|--------------|----------------------------------------------------|-----------------------------------------------------|
| **vercel**   | dpa · privacy-policy                                | Hosting, Edge, Serverless Functions                 |
| **supabase** | dpa · tia · privacy-policy                          | Auth, DB, Realtime, Storage                         |
| **cloudflare** | dpa · subprocessors · privacy-policy              | DNS, CDN, DDoS, WAF, Turnstile (Bot-Schutz)         |
| **brevo**    | tos-with-dpa (DPA als Appendix 3) · privacy-policy · anti-spam | Newsletter-Versand, DOI-Pipeline       |
| **all-inkl** | avv-personalisiert (Vertrag mit Kundennr.) · privacy-policy | Mail-SMTP (mit-glied@smallp.club Magic-Links) |
| **upstash**  | dpa · subprocessors · privacy-policy                | Redis für Rate-Limiting                             |
| **github**   | dpa · privacy-policy · subprocessors                | Code-Hosting (Microsoft-Konzern, DPF-zertifiziert)  |

19 PDFs gesamt.

## Naming-Konvention

```
legal/avv/<provider>/<doc-type>.pdf
```

- `dpa.pdf` — Data Processing Agreement / Auftragsverarbeitungsvertrag
- `tia.pdf` — Transfer Impact Assessment (DSGVO Art. 46 für US-Drittland-Transfer)
- `privacy-policy.pdf` — Datenschutzerklärung des Providers
- `subprocessors.pdf` — Liste der weiteren Auftragsverarbeiter
- `avv-personalisiert.pdf` — auf uns ausgestellter AVV (nur bei dt. Anbietern üblich)
- `tos-with-dpa.pdf` — Terms of Service mit DPA als Appendix (Brevo-Pattern)
- `anti-spam.pdf` — Brevo-spezifisch (Pflicht-Lektüre für E-Mail-Versand)

## Pflege

- **Jährlich** komplett refreshen (Datum aktualisieren, Diff prüfen)
- **Bei Provider-Wechsel** sofort neu ziehen
- **Bei Provider-DPA-Update** (typisch alle 1–2 Jahre) Mail-Notification beachten

## Cross-Reference

Datenschutzerklärung der Site (`src/app/[locale]/datenschutz/page.tsx`) listet
alle hier aufgeführten Provider mit Standort, Datenzweck, Rechtsgrundlage und
Verlinkung zur jeweiligen Privacy-Policy. Diese Mappe ist die internen
Vertrags-Belege dazu.

Volle Hosting-Strategie + DSGVO-Argumentation: `docs/project/HOSTING_STRATEGIE.md`.
