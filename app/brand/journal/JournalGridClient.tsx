// app/brand/journal/JournalGridClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ArrowRight } from 'lucide-react';
import { ShopifyArticle, getReadingTime } from '@/lib/shopify/journal';

interface JournalGridClientProps {
  initialArticles: ShopifyArticle[];
  initialPageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

export default function JournalGridClient({
  initialArticles,
  initialPageInfo
}: JournalGridClientProps) {
  const [articles, setArticles] = useState<ShopifyArticle[]>(initialArticles);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (isLoading || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/journal?after=${encodeURIComponent(pageInfo.endCursor)}`);
      if (!response.ok) throw new Error('Failed to fetch more articles');
      const data = await response.json();
      
      setArticles(prev => [...prev, ...data.articles]);
      setPageInfo(data.pageInfo);
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full">
      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {articles.map((article) => {
          const category = article.tags?.[0] || 'Travel';
          const readingTime = getReadingTime(article.contentHtml);
          
          return (
            <article 
              key={article.id} 
              className="group flex flex-col justify-between h-full bg-white rounded-2xl border border-black/5 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-black/10"
            >
              <Link href={`/brand/journal/${article.handle}`} className="flex flex-col h-full">
                {/* Image Container */}
                <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#EDEAE2]">
                  <Image
                    src={article.image?.url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'}
                    alt={article.image?.altText || article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Category tag */}
                    <span className="font-sans text-[10px] font-bold tracking-wider text-[#7A5C3E] uppercase block mb-3">
                      {category}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-xl text-[#1E1E1E] leading-snug mb-3 group-hover:text-[#7A5C3E] transition-colors">
                      {article.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="font-sans text-xs text-black/60 leading-relaxed line-clamp-3 mb-6">
                      {article.excerpt}
                    </p>
                  </div>
                  
                  {/* Meta Footer */}
                  <div className="flex items-center justify-between border-t border-black/5 pt-4 mt-auto">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-[10px] font-semibold text-black/70">
                        {article.authorV2?.name || 'Nomadica Staff'}
                      </span>
                      <span className="font-sans text-[9px] text-black/40">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    
                    <span className="font-sans text-[9px] font-semibold tracking-wider text-black/40 uppercase bg-[#F7F4EE] px-2.5 py-1 rounded-full">
                      {readingTime} min read
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Pagination Button */}
      {pageInfo.hasNextPage && (
        <div className="flex justify-center items-center mt-16">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="flex items-center gap-2.5 px-8 py-3.5 border border-black/15 bg-white text-black font-sans text-xs font-bold tracking-wider uppercase rounded-full shadow-sm hover:bg-[#F7F4EE] hover:border-black/30 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Loading...
              </>
            ) : (
              <>
                Load More Stories
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
