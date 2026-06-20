import React from 'react';
import { getBlogArticles } from '@/lib/shopify/journal';
import JournalGridClient from './JournalGridClient';
import { constructMetadata } from '@/lib/seo/metadata';

// Force dynamic rendering to fetch fresh articles on every request
export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: 'Brand Journal | Stories, Guides & Perspectives | Nomadica',
  description: 'Wanderlust narratives, destination guides, slow travel perspectives, and cultural insights from the Nomadica global travel community.',
  path: '/journal',
  ogImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
});

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
