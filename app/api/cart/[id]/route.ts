// app/api/cart/[id]/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { STOREFRONT_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_PRODUCTS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const env = getEnvironment();
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (env.shopUrl && storefrontToken) {
    try {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const data = await client.request(STOREFRONT_QUERIES.GET_CART, { id });
      return NextResponse.json(data);
    } catch (err) {
      console.error(`Failed to fetch live cart ${id}, falling back to mock:`, err);
    }
  }

  // Fallback
  const cookieStore = await cookies();
  const cartData = cookieStore.get(`shopify_cart_${id}`)?.value;
  let items = [];
  if (cartData) {
    try {
      items = JSON.parse(cartData);
    } catch {}
  }

  // Populate product details for mock cart lines
  let subtotal = 0;
  const edges = items.map((item: any, idx: number) => {
    // Attempt to match with mock product price
    const rawId = item.merchandiseId || item.variantId || '1';
    const prodId = rawId.includes('/') ? rawId.split('/').pop() : rawId;
    // Clean suffix
    const cleanId = prodId.replace(/[^0-9]/g, '');
    const product = MOCK_PRODUCTS.find(p => p.id === cleanId) || MOCK_PRODUCTS[0];
    const price = product.price;
    const lineTotal = price * item.quantity;
    subtotal += lineTotal;

    return {
      node: {
        id: `line_${idx}`,
        quantity: item.quantity,
        merchandise: {
          id: rawId,
          title: item.title || 'Default Size',
          price: { amount: String(price), currencyCode: 'INR' },
          product: { title: product.name, id: product.id }
        }
      }
    };
  });

  return NextResponse.json({
    cart: {
      id,
      checkoutUrl: `/checkout?cartId=${id}`,
      lines: {
        edges
      },
      cost: {
        subtotalAmount: { amount: String(subtotal), currencyCode: 'INR' },
        totalAmount: { amount: String(subtotal), currencyCode: 'INR' },
        totalTaxAmount: { amount: '0.00', currencyCode: 'INR' },
        totalDutyAmount: { amount: '0.00', currencyCode: 'INR' }
      }
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const env = getEnvironment();
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  try {
    const { lines } = await request.json(); // Array of { id: string, quantity: number, merchandiseId?: string }

    if (env.shopUrl && storefrontToken) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
        const data = await client.request(STOREFRONT_QUERIES.UPDATE_CART, {
          cartId: id,
          lines,
        });
        return NextResponse.json(data);
      } catch (err) {
        console.error(`Failed to update live cart ${id}, falling back to mock:`, err);
      }
    }

    // Mock cart update
    const cookieStore = await cookies();
    const cartData = cookieStore.get(`shopify_cart_${id}`)?.value;
    let items = [];
    if (cartData) {
      try {
        items = JSON.parse(cartData);
      } catch {}
    }

    // Update quantities or remove items
    lines.forEach((update: any) => {
      // Find item index
      const itemIdx = items.findIndex((item: any) =>
        item.id === update.id || 
        item.merchandiseId === update.id || 
        item.merchandiseId === update.merchandiseId ||
        item.variantId === update.id
      );

      if (itemIdx !== -1) {
        if (update.quantity === 0) {
          items.splice(itemIdx, 1);
        } else {
          items[itemIdx].quantity = update.quantity;
        }
      }
    });

    // Save back to cookie
    cookieStore.set(`shopify_cart_${id}`, JSON.stringify(items), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      cartLinesUpdate: {
        cart: {
          id,
          lines: {
            edges: items.map((item: any, idx: number) => ({
              node: {
                id: `line_${idx}`,
                quantity: item.quantity
              }
            }))
          }
        },
        userErrors: []
      }
    });

  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
