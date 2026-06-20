"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ArrowRight } from 'lucide-react';
import { ShopifyArticle } from '@/lib/shopify/journal';

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

const getCategoryLabel = (tags: string[]) => {
  if (!tags || tags.length === 0) return "Travel Tips";
  const tagList = tags.map(t => t.toLowerCase());
  if (tagList.includes("guides") || tagList.includes("guide")) return "Destination Guides";
  if (tagList.includes("adventure") || tagList.includes("hiking") || tagList.includes("stories")) return "Adventure Stories";
  if (tagList.includes("perspectives") || tagList.includes("tips") || tagList.includes("ideas")) return "Travel Tips";
  if (tagList.includes("destinations") || tagList.includes("japan") || tagList.includes("italy") || tagList.includes("switzerland") || tagList.includes("usa")) return "Destination Guides";
  return "Travel Tips";
};

export function JournalCard({ article, priority = false }: { article: ShopifyArticle; priority?: boolean }) {
  return (
    <Link href={`/journal/${article.handle}`} style={{ textDecoration: "none", display: "block", width: "100%" }}>
      <div className="journal-card">
        <div className="journal-card-image-wrap" style={{ aspectRatio: "16/10", position: "relative", width: "100%", overflow: "hidden" }}>
          <Image
            src={article.image?.url || "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80"}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={priority}
          />
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              left: "1.25rem",
              backgroundColor: "rgba(196, 167, 125, 0.85)",
              color: "#FFFFFF",
              padding: "0.35rem 0.75rem",
              borderRadius: "3px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.02em",
              zIndex: 10,
            }}
          >
            {getCategoryLabel(article.tags)}
          </div>
        </div>
        <div className="journal-card-body">
          <h3
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111111",
              marginBottom: "0.75rem",
              lineHeight: 1.4,
            }}
          >
            {article.title}
          </h3>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.875rem",
              color: "rgba(30,30,30,0.6)",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
            }}
            className="line-clamp-2"
          >
            {article.excerpt}
          </p>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              color: "rgba(30,30,30,0.45)",
              display: "block",
              marginBottom: "1.5rem",
              marginTop: "auto",
            }}
          >
            By {article.authorV2?.name || "Nomadica Editor"}
          </span>
          <div
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#c4a77d",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              textTransform: "uppercase",
            }}
          >
            READ MORE <ArrowRight size={12} style={{ color: "#c4a77d" }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function JournalGridClient({
  initialArticles,
  initialPageInfo
}: JournalGridClientProps) {
  const [articles, setArticles] = useState<ShopifyArticle[]>(initialArticles);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const loadMore = async () => {
    if (isLoading || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/journal?after=${encodeURIComponent(pageInfo.endCursor)}&limit=6`);
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

  // Filter logic
  const filteredArticles = selectedCategory === "ALL"
    ? articles
    : articles.filter(art => getCategoryLabel(art.tags).toUpperCase() === selectedCategory.toUpperCase());

  const categories = [
    { label: "ALL", filterValue: "ALL" },
    { label: "DESTINATION GUIDES", filterValue: "DESTINATION GUIDES" },
    { label: "TRAVEL TIPS", filterValue: "TRAVEL TIPS" },
    { label: "ADVENTURE STORIES", filterValue: "ADVENTURE STORIES" }
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Hero Banner Section */}
      <section 
        style={{ 
          backgroundImage: "url('/journal-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          minHeight: "440px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "6rem 1.5rem",
          borderBottom: "1px solid rgba(30,30,30,0.05)"
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 
            style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)", 
              fontWeight: 500, 
              color: "#1E1E1E", 
              letterSpacing: "-0.01em",
              lineHeight: 1.2
            }}
          >
            Travel Articles & Inspiration
          </h1>
          <p 
            style={{ 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "1rem", 
              color: "rgba(30, 30, 30, 0.7)", 
              marginTop: "1rem" 
            }}
          >
            Tales from the road to fuel your next adventure.
          </p>

          {/* Category Filter Buttons */}
          <div 
            style={{ 
              display: "flex", 
              gap: "0.75rem", 
              flexWrap: "wrap", 
              justifyContent: "center", 
              marginTop: "2.5rem" 
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.filterValue;
              return (
                <button
                  key={cat.filterValue}
                  onClick={() => setSelectedCategory(cat.filterValue)}
                  style={{
                    backgroundColor: isActive ? "#8c7355" : "#c4a77d",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.6rem 1.25rem",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => { 
                    if (!isActive) e.currentTarget.style.backgroundColor = "#b0936b"; 
                  }}
                  onMouseLeave={(e) => { 
                    if (!isActive) e.currentTarget.style.backgroundColor = "#c4a77d"; 
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-[1400px] mx-auto px-8 pt-20 pb-32 sm:px-12 flex flex-col items-center justify-center mt-4">
        {/* Grid containing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center justify-center">
          {filteredArticles.map((article, idx) => (
            <JournalCard 
              key={article.id} 
              article={article}
              priority={idx < 3}
            />
          ))}
        </div>

        {/* Empty state if no articles match category */}
        {filteredArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(30, 30, 30, 0.5)", fontFamily: "'Montserrat', sans-serif" }}>
            No articles found in this category.
          </div>
        )}

        {/* Load More Button */}
        {pageInfo.hasNextPage && selectedCategory === "ALL" && (
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
      </main>
    </div>
  );
}
