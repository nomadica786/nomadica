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
      if (data?.cart) {
        return NextResponse.json(data);
      } else {
        console.warn(`[CART API] Live Shopify cart ${id} returned null. Falling back to mock...`);
      }
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
    let price = item.price;
    let productTitle = item.productTitle || item.title || 'Product';
    let productImage = item.image || '';

    // Fallback to MOCK_PRODUCTS lookup if price or title is not stored in cookie (for legacy carts)
    if (!price || !item.productTitle) {
      const rawId = item.merchandiseId || item.variantId || '1';
      const prodId = rawId.includes('/') ? rawId.split('/').pop() : rawId;
      const cleanId = prodId ? prodId.replace(/[^0-9]/g, '') : '1';
      const product = MOCK_PRODUCTS.find(p => p.id === cleanId) || MOCK_PRODUCTS[0];
      price = price || product.price;
      productTitle = productTitle === 'Product' ? product.name : productTitle;
      productImage = productImage || product.image;
    }

    const lineTotal = price * item.quantity;
    subtotal += lineTotal;

    return {
      node: {
        id: `line_${idx}`,
        quantity: item.quantity,
        merchandise: {
          id: item.variantId || item.merchandiseId || '1',
          title: item.title || 'Default Size',
          price: { amount: String(price), currencyCode: 'INR' },
          product: { 
            id: '1', 
            title: productTitle,
            images: {
              edges: productImage ? [{ node: { url: productImage } }] : []
            }
          }
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
        if (data?.cartLinesUpdate?.cart) {
          return NextResponse.json(data);
        } else {
          console.warn(`[CART API] Shopify cartLinesUpdate returned null or had userErrors for cart ${id}:`, JSON.stringify(data?.cartLinesUpdate?.userErrors || [], null, 2));
          console.warn('[CART API] Falling back to mock cart update...');
        }
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

    // Update quantities or remove items or add new items
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
      } else if (update.quantity > 0) {
        items.push({
          id: update.id || `line_${Date.now()}`,
          merchandiseId: update.merchandiseId || update.variantId || update.id,
          variantId: update.variantId || update.merchandiseId || update.id,
          quantity: update.quantity,
          title: update.title || 'Default Size',
          price: update.price || 3499,
          productTitle: update.productTitle || update.title || 'Product',
          image: update.image || ''
        });
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
