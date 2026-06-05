// app/api/search/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { STOREFRONT_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_PRODUCTS, formatProductGraphQL } from '@/utils/mockData';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const first = parseInt(searchParams.get('first') || '10');

  try {
    const env = getEnvironment();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (env.shopUrl && storefrontToken) {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const data = await client.request(STOREFRONT_QUERIES.SEARCH_PRODUCTS, { query, first });
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`Failed to fetch live search for ${query}, falling back to mock:`, error);
  }

  // Fallback to mock search
  const filtered = query.length > 0
    ? MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_PRODUCTS;

  const edges = filtered.slice(0, first).map(product => ({
    node: formatProductGraphQL(product)
  }));

  return NextResponse.json({
    search: {
      edges
    }
  });
}
