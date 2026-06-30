import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticleByHandle, getBlogArticles, getReadingTime, ShopifyArticle } from '@/lib/shopify/journal';
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

  const articleSchema = getArticleSchema(article);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/journal" },
    { name: article.title, path: `/journal/${slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1E1E1E] w-full flex flex-col items-center">
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <main className="w-full max-w-[1800px] px-2 pt-5 pb-16 sm:px-8 flex flex-col items-center">
        <div className="w-full px-6 lg:px-12">
          <Link 
            href="/journal" 
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-black/40 hover:text-black transition-colors duration-300"
          >
            <span>&larr;</span> Back to Articles
          </Link>
        </div>
        <div style={{ height: "28px" }}></div>
 
        {/* 2. Cover Image (Situated above the title) */}
        {article.image?.url && (
          <div className="relative w-250 aspect-[16/9] overflow-hidden rounded-3xl bg-[#FFFFFF] border border-black/5 shadow-sm mb-12">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              priority
              sizes="(max-width: 1024px) 120vw, 1400px"
              className="object-cover hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        )}

        {/* 3. Title (Centered Playfair Display serif) */}
        <div className="text-center mb-8 w-full max-w-[1800px] mx-auto">
          <h1 className="font-['Playfair_Display',_serif] text-[clamp(2rem,5vw,3.25rem)] font-medium text-[#1E1E1E] leading-tight mb-4">
            {article.title}
          </h1>

          {/* 4. Subtext metadata (date and reading time) */}
          <p className="font-['Montserrat',_sans-serif] text-[0.85rem] text-[#1E1E1E]/45 font-medium m-0">
            {dateFormatted} &nbsp;&middot;&nbsp; {readingTime} min read
          </p>
        </div>

        {/* 5. Article Rich HTML Content (Inside responsive broader text container with explicit padding) */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
          <article 
            className="journal-rich-content w-full"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* 6. Share Buttons */}
          <ShareButtons />
        </div>

        {/* 7. More Travel Tips Section */}
        {otherArticles.length > 0 && (
          <section className="w-full border-t border-black/5 pt-20 mt-12 max-w-[1700px]">
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
                        sizes="(max-width: 680px) 140vw, 33vw"
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
