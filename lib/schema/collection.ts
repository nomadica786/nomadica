import { getCanonicalUrl } from '../seo/canonical';

/**
 * Builds the CollectionPage schema for structured JSON-LD data
 */
export function getCollectionSchema(collection: any, products: any[] = []) {
  if (!collection) return null;

  const collectionUrl = getCanonicalUrl(`/collections/${collection.handle}`);
  
  const itemListElement = products.map((product, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'url': getCanonicalUrl(`/products/${product.handle}`),
    'name': product.title || product.name || ''
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${collectionUrl}#collection`,
    'name': collection.title,
    'description': collection.description || '',
    'url': collectionUrl,
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': itemListElement
    }
  };
}
