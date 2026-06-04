"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import SnowballLoader from "@/components/ui/SnowBallLoader";

const allProducts = [
  { id: "1", name: "Nomad Linen Shirt", price: 3499, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80", category: "Tops" },
  { id: "2", name: "Desert Trek Trousers", price: 4299, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", category: "Bottoms" },
  { id: "3", name: "Horizon Canvas Jacket", price: 8999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", category: "Outerwear" },
  { id: "4", name: "Terra Wool Sweater", price: 5499, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", category: "Knits" },
  { id: "5", name: "Drift Cotton Tee", price: 1999, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "Tops" },
  { id: "6", name: "Summit Cargo Pants", price: 5299, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", category: "Bottoms" },
];

const suggestions = ["Linen", "Jacket", "Trousers", "Wool", "Summer", "Travel"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = query.length > 1
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length > 1) {
      setLoading(true);
      setTimeout(() => setLoading(false), 600);
    }
  };

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      {/* Search hero */}
      <div style={{ backgroundColor: "#1E1E1E", padding: "4rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "#F7F4EE", textAlign: "center", marginBottom: "2rem", letterSpacing: "-0.02em" }}>
            What are you looking for?
          </h1>
          <div style={{ position: "relative" }}>
            <Search size={20} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "rgba(247,244,238,0.4)" }} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products, categories..."
              style={{
                width: "100%",
                padding: "1.125rem 1.25rem 1.125rem 3.5rem",
                backgroundColor: "rgba(247,244,238,0.07)",
                border: "1px solid rgba(247,244,238,0.15)",
                color: "#F7F4EE",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(247,244,238,0.5)" }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Suggestions */}
          {!query && (
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid rgba(247,244,238,0.2)",
                    backgroundColor: "transparent",
                    color: "rgba(247,244,238,0.7)",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(247,244,238,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {loading ? (
          <SnowballLoader />
        ) : query.length > 1 ? (
          <>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.5)", marginBottom: "2rem" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </p>
            {filtered.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                {filtered.map((p) => <ProductCard key={p.id} {...p} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", color: "#1E1E1E", marginBottom: "0.75rem" }}>No results found</p>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9375rem", color: "rgba(30,30,30,0.5)" }}>Try a different search term.</p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}