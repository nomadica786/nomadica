import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getArticleByHandle, getBlogArticles, getReadingTime, ShopifyArticle } from '@/lib/shopify/journal';
import { JournalCard } from '../JournalGridClient';
import { constructMetadata } from '@/lib/seo/metadata';
import { getArticleSchema } from '@/lib/schema/article';
import { getBreadcrumbSchema } from '@/lib/schema/breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { ShareButtons } from '@/components/journal/ShareButtons';

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

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1E1E1E] w-full flex flex-col items-center">
      <div style={{ paddingTop: "75px" }}></div>
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />

      {/* Custom styles for responsive text width and content HTML formatting */}
      <style>{`
        .article-container {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .article-container {
            max-width: 720px;
          }
        }
        @media (max-width: 768px) {
          .article-container {
            max-width: 620px;
          }
        }
        @media (max-width: 480px) {
          .article-container {
            max-width: 100%;
            padding: 0 1.25rem;
          }
        }
        .journal-rich-content {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(0.95rem, 1.6vw, 1.05rem);
          line-height: 1.85;
          color: rgba(30, 30, 30, 0.75);
        }
        .journal-rich-content p {
          margin-bottom: 1.75rem;
        }
        .journal-rich-content h2, 
        .journal-rich-content h3 {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          color: #1E1E1E;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
        }
        .journal-rich-content ul, 
        .journal-rich-content ol {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }
        .journal-rich-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>

      <main className="w-full max-w-5xl px-6 pt-16 pb-16 sm:px-8 flex flex-col items-center">
        {/* 1. Navigation / Back to Articles link (Aligned left matching cover image boundary) */}
        <div className="w-full max-w-4xl flex justify-start mb-6">
          <Link 
            href="/journal" 
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-black/40 hover:text-black transition-colors duration-300"
          >
            <span>&larr;</span> Back to Articles
          </Link>
        </div>

        {/* 2. Cover Image (Situated above the title) */}
        {article.image?.url && (
          <div className="relative w-full max-w-4xl aspect-[16/9] overflow-hidden rounded-3xl bg-[#FFFFFF] border border-black/5 shadow-sm mb-12">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        )}

        {/* 3. Title (Centered Playfair Display serif) */}
        <div style={{ textAlign: "center", marginBottom: "2rem", width: "100%", maxWidth: "860px" }}>
          <h1 
            style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: "clamp(2rem, 5vw, 3.25rem)", 
              fontWeight: 500, 
              color: "#1E1E1E",
              lineHeight: 1.25,
              margin: "0 0 1rem"
            }}
          >
            {article.title}
          </h1>

          {/* 4. Subtext metadata (date and reading time) */}
          <p 
            style={{ 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "0.85rem", 
              color: "rgba(30,30,30,0.45)", 
              fontWeight: 500,
              margin: 0 
            }}
          >
            {dateFormatted} &nbsp;&middot;&nbsp; {readingTime} min read
          </p>
        </div>

        {/* 5. Article Rich HTML Content (Inside responsive broader text container) */}
        <div className="article-container">
          <article 
            className="journal-rich-content py-4 w-full"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* 6. Share Buttons */}
          <ShareButtons />
        </div>

        {/* 7. More Travel Tips Section */}
        {otherArticles.length > 0 && (
          <section className="w-full border-t border-black/5 pt-20 mt-12 max-w-5xl">
            <h2 
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                fontWeight: 600,
                color: "#1E1E1E",
                marginBottom: "2.5rem",
                textAlign: "left"
              }}
            >
              More Travel Tips
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center">
              {otherArticles.map((other) => (
                <Link 
                  key={other.id} 
                  href={`/journal/${other.handle}`} 
                  style={{ textDecoration: "none", display: "block", width: "100%" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ aspectRatio: "16/10", position: "relative", width: "100%", overflow: "hidden", borderRadius: "16px" }}>
                      <Image
                        src={other.image?.url || "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80"}
                        alt={other.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#1E1E1E",
                          lineHeight: 1.4,
                          margin: "0 0 0.5rem"
                        }}
                      >
                        {other.title}
                      </h3>
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.75rem",
                          color: "rgba(30,30,30,0.4)"
                        }}
                      >
                        {new Date(other.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
