// app/api/orders/track/route.ts
import { ShopifyAdminClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { MOCK_ORDERS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

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
    const accessToken = cookieStore.get('shopify_access_token')?.value;
    const shop = cookieStore.get('shopify_shop')?.value;

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
                  lineItems(first: 50) {
                    edges {
                      node {
                        id
                        title
                        quantity
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
            lineItems: {
              edges: orderNode.lineItems?.edges?.map((itemEdge: any) => {
                const itemNode = itemEdge.node;
                return {
                  node: {
                    id: itemNode.id,
                    title: itemNode.title,
                    quantity: itemNode.quantity
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

    // Fallback to mock order tracking
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
