"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Heart, LucideIcon, TrendingUp, MapPin, LocateIcon } from "lucide-react";
import { api } from "@/components/api/api";
import { groupProducts } from "@/utils/productGroup";
import Image from "next/image";
import { getShopifyImageUrl } from "@/lib/images/shopifyImage";

const heroImage =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80";


const testimonials = [
  {
    name: "Priya S.",
    review: "Absolutely love my tee! The quality is exceptional and the design is stunning. Gets compliments everywhere I go. The fabric is incredibly soft and breathable, perfect for everyday wear.",
    verified: true
  },
  {
    name: "Arjun K.",
    review: "Finally found travel-themed shirts that don't look cheesy! The fabric is soft, print quality is perfect. Ordered three more!",
    verified: true
  },
  {
    name: "Kevin D.",
    review: "Great quality and fast shipping. This is my new favorite tee. Love supporting a brand that celebrates travel!",
    verified: true
  },
  {
    name: "Rohan P.",
    review: "Bought this for a trip and it was the perfect conversation starter. Everyone wanted to know where I got it. The material holds up really well even after multiple washes.",
    verified: false
  }
];

// Cache helper functions
const getCached = (key: string, fallback: any) => {
  if (typeof window === "undefined") return fallback;
  if (process.env.NODE_ENV === "development") return fallback;
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const bannerImages = [
    "/Main Banner 1.jpg",
    "/Main Banner 2.jpg",
    "/Main Banner 4.jpg"
  ];

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Autoplay slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const router = useRouter();

  return (
    <section
      className="min-h-[140px] sm:min-h-[250px] md:min-h-[400px] lg:min-h-[450px]"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "2000/695",
        overflow: "hidden",
        marginTop: 0,
        backgroundColor: "#000000",
      }}
    >
      {/* 1. Sliding Track */}
      <div
        onClick={() => router.push("/shop")}
        style={{
          display: "flex",
          width: `${bannerImages.length * 100}%`,
          height: "100%",
          transform: `translateX(-${currentSlide * (100 / bannerImages.length)}%)`,
          transition: "transform 1.0s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
        }}
      >
        {bannerImages.map((img, index) => (
          <div
            key={img}
            style={{
              position: "relative",
              width: `${100 / bannerImages.length}%`,
              height: "100%",
              flexShrink: 0,
            }}
          >
            <Image
              src={img}
              alt={`Nomadica Banner ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        ))}
      </div>

      {/* 2. Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* 3. Logo Overlay inside Hero */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#FFFFFF",
          zIndex: 10,
        }}
      >
      </div>

      {/* 4. Navigation Buttons (Left/Right Arrows) */}
      <button
        onClick={handlePrev}
        className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center"
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          border: "none",
          cursor: "pointer",
          zIndex: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "transform 0.2s ease, background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)";
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" color="#1E1E1E" />
      </button>

      <button
        onClick={handleNext}
        className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center"
        style={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          border: "none",
          cursor: "pointer",
          zIndex: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "transform 0.2s ease, background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)";
        }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" color="#1E1E1E" />
      </button>

      {/* 5. Center-Right Content Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          padding: "clamp(1rem, 4vw, 4rem)",
          paddingRight: "clamp(1.5rem, 8vw, 5rem)",
          zIndex: 10,
          textAlign: "left",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s",
            pointerEvents: "auto",
          }}
        >
        </div>
      </div>

      {/* 6. Slide Indicator Dots */}
      <div
        className="bottom-3 md:bottom-6"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.75rem",
          zIndex: 20,
        }}
      >
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: currentSlide === index ? "#E65A00" : "rgba(255, 255, 255, 0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCarouselSection({
  title,
  products,
  loading,
  viewAllLink,
  viewAllText,
  backgroundColor,
  backgroundImage
}: {
  title: string;
  products: any[];
  loading: boolean;
  viewAllLink: string;
  viewAllText: string;
  backgroundColor?: string;
  backgroundImage?: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeVariants, setActiveVariants] = useState<Record<string, any>>({});
  const [interactedCards, setInteractedCards] = useState<Record<string, boolean>>({});

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth"
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth"
      });
    }
  };

  const displayProducts = products.length > 0 ? products : [
    { id: "p1", name: "Wanderer Spirit", handle: "white-trekking-tees", price: 599, originalPrice: 999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80" },
    { id: "p2", name: "Tropical Escape", handle: "travel-white-tees", price: 599, originalPrice: 999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80" },
    { id: "p3", name: "Sunset Chaser", handle: "blue-oversized-tee", price: 599, originalPrice: 999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80" },
    { id: "p4", name: "Paradise Found", handle: "red-trekking-regular-fit-tees", price: 599, originalPrice: 999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80" },
  ];

  return (
    <section
      style={{
            backgroundColor: backgroundImage
            ? undefined
            : backgroundColor || "#FAF9F7",

          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,

          backgroundSize: backgroundImage ? "cover" : undefined,
          backgroundPosition: backgroundImage ? "center" : undefined,
          backgroundRepeat: backgroundImage ? "no-repeat" : undefined,
    
        padding: "2rem 1.5rem",
        borderBottom: "1px solid rgba(30,30,30,0.05)",
        position: "relative"
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
        
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', sans-serif",
                fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)",
                fontWeight: 700,
                color: "#111111",
                letterSpacing: "-0.01em",
                margin: 0
              }}
            >
              {title}
            </h2>
          </div>
          <Link href={viewAllLink} style={{ textDecoration: "none" }}>
            <button
              style={{
                backgroundColor: "#c4a77d",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "0.625rem 1.75rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#b0936b";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#c4a77d";
              }}
            >
              {viewAllText}
            </button>
          </Link>
        </div>

        {/* Carousel Wrapper */}
        <div style={{ position: "relative" }}>
          
          {/* Left Navigation Arrow Button */}
          <button
            onClick={handleScrollLeft}
            style={{
              position: "absolute",
              left: "-1.25rem",
              top: "calc(50% - 36px)",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)";
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} color="#1E1E1E" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            style={{
              display: "flex",
              gap: "1.5rem",
              overflowX: "auto",
              scrollBehavior: "smooth",
              paddingBottom: "1.5rem"
            }}
            className="horizontal-scroll hide-scrollbar"
          >
            {loading && products.length === 0
              ? [1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: "0 0 calc(25% - 1.125rem)",
                      minWidth: "280px",
                      aspectRatio: "653.27 / 978",
                      backgroundColor: "#F0F0F0",
                      borderRadius: "8px",
                      animation: "shimmer 1.5s infinite"
                    }}
                  />
                ))
              : displayProducts.map((product) => {
                  const isHovered = hoveredCardId === product.id;
                  const activeVar = activeVariants[product.id] || product.colorVariants?.[0] || null;
                  const hasInteracted = interactedCards[product.id] || false;
                  
                  const price = (activeVar && activeVar.price) 
                    ? (typeof activeVar.price === "number" ? activeVar.price : parseFloat(activeVar.price || "0")) 
                    : (typeof product.price === "number" ? product.price : parseFloat(product.price || "0"));
                  
                  const originalPrice = (activeVar && activeVar.originalPrice) 
                    ? activeVar.originalPrice 
                    : product.originalPrice;
                  
                  const pTitle = activeVar ? (activeVar.name || product.name || product.title || "Product") : (product.name || product.title || "Product");
                  const pImage = (product.mockupImage && !hasInteracted)
                    ? product.mockupImage
                    : (activeVar ? activeVar.image : (product.image || product.images?.[0]?.node?.url));
                  const pHandle = activeVar ? (activeVar.handle || product.handle) : product.handle;

                  return (
                    <div
                      key={product.id}
                      style={{
                        flex: "0 0 calc(25% - 1.125rem)",
                        minWidth: "280px",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid rgba(30, 30, 30, 0.05)",
                        borderRadius: "15px",
                        overflow: "hidden",
                        boxShadow: isHovered ? "0 8px 25px rgba(0,0,0,0.06)" : "0 4px 15px rgba(0,0,0,0.02)",
                        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: "pointer"
                      }}
                      onMouseEnter={() => setHoveredCardId(product.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      {/* Image Container */}
                      <Link href={`/products/${pHandle}`} style={{ textDecoration: "none", display: "block" }}>
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "750 / 978",
                            overflow: "hidden",
                            backgroundColor: "#F9F9F9"
                          }}
                        >
                          <Image
                            src={getShopifyImageUrl(pImage, 600)}
                            alt={pTitle}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            style={{
                              objectFit: "cover",
                              transform: isHovered ? "scale(1.05)" : "scale(1)",
                              transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
                            }}
                          />

                          {/* Wishlist Heart Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const event = new CustomEvent("add-to-wishlist", { detail: { handle: pHandle } });
                              window.dispatchEvent(event);
                            }}
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "12px",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              backgroundColor: "#FFFFFF",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              zIndex: 5,
                              transition: "transform 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                            }}
                            aria-label="Add to wishlist"
                          >
                            <Heart size={18} color="#1E1E1E" />
                          </button>
                        </div>
                      </Link>

                      {/* Info Container */}
                      <div style={{ padding: "0.7rem", textAlign: "center" }}>
                        {/* Title */}
                        <Link href={`/products/${pHandle}`} style={{ textDecoration: "none" }}>
                          <h3
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "1.125rem",
                              fontWeight: 600,
                              color: isHovered ? "var(--primary-gold)" : "var(--charcoal)",
                              margin: "0 0 0.5rem 0",
                              transition: "color 0.2s ease"
                            }}
                          >
                            {pTitle}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: "var(--charcoal)", fontSize: "1rem" }}>
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                          {originalPrice && (
                            <span style={{ fontFamily: "'Montserrat', sans-serif", textDecoration: "line-through", color: "rgba(30,30,30,0.4)", fontSize: "0.875rem" }}>
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* Swatches */}
                        {product.colorVariants && product.colorVariants.length > 1 && (
                          <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", minHeight: "22px" }}>
                            {product.colorVariants.map((v: any) => {
                              const isSelected = activeVar ? activeVar.id === v.id : false;
                              const isWhite = v.colorHex?.toLowerCase() === "#ffffff" || v.colorHex?.toLowerCase() === "white";
                              
                              return (
                                      <div
                                        key={v.id}
                                        className="dest-swatch-wrap"
                                        style={{
                                          width: "28px",
                                          height: "28px",
                                          borderRadius: "50%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: isSelected
                                            ? "2px solid rgba(0, 0, 0, 1)"
                                            : "1px solid #CCCCCC",
                                          background: "transparent",
                                          transition: "all 0.15s ease",
                                        }}
                                      >
                                        <button
                                          onMouseEnter={() => {
                                            setActiveVariants(prev => ({ ...prev, [product.id]: v }));
                                            setInteractedCards(prev => ({ ...prev, [product.id]: true }));
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setActiveVariants(prev => ({ ...prev, [product.id]: v }));
                                            setInteractedCards(prev => ({ ...prev, [product.id]: true }));
                                          }}
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            backgroundColor: v.colorHex,
                                            border: isWhite
                                              ? "1px solid rgba(30,30,30,0.25)"
                                              : "none",
                                            padding: 0,
                                            cursor: "pointer",
                                          }}
                                          aria-label={`Select color ${v.colorName}`}
                                          title={v.colorName}
                                        />
                                      </div>
                                    );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
          </div>

          {/* Right Navigation Arrow Button */}
          <button
            onClick={handleScrollRight}
            style={{
              position: "absolute",
              right: "-1.25rem",
              top: "calc(50% - 36px)",
              transform: "translateY(-50%)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)";
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} color="#1E1E1E" />
          </button>

        </div>

      </div>
    </section>
  );
}

function ImageBanner({
  image, href
}: {
  image: string;
  href: string;
}) {
  const isYoutubeBanner = image.includes("youtube");
  const aspect = isYoutubeBanner ? "2000/923" : "1536/454";
  const minHeightClass = isYoutubeBanner
    ? "min-h-[170px] sm:min-h-[290px] md:min-h-[350px] lg:min-h-[470px] xl:min-h-[590px] 2xl:min-h-[700px]"
    : "min-h-[110px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[300px] xl:min-h-[370px] 2xl:min-h-[450px]";

  return (
    <section
      className={`relative w-full overflow-hidden bg-black ${minHeightClass}`}
      style={{
        aspectRatio: aspect,
      }}
    >
      <Link href={href} style={{ position: "relative", display: "block", width: "100%", height: "100%" }}>
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center"
          }}
        />
      </Link>
    </section>
  );
}

function TestimonialsSection({ bgTint }: { bgTint: boolean }) {
  return (
    <section
      className="testimonials-section"
      style={{
        position: "relative",
        width: "100%",
        height: "700px",
        backgroundImage: "url('/testimonials-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        padding: "4rem 1.5rem",
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      <style>{`
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          width: 100%;
          max-width: 800px;
        }
        .testimonial-card {
          background-color: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(30,30,30,0.03);
          box-sizing: border-box;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          transform: translateY(0);
        }
        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }
        @media (max-width: 991px) {
          .testimonials-grid {
            max-width: 100%;
          }
        }
        @media (max-width: 768px) {
          .testimonials-section {
            height: auto !important;
            min-height: auto !important;
            padding: 3rem 1rem !important;
          }
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        {/* Title */}
        <h2
          style={{
            fontFamily: "'Playfair Display', sans-serif",
            fontSize: "clamp(2.25rem, 4vw, 2.75rem)",
            fontWeight: 600,
            color: "#1E1E1E",
            letterSpacing: "-0.02em",
            marginBottom: "2.5rem",
            textAlign: "left"
          }}
        >
          What Travelers Say
        </h2>

        {/* 2x2 Grid */}
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card"
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: "2px", marginBottom: "0.75rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#388E3C"
                    stroke="#388E3C"
                    strokeWidth="1"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                  color: "rgba(30, 30, 30, 0.8)",
                  fontStyle: "italic",
                  margin: "0 0 1rem 0",
                }}
              >
                &quot;{t.review}&quot;
              </p>

              {/* Author & Verification */}
              <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#1E1E1E"
                  }}
                >
                  {t.name}
                </span>
                {t.verified && (
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.75rem",
                      color: "rgba(30, 30, 30, 0.4)",
                      marginTop: "2px"
                    }}
                  >
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



export default function HomePage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [collectionProducts, setCollectionProducts] = useState<Record<string, any[]>>({});
  const [collectionConfigs, setCollectionConfigs] = useState<any[]>([]);
  const [journalArticles, setJournalArticles] = useState<any[]>([]);
  const [mockups, setMockups] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCollections(getCached("collections", []));
    setNewArrivals(getCached("new_arrivals", []));
    setBestSellers(getCached("best_sellers", []));
    setCollectionProducts(getCached("collection_products", {}));
    setCollectionConfigs(getCached("collection_configs", []));
    setJournalArticles(getCached("journal", []));
    setMockups(getCached("product_type_mockups", {}));

    const loadHomeData = async () => {
      try {
        // Fetch Mockup images from Shopify / Fallbacks
        let mockupLookup = getCached("product_type_mockups", {});
        try {
          const res = await api.mockups.get();
          mockupLookup = res?.mockups || {};
          setCached("product_type_mockups", mockupLookup);
        } catch (err) {
          console.error("Failed to load mockups:", err);
        }
        setMockups(mockupLookup);

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
              productType: node.productType || node.category || 'Tops',
              handle: node.handle,
              createdAt: node.createdAt || '',
            };
          }) || [];
          setCached("all_products", allProds);
        } catch (err) {
          console.error("Failed to load products:", err);
        }

        const groupedAll = groupProducts(allProds, mockupLookup);

        // New Arrivals: newest 8
        const arrivals = [...groupedAll].sort((a: any, b: any) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }).slice(0, 8);
        setNewArrivals(arrivals);
        setCached("new_arrivals", arrivals);

        // Best Sellers: filtered or first 8
        const bSellersFiltered = groupedAll.filter((p: any) => p.badge?.toLowerCase() === 'best seller');
        const bSellers = bSellersFiltered.length > 0 ? bSellersFiltered.slice(0, 8) : groupedAll.slice(0, 8);
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
                    productType: node.productType || node.category || 'Tops',
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
          colProductsMap[config.handle] = groupProducts(prods || [], mockupLookup).slice(0, 5);
        }
        setCollectionProducts(colProductsMap);
        setCached("collection_products", colProductsMap);

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

  const getCategoryLabel = (tags: string[]) => {
    if (!tags || tags.length === 0) return "Travel Tips";
    const tagList = tags.map(t => t.toLowerCase());
    if (tagList.includes("guides") || tagList.includes("guide")) return "Destination Guides";
    if (tagList.includes("adventure") || tagList.includes("hiking") || tagList.includes("stories")) return "Adventure Stories";
    if (tagList.includes("perspectives") || tagList.includes("tips") || tagList.includes("ideas")) return "Travel Tips";
    if (tagList.includes("destinations") || tagList.includes("japan") || tagList.includes("italy") || tagList.includes("switzerland") || tagList.includes("usa")) return "Destination Guides";
    return "Travel Tips";
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Collections Section */}
      <section
        style={{
          position: "relative",
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/Map.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "2.5rem 1.5rem",
          borderBottom: "1px solid rgba(30,30,30,0.05)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2rem, 2.5vw, 3.5rem)", fontWeight: 700, color: "#1E1E1E", letterSpacing: "-0.04em", textAlign: "left" }}>
              Discover by <br className="md:hidden" /> Collections
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {collections.length === 0 && loading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ aspectRatio: "1/1", backgroundColor: "#F0F0F0", borderRadius: "8px", animation: "shimmer 1.5s infinite" }} />
                ))
              : (() => {
                  const desiredOrder = [
                    "destination-collection",
                    "wildlife-and-safari",
                    "adventure-and-trekking-collections",
                    "travel-quotes",
                    "beach-vibes"
                  ];

                  const collectionMeta: Record<string, { title: string; description: string }> = {
                    "destination-collection": {
                      title: "Destination Collection",
                      description: "Iconic cities and landmarks from around the world",
                    },
                    "wildlife-and-safari": {
                      title: "Wildlife & Safari Collection",
                      description: "Majestic animals and nature-inspired designs",
                    },
                    "adventure-and-trekking-collections": {
                      title: "Adventure & Trekking Collection",
                      description: "Mountain peaks and outdoor expedition themes",
                    },
                    "travel-quotes": {
                      title: "Travel Quotes Collection",
                      description: "Inspiring words for the wandering soul",
                    },
                    "beach-vibes": {
                      title: "Beach Vibes Collection",
                      description: "Coastal living and ocean-inspired designs",
                    },
                  };

                  const sortedCollections = [...collections].sort((a, b) => {
                    const indexA = desiredOrder.indexOf(a.handle);
                    const indexB = desiredOrder.indexOf(b.handle);
                    const valA = indexA === -1 ? 999 : indexA;
                    const valB = indexB === -1 ? 999 : indexB;
                    return valA - valB;
                  });

                  return sortedCollections.map((col: any) => {
                    const meta = collectionMeta[col.handle] || {
                      title: col.title,
                      description: col.description || "Explore our premium selection",
                    };

                    return (
                      <Link key={col.id} href={`/collections/${encodeURIComponent(col.handle)}`} style={{ textDecoration: "none", display: "block" }}>
                        <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", borderRadius: "8px" }} className="img-hover-zoom">
                          <Image
                            src={getShopifyImageUrl(col.image?.url, 600) || "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80"}
                            alt={meta.title}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ textAlign: "center", marginTop: "0.75rem", padding: "0 0.5rem" }}>
                          <h3 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(0.95rem, 1.2vw, 1.125rem)", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.25rem" }}>
                            {meta.title}
                          </h3>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(0.75rem, 1vw, 0.8125rem)", color: "rgba(30,30,30,0.6)", lineHeight: "1.4" }}>
                            {meta.description}
                          </p>
                        </div>
                      </Link>
                    );
                  });
                })()}
          </div>
        </div>
      </section>

      {/* 3. Latest Collection Section */}
      <ProductCarouselSection
        title="Latest Collection"
        products={newArrivals}
        loading={loading}
        viewAllLink="/shop/new-arrivals"
        viewAllText="VIEW ALL"
      />

      {/* 4. Best Sellers Section */}
      <ProductCarouselSection
        title="Best Sellers"
        products={bestSellers}
        loading={loading}
        viewAllLink="/shop/best-sellers"
        viewAllText="VIEW ALL"
        backgroundColor="#FFFFFF"
      />

      {/* 5. Banner Section 1 */}
      <ImageBanner
        image="/youtube shorts banner 1.jpg"
        href="/brand/story"
      />

      {/* 6. Collection 1 Section */}
      {collectionConfigs[0] && (
        <ProductCarouselSection
          title={collectionConfigs[0].title}
          products={collectionProducts[collectionConfigs[0].handle] || []}
          loading={loading}
          viewAllLink={`/collections/${encodeURIComponent(collectionConfigs[0].handle)}`}
          viewAllText="VIEW ALL"
        />
      )}

      {/* 7. Collection 2 Section */}
      {collectionConfigs[1] && (
        <ProductCarouselSection
          title={collectionConfigs[1].title}
          products={collectionProducts[collectionConfigs[1].handle] || []}
          loading={loading}
          viewAllLink={`/collections/${encodeURIComponent(collectionConfigs[1].handle)}`}
          viewAllText="VIEW ALL"
          backgroundColor="#FFFFFF"
        />
      )}

      {/* 8. Testimonials Section */}
      <TestimonialsSection bgTint={true} />

      {/* 9. Collection 3 Section */}
      {collectionConfigs[2] && (
        <ProductCarouselSection
          title={collectionConfigs[2].title}
          products={collectionProducts[collectionConfigs[2].handle] || []}
          loading={loading}
          viewAllLink={`/collections/${encodeURIComponent(collectionConfigs[2].handle)}`}
          viewAllText="VIEW ALL"
        />
      )}

      {/* 10. Collection 4 Section */}
      {collectionConfigs[3] && (
        <ProductCarouselSection
          title={collectionConfigs[3].title}
          products={collectionProducts[collectionConfigs[3].handle] || []}
          loading={loading}
          viewAllLink={`/collections/${encodeURIComponent(collectionConfigs[3].handle)}`}
          viewAllText="VIEW ALL"
          backgroundImage="/beach-bg.png"
        />
      )}

      {/* 11. Banner Section 2 */}
      <ImageBanner
        image="/Home-Banner2.png"
        href="/"
      />

      {/* 12. Collection 5 Section */}
      {collectionConfigs[4] && (
        <ProductCarouselSection
          title={collectionConfigs[4].title}
          products={collectionProducts[collectionConfigs[4].handle] || []}
          loading={loading}
          viewAllLink={`/collections/${encodeURIComponent(collectionConfigs[4].handle)}`}
          viewAllText="VIEW ALL"
          backgroundColor="#FFFFFF"
        />
      )}

      {/* 13. Blogs Section */}
      <section style={{ backgroundColor: "var(--sand)", padding: "6rem 1.5rem", borderBottom: "1px solid rgba(30,30,30,0.05)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.5rem)", fontWeight: 600, color: "#1E1E1E", letterSpacing: "-0.01em" }}>
                Travel Articles & Inspiration
              </h2>
            </div>
            <Link href="/journal" style={{ textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: "#c4a77d",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.65rem 1.25rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease, opacity 0.3s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#b0936b"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#c4a77d"; }}
              >
                VIEW ALL
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journalArticles.length === 0 && loading
              ? [1, 2, 3].map((i) => (
                  <div key={i} style={{ aspectRatio: "16/10", backgroundColor: "#F0F0F0", borderRadius: "8px", animation: "shimmer 1.5s infinite" }} />
                ))
              : journalArticles.map((art: any) => (
                  <Link key={art.id} href={`/journal/${art.handle}`} style={{ textDecoration: "none", display: "block" }}>
                    <div className="journal-card">
                      <div className="journal-card-image-wrap" style={{ aspectRatio: "16/10", position: "relative", width: "100%", overflow: "hidden" }}>
                        <Image
                          src={getShopifyImageUrl(art.image?.url, 600) || "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80"}
                          alt={art.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
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
                          {getCategoryLabel(art.tags)}
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
                          {art.title}
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
                          {art.excerpt}
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
                          By {art.authorV2?.name || "Nomadica Editor"}
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
                ))}
          </div>
        </div>
      </section>


      {/* 14. About Nomadica Section */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(30,30,30,0.5)", marginBottom: "1rem" }}>
              Our Story
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 600, color: "#1E1E1E", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
              Apparel for the Modern Explorer.
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", color: "rgba(30,30,30,0.7)", lineHeight: 1.8, marginBottom: "2rem" }}>
              Nomadica was born out of a desire to create a wardrobe that works anywhere in the world. We design premium travel lifestyle apparel that balances functional utility with refined, modern aesthetics. Made for adventurers, creatives, and global citizens.
            </p>
            <Link href="/brand/about" style={{ textDecoration: "none" }}>
              <button className="btn-primary">
                Our Philosophy <ArrowRight size={14} />
              </button>
            </Link>
          </div>
          <div style={{ aspectRatio: "1", overflow: "hidden", position: "relative" }}>
            <Image
              src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80"
              alt="Nomad desk with maps"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}