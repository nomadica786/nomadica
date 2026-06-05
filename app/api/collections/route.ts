// app/api/collections/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { STOREFRONT_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_COLLECTIONS } from '@/utils/mockData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const env = getEnvironment();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (env.shopUrl && storefrontToken) {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const data = await client.request(STOREFRONT_QUERIES.GET_COLLECTIONS, { first: 10 });
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Failed to fetch live collections, falling back to mock:', error);
  }

  // Fallback to mock collection list
  const edges = MOCK_COLLECTIONS.map(collection => ({
    node: {
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description: collection.description,
      image: {
        url: collection.image
      }
    }
  }));

  return NextResponse.json({
    collections: {
      edges
    }
  });
}
