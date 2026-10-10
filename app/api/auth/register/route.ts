// app/api/auth/register/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json();

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
          mutation CustomerRegister($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer {
                firstName
                lastName
                email
                phone
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
          input: {
            firstName: firstName || '',
            lastName: lastName || '',
            email,
            password,
            phone: phone || undefined
          }
        });

        const payload = data?.customerCreate;
        if (payload?.customerUserErrors && payload.customerUserErrors.length > 0) {
          const errorMessage = payload.customerUserErrors.map((e: any) => e.message).join(', ');
          return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        // Auto-login after successful registration
        const loginMutation = `
          mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken {
                accessToken
              }
              customerUserErrors {
                message
              }
            }
          }
        `;

        const loginData = await client.request(loginMutation, {
          input: { email, password }
        });

        const loginPayload = loginData?.customerAccessTokenCreate;
        const accessToken = loginPayload?.customerAccessToken?.accessToken;

        if (accessToken) {
          const cookieStore = await cookies();
          cookieStore.set('customer_access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30
          });

          cookieStore.set('customer_email', email, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30
          });

          cookieStore.set('nomadica_auth', 'true', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30
          });
        }

        return NextResponse.json({
          success: true,
          token: accessToken || null,
          user: {
            email,
            firstName: firstName || email.split('@')[0],
            lastName: lastName || 'Traveler',
            phone: phone || ''
          }
        });
      } catch (err: any) {
        console.error('Shopify customer registration failed, falling back to mock:', err);
      }
    }

    // Mock Fallback Mode
    const mockToken = `mock_customer_token_${Date.now()}`;
    const cookieStore = await cookies();
    cookieStore.set('customer_access_token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    cookieStore.set('customer_email', email, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    cookieStore.set('nomadica_auth', 'true', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    const mockProfile = {
      email,
      firstName: firstName || email.split('@')[0],
      lastName: lastName || 'Traveler',
      phone: phone || ''
    };

    // Save mock profile in cookies
    cookieStore.set('mock_profile', JSON.stringify(mockProfile), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return NextResponse.json({
      success: true,
      token: mockToken,
      user: mockProfile
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
