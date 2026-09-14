"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts } from "@/utils/productGroup";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";
import { matchesCategoryFilter, matchesColorFilter, matchesSizeFilter, sortProducts } from "@/utils/productFilters";

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
  const searchParams = useSearchParams();
  const queryCategory = searchParams ? searchParams.get("category") : null;

  const [categories, setCategories] = useState<{ title: string; handle: string }[]>(
    initialCategories || [{ title: "All", handle: "all" }]
  );
  const [collectionEdges, setCollectionEdges] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("Featured");
  const [loading, setLoading] = useState(!initialProducts);
  const [productsState, setProductsState] = useState<any[]>(initialProducts || []);
  const [mockups, setMockups] = useState<Record<string, string>>({});

  const [selectedCategory, setSelectedCategory] = useState<string[]>(() => {
    if (categoryParam.toLowerCase() !== "all") {
      return [categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)];
    }
    if (queryCategory && queryCategory.toLowerCase() !== "all") {
      return [queryCategory.charAt(0).toUpperCase() + queryCategory.slice(1)];
    }
    return [];
  });
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);

  useEffect(() => {
    if (queryCategory && queryCategory.toLowerCase() !== "all") {
      const formatted = queryCategory.charAt(0).toUpperCase() + queryCategory.slice(1);
      setSelectedCategory((prev) => (prev.includes(formatted) ? prev : [formatted]));
    }
  }, [queryCategory]);

  // Fetch mockups on mount
  useEffect(() => {
    const fetchMockups = async () => {
      try {
        const mRes = await api.mockups.get();
        setMockups(mRes?.mockups || {});
      } catch (err) {
        console.error("Failed to load mockups in CollectionClient:", err);
      }
    };
    fetchMockups();
  }, []);

// Fetch collections list on mount if not provided
useEffect(() => {
  if (initialCategories) return;

  const fetchCollections = async () => {
    try {
      const res = await api.collections.list();
      const edges = res?.collections?.edges || [];

      setCollectionEdges(edges);

      const list = edges.map((edge: any) => ({
        title: edge.node.title,
        handle: edge.node.handle,
      }));

      // Only show actual collections in the category dropdown
      setCategories(list);
    } catch (err) {
      console.error("Failed to fetch collections list:", err);
      setCategories([]);
    }
  };

  fetchCollections();
}, [initialCategories]);


  // Load products client-side if initialProducts is not provided (fallback)
  useEffect(() => {
    if (initialProducts) {
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
            image: node.images?.edges?.[0]?.node?.url || node.image?.url || node.image || '',
            hoverImage: node.images?.edges?.[1]?.node?.url || node.images?.edges?.[0]?.node?.url || node.image?.url || node.image || '',
            badge: node.badge,
            category: node.productType || node.category || 'Tops',
            productType: node.productType || node.category || 'Tops',
            createdAt: node.createdAt || '',
            collections: [
              ...(node.collections?.edges?.flatMap((e: any) => [e.node.title, e.node.handle]) || []),
              ...(node.category ? [node.category] : []),
              ...(node.productType ? [node.productType] : [])
            ],
            tags: node.tags || [],
            options: node.options || [],
            sizes: node.sizes || node.options?.find((o: any) => o.name?.toLowerCase() === "size")?.values || [],
            colors: node.colors || [],
            variants: node.variants,
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

  const enrichedProducts = useMemo(() => {
    if (!productsState || productsState.length === 0) return [];
    if (!collectionEdges || collectionEdges.length === 0) return productsState;
    return productsState.map((p) => {
      const extraCollections = [...(p.collections || [])];
      for (const cEdge of collectionEdges) {
        const colNode = cEdge.node;
        const hasProd = colNode.products?.edges?.some(
          (pe: any) => pe.node?.id === p.id || pe.node?.handle === p.handle
        );
        if (hasProd) {
          if (!extraCollections.includes(colNode.title)) extraCollections.push(colNode.title);
          if (!extraCollections.includes(colNode.handle)) extraCollections.push(colNode.handle);
        }
      }
      return { ...p, collections: extraCollections };
    });
  }, [productsState, collectionEdges]);

  if (loading) {
    return <PageLoader />;
  }

  const groupedProducts = groupProducts(enrichedProducts, mockups);

  // Apply filtering
  const filteredProducts = groupedProducts.filter((product) => {
    if (!matchesCategoryFilter(product, selectedCategory)) return false;
    if (!matchesColorFilter(product, selectedColor)) return false;
    if (!matchesSizeFilter(product, selectedSize)) return false;
    return true;
  });

  // Apply sorting (Featured defaults to highest color count first; Newest sorts by date/ID)
  const finalProducts = sortProducts(filteredProducts, sortBy);

  const isAll = (categoryParam.toLowerCase() === "all");
  const pageTitle = initialCollectionTitle || (
    selectedCategory.length === 1
      ? selectedCategory[0]
      : selectedCategory.length > 1
        ? "Selected Collections"
        : (isAll ? "All Collections" : (categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)))
  );
  const pageLabel = selectedCategory.length > 0 ? "Collection" : (isAll ? "Explore" : "Collection");

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

      <ShopFilterBar 
        categories={categories.map(c => c.title)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        sortBy={sortBy}
        setSortBy={setSortBy}
        productCount={finalProducts.length}
      />

      {/* Products Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        {finalProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", fontFamily: "'Montserrat', sans-serif" }}>
            <p style={{ fontSize: "1.125rem", color: "#1E1E1E", fontWeight: 500, marginBottom: "0.5rem" }}>
              No products found
            </p>
            <p style={{ fontSize: "0.875rem", color: "rgba(30, 30, 30, 0.5)", marginBottom: "1.5rem" }}>
              Try adjusting your filter selections or clearing filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory([]);
                setSelectedSize([]);
                setSelectedColor([]);
              }}
              style={{
                padding: "0.625rem 1.5rem",
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {finalProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                {...p}
                selectedColors={selectedColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
