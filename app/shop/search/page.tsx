"use client";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import SnowballLoader from "@/components/ui/SnowBallLoader";
import { api } from "@/components/api/api";
import { groupProducts } from "@/utils/productGroup";

const suggestions = ["Linen", "Jacket", "Trousers", "Wool", "Summer", "Travel"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  // Fetch products once on mount and cache in localStorage
  useEffect(() => {
    const initProducts = async () => {
      setLoadingInitial(true);
      try {
        const cached = localStorage.getItem("nomadica_cached_products_grouped");
        if (cached) {
          setAllProducts(JSON.parse(cached));
          setLoadingInitial(false);
          return;
        }

        const data = await api.products.list(250);
        const mappedProducts = data?.products?.edges?.map((edge: any) => {
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
            description: node.description || '',
            createdAt: node.createdAt || '',
          };
        }) || [];

        const grouped = groupProducts(mappedProducts);

        if (grouped.length > 0) {
          localStorage.setItem("nomadica_cached_products_grouped", JSON.stringify(grouped));
          setAllProducts(grouped);
        }
      } catch (err) {
        console.error("Failed to load products for search cache:", err);
      } finally {
        setLoadingInitial(false);
      }
    };

    initProducts();
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length > 1) {
      const queryLower = val.toLowerCase();
      const filtered = allProducts.filter((p) => 
        p.name.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower) ||
        p.colorVariants?.some((v: any) => v.colorName.toLowerCase().includes(queryLower))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
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
                onClick={clearSearch}
                style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(247,244,238,0.5)", padding: "4px" }}
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
        {loadingInitial && query.length > 1 ? (
          <SnowballLoader />
        ) : query.length > 1 ? (
          <>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.5)", marginBottom: "2rem" }}>
              {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </p>
            {results.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                {results.map((p) => <ProductCard key={p.id} {...p} />)}
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