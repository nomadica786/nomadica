// app/api/orders/route.ts
import { ShopifyAdminClient } from '@/lib/shopify/client';
import { ADMIN_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_ORDERS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const env = getEnvironment();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;

  const isConfigured = !!env.shopUrl && !!env.clientId;

  if (!accessToken && isConfigured) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    if (accessToken && shop) {
      const client = new ShopifyAdminClient(shop, accessToken);
      const data = await client.request(ADMIN_QUERIES.GET_ORDERS, { first: 10 });
      
      const mappedEdges = data?.orders?.edges?.map((edge: any) => {
        const node = edge.node;
        return {
          node: {
            id: node.id,
            orderNumber: node.name,
            createdAt: node.createdAt,
            email: node.email,
            customer: node.customer,
            totalPrice: {
              amount: node.totalPriceSet?.shopMoney?.amount || '0',
              currencyCode: node.totalPriceSet?.shopMoney?.currencyCode || 'INR'
            },
            totalTax: {
              amount: node.totalTaxSet?.shopMoney?.amount || '0',
              currencyCode: node.totalTaxSet?.shopMoney?.currencyCode || 'INR'
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
          }
        };
      }) || [];

      return NextResponse.json({
        orders: {
          edges: mappedEdges
        }
      });
    }
  } catch (error) {
    console.error('Failed to fetch live orders, falling back to mock:', error);
  }

  // Fallback to mock orders formatted in GraphQL structure
  return NextResponse.json({
    orders: {
      edges: MOCK_ORDERS.map(order => ({
        node: {
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
      }))
    }
  });
}
