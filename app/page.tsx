"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { CardSkeleton } from "@/components/ui/SnowBallLoader";

const heroImage =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80";

const featuredProducts = [
  {
    id: "1",
    name: "Nomad Linen Shirt",
    price: 3499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    badge: "New",
    category: "Tops",
  },
  {
    id: "2",
    name: "Desert Trek Trousers",
    price: 4299,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
    badge: "Best Seller",
    category: "Bottoms",
  },
  {
    id: "3",
    name: "Horizon Canvas Jacket",
    price: 8999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    badge: "Limited",
    category: "Outerwear",
  },
  {
    id: "4",
    name: "Terra Wool Sweater",
    price: 5499,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    badge: "Sale",
    category: "Knits",
  },
];

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

const categories = [
  {
    label: "Tops",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=800&q=80",
    href: "/shop/collections",
  },
  {
    label: "Bottoms",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    href: "/shop/collections",
  },
  {
    label: "Outerwear",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    href: "/shop/collections",
  },
];

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
      {/* Background Image */}
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

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(30,30,30,0.2) 0%, rgba(30,30,30,0.1) 50%, rgba(30,30,30,0.6) 100%)",
        }}
      />

      {/* Content */}
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
              color: "#F7F4EE",
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
              color: "#F7F4EE",
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
            <Link href="/shop/new-arrivals" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "0.875rem 2rem",
                  backgroundColor: "#F7F4EE",
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
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#7A5C3E") && ((e.currentTarget as HTMLElement).style.color = "#F7F4EE")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#F7F4EE") && ((e.currentTarget as HTMLElement).style.color = "#1E1E1E")}
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/brand/story" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "0.875rem 2rem",
                  backgroundColor: "transparent",
                  color: "#F7F4EE",
                  border: "1px solid rgba(247,244,238,0.5)",
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

        {/* Scroll indicator */}
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
              color: "#F7F4EE",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
            }}
          >
            Scroll
          </span>
          <ChevronDown size={16} color="#F7F4EE" style={{ animation: "bounce-dot 1.4s infinite" }} />
        </div>
      </div>
    </section>
  );
}

function ContainerScrollSection() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.5)));
      setScrollY(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = 0.75 + scrollY * 0.25;
  const opacity = 0.3 + scrollY * 0.7;

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "180vh",
        position: "relative",
        backgroundColor: "#1E1E1E",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            opacity,
            transition: "transform 0.05s, opacity 0.05s",
            textAlign: "center",
            padding: "0 1.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#7A5C3E",
              marginBottom: "1rem",
            }}
          >
            Designed for the Road
          </p>
          <h2
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              fontWeight: 600,
              color: "#F7F4EE",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            Clothes that move with you — across continents, climates, and cultures.
          </h2>
        </div>

        {/* Background image reveals */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            opacity: scrollY * 0.25,
            pointerEvents: "none",
          }}
        >
          {[
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70",
            "https://images.unsplash.com/photo-1528543606781-2f6e8759f1c1?w=600&q=70",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#F7F4EE",
        padding: "6rem 1.5rem",
        overflow: "hidden",
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
              color: "#7A5C3E",
              marginBottom: "0.75rem",
            }}
          >
            Best Sellers
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

        {/* 3D Testimonial Cards */}
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
                backgroundColor: active === i ? "#1E1E1E" : "#EDEAE2",
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
                    border: `2px solid ${active === i ? "#7A5C3E" : "transparent"}`,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: active === i ? "#F7F4EE" : "#1E1E1E",
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "0.75rem",
                      color: active === i ? "rgba(247,244,238,0.5)" : "rgba(30,30,30,0.5)",
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
                  color: active === i ? "rgba(247,244,238,0.85)" : "rgba(30,30,30,0.7)",
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
                  color: "#7A5C3E",
                }}
              >
                {t.product}
              </span>
            </div>
          ))}
        </div>

        {/* Dots */}
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

function CategorySection() {
  return (
    <section style={{ backgroundColor: "#F7F4EE", padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href} style={{ textDecoration: "none", position: "relative", display: "block" }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: i === 0 ? "2/3" : "2/3",
                  overflow: "hidden",
                }}
                className="img-hover-zoom"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(30,30,30,0.6) 0%, transparent 60%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "1.5rem",
                    left: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "1.75rem",
                      fontWeight: 600,
                      color: "#F7F4EE",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {cat.label}
                  </h3>
                  <span
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontSize: "0.8125rem",
                      color: "rgba(247,244,238,0.7)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    Shop <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setProductsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <HeroSection />

      <ContainerScrollSection />

      {/* New Arrivals */}
      <section style={{ backgroundColor: "#F7F4EE", padding: "6rem 1.5rem" }}>
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
                  color: "#7A5C3E",
                  marginBottom: "0.5rem",
                }}
              >
                Fresh In
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
                New Arrivals
              </h2>
            </div>
            <Link href="/shop/new-arrivals" style={{ textDecoration: "none" }}>
              <button className="btn-outline">
                View All <ArrowRight size={14} />
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
            {productsLoading
              ? [1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
          </div>
        </div>
      </section>

      <CategorySection />

      <TestimonialsSection />

      {/* Brand Strip */}
      <section
        style={{
          backgroundColor: "#4F6B5A",
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(247,244,238,0.6)",
              marginBottom: "1rem",
            }}
          >
            Our Commitment
          </p>
          <h2
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 600,
              color: "#F7F4EE",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Made consciously, worn endlessly.
          </h2>
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "1rem",
              color: "rgba(247,244,238,0.65)",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            Every Nomadica piece is crafted with sustainable materials, ethical manufacturing, and timeless design — because the planet is your destination too.
          </p>
          <Link href="/brand/sustainability" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "0.875rem 2rem",
                backgroundColor: "#F7F4EE",
                color: "#1E1E1E",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Learn More
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}