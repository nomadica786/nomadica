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

  // If this is a mock cart ID, skip Shopify and go straight to cookie fallback
  const isMockCart = id.startsWith('MOCK_CART_');
  console.log(`[CART API] Cart ID: ${id} | Mock: ${isMockCart}`);

  if (!isMockCart && env.shopUrl && storefrontToken) {
    try {
      const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
      const data = await client.request(STOREFRONT_QUERIES.GET_CART, { id });
      if (data?.cart) {
        console.log(`[CART API] Successfully retrieved live cart from Shopify: ${id}`);
        return NextResponse.json(data);
      } else {
        console.warn(`[CART API] Live Shopify cart ${id} returned null. Falling back to local...`);
      }
    } catch (err) {
      console.error(`Failed to fetch live cart ${id}, falling back to local:`, err);
    }
  } else if (isMockCart) {
    console.log(`[CART API] Mock cart detected, reading from local storage: ${id}`);
  }

  // Fallback to local/mock cart
  const cookieStore = await cookies();
  const cartData = cookieStore.get(`shopify_cart_${id}`)?.value;
  let items = [];
  if (cartData) {
    try {
      items = JSON.parse(cartData);
      console.log(`[CART API] ✅ Loaded ${items.length} items from mock cart: ${id}`);
    } catch (e) {
      console.error(`[CART API] Failed to parse mock cart data:`, e);
    }
  } else {
    console.log(`[CART API] ℹ️ No mock cart data found in cookies for: ${id}`);
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

  console.log(`[CART API] Returning cart ${id} with subtotal: ${subtotal}`);
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
    const { lines } = await request.json(); // Array of { merchandiseId: string, quantity: number }

    // If this is a mock cart, skip Shopify and go straight to mock update
    const isMockCart = id.startsWith('MOCK_CART_');
    console.log(`[CART API] Cart update - ID: ${id} | Mock: ${isMockCart}`);
    console.log(`[CART API] Lines to add:`, JSON.stringify(lines, null, 2));

    if (!isMockCart && env.shopUrl && storefrontToken) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);
        // Filter lines to only include valid CartLineInput fields (merchandiseId, quantity, attributes, customAttributes)
        const validLines = lines.map((line: any) => ({
          merchandiseId: line.merchandiseId,
          quantity: line.quantity
        }));
        console.log(`[CART API] Sending to Shopify with cartLinesAdd:`, JSON.stringify(validLines, null, 2));
        const data = await client.request(STOREFRONT_QUERIES.UPDATE_CART, {
          cartId: id,
          lines: validLines,
        });
        if (data?.cartLinesAdd?.cart) {
          console.log(`[CART API] ✅ Successfully added items to live Shopify cart: ${id}`);
          console.log(`[CART API] Cart now has ${data.cartLinesAdd.cart.lines.edges.length} items`);
          return NextResponse.json(data);
        } else {
          console.warn(`[CART API] ⚠️ Shopify cartLinesAdd returned null or had userErrors for cart ${id}:`, JSON.stringify(data?.cartLinesAdd?.userErrors || [], null, 2));
          console.warn('[CART API] Falling back to mock cart update...');
        }
      } catch (err) {
        console.error(`[CART API] Failed to add to live cart ${id}, falling back to mock:`, err);
      }
    } else if (isMockCart) {
      console.log(`[CART API] Mock cart detected, updating local storage: ${id}`);
    }

    // Mock cart update
    const cookieStore = await cookies();
    const cartData = cookieStore.get(`shopify_cart_${id}`)?.value;
    let items = [];
    if (cartData) {
      try {
        items = JSON.parse(cartData);
        console.log(`[CART API] Loaded ${items.length} items from mock cart: ${id}`);
      } catch (e) {
        console.error(`[CART API] Failed to parse mock cart data:`, e);
      }
    }

    // For mock carts: add new items (not update existing)
    lines.forEach((newLine: any) => {
      const existingIdx = items.findIndex((item: any) =>
        item.merchandiseId === newLine.merchandiseId
      );

      if (existingIdx !== -1) {
        // Item already in cart, increase quantity
        items[existingIdx].quantity += newLine.quantity;
        console.log(`[CART API] ℹ️ Increased quantity for ${newLine.merchandiseId}`);
      } else {
        // Add new item
        items.push({
          id: `line_${Date.now()}`,
          merchandiseId: newLine.merchandiseId,
          variantId: newLine.merchandiseId,
          quantity: newLine.quantity,
          title: 'Default Size',
          price: 3499,
          productTitle: 'Product',
          image: ''
        });
        console.log(`[CART API] ✅ Added new item to mock cart`);
      }
    });

    // Save back to cookie
    cookieStore.set(`shopify_cart_${id}`, JSON.stringify(items), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    console.log(`[CART API] ✅ Mock cart now has ${items.length} items`);

    return NextResponse.json({
      cartLinesAdd: {
        cart: {
          id,
          lines: {
            edges: items.map((item: any, idx: number) => ({
              node: {
                id: `line_${idx}`,
                quantity: item.quantity,
                merchandise: {
                  id: item.merchandiseId,
                  title: item.title,
                  product: {
                    id: '1',
                    title: item.productTitle,
                    images: {
                      edges: item.image ? [{ node: { url: item.image } }] : []
                    }
                  },
                  price: {
                    amount: String(item.price),
                    currencyCode: 'INR'
                  }
                }
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
