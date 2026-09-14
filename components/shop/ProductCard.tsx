"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
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
  allVariants?: any[];
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
  showAddToCart?: boolean;
  onAddToCart?: (variant?: any) => void;
  allVariants?: any[];
  selectedColors?: string[];
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
  showAddToCart = false,
  onAddToCart,
  allVariants,
  selectedColors,
}: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Strictly deduplicate colorVariants so no duplicate colors or duplicate IDs can ever exist
  const uniqueVariants = (colorVariants || []).filter(
    (v, idx, arr) =>
      arr.findIndex(
        (other) =>
          other.id === v.id ||
          (other.colorHex && v.colorHex && other.colorHex.toLowerCase() === v.colorHex.toLowerCase())
      ) === idx
  );

  const [activeVariant, setActiveVariant] = useState<ColorVariant | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (uniqueVariants && uniqueVariants.length > 0) {
      const expected = (selectedColors || [])
        .map((c) => c.toLowerCase())
        .filter((c) => c !== "all");

      if (expected.length > 0) {
        const colorMatch = uniqueVariants.find((v) => {
          const cName = (v.colorName || "").toLowerCase();
          const vTitle = (v.name || "").toLowerCase();
          const hex = (v.colorHex || "").toLowerCase();
          return expected.some((sc) => {
            if (cName.includes(sc) || vTitle.includes(sc)) return true;
            if (sc === "white" && (hex === "#ffffff" || hex === "#fff" || hex === "#faf9f6" || cName.includes("white") || vTitle.includes("white"))) return true;
            if (sc === "black" && (hex === "#1e1e1e" || hex === "#000000" || hex === "#383838" || cName.includes("black") || vTitle.includes("black"))) return true;
            if (sc === "blue" && (hex === "#1976d2" || hex === "#4e6e82" || hex === "#5c768d" || cName.includes("denim") || cName.includes("blue") || vTitle.includes("blue"))) return true;
            if (sc === "navy" && (hex === "#1a237e" || cName.includes("navy") || vTitle.includes("navy"))) return true;
            if (sc === "red" && (hex === "#d32f2f" || hex === "#800000" || cName.includes("red") || cName.includes("maroon") || vTitle.includes("red") || vTitle.includes("maroon"))) return true;
            if (sc === "maroon" && (hex === "#800000" || cName.includes("maroon") || vTitle.includes("maroon"))) return true;
            if (sc === "pink" && (hex === "#e89ba8" || cName.includes("pink") || vTitle.includes("pink"))) return true;
            if ((sc === "grey" || sc === "gray") && (hex === "#808080" || cName.includes("grey") || cName.includes("gray") || vTitle.includes("grey") || vTitle.includes("gray"))) return true;
            if (sc === "green" && (hex === "#388e3c" || hex === "#4f6b5a" || cName.includes("green") || cName.includes("olive") || vTitle.includes("green"))) return true;
            if (sc === "yellow" && (hex === "#fbc02d" || cName.includes("yellow") || cName.includes("gold") || vTitle.includes("yellow"))) return true;
            return false;
          });
        });
        if (colorMatch) {
          setActiveVariant(colorMatch);
          setHasInteracted(true);
          return;
        }
      }
      const match = uniqueVariants.find(v => v.id === id);
      setActiveVariant(match || uniqueVariants[0]);
    } else {
      setActiveVariant(null);
    }
  }, [id, colorVariants, selectedColors]);

  const currentId = activeVariant ? activeVariant.id : id;
  const currentName = activeVariant && activeVariant.colorName !== "Original" && !name.toLowerCase().includes(activeVariant.colorName.toLowerCase())
    ? `${activeVariant.colorName} ${name}`
    : (activeVariant?.name || name);
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
                  await api.wishlist.remove(currentId);
                  setWishlisted(false);
                  window.dispatchEvent(new CustomEvent("wishlist-updated"));
                } else {
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
              backgroundColor: "#FFFFFF",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              zIndex: 5,
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            aria-label="Wishlist"
          >
            <Heart
              size={18}
              fill={wishlisted ? "#E53935" : "none"}
              color={wishlisted ? "#E53935" : "#1E1E1E"}
            />
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
        {uniqueVariants && uniqueVariants.length > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", minHeight: "22px", marginBottom: "0.5rem" }}>
            {uniqueVariants.map((v) => {
              const isSelected = activeVariant ? activeVariant.id === v.id : false;
              const isWhite = isWhiteColor(v.colorHex);
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
                      border: isWhite ? "1px solid rgba(30, 30, 30, 0.2)" : "none",
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
              );
            })}
          </div>
        )}

        {/* Add to Cart Button */}
        {showAddToCart && (
          <div style={{ marginTop: "0.75rem" }}>
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onAddToCart) {
                  onAddToCart(activeVariant || { id: currentId, name: currentName, price: currentPrice, image: currentImage, allVariants });
                } else {
                  setAddingToCart(true);
                  try {
                    let cartId = localStorage.getItem("nomadica_cart_id");
                    const variantId = activeVariant?.id || currentId;
                    if (!cartId) {
                      const res = await api.cart.create([{ merchandiseId: variantId, quantity: 1 }]);
                      const newCart = res?.cartCreate?.cart || res?.cart;
                      if (newCart?.id) localStorage.setItem("nomadica_cart_id", newCart.id);
                    } else {
                      await api.cart.update(cartId, { lines: [{ merchandiseId: variantId, quantity: 1 }] });
                    }
                    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { openDrawer: true } }));
                  } catch (err) {
                    console.error("Failed to add to cart:", err);
                  } finally {
                    setAddingToCart(false);
                  }
                }
              }}
              style={{
                width: "100%",
                backgroundColor: "#C6BAA8",
                color: "#FFFFFF",
                border: "none",
                padding: "0.6rem 1rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                transform: hovered ? "scale(1.02)" : "scale(1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b0a390")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C6BAA8")}
            >
              <ShoppingCart size={14} />
              {addingToCart ? "ADDING..." : "ADD TO CART"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}