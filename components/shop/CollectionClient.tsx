"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts } from "@/utils/productGroup";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";
import { 
  matchesCategoryFilter, 
  matchesColorFilter, 
  matchesSizeFilter, 
  sortProducts, 
  extractCollectionOptions,
  normalizeCollectionKey,
  CANONICAL_COLLECTION_TITLES,
  DEFAULT_COLLECTION_OPTIONS
} from "@/utils/productFilters";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

interface CollectionClientProps {
  categoryParam: string;
  initialProducts?: any[];
  initialCollectionTitle?: string;
  initialCategories?: { title: string; handle: string }[];
}

function getInitialCategoryTitle(
  param?: string | null,
  initialTitle?: string | null,
  query?: string | null
): string[] {
  const candidate = (initialTitle && initialTitle.trim())
    ? initialTitle.trim()
    : (param && param.toLowerCase() !== "all" ? param : query);

  if (!candidate || candidate.toLowerCase() === "all") return [];

  const norm = normalizeCollectionKey(candidate);
  if (norm && CANONICAL_COLLECTION_TITLES[norm]) {
    return [CANONICAL_COLLECTION_TITLES[norm]];
  }

  if (initialTitle && initialTitle.trim()) {
    return [initialTitle.trim()];
  }

  const clean = candidate.replace(/[-_]+/g, " ").trim();
  const formatted = clean
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return [formatted.toLowerCase().endsWith("collection") ? formatted : `${formatted} Collection`];
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
    initialCategories || DEFAULT_COLLECTION_OPTIONS.map((title) => ({
      title,
      handle: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    }))
  );
  const [collectionEdges, setCollectionEdges] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("Featured");
  const [loading, setLoading] = useState(!initialProducts);
  const [productsState, setProductsState] = useState<any[]>(initialProducts || []);
  const [mockups, setMockups] = useState<Record<string, string>>({});
  const [configurations, setConfigurations] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string[]>(() => {
    return getInitialCategoryTitle(categoryParam, initialCollectionTitle, queryCategory);
  });
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);

  useEffect(() => {
    if (categoryParam && categoryParam.toLowerCase() !== "all") {
      const initial = getInitialCategoryTitle(categoryParam, initialCollectionTitle);
      if (initial.length > 0) {
        setSelectedCategory(initial);
      }
    } else if (queryCategory && queryCategory.toLowerCase() !== "all") {
      const initial = getInitialCategoryTitle(null, null, queryCategory);
      if (initial.length > 0) {
        setSelectedCategory(initial);
      }
    }
  }, [categoryParam, initialCollectionTitle, queryCategory]);

  // Fetch mockups on mount
  useEffect(() => {
    const fetchMockups = async () => {
      try {
        const mRes = await api.mockups.get();
        setMockups(mRes?.mockups || {});
        if (mRes?.configurations && Array.isArray(mRes.configurations)) {
          setConfigurations(mRes.configurations);
        }
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

      setCategories(list);

      // Ensure selectedCategory matches the exact title from the fetched collections
      const currentTarget = categoryParam || initialCollectionTitle || "";
      if (currentTarget && currentTarget.toLowerCase() !== "all") {
        const targetNorm = normalizeCollectionKey(currentTarget);
        const matched = list.find((c: any) => {
          return (
            normalizeCollectionKey(c.handle) === targetNorm ||
            normalizeCollectionKey(c.title) === targetNorm
          );
        });
        if (matched) {
          setSelectedCategory([matched.title]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch collections list:", err);
      setCategories([]);
    }
  };

  fetchCollections();
}, [initialCategories, categoryParam, initialCollectionTitle]);


  // Load products client-side if initialProducts is not provided (fallback)
  // Or if the user changes the selected collection away from the initial collection
  useEffect(() => {
    if (!initialProducts) {
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
              productTypeConfig: node.productTypeConfig,
              metafieldProductType: node.metafieldProductType,
              productTypeConfiguration: node.productTypeConfiguration,
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
      return;
    }

    // When initialProducts is provided:
    // If user changes category or clears filters, load full catalog so other collections display
    const isInitialOnly =
      selectedCategory.length === 1 &&
      (normalizeCollectionKey(selectedCategory[0]) === normalizeCollectionKey(categoryParam) ||
       normalizeCollectionKey(selectedCategory[0]) === normalizeCollectionKey(initialCollectionTitle || ""));

    if (!isInitialOnly && productsState.length <= initialProducts.length) {
      api.products.list(100).then((res) => {
        const edges = res?.products?.edges || [];
        if (edges.length > 0) {
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
              productTypeConfig: node.productTypeConfig,
              metafieldProductType: node.metafieldProductType,
              productTypeConfiguration: node.productTypeConfiguration,
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
          });
          setProductsState(mapped);
        }
      }).catch(console.error);
    }
  }, [categoryParam, initialProducts, selectedCategory, initialCollectionTitle, productsState.length]);

const enrichedProducts = useMemo(() => {
  if (!productsState || productsState.length === 0) return [];
  if (!collectionEdges || collectionEdges.length === 0) return productsState;

  return productsState.map((p) => {
    const rawCols: string[] = Array.isArray(p.collections)
      ? p.collections
      : p.collections?.edges
      ? p.collections.edges.flatMap((e: any) => [e?.node?.title, e?.node?.handle].filter(Boolean))
      : [];
    const extraCollections = [...rawCols];

    for (const cEdge of collectionEdges) {
      const colNode = cEdge.node;

      const hasProd = colNode.products?.edges?.some(
        (pe: any) =>
          pe.node?.id === p.id ||
          pe.node?.handle === p.handle
      );

      if (hasProd) {
        if (!extraCollections.includes(colNode.title)) {
          extraCollections.push(colNode.title);
        }

        if (!extraCollections.includes(colNode.handle)) {
          extraCollections.push(colNode.handle);
        }
      }
    }

    return {
      ...p,
      collections: extraCollections,
    };
  });
}, [productsState, collectionEdges]);

/*
 * Keep this calculation before the loading return.
 * Hooks must execute in the same order on every render. */
// 1. First apply the collection filter to raw products if any collection filter is active
const collectionFilteredProducts = useMemo(() => {
  if (!selectedCategory || selectedCategory.length === 0) return enrichedProducts;
  return enrichedProducts.filter((product) => matchesCategoryFilter(product, selectedCategory));
}, [enrichedProducts, selectedCategory]);

// 2. Then group the resulting products by Product Type Configuration metaobject
const groupedProducts = useMemo(() => {
  return groupProducts(collectionFilteredProducts, mockups);
}, [collectionFilteredProducts, mockups]);

// Derive dynamic Collection options strictly from dynamically fetched Shopify collections
const collectionFilterOptions = useMemo(() => {
  return extractCollectionOptions(
    categories,
    collectionEdges,
    enrichedProducts,
    configurations
  );
}, [categories, collectionEdges, enrichedProducts, configurations]);

if (loading) {
  return <PageLoader />;
}

  // 3. Apply color and size filtering on grouped products
  const filteredProducts = groupedProducts.filter((product) => {
    if (!matchesColorFilter(product, selectedColor)) return false;
    if (!matchesSizeFilter(product, selectedSize)) return false;
    return true;
  });

  // 4. Apply sorting (Featured defaults to highest color count first; Newest sorts by date/ID)
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
        categories={collectionFilterOptions}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        sortBy={sortBy}
        setSortBy={setSortBy}
        productCount={finalProducts.length}
        categoryLabel="Collection"
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
                key={p.groupKey || p.id}
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
