import { getProductTypeMockups } from '@/lib/shopify/products';
import { NextResponse } from 'next/server';

export async function GET() {
  const mockups = await getProductTypeMockups();
  const fallbackMockups: Record<string, { mockupImage: string; displayName?: string }> = {
    "Tee": { mockupImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", displayName: "Tee" },
    "Shirt": { mockupImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80", displayName: "Shirt" },
    "Trousers": { mockupImage: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", displayName: "Trousers" },
    "Jacket": { mockupImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", displayName: "Jacket" },
    "Sweater": { mockupImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", displayName: "Sweater" },
    "Polo": { mockupImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80", displayName: "Polo" },
    "Shorts": { mockupImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80", displayName: "Shorts" }
  };

  const merged: Record<string, { mockupImage?: string; displayName?: string }> = {};

  for (const [key, val] of Object.entries(fallbackMockups)) {
    merged[key] = { ...val };
  }

  for (const [key, val] of Object.entries(mockups)) {
    merged[key] = {
      ...merged[key],
      ...val
    };
  }

  return NextResponse.json({
    mockups: merged
  });
}
