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

export interface ProductTypeConfigEntry {
  id: string;
  handle?: string;
  entryName: string;
  displayName: string;
  mockupImage?: string;
}

export const DEFAULT_PRODUCT_TYPE_CONFIGS: ProductTypeConfigEntry[] = [
  { id: "gid://shopify/Metaobject/ptc-adventure", handle: "adventure", entryName: "Adventure", displayName: "Trekkking Tees", mockupImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
  { id: "gid://shopify/Metaobject/ptc-wildlife-1", handle: "wildlife-tee-1", entryName: "Wildlife Tee 1", displayName: "Wildlife Tees", mockupImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80" },
  { id: "gid://shopify/Metaobject/ptc-travel-1", handle: "travel-tee-1", entryName: "Travel Tee 1", displayName: "Travel Quotes Tee", mockupImage: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80" },
  { id: "gid://shopify/Metaobject/ptc-regular-fit", handle: "regular-fit-tee", entryName: "Regular Fit Tee", displayName: "Comfortable Regular Fit Tee", mockupImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80" },
  { id: "gid://shopify/Metaobject/ptc-oversized", handle: "oversized-tee", entryName: "Oversized Tee", displayName: "Cool Oversized Tee", mockupImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80" },
  { id: "gid://shopify/Metaobject/ptc-boxy-fit", handle: "boxy-fit-tee", entryName: "Boxy Fit Tee", displayName: "Boxy Tees", mockupImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80" },
  { id: "gid://shopify/Metaobject/ptc-beach-1", handle: "beach-tee-1", entryName: "Beach Tee 1", displayName: "Cool Beach Tees", mockupImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
  { id: "gid://shopify/Metaobject/ptc-tee", handle: "tee", entryName: "Tee", displayName: "T-Shirts", mockupImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
];

export async function getProductTypeMockups() {
  const lookup: Record<string, any> = {};
  const configsMap = new Map<string, ProductTypeConfigEntry>();

  // Initialize with known defaults
  for (const def of DEFAULT_PRODUCT_TYPE_CONFIGS) {
    configsMap.set(def.entryName.toLowerCase(), { ...def });
  }

  try {
    const client = getStorefrontClient();
    const data: any = await client.request(STOREFRONT_QUERIES.GET_PRODUCT_TYPE_MOCKUPS);
    const nodes = data?.metaobjects?.nodes || [];

    for (const node of nodes) {
      const fields = node?.fields || [];
      const productTypeField = fields.find((f: any) => f.key === "product_type");
      const displayNameField = fields.find((f: any) => f.key === "display_name");
      const mockupImageField = fields.find((f: any) => f.key === "mockup_image");

      const entryName = productTypeField?.value?.trim() || "";
      const displayName = displayNameField?.value?.trim() || entryName;
      const imageUrl = mockupImageField?.reference?.image?.url || mockupImageField?.reference?.url || "";

      if (entryName || node.id) {
        const item: ProductTypeConfigEntry = {
          id: node.id,
          handle: node.handle,
          entryName: entryName || displayName || node.handle,
          displayName: displayName || entryName,
          mockupImage: imageUrl || undefined
        };
        configsMap.set((item.entryName || node.id).toLowerCase(), item);
      }
    }
  } catch (error) {
    console.error("Failed to fetch product type mockups:", error);
  }

  const configurations = Array.from(configsMap.values());

  for (const config of configurations) {
    const entryData = {
      id: config.id,
      handle: config.handle,
      entryName: config.entryName,
      displayName: config.displayName,
      mockupImage: config.mockupImage
    };

    if (config.id) lookup[config.id] = entryData;
    if (config.handle) lookup[config.handle] = entryData;
    if (config.entryName) {
      lookup[config.entryName] = entryData;
      lookup[config.entryName.toLowerCase()] = entryData;
    }
    if (config.displayName) {
      lookup[config.displayName] = entryData;
      lookup[config.displayName.toLowerCase()] = entryData;
    }
  }

  lookup._configurations = configurations;
  return lookup;
}

export async function getAllStorefrontProducts(first: number = 50) {
  try {
    const client = getStorefrontClient();
    const data: any = await client.request(STOREFRONT_QUERIES.GET_PRODUCTS, { first });
    return data?.products?.edges || [];
  } catch (error) {
    console.error("Failed to fetch all storefront products:", error);
    return [];
  }
}

