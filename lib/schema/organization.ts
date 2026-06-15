import { getCanonicalUrl } from '../seo/canonical';

/**
 * Builds the Organization schema for structured JSON-LD data
 */
export function getOrganizationSchema() {
  const homeUrl = getCanonicalUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${homeUrl}#organization`,
    'name': 'Nomadica',
    'url': homeUrl,
    'logo': {
      '@type': 'ImageObject',
      'url': getCanonicalUrl('/Nomadica.jpg'),
      'caption': 'Nomadica Logo',
    },
    'sameAs': [
      'https://www.instagram.com/nomadica',
      'https://www.facebook.com/nomadica',
      'https://twitter.com/nomadica',
    ],
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'email': 'support@nomadica.com',
        'contactType': 'customer service',
        'availableLanguage': 'English'
      }
    ]
  };
}
