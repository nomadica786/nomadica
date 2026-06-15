import { getCanonicalUrl } from '../seo/canonical';

/**
 * Builds the WebSite search box schema for structured JSON-LD data
 */
export function getWebsiteSchema() {
  const homeUrl = getCanonicalUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${homeUrl}#website`,
    'name': 'Nomadica',
    'url': homeUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${homeUrl}/shop/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}
