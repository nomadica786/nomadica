/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/login/route.ts
import { ShopifyAuth } from '@/lib/shopify/auth';
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const env = getEnvironment();
    if (!env.isDev) {
      return NextResponse.json(
        { error: 'OAuth login only available in development' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${appUrl}/api/auth/callback`;
    const scopes = ShopifyAuth.getRequiredScopes();
    const authUrl = ShopifyAuth.getAuthorizationUrl(scopes, redirectUri);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('OAuth login redirect failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const env = getEnvironment();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

    if (isStorefrontConfigured) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl!, storefrontToken!);
        const mutation = `
          mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken {
                accessToken
                expiresAt
              }
              customerUserErrors {
                field
                message
                code
              }
            }
          }
        `;

        const data = await client.request(mutation, {
          input: { email, password }
        });

        const payload = data?.customerAccessTokenCreate;
        if (payload?.customerUserErrors && payload.customerUserErrors.length > 0) {
          const errorMessage = payload.customerUserErrors.map((e: any) => e.message).join(', ');
          return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        const accessToken = payload?.customerAccessToken?.accessToken;
        if (!accessToken) {
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const cookieStore = await cookies();
        cookieStore.set('customer_access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });

        cookieStore.set('customer_email', email, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });

        return NextResponse.json({ success: true });
      } catch (err: unknown) {
        console.error('Shopify customer login failed, falling back to mock:', err);
      }
    }

    // Mock Fallback Mode
    const cookieStore = await cookies();
    cookieStore.set('customer_access_token', `mock_customer_token_${Date.now()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    cookieStore.set('customer_email', email, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Save a mock profile in cookies
    cookieStore.set('mock_profile', JSON.stringify({
      email: email,
      firstName: email.split('@')[0],
      lastName: 'Traveler',
      phone: ''
    }), { path: '/' });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
