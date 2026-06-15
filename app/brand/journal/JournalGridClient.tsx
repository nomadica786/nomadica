// app/brand/journal/JournalGridClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ArrowRight } from 'lucide-react';
import { ShopifyArticle, getReadingTime } from '@/lib/shopify/journal';
import { motion } from 'framer-motion';

interface JournalGridClientProps {
  initialArticles: ShopifyArticle[];
  initialPageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export function JournalCard({ article, priority = false }: { article: ShopifyArticle; priority?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const category = article.tags?.[0] || 'Travel';
  const readingTime = getReadingTime(article.contentHtml);
  
  return (
    <motion.div 
      className="flex flex-col justify-between h-full w-full max-w-[360px] bg-[#F9F9F9] rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] p-6 gap-6 overflow-hidden border border-black/5 m-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
        borderColor: "rgba(30,30,30,0.15)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Top Meta Header */}
      <div className="flex justify-between items-center px-1">
        {/* Category Badge / Tag */}
        <span className="font-sans text-[10px] font-bold tracking-[0.15em] text-[#1E1E1E]/60 uppercase">
          {category}
        </span>
        
        {/* Read Link */}
        <Link href={`/brand/journal/${article.handle}`}>
          <motion.div 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer text-[#1E1E1E] border border-black/10"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
              borderColor: "#1E1E1E",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </motion.div>
        </Link>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1 min-h-[4rem] justify-center">
        <Link href={`/brand/journal/${article.handle}`}>
          <h3 className="text-xl text-center font-bold tracking-tight text-[#1E1E1E] line-clamp-2 hover:text-black/70 transition-colors uppercase font-serif">
            {article.title}
          </h3>
        </Link>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-black/5">
        {/* Blurred Background effect */}
        <div className="absolute inset-0 opacity-10 z-0">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <Image 
              src={article.image?.url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'} 
              alt={article.title} 
              className="w-full h-full object-cover blur-sm scale-150"
              fill
              sizes="250px"
            />
          </motion.div>
        </div>
        
        {/* Main Image */}
        <motion.div 
          className="relative z-10 w-full h-full p-2"
          whileHover={{ scale: 1.02 }}
          transition={{ ease: "easeInOut" }}
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image 
              src={article.image?.url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'} 
              alt={article.title} 
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority={priority}
            />
          </div>
        </motion.div>
      </div>

      {/* Excerpt / Desc */}
      <div className="flex-1 flex flex-col justify-between">
        <p className="font-sans text-xs text-center text-[#1E1E1E]/75 font-light leading-relaxed line-clamp-3 px-2">
          {article.excerpt}
        </p>

        {/* Card Footer Meta */}
        <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-4 px-1">
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-[10px] font-semibold text-[#1E1E1E]/85">
              By {article.authorV2?.name || 'Nomadica Staff'}
            </span>
            <span className="font-sans text-[9px] text-[#1E1E1E]/40">
              {formatDate(article.publishedAt)}
            </span>
          </div>
          
          <span className="font-sans text-[9px] font-semibold tracking-wider text-[#1E1E1E]/50 uppercase bg-[#FFFFFF] px-2.5 py-1 rounded-full border border-black/5">
            {readingTime} min read
          </span>
        </div>
      </div>
    </motion.div>
  );
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

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Article Grid - 4 in 1 grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 w-full justify-items-center justify-center">
        {articles.map((article, idx) => (
          <JournalCard 
            key={article.id} 
            article={article}
            priority={idx < 4}
          />
        ))}
      </div>

      {/* Pagination Button */}
      {pageInfo.hasNextPage && (
        <div className="flex justify-center items-center mt-16">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="flex items-center gap-2.5 px-8 py-3.5 border border-black/15 bg-white text-black font-sans text-xs font-bold tracking-wider uppercase rounded-full shadow-sm hover:bg-[#FFFFFF] hover:border-black/30 transition-all duration-300 disabled:opacity-50"
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
