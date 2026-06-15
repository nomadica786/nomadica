// app/brand/journal/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { getBlogArticles, getReadingTime } from '@/lib/shopify/journal';
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
  // Fetch initial batch of articles (1 featured + up to 9 grid items = 10 items)
  const { articles, pageInfo } = await getBlogArticles(10);
  
  const featuredArticle = articles[0] || null;
  const remainingArticles = articles.slice(1);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1E1E1E] pt-[64px]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center px-6 text-center bg-[#FFFFFF] border-b border-black/5" style={{ minHeight: "45vh" }}>
        {/* Background Grain Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-4">
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
      <main className="max-w-7xl mx-auto px-6 py-16 sm:px-8 space-y-24">
        {/* Featured Article Section */}
        {featuredArticle && (
          <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#FFFFFF] rounded-3xl overflow-hidden p-6 lg:p-8 border border-black/5">
              {/* Featured Image */}
              <div className="lg:col-span-7 w-full">
                <Link href={`/brand/journal/${featuredArticle.handle}`}>
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/10] overflow-hidden rounded-2xl bg-[#FFFFFF] group">
                    <Image
                      src={featuredArticle.image?.url || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'}
                      alt={featuredArticle.image?.altText || featuredArticle.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                </Link>
              </div>

              {/* Featured Meta Info */}
              <div className="lg:col-span-5 flex flex-col justify-center h-full space-y-4">
                <span className="font-sans text-[10px] font-bold tracking-[0.15em] text-[#1E1E1E] uppercase bg-[#FFFFFF] px-3.5 py-1 rounded-full w-max border border-black/5 shadow-sm">
                  {featuredArticle.tags?.[0] || 'Featured'}
                </span>

                <Link href={`/brand/journal/${featuredArticle.handle}`} className="group">
                  <h2 className="text-3xl sm:text-4xl lg:text-3.5xl xl:text-4xl text-[#1E1E1E] leading-tight hover:text-[#1E1E1E] transition-colors duration-300">
                    {featuredArticle.title}
                  </h2>
                </Link>

                <p className="font-sans text-sm text-black/60 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex flex-col gap-1 border-t border-black/5 pt-4 mt-2">
                  <span className="font-sans text-[11px] font-semibold text-black/80">
                    By {featuredArticle.authorV2?.name || 'Nomadica Staff'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-black/40 font-sans">
                    <span>{formatDate(featuredArticle.publishedAt)}</span>
                    <span className="h-1 w-1 rounded-full bg-black/15" />
                    <span>{getReadingTime(featuredArticle.contentHtml)} min read</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    href={`/brand/journal/${featuredArticle.handle}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-[#FFFFFF] font-sans text-xs font-bold tracking-wider uppercase rounded-full shadow-sm hover:bg-[#1E1E1E] transition-all duration-300 group"
                  >
                    Read Story
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Editorial Journal Grid */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <h2 className="text-2xl font-normal text-[#1E1E1E]">
              Recent Perspectives
            </h2>
            <span className="font-sans text-[10px] font-bold text-black/40 tracking-wider uppercase">
              {remainingArticles.length} Stories Found
            </span>
          </div>

          <JournalGridClient 
            initialArticles={remainingArticles} 
            initialPageInfo={pageInfo} 
          />
        </section>
      </main>
    </div>
  );
}
