"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { CardSkeleton } from "@/components/ui/SnowBallLoader";
import { api } from "@/components/api/api";
import { groupProducts } from "@/utils/productGroup";

const heroImage =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Goa, India",
    review: "I wore the Nomad Linen Shirt through 3 countries. Looks great, feels incredible.",
    product: "Nomad Linen Shirt",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
  {
    name: "Arjun Mehta",
    location: "Ladakh, India",
    review: "The Desert Trek Trousers handled everything from mountain trails to city streets flawlessly.",
    product: "Desert Trek Trousers",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Ananya Patel",
    location: "Rajasthan, India",
    review: "Finally, travel clothes that look editorial without sacrificing comfort. Nomadica is unmatched.",
    product: "Horizon Canvas Jacket",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
  },
  {
    name: "Rohit Kapoor",
    location: "Mumbai, India",
    review: "Every piece feels considered. The quality is exceptional for the price point.",
    product: "Terra Wool Sweater",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
];

// Cache helper functions
const getCached = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`nomadica_home_cache_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setCached = (key: string, data: any) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`nomadica_home_cache_${key}`, JSON.stringify(data));
  } catch {}
};

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        marginTop: 0,
      }}
    >
      <img
        src={heroImage}
        alt="Nomadica Hero"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          transform: loaded ? "scale(1)" : "scale(1.08)",
          transition: "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(30,30,30,0.2) 0%, rgba(30,30,30,0.1) 50%, rgba(30,30,30,0.6) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(1.5rem, 5vw, 5rem)",
          paddingTop: "64px",
        }}
      >
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s",
          }}
        >
          <span
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              opacity: 0.8,
              display: "block",
              marginBottom: "1rem",
            }}
          >
            Summer Collection 2025
          </span>
          <h1
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
              maxWidth: "700px",
            }}
          >
            Wear Your
            <br />
            Journey.
          </h1>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/shop" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "0.875rem 2rem",
                  backgroundColor: "#FFFFFF",
                  color: "#1E1E1E",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#1E1E1E";
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
                  (e.currentTarget as HTMLElement).style.color = "#1E1E1E";
                }}
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/brand/story" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "0.875rem 2rem",
                  backgroundColor: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  transition: "border-color 0.2s ease",
                }}
              >
                Our Story
              </button>
            </Link>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            right: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            opacity: 0.6,
            animation: "fade-in 1s ease 1.5s both",
          }}
        >
          <span
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.6875rem",
              color: "#FFFFFF",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
            }}
          >
            Scroll
          </span>
          <ChevronDown size={16} color="#FFFFFF" style={{ animation: "bounce-dot 1.4s infinite" }} />
        </div>
      </div>
    </section>
  );
}

function ProductGridSection({
  title,
  subtitle,
  products,
  loading,
  bgTint,
  viewAllLink,
  viewAllText,
}: {
  title: string;
  subtitle: string;
  products: any[];
  loading: boolean;
  bgTint: boolean;
  viewAllLink: string;
  viewAllText: string;
}) {
  return (
    <section style={{ backgroundColor: bgTint ? "#F9F9F9" : "#FFFFFF", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(30,30,30,0.05)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(30,30,30,0.5)",
                marginBottom: "0.5rem",
              }}
            >
              {subtitle}
            </p>
            <h2
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 600,
                color: "#1E1E1E",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h2>
          </div>
          <Link href={viewAllLink} style={{ textDecoration: "none" }}>
            <button className="btn-outline">
              {viewAllText} <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {loading && products.length === 0
            ? [1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
        </div>
      </div>
    </section>
  );
}

function ImageBanner({
  image,
  title,
  subtitle,
  ctaText,
  ctaLink,
}: {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}) {
  return (
    <section
      style={{
        position: "relative",
        height: "450px",
        overflow: "hidden",
        backgroundColor: "#1E1E1E",
      }}
    >
      <img
        src={image}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 600,
            color: "#FFFFFF",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
            maxWidth: "800px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "1rem",
            color: "rgba(255, 255, 255, 0.75)",
            maxWidth: "600px",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          {subtitle}
        </p>
        <Link href={ctaLink} style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "0.875rem 2rem",
              backgroundColor: "#FFFFFF",
              color: "#1E1E1E",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.875rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1E1E1E";
              (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
              (e.currentTarget as HTMLElement).style.color = "#1E1E1E";
            }}
          >
            {ctaText} <ArrowRight size={14} style={{ marginLeft: "0.5rem", display: "inline" }} />
          </button>
        </Link>
      </div>
    </section>
  );
}

function TestimonialsSection({ bgTint }: { bgTint: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      style={{
        backgroundColor: bgTint ? "#F9F9F9" : "#FFFFFF",
        padding: "6rem 1.5rem",
        borderBottom: "1px solid rgba(30,30,30,0.05)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(30,30,30,0.5)",
              marginBottom: "0.75rem",
            }}
          >
            Feedback
          </p>
          <h2
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 600,
              color: "#1E1E1E",
              letterSpacing: "-0.02em",
            }}
          >
            Loved by Nomads
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
          className="horizontal-scroll"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                width: "clamp(280px, 35vw, 400px)",
                scrollSnapAlign: "start",
                backgroundColor: active === i ? "#1E1E1E" : "#FFFFFF",
                border: active === i ? "1px solid #1E1E1E" : "1px solid rgba(30,30,30,0.08)",
                boxShadow: "0 12px 32px rgba(30,30,30,0.04)",
                padding: "2.5rem 2rem",
                cursor: "pointer",
                transition: "all 0.4s ease",
                transform: active === i ? "translateY(-8px)" : "translateY(0)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <img
                  src={t.image}
                  alt={t.name}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid ${active === i ? "#1E1E1E" : "transparent"}`,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: active === i ? "#FFFFFF" : "#1E1E1E",
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "0.75rem",
                      color: active === i ? "rgba(255, 255, 255, 0.5)" : "rgba(30,30,30,0.5)",
                    }}
                  >
                    {t.location}
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  color: active === i ? "rgba(255, 255, 255, 0.85)" : "rgba(30,30,30,0.7)",
                  marginBottom: "1.25rem",
                  fontStyle: "italic",
                }}
              >
                &quot;{t.review}&quot;
              </p>

              <span
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: active === i ? "#FFFFFF" : "#1E1E1E",
                }}
              >
                {t.product}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: active === i ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: active === i ? "#1E1E1E" : "rgba(30,30,30,0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [collections, setCollections] = useState<any[]>(() => getCached("collections", []));
  const [newArrivals, setNewArrivals] = useState<any[]>(() => getCached("new_arrivals", []));
  const [bestSellers, setBestSellers] = useState<any[]>(() => getCached("best_sellers", []));
  const [collectionProducts, setCollectionProducts] = useState<Record<string, any[]>>(() => getCached("collection_products", {}));
  const [collectionConfigs, setCollectionConfigs] = useState<any[]>(() => getCached("collection_configs", []));
  const [journalArticles, setJournalArticles] = useState<any[]>(() => getCached("journal", []));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // 1. Fetch Collections list
        let cols = getCached("collections", []);
        try {
          const res = await api.collections.list();
          cols = res?.collections?.edges?.map((edge: any) => edge.node) || [];
          setCached("collections", cols);
        } catch (err) {
          console.error("Failed to load collections:", err);
        }
        setCollections(cols);

        // 2. Fetch all products to extract New Arrivals, Best Sellers, and filter standard categories
        let allProds = getCached("all_products", []);
        try {
          const res = await api.products.list(100);
          allProds = res?.products?.edges?.map((edge: any) => {
            const node = edge.node;
            const price = parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || '0');
            return {
              id: node.id,
              name: node.title,
              price: price,
              originalPrice: price * 1.3,
              image: node.images?.edges?.[0]?.node?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80',
              badge: node.badge,
              category: node.productType || node.category || 'Tops',
              handle: node.handle,
              createdAt: node.createdAt || '',
            };
          }) || [];
          setCached("all_products", allProds);
        } catch (err) {
          console.error("Failed to load products:", err);
        }

        const groupedAll = groupProducts(allProds);

        // New Arrivals: newest 5
        const arrivals = [...groupedAll].sort((a: any, b: any) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }).slice(0, 5);
        setNewArrivals(arrivals);
        setCached("new_arrivals", arrivals);

        // Best Sellers: filtered or first 5
        const bSellersFiltered = groupedAll.filter((p: any) => p.badge?.toLowerCase() === 'best seller');
        const bSellers = bSellersFiltered.length > 0 ? bSellersFiltered.slice(0, 5) : groupedAll.slice(0, 5);
        setBestSellers(bSellers);
        setCached("best_sellers", bSellers);

        // 3. Resolve the 5 dynamic collection spots
        const fallbackHandles = ['travel-quotes', 'tops', 'bottoms', 'outerwear', 'knits'];
        const resolvedConfigs = [];
        for (let i = 0; i < 5; i++) {
          const colNode = cols[i];
          const handle = colNode ? colNode.handle : fallbackHandles[i];
          const title = colNode ? colNode.title : handle.charAt(0).toUpperCase() + handle.slice(1);
          resolvedConfigs.push({ handle, title });
        }
        setCollectionConfigs(resolvedConfigs);
        setCached("collection_configs", resolvedConfigs);

        // Fetch products for each of the 5 collections
        const colProductsMap: Record<string, any[]> = {};
        for (const config of resolvedConfigs) {
          let prods = getCached(`coll_${config.handle}`, null);
          if (!prods) {
            try {
              const res = await api.collections.getByHandle(config.handle, 10);
              const edges = res?.collectionByHandle?.products?.edges || [];
              if (edges.length > 0) {
                prods = edges.map((edge: any) => {
                  const node = edge.node;
                  const price = parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || '0');
                  return {
                    id: node.id,
                    name: node.title,
                    price: price,
                    originalPrice: price * 1.3,
                    image: node.images?.edges?.[0]?.node?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80',
                    badge: node.badge,
                    category: node.productType || node.category || 'Tops',
                    handle: node.handle,
                    createdAt: node.createdAt || '',
                  };
                });
              } else {
                prods = allProds.filter((p: any) => p.category?.toLowerCase() === config.handle.toLowerCase());
              }
              setCached(`coll_${config.handle}`, prods);
            } catch (err) {
              console.error(`Error loading collection products for ${config.handle}:`, err);
              prods = allProds.filter((p: any) => p.category?.toLowerCase() === config.handle.toLowerCase());
            }
          }
          colProductsMap[config.handle] = groupProducts(prods || []).slice(0, 5);
        }
        setCollectionProducts(colProductsMap);
        setCached("collection_products", colProductsMap);

        // 4. Fetch Blog Articles
        let articles = getCached("journal", []);
        try {
          const res = await fetch('/api/journal?limit=3');
          const data = await res.json();
          articles = data?.articles || [];
          setCached("journal", articles);
        } catch (err) {
          console.error("Failed to load journal articles:", err);
        }
        setJournalArticles(articles);

      } catch (error) {
        console.error("General homepage data fetch failure:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Collections Section */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(30,30,30,0.05)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(30,30,30,0.5)", marginBottom: "0.75rem" }}>
              Explore Categories
            </p>
            <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "#1E1E1E", letterSpacing: "-0.02em" }}>
              Shop by Collection
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {collections.length === 0 && loading
              ? [1, 2, 3].map((i) => (
                  <div key={i} style={{ aspectRatio: "16/10", backgroundColor: "#F0F0F0", animation: "shimmer 1.5s infinite" }} />
                ))
              : collections.map((col: any) => (
                  <Link key={col.id} href={`/shop?category=${encodeURIComponent(col.handle)}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }} className="img-hover-zoom">
                      <img
                        src={col.image?.url || "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80"}
                        alt={col.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(30,30,30,0.6) 0%, transparent 60%)" }} />
                      <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                        <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 600, color: "#FFFFFF", marginBottom: "0.3rem" }}>
                          {col.title}
                        </h3>
                        <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          Explore Collection <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* 3. New Arrivals Section */}
      <ProductGridSection
        title="New Arrivals"
        subtitle="Just Landed"
        products={newArrivals}
        loading={loading}
        bgTint={true}
        viewAllLink="/shop/new-arrivals"
        viewAllText="View New Arrivals"
      />

      {/* 4. Best Sellers Section */}
      <ProductGridSection
        title="Best Sellers"
        subtitle="Community Favorites"
        products={bestSellers}
        loading={loading}
        bgTint={false}
        viewAllLink="/shop/best-sellers"
        viewAllText="View Best Sellers"
      />

      {/* 5. Banner Section 1 */}
      <ImageBanner
        image="https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=1600&q=80"
        title="Equipped for the Unplanned"
        subtitle="Nomadica travel apparel balances functional utility with refined, modern aesthetics. Made for adventurers, creatives, and global citizens."
        ctaText="Shop the Catalog"
        ctaLink="/shop"
      />

      {/* 6. Collection 1 Section */}
      {collectionConfigs[0] && (
        <ProductGridSection
          title={collectionConfigs[0].title}
          subtitle="Featured Series"
          products={collectionProducts[collectionConfigs[0].handle] || []}
          loading={loading}
          bgTint={true}
          viewAllLink={`/shop?category=${encodeURIComponent(collectionConfigs[0].handle)}`}
          viewAllText={`Explore ${collectionConfigs[0].title}`}
        />
      )}

      {/* 7. Collection 2 Section */}
      {collectionConfigs[1] && (
        <ProductGridSection
          title={collectionConfigs[1].title}
          subtitle="Wardrobe Essentials"
          products={collectionProducts[collectionConfigs[1].handle] || []}
          loading={loading}
          bgTint={false}
          viewAllLink={`/shop?category=${encodeURIComponent(collectionConfigs[1].handle)}`}
          viewAllText={`Explore ${collectionConfigs[1].title}`}
        />
      )}

      {/* 8. Testimonials Section */}
      <TestimonialsSection bgTint={true} />

      {/* 9. Collection 3 Section */}
      {collectionConfigs[2] && (
        <ProductGridSection
          title={collectionConfigs[2].title}
          subtitle="Engineered For Travel"
          products={collectionProducts[collectionConfigs[2].handle] || []}
          loading={loading}
          bgTint={false}
          viewAllLink={`/shop?category=${encodeURIComponent(collectionConfigs[2].handle)}`}
          viewAllText={`Explore ${collectionConfigs[2].title}`}
        />
      )}

      {/* 10. Collection 4 Section */}
      {collectionConfigs[3] && (
        <ProductGridSection
          title={collectionConfigs[3].title}
          subtitle="Layer Up"
          products={collectionProducts[collectionConfigs[3].handle] || []}
          loading={loading}
          bgTint={true}
          viewAllLink={`/shop?category=${encodeURIComponent(collectionConfigs[3].handle)}`}
          viewAllText={`Explore ${collectionConfigs[3].title}`}
        />
      )}

      {/* 11. Banner Section 2 */}
      <ImageBanner
        image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80"
        title="Made Consciously, Worn Endlessly"
        subtitle="Timeless apparel designed with respect for the planet. We utilize organic, sustainable materials and enforce fair labor standard compliance across all partners."
        ctaText="Our Philosophy"
        ctaLink="/brand/sustainability"
      />

      {/* 12. Collection 5 Section */}
      {collectionConfigs[4] && (
        <ProductGridSection
          title={collectionConfigs[4].title}
          subtitle="Natural Warmth"
          products={collectionProducts[collectionConfigs[4].handle] || []}
          loading={loading}
          bgTint={false}
          viewAllLink={`/shop?category=${encodeURIComponent(collectionConfigs[4].handle)}`}
          viewAllText={`Explore ${collectionConfigs[4].title}`}
        />
      )}

      {/* 13. Blogs Section */}
      <section style={{ backgroundColor: "#F9F9F9", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(30,30,30,0.05)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(30,30,30,0.5)", marginBottom: "0.5rem" }}>
                Editorial
              </p>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "#1E1E1E", letterSpacing: "-0.02em" }}>
                The Nomad Journal
              </h2>
            </div>
            <Link href="/brand/journal" style={{ textDecoration: "none" }}>
              <button className="btn-outline">
                Read the Journal <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {journalArticles.length === 0 && loading
              ? [1, 2, 3].map((i) => (
                  <div key={i} style={{ aspectRatio: "16/10", backgroundColor: "#F0F0F0", animation: "shimmer 1.5s infinite" }} />
                ))
              : journalArticles.map((art: any) => (
                  <Link key={art.id} href={`/brand/journal/${art.handle}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(30,30,30,0.08)", boxShadow: "0 12px 32px rgba(30,30,30,0.04)" }}>
                      <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
                        <img src={art.image?.url} alt={art.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ padding: "1.5rem" }}>
                        <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.6875rem", color: "rgba(30,30,30,0.4)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                          {new Date(art.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                        <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                          {art.title}
                        </h3>
                        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.6)", lineHeight: 1.6 }} className="line-clamp-2">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* 14. About Nomadica Section */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(30,30,30,0.5)", marginBottom: "1rem" }}>
              Our Story
            </p>
            <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 600, color: "#1E1E1E", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
              Apparel for the Modern Explorer.
            </h2>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", color: "rgba(30,30,30,0.7)", lineHeight: 1.8, marginBottom: "2rem" }}>
              Nomadica was born out of a desire to create a wardrobe that works anywhere in the world. We design premium travel lifestyle apparel that balances functional utility with refined, modern aesthetics. Made for adventurers, creatives, and global citizens.
            </p>
            <Link href="/brand/about" style={{ textDecoration: "none" }}>
              <button className="btn-primary">
                Our Philosophy <ArrowRight size={14} />
              </button>
            </Link>
          </div>
          <div style={{ aspectRatio: "1", overflow: "hidden", position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80"
              alt="Nomad desk with maps"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}