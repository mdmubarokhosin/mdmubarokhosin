import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mdmubarokhosin.pages.dev'

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/resume.html`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
