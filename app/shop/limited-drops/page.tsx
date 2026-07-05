"use client";
import { useState, useEffect } from "react";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts } from "@/utils/productGroup";
import { ProductCarouselSection } from "@/components/shop/ProductCarouselSection";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";

function Countdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  const fmt = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
      {[["HRS", time.h], ["MIN", time.m], ["SEC", time.s]].map(([label, val]) => (
        <div key={label as string} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "#FFFFFF", lineHeight: 1 }}>{fmt(val as number)}</div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255, 255, 255,0.5)", marginTop: "0.25rem" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function LimitedDropsPage() {
  const target = new Date(Date.now() + 48 * 3600 * 1000);
  const { data: pageData, loading } = useApi(async () => {
    const [productsRes, mockupsRes, collectionsRes] = await Promise.all([
      api.products.list(50),
      api.mockups.get().catch(() => ({ mockups: {} })),
      api.collections.list().catch(() => ({ collections: { edges: [] } }))
    ]);
    return {
      products: productsRes,
      mockups: mockupsRes?.mockups || {},
      collections: collectionsRes?.collections?.edges?.map((e: any) => e.node.title) || []
    };
  });

  const categories = ["All", ...(pageData?.collections || [])];

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Featured");

  if (loading) {
    return <PageLoader />;
  }

  const allProducts = pageData?.products?.products?.edges?.map((edge: any) => {
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
      createdAt: node.createdAt || '',
      handle: node.handle,
      collections: node.collections?.edges?.map((e: any) => e.node.title) || [],
      variants: node.variants
    };
  }) || [];

  const groupedProducts = groupProducts(allProducts, pageData?.mockups || {});
  const drops = groupedProducts.filter((p: any) => p.badge?.toLowerCase() === 'limited');
  const baseList = drops.length > 0 ? drops : groupedProducts.slice(0, 3);

  // Apply filtering
  const filteredProducts = baseList.filter(product => {
    if (selectedCategory !== "All") {
      const expectedCat = selectedCategory.toLowerCase();
      const matchesCollection = product.collections?.some((c: string) => c.toLowerCase() === expectedCat);
      const matchesType = (product.productType || product.category || "").toLowerCase() === expectedCat;
      if (!matchesCollection && !matchesType) return false;
    }
    if (selectedSize !== "All") {
      const hasSize = product.allVariants?.some((edge: any) => 
        edge.node?.title?.toLowerCase().includes(selectedSize.toLowerCase()) || 
        edge.node?.selectedOptions?.some((opt: any) => opt.name.toLowerCase() === "size" && opt.value.toLowerCase() === selectedSize.toLowerCase())
      );
      if (!hasSize) return false;
    }
    if (selectedColor !== "All") {
      const hasColor = product.allVariants?.some((edge: any) => 
        edge.node?.title?.toLowerCase().includes(selectedColor.toLowerCase()) || 
        edge.node?.selectedOptions?.some((opt: any) => opt.name.toLowerCase() === "color" && opt.value.toLowerCase() === selectedColor.toLowerCase())
      );
      if (!hasColor) return false;
    }
    return true;
  });

  // Apply sorting
  const finalProducts = (() => {
    let sorted = [...filteredProducts];
    if (sortBy === "Price: Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Newest") {
      sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else {
      const newestPart = [...sorted].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3);
      const otherPart = sorted.filter(p => !newestPart.find(n => n.id === p.id));
      otherPart.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return [...newestPart, ...otherPart];
    }
    return sorted;
  })();

  const newestIds = new Set([...baseList].sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3).map(p => p.id));

  return (
    <div style={{ paddingTop: "0px", backgroundColor: "#FAF9F7", minHeight: "100vh" }}>
      {/* Drop countdown header */}
      <div
        style={{
          minHeight: "45vh",
          borderBottom: "1px solid rgba(30,30,30,0.1)",
          padding: "3rem 1.5rem 2.5rem",
          backgroundImage: "url('/shop-header.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
            Exclusive
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2.5rem, 3vw, 4rem)", color: "#1E1E1E", letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
            Limited Drops
          </h1>
          
          {/* Glass countdown card */}
          <div style={{
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            padding: "1.5rem 2.5rem",
            borderRadius: "20px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
            display: "inline-block"
          }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6875rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Next drop ends in
            </p>
            <Countdown targetDate={target} />
          </div>
        </div>
      </div>

      <ShopFilterBar 
        categories={categories}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {finalProducts.map((p: any) => (
            <ProductCard
              key={p.id}
              {...p}
              badge={newestIds.has(p.id) ? "New" : p.badge}
            />
          ))}
        </div>
      </div>
    </div>
  );
}