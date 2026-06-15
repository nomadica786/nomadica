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
    const { lines } = await request.json(); // Array of { id?: string, merchandiseId?: string, quantity: number }

    // If this is a mock cart, skip Shopify and go straight to mock update
    const isMockCart = id.startsWith('MOCK_CART_');
    const isUpdateOrRemove = lines.length > 0 && lines[0].id !== undefined;

    console.log(`[CART API] Cart PUT - ID: ${id} | Mock: ${isMockCart} | UpdateOrRemove: ${isUpdateOrRemove}`);
    console.log(`[CART API] Payload lines:`, JSON.stringify(lines, null, 2));

    if (!isMockCart && env.shopUrl && storefrontToken) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl, storefrontToken);

        if (isUpdateOrRemove) {
          const lineToUpdate = lines[0];
          const lineId = lineToUpdate.id;
          const qty = lineToUpdate.quantity;

          if (qty === 0) {
            console.log(`[CART API] Sending to Shopify with cartLinesRemove:`, lineId);
            const data = await client.request(STOREFRONT_QUERIES.REMOVE_CART_LINES, {
              cartId: id,
              lineIds: [lineId],
            });
            if (data?.cartLinesRemove?.cart) {
              console.log(`[CART API] ✅ Successfully removed item from live Shopify cart: ${id}`);
              return NextResponse.json({
                cart: data.cartLinesRemove.cart,
                userErrors: data.cartLinesRemove.userErrors || []
              });
            } else {
              console.warn(`[CART API] ⚠️ Shopify cartLinesRemove returned null or had errors:`, data?.cartLinesRemove?.userErrors);
            }
          } else {
            console.log(`[CART API] Sending to Shopify with cartLinesUpdate:`, { lineId, qty });
            const data = await client.request(STOREFRONT_QUERIES.UPDATE_CART_QUANTITY, {
              cartId: id,
              lines: [{ id: lineId, quantity: qty }],
            });
            if (data?.cartLinesUpdate?.cart) {
              console.log(`[CART API] ✅ Successfully updated quantity in live Shopify cart: ${id}`);
              return NextResponse.json({
                cart: data.cartLinesUpdate.cart,
                userErrors: data.cartLinesUpdate.userErrors || []
              });
            } else {
              console.warn(`[CART API] ⚠️ Shopify cartLinesUpdate returned null or had errors:`, data?.cartLinesUpdate?.userErrors);
            }
          }
        } else {
          // Add behavior
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
            return NextResponse.json(data);
          } else {
            console.warn(`[CART API] ⚠️ Shopify cartLinesAdd returned null:`, data?.cartLinesAdd?.userErrors);
          }
        }
      } catch (err) {
        console.error(`[CART API] Failed to interact with live cart ${id}, falling back to mock:`, err);
      }
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

    if (isUpdateOrRemove) {
      const lineToUpdate = lines[0];
      const idx = parseInt(lineToUpdate.id.replace('line_', ''));
      const qty = lineToUpdate.quantity;

      if (qty === 0) {
        if (!isNaN(idx) && idx >= 0 && idx < items.length) {
          console.log(`[CART API] [MOCK] Removing item at index ${idx}`);
          items.splice(idx, 1);
        }
      } else {
        if (!isNaN(idx) && idx >= 0 && idx < items.length) {
          console.log(`[CART API] [MOCK] Updating quantity at index ${idx} to ${qty}`);
          items[idx].quantity = qty;
        }
      }
    } else {
      // Add behavior
      lines.forEach((newLine: any) => {
        const existingIdx = items.findIndex((item: any) =>
          item.merchandiseId === newLine.merchandiseId
        );

        if (existingIdx !== -1) {
          items[existingIdx].quantity += newLine.quantity;
        } else {
          items.push({
            id: `line_${Date.now()}`,
            merchandiseId: newLine.merchandiseId,
            variantId: newLine.merchandiseId,
            quantity: newLine.quantity,
            title: newLine.title || 'Default Size',
            price: newLine.price || 3499,
            productTitle: newLine.productTitle || 'Product',
            image: newLine.image || ''
          });
        }
      });
    }

    // Save back to cookie
    cookieStore.set(`shopify_cart_${id}`, JSON.stringify(items), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    console.log(`[CART API] ✅ Mock cart now has ${items.length} items`);

    return NextResponse.json({
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
    });

  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
