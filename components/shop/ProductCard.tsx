"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { api } from "@/components/api/api";
import { useAuth } from "@/utils/hooks/useAuth";

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
}: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const [activeVariant, setActiveVariant] = useState<ColorVariant | null>(null);

  useEffect(() => {
    if (colorVariants && colorVariants.length > 0) {
      const match = colorVariants.find(v => v.id === id);
      setActiveVariant(match || colorVariants[0]);
    } else {
      setActiveVariant(null);
    }
  }, [id, colorVariants]);

  const currentId = activeVariant ? activeVariant.id : id;
  const currentName = activeVariant && activeVariant.colorName !== "Original"
    ? `${activeVariant.colorName} ${name}`
    : name;
  const currentPrice = activeVariant ? activeVariant.price : price;
  const currentOriginalPrice = activeVariant ? activeVariant.originalPrice : originalPrice;
  const currentImage = activeVariant ? activeVariant.image : image;
  const currentBadge = activeVariant ? (activeVariant.badge || badge) : badge;

  const productHref = href || `/shop/product-details?id=${currentId}`;

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
      style={{ position: "relative", width: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <Link href={productHref} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          <img
            src={currentImage}
            alt={currentName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />

          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(30,30,30,0.5) 0%, transparent 50%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "1.25rem",
            }}
          >
            <button
              disabled={addingToCart}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isAuthenticated) {
                  router.push("/account/login");
                  return;
                }
                setAddingToCart(true);
                try {
                  console.log("========================================");
                  console.log("[CHECKOUT FLOW] STEP 1: Customer adding to cart");
                  console.log("========================================");
                  console.log(`  Product: ${currentName} (${currentPrice} INR)`);
                  
                  // Fetch product to get actual variant ID
                  console.log(`  Fetching product ${currentId} to get variant ID...`);
                  const productRes = await api.products.get(currentId || "1");
                  const product = productRes?.product || productRes?.productByHandle;
                  
                  if (!product) {
                    throw new Error('Product not found');
                  }

                  // Get first available variant (in real implementation, user would select variant)
                  const variant = product.variants?.edges?.[0]?.node;
                  const variantId = variant?.id;

                  if (!variantId) {
                    console.error('[ProductCard] No variant ID found in product response:', product);
                    throw new Error('Product has no variants');
                  }

                  console.log(`  ✅ Using variant ID: ${variantId}`);

                  let cartId = localStorage.getItem("nomadica_cart_id");
                  
                  if (!cartId) {
                    const res = await api.cart.create([{
                      merchandiseId: variantId,
                      quantity: 1,
                      title: "Default Size",
                      price: currentPrice,
                      productTitle: currentName,
                      image: currentImage
                    }]);
                    const newCart = res?.cartCreate?.cart || res?.cart;
                    if (newCart?.id) {
                      console.log(`  ✅ Created new cart: ${newCart.id}`);
                      localStorage.setItem("nomadica_cart_id", newCart.id);
                    }
                  } else {
                    const res = await api.cart.update(cartId, {
                      lines: [{
                        merchandiseId: variantId,
                        quantity: 1,
                        title: "Default Size",
                        price: currentPrice,
                        productTitle: currentName,
                        image: currentImage
                      }]
                    });
                    console.log(`  ✅ Updated existing cart: ${cartId}`);
                  }
                  
                  window.dispatchEvent(new CustomEvent("cart-updated", { detail: { openDrawer: true } }));
                } catch (err) {
                  console.error("Card Add to Bag failed:", err);
                } finally {
                  setAddingToCart(false);
                }
              }}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#FFFFFF",
                color: "#1E1E1E",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "background 0.2s ease",
                transform: hovered ? "translateY(0)" : "translateY(20px)",
                transition2: "transform 0.4s ease, background 0.2s ease",
                opacity: addingToCart ? 0.7 : 1,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any}
            >
              <ShoppingBag size={14} />
              {addingToCart ? "Adding..." : "Add to Bag"}
            </button>
          </div>

          {/* Badge */}
          {currentBadge && (
            <div
              style={{
                position: "absolute",
                top: "0.75rem",
                left: "0.75rem",
                backgroundColor: currentBadge === "Sale" ? "#1E1E1E" : currentBadge === "New" ? "#4F6B5A" : "#1E1E1E",
                color: "#FFFFFF",
                padding: "0.25rem 0.625rem",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {currentBadge}
            </div>
          )}

          {/* Wishlist */}
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
                } else {
                  await api.wishlist.add(currentId);
                  setWishlisted(true);
                }
              } catch (err) {
                console.error("Wishlist toggle failed:", err);
              }
            }}
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255,0.9)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              color: wishlisted ? "#1E1E1E" : "#1E1E1E",
            }}
          >
            <Heart size={14} fill={wishlisted ? "#1E1E1E" : "none"} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div style={{ paddingTop: "0.875rem" }}>
        {category && (
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.6875rem",
              color: "#1E1E1E",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
              fontWeight: 500,
            }}
          >
            {category}
          </p>
        )}
        <Link href={productHref} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "#1E1E1E",
              marginBottom: "0.375rem",
              lineHeight: 1.4,
            }}
          >
            {currentName}
          </h3>
        </Link>

        {/* Color Swatches */}
        {colorVariants && colorVariants.length > 1 && (
          <div style={{ display: "flex", gap: "0.375rem", marginTop: "0.25rem", marginBottom: "0.55rem", flexWrap: "wrap" }}>
            {colorVariants.map((v) => (
              <button
                key={v.id}
                onMouseEnter={() => setActiveVariant(v)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveVariant(v);
                }}
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: v.colorHex,
                  border: activeVariant?.id === v.id ? "1.5px solid #1E1E1E" : "1px solid rgba(30, 30, 30, 0.2)",
                  boxShadow: activeVariant?.id === v.id ? "0 0 0 1.5px #FFFFFF inset" : "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "transform 0.15s ease",
                  transform: activeVariant?.id === v.id ? "scale(1.15)" : "scale(1)",
                }}
                title={v.colorName}
              />
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "#1E1E1E",
            }}
          >
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
          {currentOriginalPrice && (
            <span
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.875rem",
                color: "rgba(30,30,30,0.4)",
                textDecoration: "line-through",
              }}
            >
              ₹{currentOriginalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}