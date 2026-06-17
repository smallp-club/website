import { NextResponse } from 'next/server';

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set(
    'Clear-Site-Data',
    '"cookies", "storage", "cache"',
  );
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
