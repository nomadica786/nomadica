"use client";
import ProductCard from "@/components/shop/ProductCard";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";

export default function NewArrivalsPage() {
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
      category: node.category || 'Tops',
    };
  }) || [];

  const newArrivals = allProducts.filter((p: any) => p.badge?.toLowerCase() === 'new');
  const displayProducts = newArrivals.length > 0 ? newArrivals : allProducts.slice(0, 6);

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          height: "340px",
          overflow: "hidden",
          backgroundColor: "#1E1E1E",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80"
          alt="New Arrivals"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "1.5rem",
          }}
        >
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#7A5C3E", marginBottom: "0.75rem", fontWeight: 500 }}>
            Just Landed
          </p>
          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 600, color: "#F7F4EE", letterSpacing: "-0.02em", lineHeight: 1 }}>
            New Arrivals
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", color: "rgba(247,244,238,0.65)", marginTop: "1rem", maxWidth: "400px", lineHeight: 1.7 }}>
            The latest additions to the Nomadica collection, designed for every destination.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {displayProducts.map((p: any) => <ProductCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  );
}