"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { api } from "@/components/api/api";
import { useAuth } from "@/utils/hooks/useAuth";

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
}: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const productHref = href || `/shop/product-details?id=${id}`;

  useEffect(() => {
    const checkWishlist = async () => {
      if (!id) return;
      try {
        const res = await api.wishlist.list();
        const isInWishlist = res?.wishlist?.some((item: any) => item.id === id);
        setWishlisted(!!isInWishlist);
      } catch {}
    };
    checkWishlist();
  }, [id]);

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
            backgroundColor: "#EDE9E1",
          }}
        >
          <img
            src={hovered && hoverImage ? hoverImage : image}
            alt={name}
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
                  let cartId = localStorage.getItem("nomadica_cart_id");
                  const variantId = `gid://shopify/ProductVariant/${id}000`;
                  
                  if (!cartId) {
                    const res = await api.cart.create([{
                      merchandiseId: variantId,
                      quantity: 1,
                      title: "Default Size"
                    }]);
                    const newCart = res?.cartCreate?.cart || res?.cart;
                    if (newCart?.id) {
                      localStorage.setItem("nomadica_cart_id", newCart.id);
                    }
                  } else {
                    await api.cart.update(cartId, {
                      lines: [{
                        merchandiseId: variantId,
                        quantity: 1,
                        title: "Default Size"
                      }]
                    });
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
                backgroundColor: "#F7F4EE",
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
          {badge && (
            <div
              style={{
                position: "absolute",
                top: "0.75rem",
                left: "0.75rem",
                backgroundColor: badge === "Sale" ? "#7A5C3E" : badge === "New" ? "#4F6B5A" : "#1E1E1E",
                color: "#F7F4EE",
                padding: "0.25rem 0.625rem",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {badge}
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
                  await api.wishlist.remove(id);
                  setWishlisted(false);
                } else {
                  await api.wishlist.add(id);
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
              backgroundColor: "rgba(247,244,238,0.9)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              color: wishlisted ? "#7A5C3E" : "#1E1E1E",
            }}
          >
            <Heart size={14} fill={wishlisted ? "#7A5C3E" : "none"} />
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
              color: "#7A5C3E",
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
            {name}
          </h3>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "#1E1E1E",
            }}
          >
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && (
            <span
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.875rem",
                color: "rgba(30,30,30,0.4)",
                textDecoration: "line-through",
              }}
            >
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}