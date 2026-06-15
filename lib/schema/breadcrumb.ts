import { getCanonicalUrl } from '../seo/canonical';

interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Builds the BreadcrumbList schema for structured JSON-LD data
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': getCanonicalUrl(item.path)
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': itemListElement
  };
}
