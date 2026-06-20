import React from 'react';
import { getBlogArticles } from '@/lib/shopify/journal';
import JournalGridClient from './JournalGridClient';

// Force dynamic rendering to fetch fresh articles on every request
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Brand Journal | Stories, Guides & Perspectives | Nomadica',
  description: 'Wanderlust narratives, destination guides, slow travel perspectives, and cultural insights from the Nomadica global travel community.',
  openGraph: {
    title: 'Brand Journal | Stories, Guides & Perspectives | Nomadica',
    description: 'Wanderlust narratives, destination guides, slow travel perspectives, and cultural insights.',
    images: [{ url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' }],
    type: 'website',
  }
};

export default async function BrandJournalPage() {
  // Fetch initial batch of articles
  const { articles, pageInfo } = await getBlogArticles(12);

  return (
    <div className="min-h-screen bg-var(--sand) text-[#1E1E1E] pt-[64px] flex flex-col items-center w-full">
      <JournalGridClient 
        initialArticles={articles} 
        initialPageInfo={pageInfo} 
      />
    </div>
  );
}
