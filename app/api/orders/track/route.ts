// app/api/orders/track/route.ts
import { ShopifyAdminClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { MOCK_ORDERS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { getShopifySession } from '@/utils/shopifySession';

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Missing orderNumber or email' },
        { status: 400 }
      );
    }

    const env = getEnvironment();
    const cookieStore = await cookies();
    const session = getShopifySession();
    const accessToken = session?.accessToken || cookieStore.get('shopify_access_token')?.value;
    const shop = session?.shop || cookieStore.get('shopify_shop')?.value;

    if (env.shopUrl && accessToken && shop) {
      try {
        const client = new ShopifyAdminClient(shop, accessToken);
        // Clean order number for Shopify query
        const cleanNumber = orderNumber.replace('NMD-', '').trim();
        const query = `
          query GetOrderByNumber($query: String!) {
            orders(first: 1, query: $query) {
              edges {
                node {
                  id
                  name
                  createdAt
                  email
                  totalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  displayFulfillmentStatus
                  shippingAddress {
                    firstName
                    lastName
                    address1
                    address2
                    city
                    province
                    zip
                    country
                  }
                  fulfillments(first: 5) {
                    trackingInfo(first: 5) {
                      number
                      company
                      url
                    }
                  }
                  lineItems(first: 50) {
                    edges {
                      node {
                        id
                        title
                        quantity
                        variant {
                          id
                          price
                          image {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
        const data = await client.request(query, { query: `name:${cleanNumber}` });
        const orderNode = data?.orders?.edges?.[0]?.node;

        if (orderNode && orderNode.email.toLowerCase() === email.toLowerCase()) {
          const mappedOrder = {
            id: orderNode.id,
            orderNumber: orderNode.name,
            createdAt: orderNode.createdAt,
            email: orderNode.email,
            totalPrice: {
              amount: orderNode.totalPriceSet?.shopMoney?.amount || '0',
              currencyCode: orderNode.totalPriceSet?.shopMoney?.currencyCode || 'INR'
            },
            fulfillmentStatus: orderNode.displayFulfillmentStatus,
            shippingAddress: orderNode.shippingAddress,
            trackingInfo: orderNode.fulfillments?.[0]?.trackingInfo?.[0] || null,
            lineItems: {
              edges: orderNode.lineItems?.edges?.map((itemEdge: any) => {
                const itemNode = itemEdge.node;
                return {
                  node: {
                    id: itemNode.id,
                    title: itemNode.title,
                    quantity: itemNode.quantity,
                    variant: itemNode.variant ? {
                      price: {
                        amount: itemNode.variant.price || '0',
                        currencyCode: 'INR'
                      },
                      image: itemNode.variant.image ? {
                        url: itemNode.variant.image.url
                      } : null
                    } : null
                  }
                };
              })
            }
          };
          return NextResponse.json({ order: mappedOrder });
        }
      } catch (err) {
        console.error('Failed to track live order, falling back to mock:', err);
      }
    }

    // 1. Try to find order in custom mock orders cookie first!
    const mockOrdersCookie = cookieStore.get('mock_orders')?.value;
    if (mockOrdersCookie) {
      try {
        const parsedOrders = JSON.parse(mockOrdersCookie);
        const foundCustom = parsedOrders.find((edge: any) => {
          const node = edge.node;
          return (
            (node.orderNumber.toLowerCase() === orderNumber.toLowerCase() ||
             node.orderNumber.replace('NMD-', '').toLowerCase() === orderNumber.toLowerCase() ||
             node.orderNumber.replace('#', '').toLowerCase() === orderNumber.replace('#', '').toLowerCase()) &&
            node.email.toLowerCase() === email.toLowerCase()
          );
        });
        if (foundCustom) {
          console.log('[TRACK API] Found order in local custom mock_orders cookie:', foundCustom.node.orderNumber);
          return NextResponse.json({ order: foundCustom.node });
        }
      } catch (e) {
        console.error('[TRACK API] Failed to parse custom mock_orders cookie:', e);
      }
    }

    // 2. Fallback to hardcoded mock order tracking
    const order = MOCK_ORDERS.find(o =>
      (o.orderNumber.toLowerCase() === orderNumber.toLowerCase() ||
       o.orderNumber.replace('NMD-', '').toLowerCase() === orderNumber.toLowerCase()) &&
      o.email.toLowerCase() === email.toLowerCase()
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        email: order.email,
        totalPrice: {
          amount: String(order.total),
          currencyCode: 'INR'
        },
        status: order.status,
        fulfillmentStatus: order.status === 'Delivered' ? 'FULFILLED' : 'UNFULFILLED',
        lineItems: {
          edges: order.lineItems.map(item => ({
            node: {
              id: item.id,
              title: item.title,
              quantity: item.quantity
            }
          }))
        }
      }
    });

  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
