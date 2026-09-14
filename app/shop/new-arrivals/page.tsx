"use client";
import { useState, useMemo } from "react";
import { api, useApi } from "@/components/api/api";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts, GroupedProduct } from "@/utils/productGroup";
import ProductCard from "@/components/shop/ProductCard";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";
import { matchesCategoryFilter, matchesColorFilter, matchesSizeFilter, sortProducts } from "@/utils/productFilters";

type CollectionEdge = { node: { title: string } };
type ProductOption = { name?: string; value?: string };
type PriceNode = { amount?: string };
type ProductVariantEdge = { node?: { title?: string; selectedOptions?: ProductOption[]; price?: PriceNode; compareAtPrice?: PriceNode } };
type ProductNode = {
  id: string;
  title: string;
  price?: number;
  originalPrice?: number;
  variants?: { edges?: ProductVariantEdge[] };
  images?: { edges?: Array<{ node?: { url?: string } }> };
  badge?: string;
  productType?: string;
  category?: string;
  productTypeConfig?: any;
  metafieldProductType?: any;
  productTypeConfiguration?: any;
  createdAt?: string;
  handle?: string;
  collections?: { edges?: CollectionEdge[] };
  tags?: string[];
  options?: any[];
  sizes?: string[];
  colors?: string[];
};

export default function NewArrivalsPage() {
  const router = useRouter();
  const { data: pageData, loading } = useApi(async () => {
    const [productsRes, mockupsRes, collectionsRes] = await Promise.all([
      api.products.list(50),
      api.mockups.get().catch(() => ({ mockups: {} })),
      api.collections.list().catch(() => ({ collections: { edges: [] } }))
    ]);
    return {
      products: productsRes,
      mockups: mockupsRes?.mockups || {},
      configurations: mockupsRes?.configurations || [],
      collections: collectionsRes?.collections?.edges?.map((e: CollectionEdge) => e.node.title) || []
    };
  });

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest");

  const allProducts = useMemo(() => {
    return pageData?.products?.products?.edges?.map((edge: { node: ProductNode }) => {
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
        productType: node.productType || node.category || 'Tops',
        productTypeConfig: node.productTypeConfig,
        metafieldProductType: node.metafieldProductType,
        productTypeConfiguration: node.productTypeConfiguration,
        createdAt: node.createdAt || '',
        handle: node.handle,
        collections: [
          ...(node.collections?.edges?.map((e: CollectionEdge) => e.node.title) || []),
          ...(node.category ? [node.category] : []),
          ...(node.productType ? [node.productType] : [])
        ],
        tags: node.tags || [],
        options: node.options || [],
        sizes: node.sizes || node.options?.find((o: any) => o.name?.toLowerCase() === "size")?.values || [],
        colors: node.colors || [],
        variants: node.variants
      };
    }) || [];
  }, [pageData?.products]);

  const groupedProducts = useMemo(() => {
    return groupProducts(allProducts, pageData?.mockups || {});
  }, [allProducts, pageData?.mockups]);

  const categoryOptions = useMemo(() => {
    const list = new Set<string>();
    if (pageData?.configurations && Array.isArray(pageData.configurations)) {
      for (const config of pageData.configurations) {
        if (config.displayName) list.add(config.displayName);
        else if (config.entryName) list.add(config.entryName);
      }
    }
    for (const gp of groupedProducts) {
      if (gp.displayName) list.add(gp.displayName);
      else if (gp.name) list.add(gp.name);
    }
    const generic = ["tops", "bottoms", "outerwear", "knits", "all"];
    return Array.from(list).filter(item => !generic.includes(item.toLowerCase()));
  }, [pageData?.configurations, groupedProducts]);

  if (loading) {
    return <PageLoader />;
  }
  
  // Apply filtering
  const filteredProducts = groupedProducts.filter(product => {
    if (!matchesCategoryFilter(product, selectedCategory)) return false;
    if (!matchesColorFilter(product, selectedColor)) return false;
    if (!matchesSizeFilter(product, selectedSize)) return false;
    return true;
  });

  // Apply sorting (Featured defaults to highest color count first; Newest sorts by date/ID)
  const finalProducts = sortProducts(filteredProducts, sortBy);

  const newestIds = new Set([...groupedProducts].sort((a: GroupedProduct, b: GroupedProduct) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3).map((p: GroupedProduct) => p.id));

  return (
    <div style={{ paddingTop: "0px", backgroundColor: "#FAF9F7", minHeight: "100vh" }}>
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
            Latest Collection
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", textAlign: "center", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
            New Arrivals
          </p>
        </div>
      </div>
      <ShopFilterBar 
        categories={categoryOptions}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        sortBy={sortBy}
        setSortBy={setSortBy}
        productCount={finalProducts.length}
        pageFilterLabel={"Latest Collection"}
        onClearPageFilter={() => router.push('/shop')}
      />

      {/* Products Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {finalProducts.map((p: GroupedProduct) => (
            <ProductCard
              key={p.groupKey || p.id}
              {...p}
              badge={newestIds.has(p.id) ? "New" : p.badge}
              selectedColors={selectedColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}