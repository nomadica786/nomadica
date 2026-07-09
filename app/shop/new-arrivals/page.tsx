"use client";
import { useState } from "react";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts } from "@/utils/productGroup";
import ProductCard from "@/components/shop/ProductCard";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";

export default function NewArrivalsPage() {
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
  const [sortBy, setSortBy] = useState<string>("Newest");

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
  
  // Apply filtering
  const filteredProducts = groupedProducts.filter(product => {
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
    } else if (sortBy === "Featured") {
      const newestPart = [...sorted].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3);
      const otherPart = sorted.filter(p => !newestPart.find(n => n.id === p.id));
      otherPart.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return [...newestPart, ...otherPart];
    } else {
      // Default for New Arrivals is "Newest"
      sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return sorted;
  })();

  const newestIds = new Set([...groupedProducts].sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3).map(p => p.id));

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
            Just Landed
          </p>
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