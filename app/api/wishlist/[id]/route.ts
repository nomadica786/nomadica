// app/api/wishlist/[id]/route.ts
import { MOCK_PRODUCTS } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const wishlistCookie = cookieStore.get('shopify_wishlist')?.value;
    let productIds: string[] = [];

    if (wishlistCookie) {
      try {
        productIds = JSON.parse(wishlistCookie);
      } catch {}
    }

    const index = productIds.indexOf(id);
    if (index !== -1) {
      productIds.splice(index, 1);
    }

    // Save back to cookie
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
    console.error('Remove from wishlist failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
