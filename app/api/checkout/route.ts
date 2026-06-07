import { MockPaymentGateway } from '@/lib/payment/mock-gateway';
import { getEnvironment } from '@/utils/env';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { ShopifyAdminClient } from '@/lib/shopify/client';
import { getShopifySession } from '@/utils/shopifySession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const env = getEnvironment();

    // Use mock payment gateway if in development or if live Shopify config is missing
    if (env.isDev || !env.shopUrl) {
      const paymentResult = await MockPaymentGateway.processPayment({
        orderId: body.orderId || `MOCK_ORDER_${Date.now()}`,
        amount: body.totalPrice || body.amount || 0,
        currency: body.currency || 'INR',
        customerEmail: body.email || 'customer@example.com',
        cardNumber: body.cardNumber,
        expiry: body.expiry,
        cvv: body.cvv
      });

      if (paymentResult.success) {
        console.log('================================================================');
        console.log('[ORDER UPDATE PROCESS] STARTING ORDER CREATION AND UPDATE FLOW');
        console.log('================================================================');
        
        const cookieStore = await cookies();
        const customerEmail = cookieStore.get('customer_email')?.value;
        const session = getShopifySession();
        const accessToken = session?.accessToken || cookieStore.get('shopify_access_token')?.value;
        const shop = session?.shop || cookieStore.get('shopify_shop')?.value;

        console.log('[STEP 1: SESSION CHECK] Checking credentials for Shopify and Local stores:');
        console.log('  - Active customer email session:', customerEmail || 'GUEST / NONE');
        console.log('  - Server-side cached Shopify session loaded:', session ? 'YES (Valid)' : 'NO');
        console.log('  - Shopify Admin Access Token found:', accessToken ? `YES (${accessToken.slice(0, 8)}...)` : 'NO');
        console.log('  - Shopify Merchant Shop Domain:', shop || 'NONE');

        let shopifyOrderId = null;
        let shopifyOrderNumber = null;

        if (accessToken && shop) {
          console.log('\n[STEP 2: SHOPIFY UPDATE - START] Initiating order sync with Shopify Merchant Dashboard');
          try {
            console.log('  - Initializing ShopifyAdminClient for shop:', shop);
            const adminClient = new ShopifyAdminClient(shop, accessToken);
            
            console.log('  - Preparing line items from cart...');
            const draftLineItems = (body.lineItems || []).map((item: any) => {
              let cleanVariantId = item.variantId;
              if (cleanVariantId && !cleanVariantId.startsWith('gid://')) {
                try {
                  const decoded = Buffer.from(cleanVariantId, 'base64').toString('utf8');
                  if (decoded.startsWith('gid://')) {
                    console.log(`    - Decoded Base64 Storefront variant ID to Admin GID: ${cleanVariantId} -> ${decoded}`);
                    cleanVariantId = decoded;
                  }
                } catch (e: any) {
                  console.log(`    - Failed to decode variant ID ${cleanVariantId}:`, e.message);
                }
              }
              return {
                variantId: cleanVariantId,
                quantity: item.quantity
              };
            });

            const draftInput = {
              email: customerEmail || body.email || 'customer@example.com',
              shippingAddress: {
                firstName: body.firstName || 'Traveler',
                lastName: body.lastName || 'Guest',
                address1: body.address1 || '123 Main St',
                address2: body.address2 || '',
                city: body.city || 'Mumbai',
                province: body.province || 'Maharashtra',
                zip: body.zip || '400001',
                countryCode: 'IN'
              },
              billingAddress: {
                firstName: body.firstName || 'Traveler',
                lastName: body.lastName || 'Guest',
                address1: body.address1 || '123 Main St',
                address2: body.address2 || '',
                city: body.city || 'Mumbai',
                province: body.province || 'Maharashtra',
                zip: body.zip || '400001',
                countryCode: 'IN'
              },
              lineItems: draftLineItems
            };

            console.log('  - [SHOPIFY MUTATION 1/2] Sending draftOrderCreate mutation...');
            console.log('    - Payload sent to Shopify:', JSON.stringify(draftInput, null, 2));

            let draftData = await adminClient.request(
              `mutation DraftOrderCreate($input: DraftOrderInput!) {
                draftOrderCreate(input: $input) {
                  draftOrder {
                    id
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }`,
              { input: draftInput }
            );

            let draftPayload = draftData?.draftOrderCreate;
            console.log('  - [SHOPIFY RESPONSE] draftOrderCreate raw API response:', JSON.stringify(draftData, null, 2));

            if ((!draftPayload?.draftOrder?.id || (draftPayload?.userErrors && draftPayload.userErrors.length > 0)) && body.lineItems) {
              console.warn('\n  - [SHOPIFY FALLBACK TRIGGERED] Draft order creation failed or has validation errors (e.g., variant IDs do not exist in merchant catalog). Retrying with custom line items...');
              
              const customLineItems = (body.lineItems || []).map((item: any) => ({
                title: item.title || 'Product',
                originalUnitPrice: String(item.price || 0),
                quantity: item.quantity
              }));

              const retryInput = {
                ...draftInput,
                lineItems: customLineItems
              };

              console.log('  - [SHOPIFY MUTATION RETRY] Retrying draftOrderCreate with custom line items...');
              console.log('    - Fallback Payload sent to Shopify:', JSON.stringify(retryInput, null, 2));

              const retryData = await adminClient.request(
                `mutation DraftOrderCreate($input: DraftOrderInput!) {
                  draftOrderCreate(input: $input) {
                    draftOrder {
                      id
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }`,
                { input: retryInput }
              );

              console.log('  - [SHOPIFY RESPONSE] Fallback draftOrderCreate raw API response:', JSON.stringify(retryData, null, 2));

              if (retryData?.draftOrderCreate?.draftOrder?.id) {
                draftPayload = retryData.draftOrderCreate;
                console.log('  - [SHOPIFY SUCCESS] Fallback draftOrderCreate succeeded with ID:', draftPayload.draftOrder.id);
              } else {
                console.error('  - [SHOPIFY ERROR] Fallback draftOrderCreate also failed:', JSON.stringify(retryData?.draftOrderCreate?.userErrors || [], null, 2));
              }
            }

            if (draftPayload?.draftOrder?.id) {
              const draftOrderId = draftPayload.draftOrder.id;
              console.log('\n  - [SHOPIFY MUTATION 2/2] Succeeded draftOrderCreate. Proceeding to draftOrderComplete to transition draft to a real order...');
              console.log('    - Draft Order ID to complete:', draftOrderId);

              const completeData = await adminClient.request(
                `mutation DraftOrderComplete($id: ID!) {
                  draftOrderComplete(id: $id) {
                    draftOrder {
                      order {
                        id
                        name
                      }
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }`,
                { id: draftOrderId }
              );

              console.log('  - [SHOPIFY RESPONSE] draftOrderComplete raw API response:', JSON.stringify(completeData, null, 2));

              const completePayload = completeData?.draftOrderComplete;
              if (completePayload?.draftOrder?.order?.id) {
                shopifyOrderId = completePayload.draftOrder.order.id;
                shopifyOrderNumber = completePayload.draftOrder.order.name;
                console.log('  - [SHOPIFY UPDATE SUCCESS] Real Shopify order successfully updated on board! Shopify Order Name/Number:', shopifyOrderNumber);
              } else {
                console.error('  - [SHOPIFY ERROR] Failed to complete draft order:', JSON.stringify(completePayload?.userErrors || [], null, 2));
              }
            } else {
              console.error('  - [SHOPIFY ERROR] All draft order creation attempts failed. Order could not be synced on Shopify. User errors:', JSON.stringify(draftPayload?.userErrors || [], null, 2));
            }
          } catch (err: any) {
            console.error('  - [SHOPIFY EXCEPTION] Caught error during Shopify API communication:', err.message);
            if (err.message && err.message.includes('403')) {
              console.error('\n  ================================================================');
              console.error('  [403 FORBIDDEN DETECTED] This token is missing required scopes!');
              console.error('  TO FIX: Please visit http://localhost:3000/api/auth/login in');
              console.error('  your browser to re-run OAuth and request the new scopes.');
              console.error('  ================================================================\n');
            } else {
              console.error(err.stack);
            }
          }
          console.log('[STEP 2: SHOPIFY UPDATE - END]');
        } else {
          console.warn('\n[STEP 2: SHOPIFY UPDATE - SKIPPED] No admin credentials (shop url and access token) found in persistent session or cookies. Skipping live Shopify board update.');
        }

        const orderNumber = shopifyOrderNumber || `NMD-${Math.floor(1000 + Math.random() * 9000)}`;
        const orderId = shopifyOrderId || `gid://shopify/Order/${Math.floor(100000 + Math.random() * 900000)}`;

        console.log(`\n[STEP 3: LOCAL UPDATE - START] Updating local order storage (cookie: 'mock_orders') for the customer`);
        console.log(`  - Target Local Order ID: ${orderId}`);
        console.log(`  - Target Local Order Number: ${orderNumber}`);

        const newOrder = {
          node: {
            id: orderId,
            orderNumber,
            createdAt: new Date().toISOString(),
            email: customerEmail || body.email || 'customer@example.com',
            totalPrice: {
              amount: String(body.totalPrice || 0),
              currencyCode: body.currency || 'INR'
            },
            status: body.paymentMethod === 'COD' ? 'Pending COD' : 'In Transit',
            lineItems: {
              edges: (body.lineItems || []).map((item: any, idx: number) => ({
                node: {
                  id: item.variantId || `l_${idx}`,
                  title: item.title,
                  quantity: item.quantity,
                  variant: {
                    price: {
                      amount: String(item.price || 0),
                      currencyCode: 'INR'
                    },
                    image: {
                      url: item.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=300&q=80'
                    }
                  }
                }
              }))
            }
          }
        };

        console.log('  - Reading existing local orders from cookie...');
        const existingCookie = cookieStore.get('mock_orders')?.value;
        let orders = [];
        if (existingCookie) {
          try {
            orders = JSON.parse(existingCookie);
            console.log(`    - Found ${orders.length} existing orders in local cookie`);
          } catch (e: any) {
            console.error('    - Failed to parse existing local orders cookie:', e.message);
          }
        }
        
        orders.unshift(newOrder);
        console.log(`  - Saving updated orders list (total ${orders.length} orders) to local cookie 'mock_orders'`);
        cookieStore.set('mock_orders', JSON.stringify(orders), {
          path: '/',
          maxAge: 60 * 60 * 24 * 30
        });

        console.log('[STEP 3: LOCAL UPDATE - END] Cookie successfully updated.');
        console.log('================================================================');
        console.log('[ORDER UPDATE PROCESS] COMPLETED SUCCESSFULLY');
        console.log('================================================================');

        return NextResponse.json({
          ...paymentResult,
          orderId,
          orderNumber
        });
      }

      return NextResponse.json(paymentResult);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Production payment processing not configured'
      }, { status: 501 });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
