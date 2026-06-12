import type { MetadataRoute } from 'next';

const baseUrl = 'https://smallp.club';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/club`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/topics`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ngo`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/shop`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
