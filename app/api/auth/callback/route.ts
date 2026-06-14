// app/api/auth/callback/route.ts
import { ShopifyAuth } from '@/lib/shopify/auth';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { setShopifySession } from '@/utils/shopifySession';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');

  if (!code || !shop) {
    return NextResponse.json(
      { error: 'Missing authorization code or shop parameter' },
      { status: 400 }
    );
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/';
    const redirectUri = `${appUrl}/api/auth/callback`;
    const tokenResponse = await ShopifyAuth.getAccessToken(code, redirectUri);

    // Persist session on server so checkout works from customer sessions
    setShopifySession({
      accessToken: tokenResponse.access_token,
      shop: shop
    });

    const cookieStore = await cookies();
    
    // Store access token in secure HTTP-only cookie
    cookieStore.set('shopify_access_token', tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.expires_in || 31536000, // 1 year fallback
      path: '/',
    });

    // Store shop URL in regular cookie for reference
    cookieStore.set('shopify_shop', shop, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Redirect to profile
    return NextResponse.redirect(`${appUrl}/account/profile`);
  } catch (error) {
    console.error('OAuth callback failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 500 }
    );
  }
}
