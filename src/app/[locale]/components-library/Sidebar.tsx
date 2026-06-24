'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface NavItem {
  name: string;
  href?: string;
  status: 'available' | 'coming';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: 'Foundations',
    items: [
      { name: 'Motion',  href: '/components-library/foundations/motion',  status: 'available' },
      { name: 'Tokens',  href: '/components-library/foundations/tokens',  status: 'available' },
    ],
  },
  {
    title: 'Primitives',
    items: [
      { name: 'Layout',          href: '/components-library/primitives/layout',           status: 'available' },
      { name: 'Typo',            href: '/components-library/primitives/typo',             status: 'available' },
      { name: 'Brand',           href: '/components-library/primitives/brand',           status: 'available' },
      { name: 'Skip To Content', href: '/components-library/primitives/skip-to-content', status: 'available' },
      { name: 'Button',          href: '/components-library/primitives/button',          status: 'available' },
      { name: 'Input',           href: '/components-library/primitives/input',           status: 'available' },
    ],
  },
  {
    title: 'Patterns',
    items: [
      { name: 'Measure Line',     href: '/components-library/patterns/measure-line',      status: 'available' },
      { name: 'Sticky Crossfade', href: '/components-library/patterns/sticky-crossfade',  status: 'available' },
      { name: 'Stat Pair',         href: '/components-library/patterns/stat-pair',         status: 'available' },
      { name: 'Stat Pair Topo',    href: '/components-library/patterns/stat-pair-topo',    status: 'available' },
      { name: 'Card Fan',          href: '/components-library/patterns/card-fan',          status: 'available' },
      { name: 'Pull Focus Grid',   href: '/components-library/patterns/pull-focus-grid',   status: 'available' },
      { name: 'Brand Marquee',     href: '/components-library/patterns/brand-marquee',     status: 'available' },
    ],
  },
  {
    title: 'Sections',
    items: [
      { name: 'Site Nav',        href: '/components-library/sections/site-nav',         status: 'available' },
      { name: 'Site Footer',     href: '/components-library/sections/site-footer',      status: 'available' },
      { name: 'Four Cm Reveal',  href: '/components-library/sections/four-cm-reveal',   status: 'available' },
    ],
  },
];

function endsWithPath(pathname: string, suffix: string): boolean {
  return pathname === suffix || pathname.endsWith(suffix);
}

export function Sidebar() {
  const pathname = usePathname() ?? '';
  const isIndex = endsWithPath(pathname, '/components-library');

  return (
    <nav className={styles.sidebar} aria-label="Components Library Navigation">
      <Link href="/components-library" className={styles.brand} aria-current={isIndex ? 'page' : undefined}>
        <span className={styles.brandEyebrow}>intern</span>
        <span className={styles.brandName}>components library</span>
      </Link>

      {sections.map((section) => (
        <div key={section.title} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <ul className={styles.itemList}>
            {section.items.length === 0 && (
              <li className={styles.itemComing}>(kommt mit Landing-Kit)</li>
            )}
            {section.items.map((item) => {
              if (item.status === 'coming' || !item.href) {
                return (
                  <li key={item.name} className={styles.itemComing} aria-disabled="true">
                    {item.name}
                  </li>
                );
              }
              const isActive = endsWithPath(pathname, item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
