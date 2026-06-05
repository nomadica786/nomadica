// app/api/cart/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { STOREFRONT_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { lineItems } = await request.json();
    const env = getEnvironment();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (env.shopUrl && storefrontToken) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
        const data = await client.request(STOREFRONT_QUERIES.CREATE_CART, {
          input: {
            lines: lineItems.map((item: any) => ({
              merchandiseId: item.merchandiseId || item.variantId, // Support both naming styles
              quantity: item.quantity,
            })),
          },
        });
        return NextResponse.json(data);
      } catch (err) {
        console.error('Failed to create cart on Shopify, falling back to mock:', err);
      }
    }

    // Mock cart creation
    const cartId = `MOCK_CART_${Date.now()}`;
    const cookieStore = await cookies();
    cookieStore.set(`shopify_cart_${cartId}`, JSON.stringify(lineItems), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      cartCreate: {
        cart: {
          id: cartId,
          checkoutUrl: `/checkout?cartId=${cartId}`,
          lines: {
            edges: lineItems.map((item: any, idx: number) => ({
              node: {
                id: `line_${idx}`,
                quantity: item.quantity,
                merchandise: {
                  id: item.merchandiseId || item.variantId,
                  title: 'Default Variant',
                  price: { amount: '3499.00', currencyCode: 'INR' },
                  product: { title: 'Nomadica Piece' }
                }
              }
            }))
          }
        },
        userErrors: []
      }
    });

  } catch (error) {
    console.error('Cart creation error:', error);
    return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
  }
}
