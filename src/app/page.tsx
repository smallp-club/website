import { redirect } from 'next/navigation';

// Root redirect → /de (default locale, handled by next-intl middleware)
export default function RootPage() {
  redirect('/');
}
