import { MetadataRoute } from 'next';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import { getStorefrontClient, getBlogArticles, ShopifyArticle } from '@/lib/shopify/journal';
import { STOREFRONT_QUERIES } from '@/lib/shopify/queries';

// Set dynamic revalidation for sitemap to keep it fresh
export const revalidate = 86400; // 24 hours

async function fetchProductHandles(): Promise<string[]> {
  try {
    const client = getStorefrontClient();
    const data: any = await client.request(STOREFRONT_QUERIES.GET_PRODUCTS, { first: 100 });
    const edges = data?.products?.edges || [];
    return edges.map((e: any) => e.node.handle).filter(Boolean);
  } catch (err) {
    console.error("Failed to fetch products for sitemap:", err);
    return [];
  }
}

async function fetchCollectionHandles(): Promise<string[]> {
  try {
    const client = getStorefrontClient();
    const data: any = await client.request(STOREFRONT_QUERIES.GET_COLLECTIONS, { first: 100 });
    const edges = data?.collections?.edges || [];
    return edges.map((e: any) => e.node.handle).filter(Boolean);
  } catch (err) {
    console.error("Failed to fetch collections for sitemap:", err);
    return [];
  }
}

async function fetchArticleHandles(): Promise<string[]> {
  try {
    const { articles } = await getBlogArticles(100);
    return articles.map((a: ShopifyArticle) => a.handle).filter(Boolean);
  } catch (err) {
    console.error("Failed to fetch articles for sitemap:", err);
    return [];
  }
}

/**
 * Generates sitemap.xml dynamically with static pages and shopify resources
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Static Pages
  const staticPaths = [
    { url: getCanonicalUrl('/'), priority: 1.0, changeFrequency: 'daily' },
    { url: getCanonicalUrl('/shop'), priority: 0.9, changeFrequency: 'daily' },
    { url: getCanonicalUrl('/journal'), priority: 0.8, changeFrequency: 'daily' },
    { url: getCanonicalUrl('/brand/about'), priority: 0.7, changeFrequency: 'weekly' },
    { url: getCanonicalUrl('/brand/story'), priority: 0.7, changeFrequency: 'weekly' },
    { url: getCanonicalUrl('/brand/sustainability'), priority: 0.7, changeFrequency: 'weekly' },
    { url: getCanonicalUrl('/support/faq'), priority: 0.7, changeFrequency: 'weekly' },
    { url: getCanonicalUrl('/support/contact'), priority: 0.7, changeFrequency: 'monthly' },
    { url: getCanonicalUrl('/support/privacy-policy'), priority: 0.5, changeFrequency: 'monthly' },
    { url: getCanonicalUrl('/support/return-policy'), priority: 0.5, changeFrequency: 'monthly' },
    { url: getCanonicalUrl('/support/shipping-policy'), priority: 0.5, changeFrequency: 'monthly' },
    { url: getCanonicalUrl('/support/terms'), priority: 0.5, changeFrequency: 'monthly' },
  ];

  // 2. Fetch Dynamic URLs
  const [productHandles, collectionHandles, articleHandles] = await Promise.all([
    fetchProductHandles(),
    fetchCollectionHandles(),
    fetchArticleHandles(),
  ]);

  const productPaths = productHandles.map((handle) => ({
    url: getCanonicalUrl(`/products/${handle}`),
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const collectionPaths = collectionHandles.map((handle) => ({
    url: getCanonicalUrl(`/collections/${handle}`),
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const articlePaths = articleHandles.map((handle) => ({
    url: getCanonicalUrl(`/journal/${handle}`),
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPaths.map((p) => ({
      url: p.url,
      lastModified: currentDate,
      changeFrequency: p.changeFrequency as any,
      priority: p.priority,
    })),
    ...productPaths,
    ...collectionPaths,
    ...articlePaths,
  ];
}
