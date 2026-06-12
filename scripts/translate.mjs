#!/usr/bin/env node
/**
 * small p club — DeepL Translation Script
 *
 * Vergleicht messages/de.json mit messages/en.json,
 * übersetzt fehlende/geänderte Keys via DeepL Free API
 * und schreibt einen Review-Entwurf nach messages/en.draft.json.
 *
 * Usage:
 *   npm run translate
 *
 * Nach der Übersetzung:
 *   1. messages/en.draft.json öffnen und reviewen
 *   2. Korrekturen vornehmen
 *   3. Datei umbenennen zu messages/en.json → fertig
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const DEEPL_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_KEY) {
  console.error('❌  DEEPL_API_KEY fehlt in .env.local');
  process.exit(1);
}

const API_HOST = DEEPL_KEY.endsWith(':fx')
  ? 'api-free.deepl.com'
  : 'api.deepl.com';

// ---- Helpers ----

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function flattenObject(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(acc, flattenObject(value, fullKey));
    } else {
      acc[fullKey] = value;
    }
    return acc;
  }, {});
}

function setNestedValue(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

async function translateText(text, targetLang) {
  return new Promise((resolve, reject) => {
    // formality only supported for DE, FR, IT, ES, NL, PL, PT, RU, JA — not EN
    const formalitySupported = !['EN', 'EN-US', 'EN-GB'].includes(targetLang.toUpperCase());
    const params = { text, source_lang: 'DE', target_lang: targetLang.toUpperCase() };
    if (formalitySupported) params.formality = 'less';
    const body = new URLSearchParams(params).toString();

    const req = https.request(
      {
        hostname: API_HOST,
        path: '/v2/translate',
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.translations?.[0]?.text) {
              resolve(parsed.translations[0].text);
            } else {
              reject(new Error(data));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ---- Main ----

async function main() {
  const sourceFile = path.join(ROOT, 'messages/de.json');
  const targetFile = path.join(ROOT, 'messages/en.json');
  const draftFile = path.join(ROOT, 'messages/en.draft.json');

  const source = readJson(sourceFile);
  const existing = readJson(targetFile);

  const flatSource = flattenObject(source);
  const flatExisting = flattenObject(existing);

  const missing = Object.keys(flatSource).filter(
    (key) => !flatExisting[key] || flatExisting[key] === flatSource[key]
  );

  if (missing.length === 0) {
    console.log('✅  Alle Keys sind bereits übersetzt. Nichts zu tun.');
    return;
  }

  console.log(`🔍  ${missing.length} fehlende/neue Keys gefunden. Übersetze via DeepL...\n`);

  const draft = JSON.parse(JSON.stringify(existing));
  let count = 0;

  for (const key of missing) {
    const text = flatSource[key];
    if (!text || typeof text !== 'string') continue;

    try {
      const translated = await translateText(text, 'EN');
      setNestedValue(draft, key, translated);
      console.log(`  ✓ ${key}`);
      console.log(`    DE: ${text}`);
      console.log(`    EN: ${translated}\n`);
      count++;
    } catch (err) {
      console.error(`  ✗ Fehler bei "${key}":`, err.message);
    }
  }

  fs.writeFileSync(draftFile, JSON.stringify(draft, null, 2) + '\n', 'utf-8');

  console.log(`\n✅  ${count} Keys übersetzt.`);
  console.log(`📄  Entwurf gespeichert: messages/en.draft.json`);
  console.log(`\nNächste Schritte:`);
  console.log(`  1. messages/en.draft.json öffnen und reviewen`);
  console.log(`  2. Korrekturen vornehmen`);
  console.log(`  3. Datei umbenennen/ersetzen: mv messages/en.draft.json messages/en.json`);
}

main().catch((err) => {
  console.error('❌  Unerwarteter Fehler:', err);
  process.exit(1);
});
