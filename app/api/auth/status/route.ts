// app/api/auth/status/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ShopifyAdminClient, ShopifyStorefrontClient } from '@/lib/shopify/client';
import { ADMIN_QUERIES } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const headerToken = request.headers.get('x-customer-token') || bearerToken;
  const cookieToken = cookieStore.get('customer_access_token')?.value;
  const customerAccessToken = headerToken || cookieToken;

  const customerEmail = cookieStore.get('customer_email')?.value;
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;
  const env = getEnvironment();

  // 1. Check customer session first (Storefront API authenticated customer or token)
  if (customerAccessToken) {
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

    if (isStorefrontConfigured && !customerAccessToken.startsWith('mock_')) {
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
          cookieStore.set('nomadica_auth', 'true', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30
          });

          return NextResponse.json({
            isAuthenticated: true,
            token: customerAccessToken,
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
        const parsed = JSON.parse(savedProfile);
        cookieStore.set('nomadica_auth', 'true', {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30
        });

        return NextResponse.json({
          isAuthenticated: true,
          token: customerAccessToken,
          user: {
            ...parsed,
            isCustomer: true
          }
        });
      } catch {}
    }

    cookieStore.set('nomadica_auth', 'true', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return NextResponse.json({
      isAuthenticated: true,
      token: customerAccessToken,
      user: {
        email: customerEmail || 'arjun.mehta@email.com',
        firstName: customerEmail ? customerEmail.split('@')[0] : 'Arjun',
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

      cookieStore.set('nomadica_auth', 'true', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      });

      return NextResponse.json({
        isAuthenticated: true,
        token: accessToken,
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

  return NextResponse.json(
    { isAuthenticated: false, user: null, token: null },
    { status: 200 }
  );
}
