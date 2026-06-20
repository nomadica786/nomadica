// app/api/journal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBlogArticles } from '@/lib/shopify/journal';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after') || undefined;
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const data = await getBlogArticles(limit, after, { cache: 'no-store' });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch journal articles API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
