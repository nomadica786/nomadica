"use client";
import ProductCard from "@/components/shop/ProductCard";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts, sortNewArrivalsFirst } from "@/utils/productGroup";

export default function BestSellersPage() {
  const { data, loading } = useApi(() => api.products.list(50));

  if (loading) {
    return <PageLoader />;
  }

  const allProducts = data?.products?.edges?.map((edge: any) => {
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
  const bestSellers = groupedProducts.filter((p: any) => p.badge?.toLowerCase() === 'best seller');
  const baseList = bestSellers.length > 0 ? bestSellers : groupedProducts.slice(0, 4);

  const { sorted: displayProducts, newestIds } = sortNewArrivalsFirst(baseList, 3);

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: "300px", overflow: "hidden", backgroundColor: "#1E1E1E" }}>
        <img src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1600&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255, 255, 255,0.7)", marginBottom: "0.75rem" }}>Community Picks</p>
          <h1 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em" }}>Best Sellers</h1>
        </div>
      </div>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
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