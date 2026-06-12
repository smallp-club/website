import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'small p club',
    short_name: 'small p',
    description: 'no measure, no pressure',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F6F2',
    theme_color: '#0A0A0A',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  };
}
