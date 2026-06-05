// app/api/wishlist/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { MOCK_PRODUCTS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const wishlistCookie = cookieStore.get('shopify_wishlist')?.value;
  let productIds: string[] = [];

  if (wishlistCookie) {
    try {
      productIds = JSON.parse(wishlistCookie);
    } catch {}
  }

  const env = getEnvironment();
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (env.shopUrl && storefrontToken && productIds.length > 0) {
    try {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const query = `
        query GetProductsByIds($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              id
              title
              description
              handle
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    available: availableForSale
                  }
                }
              }
            }
          }
        }
      `;
      const data = await client.request<{ nodes: any[] }>(query, { ids: productIds });
      const wishlistProducts = (data.nodes || [])
        .filter((node: any) => node !== null && node !== undefined)
        .map((node: any) => ({
          id: node.id,
          name: node.title,
          price: parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || '0'),
          image: node.images?.edges?.[0]?.node?.url || '',
          category: node.category || 'Tops',
          handle: node.handle
        }));
      return NextResponse.json({
        wishlist: wishlistProducts
      });
    } catch (err) {
      console.error('Failed to fetch live products for wishlist, falling back to mock:', err);
    }
  }

  // Find products matching the wishlisted IDs
  const wishlistProducts = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));

  return NextResponse.json({
    wishlist: wishlistProducts
  });
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const wishlistCookie = cookieStore.get('shopify_wishlist')?.value;
    let productIds: string[] = [];

    if (wishlistCookie) {
      try {
        productIds = JSON.parse(wishlistCookie);
      } catch {}
    }

    if (!productIds.includes(productId)) {
      productIds.push(productId);
    }

    // Save back to cookie (expires in 30 days)
    cookieStore.set('shopify_wishlist', JSON.stringify(productIds), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    const wishlistProducts = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));

    return NextResponse.json({
      wishlist: wishlistProducts,
      success: true
    });
  } catch (error) {
    console.error('Add to wishlist failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
