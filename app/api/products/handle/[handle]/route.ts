// app/api/products/handle/[handle]/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { STOREFRONT_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_PRODUCTS, formatProductGraphQL } from '@/utils/mockData';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  try {
    const env = getEnvironment();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (env.shopUrl && storefrontToken) {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const data = await client.request(STOREFRONT_QUERIES.GET_PRODUCT_BY_HANDLE, { handle });
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`Failed to fetch live product handle ${handle}, falling back to mock:`, error);
  }

  // Fallback to mock product
  const product = MOCK_PRODUCTS.find(p => p.handle === handle);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({
    productByHandle: formatProductGraphQL(product)
  });
}
