"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts, sortNewArrivalsFirst } from "@/utils/productGroup";

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
  const drops = groupedProducts.filter((p: any) => p.badge?.toLowerCase() === 'limited');
  const baseList = drops.length > 0 ? drops : groupedProducts.slice(0, 3);

  const { sorted: displayProducts, newestIds } = sortNewArrivalsFirst(baseList, 3);

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      {/* Drop countdown */}
      <div style={{ backgroundColor: "#1E1E1E", padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "1rem" }}>Exclusive</p>
        <h1 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "2.5rem" }}>
          Limited Drops
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", color: "rgba(255, 255, 255,0.5)", marginBottom: "2rem", letterSpacing: "0.05em" }}>
          Next drop ends in:
        </p>
        <Countdown targetDate={target} />
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
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