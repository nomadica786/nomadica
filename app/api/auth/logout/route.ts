// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('shopify_access_token');
  cookieStore.delete('shopify_shop');
  cookieStore.delete('customer_access_token');
  cookieStore.delete('customer_email');
  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete('shopify_access_token');
  cookieStore.delete('shopify_shop');
  cookieStore.delete('customer_access_token');
  cookieStore.delete('customer_email');
  return NextResponse.json({ success: true });
}
