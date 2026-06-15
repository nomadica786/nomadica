import { getCanonicalUrl } from '../seo/canonical';

/**
 * Builds the BlogPosting schema for structured JSON-LD data
 */
export function getArticleSchema(article: any) {
  if (!article) return null;

  const articleUrl = getCanonicalUrl(`/journal/${article.handle}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${articleUrl}#article`,
    'headline': article.title,
    'description': article.excerpt || '',
    'image': article.image?.url || '',
    'datePublished': article.publishedAt,
    'dateModified': article.publishedAt,
    'author': {
      '@type': 'Person',
      'name': article.authorV2?.name || 'Nomadica Staff'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Nomadica',
      'logo': {
        '@type': 'ImageObject',
        'url': getCanonicalUrl('/Nomadica.jpg')
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': articleUrl
    }
  };
}
