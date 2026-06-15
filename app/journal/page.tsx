import React from 'react';
import { Compass } from 'lucide-react';
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
  // Fetch initial batch of articles (1 featured + up to 9 grid items = 10 items)
  const { articles, pageInfo } = await getBlogArticles(10);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1E1E1E] pt-[64px] flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center px-6 pb-24 text-center bg-[#FFFFFF] border-b border-black/5 w-full mb-8" style={{ minHeight: "45vh" }}>
        {/* Background Grain Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="mt-28 relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/15 bg-[#FFFFFF] shadow-sm">
            <Compass size={13} className="text-[#1E1E1E]" style={{ animation: 'spin 8s linear infinite' }} />
            <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#1E1E1E] uppercase leading-none">
              BRAND JOURNAL
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1] tracking-tight text-[#1E1E1E] mt-2">
            Stories, Guides <br className="sm:hidden" />
            <span className="italic font-normal text-[#1E1E1E]">& Perspectives</span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-black/60 leading-relaxed max-w-xl mt-4">
            A quiet space dedicated to visual storytelling, destination guides, slow travel journals, and cultural perspectives from explorers around the globe.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-[1400px] mx-auto px-8 pt-20 pb-32 sm:px-12 flex flex-col items-center justify-center mt-12">
        {/* Editorial Journal Grid */}
        <section className="space-y-32 w-full flex flex-col items-center justify-center">
          <div className="w-full flex justify-center">
            <JournalGridClient 
              initialArticles={articles} 
              initialPageInfo={pageInfo} 
            />
          </div>
        </section>
      </main>
    </div>
  );
}
