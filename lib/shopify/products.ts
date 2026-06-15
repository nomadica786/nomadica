import { getStorefrontClient } from './journal';
import { STOREFRONT_QUERIES } from './queries';
import { MOCK_PRODUCTS, formatProductGraphQL } from '@/utils/mockData';

/**
 * Fetches a product by its URL handle from Shopify Storefront (with mock fallback)
 */
export async function getProductByHandle(handle: string) {
  try {
    const client = getStorefrontClient();
    const data: any = await client.request(STOREFRONT_QUERIES.GET_PRODUCT_BY_HANDLE, { handle });
    if (data?.productByHandle) {
      return data.productByHandle;
    }
  } catch (error) {
    console.error(`Failed to fetch live product handle ${handle}:`, error);
  }

  // Fallback to mock product
  const mockProduct = MOCK_PRODUCTS.find(p => p.handle === handle);
  if (mockProduct) {
    return formatProductGraphQL(mockProduct);
  }
  return null;
}

/**
 * Fetches a collection by its handle along with its product list
 */
export async function getCollectionByHandle(handle: string, first: number = 20) {
  try {
    const client = getStorefrontClient();
    const data: any = await client.request(STOREFRONT_QUERIES.GET_COLLECTION_BY_HANDLE, { handle, first });
    if (data?.collectionByHandle) {
      return data.collectionByHandle;
    }
  } catch (error) {
    console.error(`Failed to fetch live collection handle ${handle}:`, error);
  }
  return null;
}
