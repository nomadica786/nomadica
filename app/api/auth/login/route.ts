// app/api/auth/login/route.ts
import { ShopifyAuth } from '@/lib/shopify/auth';
import { getEnvironment } from '@/utils/env';
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
