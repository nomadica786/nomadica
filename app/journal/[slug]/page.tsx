import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Compass, Calendar, Clock, User } from 'lucide-react';
import { getArticleByHandle, getBlogArticles, getReadingTime, ShopifyArticle } from '@/lib/shopify/journal';
import { JournalCard } from '../JournalGridClient';
import { constructMetadata } from '@/lib/seo/metadata';
import { getArticleSchema } from '@/lib/schema/article';
import { getBreadcrumbSchema } from '@/lib/schema/breadcrumb';
import JsonLd from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleByHandle(slug);
  
  if (!article) {
    return constructMetadata({
      title: 'Article Not Found | Nomadica Journal',
      description: 'The requested article could not be found.',
      path: `/journal/${slug}`,
    });
  }

  return constructMetadata({
    title: `${article.title} | Nomadica Journal`,
    description: article.excerpt || `Read ${article.title} on Nomadica Journal.`,
    path: `/journal/${slug}`,
    ogImage: article.image?.url || '/Nomadica.jpg',
    type: 'article',
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleByHandle(slug);

  if (!article) {
    notFound();
  }

  // Fetch other blog articles for the bottom section
  const { articles: allArticles } = await getBlogArticles(5);
  const otherArticles = (allArticles as ShopifyArticle[])
    .filter((a: ShopifyArticle) => a.id !== article.id)
    .slice(0, 3);

  const dateFormatted = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const readingTime = getReadingTime(article.contentHtml);

  // Structured Article Schema for Search Engine SEO crawlers
  const articleSchema = getArticleSchema(article);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/journal" },
    { name: article.title, path: `/journal/${slug}` },
  ]);

  const category = article.tags?.[0] || 'Travel';

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1E1E1E] w-full flex flex-col items-center">
      <div style={{ paddingTop: "75px" }}></div>
      {/* Inject Structured Metadata JSON-LD */}
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <main className="w-full max-w-5xl px-6 pt-32 pb-16 sm:px-8 space-y-16 flex flex-col items-center justify-center">
        {/* Article Navigation Bar */}
        <div className="w-full max-w-3xl flex justify-center">
          <Link 
            href="/journal" 
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-black/50 hover:text-[#1E1E1E] transition-colors duration-300 group"
          >
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Journal
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 text-center max-w-3xl mx-auto flex flex-col items-center">
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#1E1E1E] uppercase block">
            {category}
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-tight text-[#1E1E1E]">
            {article.title}
          </h1>

          {/* Meta Elements */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 border-y border-black/5 py-4 font-sans text-xs text-black/50 w-full">
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
          <div className="relative w-full max-w-4xl aspect-[16/9] overflow-hidden rounded-3xl bg-[#FFFFFF] border border-black/5 shadow-sm">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}

        {/* Rich HTML Content Section */}
        <article 
          className="journal-content py-8 w-full max-w-3xl"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Footer Navigation */}
        <footer className="border-t border-black/5 pt-12 pb-16 w-full flex justify-center max-w-3xl">
          <Link 
            href="/journal" 
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-black/15 bg-white text-black font-sans text-xs font-bold tracking-wider uppercase rounded-full shadow-sm hover:bg-black hover:text-white hover:border-black transition-all duration-300"
          >
            <Compass size={14} />
            Return to Journal Landing
          </Link>
        </footer>

        {/* Other Blogs Section */}
        {otherArticles.length > 0 && (
          <section className="w-full border-t border-black/5 pt-24 mt-20 space-y-12 flex flex-col items-center">
            <h2 className="text-3xl font-normal text-[#1E1E1E] text-center uppercase font-serif tracking-tight">
              More Perspectives
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center justify-center max-w-5xl">
              {otherArticles.map((other) => (
                <JournalCard 
                  key={other.id}
                  article={other}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
