import { getCanonicalUrl } from '../seo/canonical';

/**
 * Builds the Product schema for structured JSON-LD data
 */
export function getProductSchema(product: any) {
  if (!product) return null;

  const productUrl = getCanonicalUrl(`/products/${product.handle}`);
  const title = product.title || product.name || '';
  const description = product.description || product.excerpt || '';
  
  // Resolve image list (handles arrays, strings, and Shopify GraphQL edges)
  let imageUrls: string[] = [];
  if (product.images) {
    if (Array.isArray(product.images)) {
      imageUrls = product.images;
    } else if (typeof product.images === 'string') {
      imageUrls = [product.images];
    } else if (product.images.edges) {
      imageUrls = product.images.edges.map((e: any) => e.node?.url).filter(Boolean);
    }
  }
  
  const price = product.price || parseFloat(product.variants?.edges?.[0]?.node?.price?.amount || '0') || 0;
  
  // Resolve variants (handles arrays and Shopify GraphQL edges)
  let variantList: any[] = [];
  const rawVariants = product.variants;
  if (rawVariants) {
    if (Array.isArray(rawVariants)) {
      variantList = rawVariants;
    } else if (rawVariants.edges) {
      variantList = rawVariants.edges.map((e: any) => e.node);
    }
  }

  const offers = variantList.length > 0 
    ? variantList.map((v: any) => {
        const variantPrice = v.price?.amount ? parseFloat(v.price.amount) : (v.price || price);
        return {
          '@type': 'Offer',
          'price': variantPrice,
          'priceCurrency': 'INR',
          'availability': v.available !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'url': `${productUrl}?variant=${encodeURIComponent(v.id || '')}`,
        };
      })
    : {
        '@type': 'Offer',
        'price': price,
        'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock',
        'url': productUrl,
      };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    'name': title,
    'description': description,
    'image': imageUrls,
    'brand': {
      '@type': 'Brand',
      'name': 'Nomadica',
    },
    'offers': offers,
    'sku': product.id || ''
  };
}

