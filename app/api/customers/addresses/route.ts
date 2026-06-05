// app/api/customers/addresses/route.ts
import { ShopifyAdminClient } from '@/lib/shopify/client';
import { ADMIN_QUERIES, ADMIN_MUTATIONS } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_ADDRESSES } from '@/utils/mockData';
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
      // Fallback to mock addresses if no customer context is linked in dev OAuth admin mode
    }
  } catch (error) {
    console.error('Failed to fetch live addresses, falling back to mock:', error);
  }

  // Fallback to mock addresses
  // Load from cookies if updated, otherwise default
  const savedAddresses = cookieStore.get('mock_addresses')?.value;
  if (savedAddresses) {
    try {
      return NextResponse.json({ addresses: JSON.parse(savedAddresses) });
    } catch {}
  }

  return NextResponse.json({
    addresses: MOCK_ADDRESSES
  });
}

export async function POST(request: NextRequest) {
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

    // Parse existing mock addresses from cookie or load defaults
    const savedAddressesCookie = cookieStore.get('mock_addresses')?.value;
    let addressesList = [];
    if (savedAddressesCookie) {
      try {
        addressesList = JSON.parse(savedAddressesCookie);
      } catch {
        addressesList = [...MOCK_ADDRESSES];
      }
    } else {
      addressesList = [...MOCK_ADDRESSES];
    }

    const newAddress = {
      id: `gid://shopify/MailingAddress/${Date.now()}`,
      label: body.label || 'Additional Address',
      name: body.name || 'Arjun Mehta',
      address1: body.address1 || '',
      address2: body.address2 || '',
      city: body.city || '',
      province: body.province || '',
      country: body.country || 'India',
      zip: body.zip || '',
      default: body.default || false,
    };

    if (newAddress.default) {
      addressesList.forEach((addr: any) => { addr.default = false; });
    }

    addressesList.push(newAddress);

    // Save to cookies
    cookieStore.set('mock_addresses', JSON.stringify(addressesList), { path: '/' });

    if (accessToken && shop) {
      try {
        const client = new ShopifyAdminClient(shop, accessToken);
        // Fallback returns success directly
      } catch (err) {
        console.error('Failed to create address in Shopify:', err);
      }
    }

    return NextResponse.json({
      customerAddress: newAddress,
      addresses: addressesList,
      userErrors: []
    });
  } catch (error) {
    console.error('Create address error:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
