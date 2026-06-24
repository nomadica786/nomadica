"use client";
import ProductCard from "@/components/shop/ProductCard";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts } from "@/utils/productGroup";

export default function NewArrivalsPage() {
  const { data: pageData, loading } = useApi(async () => {
    const [productsRes, mockupsRes] = await Promise.all([
      api.products.list(50),
      api.mockups.get().catch(() => ({ mockups: {} }))
    ]);
    return {
      products: productsRes,
      mockups: mockupsRes?.mockups || {}
    };
  });

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
    };
  }) || [];

  const groupedProducts = groupProducts(allProducts, pageData?.mockups || {});
  
  // Sort by createdAt descending (newest first, then second, then third)
  const displayProducts = [...groupedProducts].sort((a: any, b: any) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const newestIds = new Set(displayProducts.slice(0, 3).map(p => p.id));

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
            New Arrivals
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", textAlign: "center", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
            Just Landed
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {displayProducts.map((p: any) => (
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