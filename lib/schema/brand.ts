import { getCanonicalUrl } from '../seo/canonical';

/**
 * Builds the Brand schema for structured JSON-LD data
 */
export function getBrandSchema() {
  const homeUrl = getCanonicalUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${homeUrl}#brand`,
    'name': 'Nomadica',
    'url': homeUrl,
    'logo': getCanonicalUrl('/Nomadica.jpg'),
    'description': 'Premium travel-inspired lifestyle apparel and adventure wear designed for modern nomads.'
  };
}
