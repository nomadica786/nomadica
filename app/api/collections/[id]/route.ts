// app/api/collections/[id]/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { MOCK_COLLECTIONS } from '@/utils/mockData';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const env = getEnvironment();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (env.shopUrl && storefrontToken) {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const query = `
        query GetCollectionById($id: ID!) {
          collection(id: $id) {
            id
            title
            description
            handle
            image {
              url
            }
          }
        }
      `;
      const data = await client.request(query, { id });
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`Failed to fetch live collection ${id}, falling back to mock:`, error);
  }

  // Fallback to mock collection details
  const collection = MOCK_COLLECTIONS.find(c => c.id === id);
  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  return NextResponse.json({
    collection: {
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description: collection.description,
      image: {
        url: collection.image
      }
    }
  });
}
