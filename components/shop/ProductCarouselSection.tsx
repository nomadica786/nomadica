"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { getShopifyImageUrl } from "@/lib/images/shopifyImage";

export function ProductCarouselSection({
  icon,
  title,
  products,
  loading,
  viewAllLink,
  viewAllText,
  backgroundColor,
  backgroundImage
}: {
  icon?: LucideIcon;
  title: string;
  products: any[];
  loading?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
  backgroundColor?: string;
  backgroundImage?: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeVariants, setActiveVariants] = useState<Record<string, any>>({});
  const [interactedCards, setInteractedCards] = useState<Record<string, boolean>>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const Icon = icon;

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current?.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth"
      });
      setTimeout(updateScrollButtons, 350);
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current?.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth"
      });
      setTimeout(updateScrollButtons, 350);
    }
  };

  const updateScrollButtons = () => {
  const container = scrollContainerRef.current;
  if (!container) return;

  setCanScrollLeft(container.scrollLeft > 5);

  setCanScrollRight(
    container.scrollLeft <
      container.scrollWidth - container.clientWidth - 5
  );
};

  useEffect(() => {
  updateScrollButtons();

  const container = scrollContainerRef.current;
  if (!container) return;

  container.addEventListener("scroll", updateScrollButtons);
  window.addEventListener("resize", updateScrollButtons);

  return () => {
    container.removeEventListener("scroll", updateScrollButtons);
    window.removeEventListener("resize", updateScrollButtons);
  };
  }, [products]);

  

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
              {Icon && (
                  <Icon
                    style={{ marginTop: "8px" }}
                    size={26}
                    strokeWidth={2}
                    color="#C4B5A0"
                  />
                )}
            <h2
              style={{
                fontFamily: "'Playfair Display', sans-serif",
                fontSize: "clamp(2.25rem, 1.875vw, 2.25rem)",
                fontWeight: 700,
                color: "#111111",
                letterSpacing: "-0.5px",
                margin: 0
              }}
            >
              {title}
            </h2>
          </div>
          {viewAllLink && viewAllText && (
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
          )}
        </div>

        {/* Carousel Wrapper */}
        <div style={{ position: "relative" }}>
          
          {/* Left Navigation Arrow Button */}
          {canScrollLeft && (
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
          )}

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
                      aspectRatio: "274 / 477",
                      backgroundColor: "#F0F0F0",
                      borderRadius: "10px",
                      border: "1 px solid #EAEAEA",
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
                            aspectRatio: "285 / 356",
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
                                          width: "22px",
                                          height: "22px",
                                          borderRadius: "50%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: isSelected
                                            ? "1px solid rgba(0, 0, 0, 1)"
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
                                            width: "16px",
                                            height: "16px",
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
          {canScrollRight && (
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
          )}

        </div>

      </div>
    </section>
  );
}
