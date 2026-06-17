'use client';

import { useState } from 'react';
import styles from './ClearSiteDataButton.module.css';

type ButtonState = 'idle' | 'loading' | 'done';

export function ClearSiteDataButton() {
  const [state, setState] = useState<ButtonState>('idle');

  async function handleClick() {
    setState('loading');

    try {
      await fetch('/api/clear-site-data', { method: 'POST' });
    } catch {
      // weiter — Client-Side-Cleanup läuft auch ohne Server-Response
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch {
        // ignorieren
      }
      try {
        sessionStorage.clear();
      } catch {
        // ignorieren
      }

      try {
        const dbsApi = (
          indexedDB as IDBFactory & { databases?: () => Promise<IDBDatabaseInfo[]> }
        ).databases;
        if (dbsApi) {
          const dbs = await dbsApi.call(indexedDB);
          await Promise.all(
            dbs.map(
              (db) =>
                new Promise<void>((resolve) => {
                  if (!db.name) {
                    resolve();
                    return;
                  }
                  const req = indexedDB.deleteDatabase(db.name);
                  req.onsuccess = () => resolve();
                  req.onerror = () => resolve();
                  req.onblocked = () => resolve();
                }),
            ),
          );
        }
      } catch {
        // ignorieren
      }

      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
      } catch {
        // ignorieren
      }

      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        // ignorieren
      }

      const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
      const host = window.location.hostname;
      document.cookie.split(';').forEach((c) => {
        const eq = c.indexOf('=');
        const name = (eq > -1 ? c.substring(0, eq) : c).trim();
        if (!name) return;
        document.cookie = `${name}=;${expire};path=/`;
        document.cookie = `${name}=;${expire};path=/;domain=${host}`;
        document.cookie = `${name}=;${expire};path=/;domain=.${host}`;
      });
    }

    setState('done');
  }

  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {state === 'done' ? (
        <div className={styles.confirmation}>
          <p className={styles.confirmLead}>weg. wir sehen dich nicht mehr.</p>
          <p className={styles.confirmDetail}>
            falls du eingeloggt warst, bist du jetzt ausgeloggt. lad die seite
            einmal neu (<kbd>Cmd+R</kbd> oder <kbd>Strg+R</kbd>), dann ist auch
            die aktuelle ansicht sauber.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={state === 'loading'}
          aria-busy={state === 'loading'}
          className={styles.button}
        >
          {state === 'loading' ? 'lösche…' : 'alles löschen'}
        </button>
      )}
    </div>
  );
}
