// app/api/auth/status/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ShopifyAdminClient, ShopifyStorefrontClient } from '@/lib/shopify/client';
import { ADMIN_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';

export async function GET() {
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customer_access_token')?.value;
  const customerEmail = cookieStore.get('customer_email')?.value;
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;
  const env = getEnvironment();

  // 1. Check customer session first (Storefront API authenticated customer)
  if (customerAccessToken) {
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

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
            isAuthenticated: true,
            user: {
              email: customer.email,
              firstName: customer.firstName,
              lastName: customer.lastName,
              phone: customer.phone,
              isCustomer: true
            }
          });
        }
      } catch (err) {
        console.error('Failed to validate customer token with Storefront API:', err);
      }
    }

    // Customer Session Mock Fallback
    const savedProfile = cookieStore.get('mock_profile')?.value;
    if (savedProfile) {
      try {
        return NextResponse.json({
          isAuthenticated: true,
          user: {
            ...JSON.parse(savedProfile),
            isCustomer: true
          }
        });
      } catch {}
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        email: customerEmail || 'arjun.mehta@email.com',
        firstName: 'Arjun',
        lastName: 'Mehta',
        isCustomer: true
      }
    });
  }

  // 2. Fallback to developer admin session (OAuth merchant token)
  if (accessToken && shop) {
    try {
      const client = new ShopifyAdminClient(shop, accessToken);
      const shopData = await client.request<{ shop: { name: string; email: string } }>(
        ADMIN_QUERIES.GET_SHOP_INFO
      );

      const nameParts = shopData.shop.name.split(' ');
      const firstName = nameParts[0] || 'Shop';
      const lastName = nameParts.slice(1).join(' ') || 'Admin';

      return NextResponse.json({
        isAuthenticated: true,
        user: {
          email: shopData.shop.email,
          firstName,
          lastName,
          isAdmin: true
        },
      });
    } catch (error) {
      console.error('Validate session failed, returning mock profile fallback:', error);
    }
  }

  // 3. Fallback to default mock customer if not configured
  const isConfigured = !!env.shopUrl && !!env.clientId;
  if (!isConfigured) {
    const savedProfile = cookieStore.get('mock_profile')?.value;
    if (savedProfile) {
      try {
        return NextResponse.json({
          isAuthenticated: true,
          user: JSON.parse(savedProfile),
        });
      } catch {}
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        email: 'arjun.mehta@email.com',
        firstName: 'Arjun',
        lastName: 'Mehta',
        isMock: true,
      },
    });
  }

  return NextResponse.json(
    { isAuthenticated: false, user: null },
    { status: 200 }
  );
}
