import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Preview — small p club',
  robots: { index: false, follow: false },
};

/**
 * Preview-Bühnen sind interne Design-/Konzept-Artefakte (Wireframes,
 * Pattern-Reviews, Backlog-Notizen). In Production nicht erreichbar —
 * sonst leaken sie interne Architektur- und Planungsinfos (Recon-Fläche).
 * Gleicher Guard wie /components-library.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound();

  return <>{children}</>;
}
