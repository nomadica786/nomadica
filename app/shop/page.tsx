"use client";
import { useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { CardSkeleton } from "@/components/ui/SnowBallLoader";
import { Filter, ChevronDown, X } from "lucide-react";

const allProducts = [
  { id: "1", name: "Nomad Linen Shirt", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80", badge: "New", category: "Tops" },
  { id: "2", name: "Desert Trek Trousers", price: 4299, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", badge: "Best Seller", category: "Bottoms" },
  { id: "3", name: "Horizon Canvas Jacket", price: 8999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", badge: "Limited", category: "Outerwear" },
  { id: "4", name: "Terra Wool Sweater", price: 5499, originalPrice: 6999, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", badge: "Sale", category: "Knits" },
  { id: "5", name: "Drift Cotton Tee", price: 1999, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "Tops" },
  { id: "6", name: "Summit Cargo Pants", price: 5299, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", category: "Bottoms" },
  { id: "7", name: "Dusk Linen Trousers", price: 3799, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80", category: "Bottoms" },
  { id: "8", name: "Wander Merino Hoodie", price: 6299, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", category: "Outerwear" },
];

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Knits"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = allProducts
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      return 0;
    });

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh", backgroundColor: "#F7F4EE" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(30,30,30,0.1)",
          padding: "3rem 1.5rem 2rem",
          backgroundColor: "#F7F4EE",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A5C3E", marginBottom: "0.5rem" }}>
            Explore
          </p>
          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 600, color: "#1E1E1E", letterSpacing: "-0.02em" }}>
            All Collections
          </h1>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          position: "sticky",
          top: "64px",
          zIndex: 100,
          backgroundColor: "#F7F4EE",
          borderBottom: "1px solid rgba(30,30,30,0.1)",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            overflowX: "auto",
            padding: "1rem 0",
          }}
        >
          {/* Category tabs */}
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.5rem 1rem",
                  border: activeCategory === cat ? "1px solid #1E1E1E" : "1px solid rgba(30,30,30,0.2)",
                  backgroundColor: activeCategory === cat ? "#1E1E1E" : "transparent",
                  color: activeCategory === cat ? "#F7F4EE" : "#1E1E1E",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.8125rem",
                color: "#1E1E1E",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.5)", marginBottom: "2rem" }}>
          {filtered.length} items
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}