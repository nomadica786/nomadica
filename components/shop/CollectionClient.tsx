"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts, sortNewArrivalsFirst } from "@/utils/productGroup";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

interface CollectionClientProps {
  categoryParam: string;
  initialProducts?: any[];
  initialCollectionTitle?: string;
  initialCategories?: { title: string; handle: string }[];
}

export default function CollectionClient({
  categoryParam,
  initialProducts,
  initialCollectionTitle,
  initialCategories
}: CollectionClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ title: string; handle: string }[]>(
    initialCategories || [{ title: "All", handle: "all" }]
  );
  const [sortBy, setSortBy] = useState("Featured");
  const [loading, setLoading] = useState(!initialProducts);
  const [productsState, setProductsState] = useState<any[]>(initialProducts || []);

  // Fetch categories/collections list on mount if not provided
  useEffect(() => {
    if (initialCategories) return;
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
        console.error("Failed to fetch collections list:", err);
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
  }, [initialCategories]);

  // Load products client-side if initialProducts is not provided (fallback)
  useEffect(() => {
    if (initialProducts) {
      setProductsState(initialProducts);
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      setLoading(true);
      try {
        const isAll = categoryParam.toLowerCase() === "all";
        let res;
        if (isAll) {
          res = await api.products.list(50);
        } else {
          res = await api.collections.getByHandle(categoryParam, 50);
        }

        const edges = res?.collectionByHandle?.products?.edges || res?.products?.edges || [];
        const mapped = edges.map((edge: any) => {
          const node = edge.node;
          const priceVal = node.price || parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || '0');
          const origPriceVal = node.originalPrice || (node.variants?.edges?.[0]?.node?.compareAtPrice ? parseFloat(node.variants?.edges?.[0]?.node?.compareAtPrice?.amount || '0') : undefined);
          return {
            id: node.id,
            name: node.title,
            handle: node.handle,
            price: priceVal,
            originalPrice: origPriceVal,
            image: node.images?.edges?.[0]?.node?.url || '',
            hoverImage: node.images?.edges?.[1]?.node?.url || node.images?.edges?.[0]?.node?.url || '',
            badge: node.badge,
            category: node.productType || node.category || 'Tops',
            createdAt: node.createdAt || '',
          };
        }) || [];
        setProductsState(mapped);
      } catch (err) {
        console.error("Failed to load collection products client-side:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryParam, initialProducts]);

  const handleCategoryChange = (handle: string) => {
    if (handle === "all") {
      router.push("/shop");
    } else {
      router.push(`/collections/${handle}`);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  const groupedProducts = groupProducts(productsState);

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

  const isAll = categoryParam.toLowerCase() === "all";
  const pageTitle = initialCollectionTitle || (isAll ? "All Collections" : (categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)));
  const pageLabel = isAll ? "Explore" : "Collection";

  return (
    <div style={{ paddingTop: "0px", minHeight: "100vh", backgroundColor: "#FAF9F7" }}>
      {/* Header */}
      <div
        style={{
          height: "35vh",
          borderBottom: "1px solid rgba(30,30,30,0.1)",
          padding: "3rem 1.5rem 2rem",
          backgroundImage: "url('/shop-header.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Playfair Display', sans-serif", textAlign: "center", fontSize: "clamp(2.5rem, 3vw, 4rem)", color: "#1E1E1E", letterSpacing: "-0.02em", paddingTop: "4%" }}>
            {pageTitle}
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", textAlign: "center", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
            {pageLabel}
          </p>
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
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
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
