// app/api/customers/profile/route.ts
import { ShopifyAdminClient, ShopifyStorefrontClient } from '@/lib/shopify/client';
import { ADMIN_QUERIES, ADMIN_MUTATIONS } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  const env = getEnvironment();
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customer_access_token')?.value;
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;
  const customerEmail = cookieStore.get('customer_email')?.value;

  const isConfigured = !!env.shopUrl && !!env.clientId;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

  // 1. Check customer session first
  if (customerAccessToken) {
    if (isStorefrontConfigured) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl!, storefrontToken!);
        const query = `
          query GetCustomerProfile($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
              email
              firstName
              lastName
              phone
            }
          }
        `;
        const data = await client.request(query, { customerAccessToken });
        const customer = data?.customer;

        if (customer) {
          return NextResponse.json({
            customer: {
              email: customer.email,
              firstName: customer.firstName,
              lastName: customer.lastName,
              phone: customer.phone || '',
            }
          });
        }
      } catch (err) {
        console.error('Failed to validate customer token with Storefront API, falling back to mock:', err);
      }
    }

    // Customer Session Mock Fallback
    const savedProfile = cookieStore.get('mock_profile')?.value;
    if (savedProfile) {
      try {
        return NextResponse.json({ customer: JSON.parse(savedProfile) });
      } catch {}
    }

    return NextResponse.json({
      customer: {
        email: customerEmail || 'arjun.mehta@email.com',
        firstName: 'Arjun',
        lastName: 'Mehta',
        phone: '+91 98765 43210'
      }
    });
  }

  // 2. Fallback to developer admin session
  if (!accessToken && isConfigured) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    if (accessToken && shop) {
      const client = new ShopifyAdminClient(shop, accessToken);
      // Fetch shop owner details as customer profile in development
      const data = await client.request(ADMIN_QUERIES.GET_SHOP_INFO);
      return NextResponse.json({
        customer: {
          email: data.shop.email,
          firstName: 'Shop',
          lastName: data.shop.name,
          phone: '',
        }
      });
    }
  } catch (error) {
    console.error('Failed to fetch live profile, falling back to mock:', error);
  }

  // Fallback to mock profile
  const savedProfile = cookieStore.get('mock_profile')?.value;
  if (savedProfile) {
    try {
      return NextResponse.json({ customer: JSON.parse(savedProfile) });
    } catch {}
  }

  return NextResponse.json({
    customer: {
      email: 'arjun.mehta@email.com',
      firstName: 'Arjun',
      lastName: 'Mehta',
      phone: '+91 98765 43210'
    }
  });
}

export async function PUT(request: NextRequest) {
  const env = getEnvironment();
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customer_access_token')?.value;
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

  try {
    const body = await request.json();
    const isConfigured = !!env.shopUrl && !!env.clientId;

    // 1. Customer Access Token PUT
    if (customerAccessToken) {
      if (isStorefrontConfigured) {
        try {
          const client = new ShopifyStorefrontClient(env.shopUrl!, storefrontToken!);
          const mutation = `
            mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
              customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
                customer {
                  email
                  firstName
                  lastName
                  phone
                }
                customerUserErrors {
                  field
                  message
                }
              }
            }
          `;
          const data = await client.request(mutation, {
            customerAccessToken,
            customer: {
              firstName: body.firstName,
              lastName: body.lastName,
              email: body.email,
              phone: body.phone
            }
          });
          
          if (data?.customerUpdate?.customer) {
            cookieStore.set('mock_profile', JSON.stringify({
              email: body.email,
              firstName: body.firstName,
              lastName: body.lastName,
              phone: body.phone
            }), { path: '/' });

            return NextResponse.json({
              customerUpdate: {
                customer: data.customerUpdate.customer,
                userErrors: data.customerUpdate.customerUserErrors || []
              }
            });
          }
        } catch (err) {
          console.error('Shopify customer profile update mutation failed:', err);
        }
      }

      // Mock update fallback
      cookieStore.set('mock_profile', JSON.stringify({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone
      }), { path: '/' });

      return NextResponse.json({
        customerUpdate: {
          customer: {
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone
          },
          userErrors: []
        }
      });
    }

    // 2. Admin Access Token PUT
    if (!accessToken && isConfigured) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (accessToken && shop) {
      try {
        const client = new ShopifyAdminClient(shop, accessToken);
        const data = await client.request(ADMIN_MUTATIONS.UPDATE_CUSTOMER, {
          input: {
            id: body.id,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
          }
        });
        return NextResponse.json(data);
      } catch (err) {
        console.error('Shopify profile update mutation failed:', err);
      }
    }

    // Update fallback in cookies so it persists during user session
    cookieStore.set('mock_profile', JSON.stringify({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone
    }), { path: '/' });

    return NextResponse.json({
      customerUpdate: {
        customer: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone
        },
        userErrors: []
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
