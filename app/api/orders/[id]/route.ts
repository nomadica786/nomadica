// app/api/orders/[id]/route.ts
import { ShopifyAdminClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { MOCK_ORDERS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getShopifySession } from '@/utils/shopifySession';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const env = getEnvironment();
  const cookieStore = await cookies();
  const session = getShopifySession();
  const accessToken = session?.accessToken || cookieStore.get('shopify_access_token')?.value;
  const shop = session?.shop || cookieStore.get('shopify_shop')?.value;

  const isConfigured = !!env.shopUrl && !!env.clientId;

  if (!accessToken && isConfigured) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    if (accessToken && shop) {
      const client = new ShopifyAdminClient(shop, accessToken);
      const query = `
        query GetOrderById($id: ID!) {
          order(id: $id) {
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
            displayFinancialStatus
            displayFulfillmentStatus
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    price
                  }
                }
              }
            }
          }
        }
      `;
      const data = await client.request(query, { id });
      const node = data?.order;
      if (!node) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const mappedOrder = {
        id: node.id,
        orderNumber: node.name,
        createdAt: node.createdAt,
        email: node.email,
        totalPrice: {
          amount: node.totalPriceSet?.shopMoney?.amount || '0',
          currencyCode: node.totalPriceSet?.shopMoney?.currencyCode || 'INR'
        },
        financialStatus: node.displayFinancialStatus,
        fulfillmentStatus: node.displayFulfillmentStatus,
        lineItems: {
          edges: node.lineItems?.edges?.map((itemEdge: any) => {
            const itemNode = itemEdge.node;
            return {
              node: {
                id: itemNode.id,
                title: itemNode.title,
                quantity: itemNode.quantity,
                variant: {
                  id: itemNode.variant?.id,
                  title: itemNode.variant?.title,
                  price: {
                    amount: itemNode.variant?.price || '0',
                    currencyCode: 'INR'
                  }
                }
              }
            };
          })
        }
      };

      return NextResponse.json({ order: mappedOrder });
    }
  } catch (error) {
    console.error(`Failed to fetch live order ${id}, falling back to mock:`, error);
  }

  // Fallback to mock order details
  // Allow finding by ID or orderNumber (NMD-2047)
  const order = MOCK_ORDERS.find(o => o.id === id || o.orderNumber === id || o.orderNumber.replace('NMD-', '') === id);
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
      lineItems: {
        edges: order.lineItems.map(item => ({
          node: {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            variant: {
              price: {
                amount: String(item.price),
                currencyCode: 'INR'
              }
            }
          }
        }))
      }
    }
  });
}
