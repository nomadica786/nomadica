// app/api/collections/handle/[handle]/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { STOREFRONT_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_COLLECTIONS, formatCollectionGraphQL } from '@/utils/mockData';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const { searchParams } = new URL(request.url);
  const first = parseInt(searchParams.get('first') || '20');

  try {
    const env = getEnvironment();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (env.shopUrl && storefrontToken) {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const data = await client.request(STOREFRONT_QUERIES.GET_COLLECTION_BY_HANDLE, { handle, first });
      console.log('Shopify Response:', JSON.stringify(data))
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`Failed to fetch live collection handle ${handle}, falling back to mock:`, error);
  }

  // Fallback to mock collection products
  const collection = MOCK_COLLECTIONS.find(c => c.handle === handle);
  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  return NextResponse.json({
    collectionByHandle: formatCollectionGraphQL(collection)
  });
}
