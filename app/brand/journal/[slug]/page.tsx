// app/brand/journal/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Compass, Calendar, Clock, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { getArticleByHandle, getReadingTime } from '@/lib/shopify/journal';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleByHandle(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | Nomadica Journal',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/brand/journal/${slug}`;

  return {
    title: `${article.title} | Nomadica Journal`,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.authorV2?.name || 'Nomadica Staff'],
      images: article.image?.url ? [{ url: article.image.url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.image?.url ? [article.image.url] : [],
    }
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleByHandle(slug);

  if (!article) {
    notFound();
  }

  const dateFormatted = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const readingTime = getReadingTime(article.contentHtml);

  // Structured Article Schema for Search Engine SEO crawlers
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image?.url,
    "datePublished": article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.authorV2?.name || "Nomadica Staff"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nomadica",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80"
      }
    }
  };

  const category = article.tags?.[0] || 'Travel';

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1E1E1E] pt-[64px]">
      {/* Inject Structured Metadata JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />

      {/* Article Navigation Bar */}
      <div className="max-w-4xl mx-auto px-6 pt-10 sm:px-8">
        <Link 
          href="/brand/journal" 
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-black/50 hover:text-[#1E1E1E] transition-colors duration-300 group"
        >
          <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Journal
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 sm:px-8 space-y-10">
        {/* Article Header */}
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#1E1E1E] uppercase block">
            {category}
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-tight text-[#1E1E1E]">
            {article.title}
          </h1>

          {/* Meta Elements */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 border-y border-black/5 py-4 font-sans text-xs text-black/50">
            <div className="flex items-center gap-1.5">
              <User size={13} className="text-[#1E1E1E]" />
              <span className="font-semibold text-black/70">
                {article.authorV2?.name || 'Nomadica Staff'}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              <span>{dateFormatted}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.image?.url && (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl bg-[#FFFFFF] border border-black/5 shadow-sm">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        {/* Rich HTML Content Section */}
        <article 
          className="journal-content py-8"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Footer Navigation */}
        <footer className="border-t border-black/5 pt-12 pb-16 flex justify-center">
          <Link 
            href="/brand/journal" 
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-black/15 bg-white text-black font-sans text-xs font-bold tracking-wider uppercase rounded-full shadow-sm hover:bg-[#FFFFFF] hover:border-black/30 transition-all duration-300"
          >
            <Compass size={14} className="text-[#1E1E1E]" />
            Return to Journal Landing
          </Link>
        </footer>
      </main>
    </div>
  );
}
