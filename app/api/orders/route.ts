// app/api/orders/route.ts
import { ShopifyAdminClient, ShopifyStorefrontClient } from '@/lib/shopify/client';
import { ADMIN_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_ORDERS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getShopifySession } from '@/utils/shopifySession';

export async function GET() {
  const env = getEnvironment();
  const cookieStore = await cookies();
  const customerEmail = cookieStore.get('customer_email')?.value;
  const customerAccessToken = cookieStore.get('customer_access_token')?.value;
  const session = getShopifySession();
  const accessToken = session?.accessToken || cookieStore.get('shopify_access_token')?.value;
  const shop = session?.shop || cookieStore.get('shopify_shop')?.value;

  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

  // Load custom mock orders from cookie (filtered by customer email)
  let customOrders: any[] = [];
  const mockOrdersCookie = cookieStore.get('mock_orders')?.value;
  if (mockOrdersCookie) {
    try {
      const parsedOrders = JSON.parse(mockOrdersCookie);
      if (customerEmail) {
        customOrders = parsedOrders.filter((order: any) =>
          order?.node?.email?.toLowerCase() === customerEmail.toLowerCase()
        );
      } else {
        customOrders = parsedOrders;
      }
    } catch {}
  }

  // 1. Check customer token first (Storefront API)
  if (customerAccessToken) {
    if (isStorefrontConfigured) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl!, storefrontToken!);
        const query = `
          query GetCustomerOrders($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
              orders(first: 10) {
                edges {
                  node {
                    id
                    orderNumber
                    processedAt
                    financialStatus
                    fulfillmentStatus
                    totalPrice {
                      amount
                      currencyCode
                    }
                    lineItems(first: 10) {
                      edges {
                        node {
                          title
                          quantity
                          variant {
                            id
                            title
                            price {
                              amount
                              currencyCode
                            }
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
        
        const data = await client.request(query, { customerAccessToken });
        const orders = data?.customer?.orders?.edges || [];

        const mappedEdges = orders.map((edge: any) => {
          const node = edge.node;
          return {
            node: {
              id: node.id,
              orderNumber: `#${node.orderNumber}`,
              createdAt: node.processedAt,
              email: '',
              totalPrice: {
                amount: node.totalPrice?.amount || '0',
                currencyCode: node.totalPrice?.currencyCode || 'INR'
              },
              financialStatus: node.financialStatus,
              fulfillmentStatus: node.fulfillmentStatus,
              lineItems: {
                edges: node.lineItems?.edges?.map((itemEdge: any) => {
                  const itemNode = itemEdge.node;
                  return {
                    node: {
                      id: itemNode.variant?.id || '',
                      title: itemNode.title,
                      quantity: itemNode.quantity,
                      variant: {
                        id: itemNode.variant?.id || '',
                        title: itemNode.variant?.title || '',
                        price: {
                          amount: itemNode.variant?.price?.amount || '0',
                          currencyCode: itemNode.variant?.price?.currencyCode || 'INR'
                        }
                      }
                    }
                  };
                })
              }
            }
          };
        });

        return NextResponse.json({
          orders: {
            edges: [...customOrders, ...mappedEdges]
          }
        });

      } catch (error) {
        console.error('Failed to fetch storefront customer orders, falling back to mock:', error);
      }
    }

    // Customer Fallback directly to mocks (merging custom orders)
    const defaultCustomerEdges = MOCK_ORDERS.map(order => ({
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
    }));

    return NextResponse.json({
      orders: {
        edges: [...customOrders, ...defaultCustomerEdges]
      }
    });
  }

  // 2. Fallback to developer Admin API
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
          edges: [...customOrders, ...mappedEdges]
        }
      });
    }
  } catch (error) {
    console.error('Failed to fetch live orders, falling back to mock:', error);
  }

  // Fallback to mock orders (merging custom orders)
  const defaultAdminEdges = MOCK_ORDERS.map(order => ({
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
  }));

  return NextResponse.json({
    orders: {
      edges: [...customOrders, ...defaultAdminEdges]
    }
  });
}
