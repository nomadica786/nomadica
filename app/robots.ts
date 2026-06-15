import { MetadataRoute } from 'next';
import { getCanonicalUrl } from '@/lib/seo/canonical';

/**
 * Generates the robots.txt rules dynamically for the site
 */
export default function robots(): MetadataRoute.Robots {
  const homeUrl = getCanonicalUrl('/');
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/products/',
        '/collections/',
        '/journal/',
        '/brand/',
        '/support/'
      ],
      disallow: [
        '/api/',
        '/checkout',
        '/account/',
        '/maintenance',
        '/admin'
      ]
    },
    sitemap: `${homeUrl}/sitemap.xml`
  };
}
