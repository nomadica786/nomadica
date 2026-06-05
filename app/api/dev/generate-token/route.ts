// app/api/dev/generate-token/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ShopifyAdminClient } from '@/lib/shopify/client';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;

  if (!accessToken || !shop) {
    return NextResponse.json(
      {
        success: false,
        error: 'Not authenticated. Please visit http://localhost:3000/api/auth/login to authenticate with Shopify first, then refresh this page.'
      },
      { status: 401 }
    );
  }

  try {
    const client = new ShopifyAdminClient(shop, accessToken);
    const mutation = `
      mutation CreateStorefrontToken($input: StorefrontAccessTokenInput!) {
        storefrontAccessTokenCreate(input: $input) {
          storefrontAccessToken {
            accessToken
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await client.request(mutation, {
      input: { title: "Nomadica Storefront Token" }
    });

    const payload = data?.storefrontAccessTokenCreate;
    if (payload?.userErrors && payload.userErrors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: payload.userErrors
      }, { status: 400 });
    }

    const token = payload?.storefrontAccessToken?.accessToken;
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Failed to retrieve storefront token from Shopify payload'
      }, { status: 500 });
    }

    // Write token to .env file in project root
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace the placeholder or existing token
      if (envContent.includes('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=')) {
        envContent = envContent.replace(
          /NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=.*/,
          `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=${token}`
        );
      } else {
        envContent += `\nNEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=${token}`;
      }
      
      fs.writeFileSync(envPath, envContent, 'utf8');
    }

    return NextResponse.json({
      success: true,
      message: 'Storefront access token created successfully and written to .env! Please restart your Next.js development server to apply the changes.',
      token: token
    });

  } catch (error) {
    console.error('Failed to generate storefront access token:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
