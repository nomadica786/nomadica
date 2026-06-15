"use client";
import { useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts } from "@/utils/productGroup";
import { Filter, ChevronDown, X } from "lucide-react";

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Knits"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const { data, loading } = useApi(() => api.products.list(50));

  if (loading) {
    return <PageLoader />;
  }

  // Map Shopify GraphQL product nodes back to standard ProductCard props
  const allProducts = data?.products?.edges?.map((edge: any) => {
    const node = edge.node;
    const priceVal = node.price || parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || '0');
    const origPriceVal = node.originalPrice || (node.variants?.edges?.[0]?.node?.compareAtPrice ? parseFloat(node.variants?.edges?.[0]?.node?.compareAtPrice?.amount || '0') : undefined);
    return {
      id: node.id,
      name: node.title,
      price: priceVal,
      originalPrice: origPriceVal,
      image: node.images?.edges?.[0]?.node?.url || '',
      hoverImage: node.images?.edges?.[1]?.node?.url || node.images?.edges?.[0]?.node?.url || '',
      badge: node.badge,
      category: node.category || 'Tops',
    };
  }) || [];

  const groupedProducts = groupProducts(allProducts);

  const filtered = groupedProducts
    .filter((p: any ) => activeCategory === "All" || p.category === activeCategory)
    .sort((a: any, b: any) => {
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
          {filtered.map((product: any) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}