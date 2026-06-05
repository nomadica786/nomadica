// app/api/customers/profile/route.ts
import { ShopifyAdminClient } from '@/lib/shopify/client';
import { ADMIN_QUERIES, ADMIN_MUTATIONS } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

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
  // Retrieve customized profile from cookies if it was updated, otherwise return default mock
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
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;

  try {
    const body = await request.json();

    const isConfigured = !!env.shopUrl && !!env.clientId;

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
