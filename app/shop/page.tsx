"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts, sortNewArrivalsFirst } from "@/utils/productGroup";
import { Filter, ChevronDown, X } from "lucide-react";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

function CollectionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [categories, setCategories] = useState<{ title: string; handle: string }[]>([
    { title: "All", handle: "all" }
  ]);
  const [sortBy, setSortBy] = useState("Featured");

  // Fetch collections from Shopify for filter tabs
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.collections.list();
        const edges = res?.collections?.edges || [];
        const list = edges.map((edge: any) => ({
          title: edge.node.title,
          handle: edge.node.handle
        }));
        setCategories([{ title: "All", handle: "all" }, ...list]);
      } catch (err) {
        console.error("Failed to fetch collections:", err);
        // Fallback static categories
        setCategories([
          { title: "All", handle: "all" },
          { title: "Tops", handle: "tops" },
          { title: "Bottoms", handle: "bottoms" },
          { title: "Outerwear", handle: "outerwear" },
          { title: "Knits", handle: "knits" }
        ]);
      }
    };
    fetchCategories();
  }, []);

  const isAll = categoryParam.toLowerCase() === "all";

  // Call the api dynamically based on whether it is a custom collection or static category
  const { data, loading } = useApi(() => {
    if (isAll) {
      return api.products.list(50);
    } else {
      return api.collections.getByHandle(categoryParam, 50);
    }
  }, [categoryParam, isAll]);

  const handleCategoryChange = (handle: string) => {
    if (handle === "all") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${encodeURIComponent(handle)}`);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  // Resolve the edges depending on API response structure
  const edges = data?.collectionByHandle?.products?.edges || data?.products?.edges || [];

  // Map Shopify GraphQL product nodes back to standard ProductCard props
  const allProducts = edges.map((edge: any) => {
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
      category: node.productType || node.category || 'Tops',
      createdAt: node.createdAt || '',
    };
  }) || [];

  const groupedProducts = groupProducts(allProducts);

  // Apply "new arrivals first" partition and badge mapping
  const { sorted: sortedProducts, newestIds } = sortNewArrivalsFirst(groupedProducts, 3);

  // Sort other products (not in the top 3 newest) based on user's sorting option
  const finalProducts = (() => {
    const newestPart = sortedProducts.filter(p => newestIds.has(p.id));
    const otherPart = sortedProducts.filter(p => !newestIds.has(p.id));

    if (sortBy === "Price: Low to High") {
      otherPart.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      otherPart.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Newest") {
      otherPart.sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
    }

    return [...newestPart, ...otherPart];
  })();

  const pageTitle = isAll ? "All Collections" : (data?.collectionByHandle?.title || "Collection");
  const pageLabel = isAll ? "Explore" : "Collection";

  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid rgba(30,30,30,0.1)",
          padding: "3rem 1.5rem 2rem",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
            {pageLabel}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 600, color: "#1E1E1E", letterSpacing: "-0.02em" }}>
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          position: "sticky",
          top: "64px",
          zIndex: 100,
          backgroundColor: "#FFFFFF",
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
            {categories.map((cat) => {
              const isSelected = categoryParam.toLowerCase() === cat.handle.toLowerCase();
              return (
                <button
                  key={cat.handle}
                  onClick={() => handleCategoryChange(cat.handle)}
                  style={{
                    padding: "0.5rem 1rem",
                    border: isSelected ? "1px solid #1E1E1E" : "1px solid rgba(30,30,30,0.2)",
                    backgroundColor: isSelected ? "#1E1E1E" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#1E1E1E",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontFamily: "'Montserrat', sans-serif",
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
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.5)", marginBottom: "2rem" }}>
          {finalProducts.length} items
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {finalProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              {...product}
              badge={newestIds.has(product.id) ? "New" : product.badge}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CollectionsPageContent />
    </Suspense>
  );
}