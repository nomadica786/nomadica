"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { api } from "@/components/api/api";
import { useAuth } from "@/utils/hooks/useAuth";
import Image from "next/image";
import { getShopifyImageUrl } from "@/lib/images/shopifyImage";

const isWhiteColor = (colorHex: string) => {
  if (!colorHex) return false;
  const normalized = colorHex.trim().toLowerCase();
  return normalized === "#ffffff" || normalized === "white" || normalized === "#fff";
};

interface ColorVariant {
  id: string;
  colorName: string;
  colorHex: string;
  image: string;
  hoverImage?: string;
  price: number;
  originalPrice?: number;
  handle: string;
  badge?: string;
}

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  category?: string;
  href?: string;
  colorVariants?: ColorVariant[];
  handle?: string;
  mockupImage?: string;
}

export default function ProductCard({
  id = "1",
  name,
  price,
  originalPrice,
  image,
  hoverImage,
  badge,
  category,
  href,
  colorVariants,
  handle,
  mockupImage,
}: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const [activeVariant, setActiveVariant] = useState<ColorVariant | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (colorVariants && colorVariants.length > 0) {
      const match = colorVariants.find(v => v.id === id);
      setActiveVariant(match || colorVariants[0]);
    } else {
      setActiveVariant(null);
    }
  }, [id, colorVariants]);

  const[bgcolor, setbgcolor] = useState("#FFFFFF");
  const currentId = activeVariant ? activeVariant.id : id;
  const currentName = activeVariant && activeVariant.colorName !== "Original"
    ? `${activeVariant.colorName} ${name}`
    : name;
  const currentPrice = activeVariant ? activeVariant.price : price;
  const currentOriginalPrice = activeVariant ? activeVariant.originalPrice : originalPrice;
  const currentImage = (mockupImage && !hasInteracted)
    ? mockupImage
    : (activeVariant ? activeVariant.image : image);
  const currentBadge = activeVariant ? (activeVariant.badge || badge) : badge;
  const currentHandle = activeVariant ? activeVariant.handle : handle;

  const productHref = href || (currentHandle ? `/products/${currentHandle}` : `/shop/product-details?id=${currentId}`);

  const sizedImage = getShopifyImageUrl(currentImage, 600);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!currentId) return;
      try {
        const res = await api.wishlist.list();
        const isInWishlist = res?.wishlist?.some((item: any) => item.id === currentId);
        setWishlisted(!!isInWishlist);
      } catch {}
    };
    checkWishlist();
  }, [currentId]);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(30, 30, 30, 0.05)",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: hovered ? "0 8px 25px rgba(0,0,0,0.06)" : "0 4px 15px rgba(0,0,0,0.02)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        position: "relative"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <Link href={productHref} style={{ textDecoration: "none", display: "block" }}>
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
            src={sizedImage}
            alt={currentName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{
              objectFit: "cover",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
            }}
          />

          {/* Badge */}
          {currentBadge && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                backgroundColor: currentBadge === "Sale" ? "var(--charcoal)" : currentBadge === "New" ? "var(--forest-green)" : "var(--charcoal)",
                color: "#FFFFFF",
                padding: "0.25rem 0.625rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                zIndex: 5
              }}
            >
              {currentBadge}
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAuthenticated) {
                router.push("/account/login");
                return;
              }
              try {
                if (wishlisted) {
                  setbgcolor("white")
                  await api.wishlist.remove(currentId);
                  setWishlisted(false);
                  window.dispatchEvent(new CustomEvent("wishlist-updated"));
                } else {
                  setbgcolor("red")
                  await api.wishlist.add(currentId);
                  setWishlisted(true);
                  window.dispatchEvent(new CustomEvent("wishlist-updated"));
                }
              } catch (err) {
                console.error("Wishlist toggle failed:", err);
              }
            }}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: bgcolor,
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
            aria-label="Wishlist"
          >
            <Heart size={18} fill="white" />
          </button>
        </div>
      </Link>

      {/* Info Container */}
      <div style={{ padding: "0.7rem", textAlign: "center" }}>
        {/* Title */}
        <Link href={productHref} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: hovered ? "var(--primary-gold)" : "var(--charcoal)",
              margin: "0 0 0.5rem 0",
              transition: "color 0.2s ease"
            }}
          >
            {currentName}
          </h3>
        </Link>

        {/* Price */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: "var(--charcoal)", fontSize: "1rem" }}>
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
          {currentOriginalPrice && (
            <span style={{ fontFamily: "'Montserrat', sans-serif", textDecoration: "line-through", color: "rgba(30,30,30,0.4)", fontSize: "0.875rem" }}>
              ₹{currentOriginalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {colorVariants && colorVariants.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", minHeight: "22px", marginBottom: "0.5rem" }}>
            {colorVariants.map((v) => {
              const isSelected = activeVariant ? activeVariant.id === v.id : false;
              const isWhite = v.colorHex?.toLowerCase() === "#ffffff" || v.colorHex?.toLowerCase() === "white";
              return (
                <div key={v.id} className="dest-swatch-wrap" style={{ width: "22px", height: "22px" }}>
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
                                            ? "2px solid rgba(0, 0, 0, 1)"
                                            : "2px solid #CCCCCC",
                                          background: "transparent",
                                          transition: "all 0.15s ease",
                                        }}
                                      >
                  <button
                    onMouseEnter={() => {
                      setActiveVariant(v);
                      setHasInteracted(true);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveVariant(v);
                      setHasInteracted(true);
                    }}
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: v.colorHex,
                      boxShadow: isSelected ? "0 0 0 1.5px #FFFFFF inset" : "none",
                      padding: 0,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      transform: isSelected ? "scale(1.25)" : "scale(1)",
                    }}
                    title={v.colorName}
                    aria-label={`Select color ${v.colorName}`}
                  />
                </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}