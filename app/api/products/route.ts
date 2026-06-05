// app/api/products/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { STOREFRONT_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_PRODUCTS, formatProductGraphQL } from '@/utils/mockData';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '12');
    const after = searchParams.get('after');

    const env = getEnvironment();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (env.shopUrl && storefrontToken) {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const data = await client.request(STOREFRONT_QUERIES.GET_PRODUCTS, { first, after });
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Failed to fetch live products, falling back to mock:', error);
  }

  // Fallback to mock data formatted in GraphQL structure
  const edges = MOCK_PRODUCTS.map(product => ({
    node: formatProductGraphQL(product)
  }));

  return NextResponse.json({
    products: {
      edges,
      pageInfo: {
        hasNextPage: false,
        endCursor: null
      }
    }
  });
}
