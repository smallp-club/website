import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'small p club — no measure, no pressure',
  description: 'Eine Awareness-Bewegung gegen Scham und Vergleichsdruck rund um Männlichkeit und Körperbild.',
  robots: {
    index: false,
    follow: false,
  },
};

// Root layout has no <html lang> — locale layouts own that
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
