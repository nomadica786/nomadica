"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, ChevronDown, Truck, RotateCcw, Shield } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

const product = {
  id: "1",
  name: "Nomad Linen Shirt",
  price: 3499,
  originalPrice: 4999,
  category: "Tops",
  description: "Crafted from 100% European linen, the Nomad Linen Shirt is designed for the traveller who refuses to sacrifice style for comfort. Its relaxed silhouette breathes beautifully in tropical climates while looking effortlessly polished at dinner.",
  materials: "100% European Linen. Machine wash cold. Hang dry.",
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["#D4C5B0", "#4F6B5A", "#7A5C3E"],
  images: [
    "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=800&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
  ],
  rating: 4.8,
  reviews: 124,
  badge: "New",
};

const relatedProducts = [
  { id: "2", name: "Desert Trek Trousers", price: 4299, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", category: "Bottoms" },
  { id: "5", name: "Drift Cotton Tee", price: 1999, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "Tops" },
  { id: "3", name: "Horizon Canvas Jacket", price: 8999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", badge: "Limited", category: "Outerwear" },
  { id: "4", name: "Terra Wool Sweater", price: 5499, originalPrice: 6999, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", badge: "Sale", category: "Knits" },
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {["Home", "Shop", product.category, product.name].map((crumb, i, arr) => (
            <span key={crumb} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link
                href={i === 0 ? "/" : i === 1 ? "/shop/collections" : "#"}
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.8125rem",
                  color: i === arr.length - 1 ? "#1E1E1E" : "rgba(30,30,30,0.4)",
                  textDecoration: "none",
                  fontWeight: i === arr.length - 1 ? 500 : 400,
                }}
              >
                {crumb}
              </Link>
              {i < arr.length - 1 && (
                <span style={{ color: "rgba(30,30,30,0.3)", fontSize: "0.75rem" }}>/</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4rem",
          alignItems: "start",
        }}
      >
        {/* Images */}
        <div>
          {/* Main image */}
          <div
            style={{
              aspectRatio: "3/4",
              overflow: "hidden",
              backgroundColor: "#EDE9E1",
              marginBottom: "0.75rem",
            }}
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s ease" }}
            />
          </div>

          {/* Thumbnails */}
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                style={{
                  flexShrink: 0,
                  width: "80px",
                  aspectRatio: "1",
                  overflow: "hidden",
                  border: selectedImage === i ? "2px solid #1E1E1E" : "2px solid transparent",
                  cursor: "pointer",
                  padding: 0,
                  background: "none",
                }}
              >
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{ paddingTop: "0.5rem" }}>
          {product.badge && (
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                backgroundColor: "#4F6B5A",
                color: "#F7F4EE",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              {product.badge}
            </span>
          )}

          <h1
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 600,
              color: "#1E1E1E",
              letterSpacing: "-0.01em",
              marginBottom: "0.75rem",
              lineHeight: 1.15,
            }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  fill={star <= Math.floor(product.rating) ? "#7A5C3E" : "none"}
                  stroke="#7A5C3E"
                />
              ))}
            </div>
            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <span
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#1E1E1E",
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <>
                <span
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "1.125rem",
                    color: "rgba(30,30,30,0.35)",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span
                  style={{
                    backgroundColor: "#7A5C3E",
                    color: "#F7F4EE",
                    padding: "0.2rem 0.5rem",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Color */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", fontWeight: 500, color: "#1E1E1E", marginBottom: "0.75rem" }}>
              Colour
            </p>
            <div style={{ display: "flex", gap: "0.625rem" }}>
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: selectedColor === color ? "2px solid #1E1E1E" : "2px solid transparent",
                    outline: selectedColor === color ? "1px solid #1E1E1E" : "none",
                    outlineOffset: "2px",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", fontWeight: 500, color: "#1E1E1E" }}>
                Size
              </p>
              <button style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "#7A5C3E", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Size Guide
              </button>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: "48px",
                    height: "48px",
                    border: selectedSize === size ? "1px solid #1E1E1E" : "1px solid rgba(30,30,30,0.2)",
                    backgroundColor: selectedSize === size ? "#1E1E1E" : "transparent",
                    color: selectedSize === size ? "#F7F4EE" : "#1E1E1E",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add to cart */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(30,30,30,0.2)",
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: "44px",
                  height: "52px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                  color: "#1E1E1E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span
                style={{
                  width: "44px",
                  textAlign: "center",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "#1E1E1E",
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: "44px",
                  height: "52px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                  color: "#1E1E1E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>

            <button
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <ShoppingBag size={16} />
              Add to Bag
            </button>

            <button
              onClick={() => setWishlisted(!wishlisted)}
              style={{
                width: "52px",
                height: "52px",
                border: "1px solid rgba(30,30,30,0.2)",
                backgroundColor: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: wishlisted ? "#7A5C3E" : "#1E1E1E",
                flexShrink: 0,
              }}
            >
              <Heart size={18} fill={wishlisted ? "#7A5C3E" : "none"} />
            </button>
          </div>

          {/* Service badges */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              padding: "1.5rem 0",
              borderTop: "1px solid rgba(30,30,30,0.1)",
              borderBottom: "1px solid rgba(30,30,30,0.1)",
              marginBottom: "1.5rem",
            }}
          >
            {[
              { icon: Truck, label: "Free Delivery", sub: "On orders over ₹2000" },
              { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
              { icon: Shield, label: "Secure Pay", sub: "UPI, Cards, Wallets" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <Icon size={18} style={{ marginBottom: "0.375rem", color: "#7A5C3E" }} />
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.125rem" }}>{label}</p>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.6875rem", color: "rgba(30,30,30,0.5)" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Accordion */}
          {[
            { id: "description", label: "Description", content: product.description },
            { id: "materials", label: "Materials & Care", content: product.materials },
          ].map((section) => (
            <div key={section.id} style={{ borderBottom: "1px solid rgba(30,30,30,0.1)" }}>
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.125rem 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "#1E1E1E",
                }}
              >
                {section.label}
                <ChevronDown
                  size={16}
                  style={{
                    transform: openSection === section.id ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {openSection === section.id && (
                <p
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "0.9rem",
                    color: "rgba(30,30,30,0.65)",
                    lineHeight: 1.8,
                    paddingBottom: "1.25rem",
                  }}
                >
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related products */}
      <div style={{ maxWidth: "1400px", margin: "4rem auto 0", padding: "0 1.5rem 5rem" }}>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "2rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "2rem", letterSpacing: "-0.01em" }}>
          You May Also Like
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {relatedProducts.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  );
}