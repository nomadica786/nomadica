// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIES_TO_DELETE = [
  'shopify_access_token',
  'shopify_shop',
  'customer_access_token',
  'customer_email',
  'nomadica_auth',
  'mock_profile',
  'mock_orders',
  'shopify_wishlist',
];

function expireCookies(cookieStore: any, response: NextResponse) {
  for (const name of COOKIES_TO_DELETE) {
    const isHttpOnly = name === 'customer_access_token' || name === 'shopify_access_token';
    const cookieOptions = {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
      httpOnly: isHttpOnly,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };
    try {
      cookieStore.delete({ name, path: '/' });
      cookieStore.set(name, '', cookieOptions);
    } catch {}
    try {
      response.cookies.delete(name);
      response.cookies.set(name, '', cookieOptions);
    } catch {}
  }
}

export async function POST() {
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true });
  expireCookies(cookieStore, response);
  return response;
}

export async function GET() {
  const cookieStore = await cookies();
  const response = NextResponse.json({ success: true });
  expireCookies(cookieStore, response);
  return response;
}

