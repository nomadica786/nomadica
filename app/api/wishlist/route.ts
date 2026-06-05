// app/api/wishlist/route.ts
import { MOCK_PRODUCTS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const wishlistCookie = cookieStore.get('shopify_wishlist')?.value;
  let productIds: string[] = [];

  if (wishlistCookie) {
    try {
      productIds = JSON.parse(wishlistCookie);
    } catch {}
  }

  // Find products matching the wishlisted IDs
  const wishlistProducts = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));

  return NextResponse.json({
    wishlist: wishlistProducts
  });
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const wishlistCookie = cookieStore.get('shopify_wishlist')?.value;
    let productIds: string[] = [];

    if (wishlistCookie) {
      try {
        productIds = JSON.parse(wishlistCookie);
      } catch {}
    }

    if (!productIds.includes(productId)) {
      productIds.push(productId);
    }

    // Save back to cookie (expires in 30 days)
    cookieStore.set('shopify_wishlist', JSON.stringify(productIds), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    const wishlistProducts = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));

    return NextResponse.json({
      wishlist: wishlistProducts,
      success: true
    });
  } catch (error) {
    console.error('Add to wishlist failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
