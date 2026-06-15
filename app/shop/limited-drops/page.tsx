"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { api, useApi } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts } from "@/utils/productGroup";

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
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "#F7F4EE", lineHeight: 1 }}>{fmt(val as number)}</div>
          <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(247,244,238,0.5)", marginTop: "0.25rem" }}>{label}</div>
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
  const displayProducts = drops.length > 0 ? drops : groupedProducts.slice(0, 3);

  const newestId = (() => {
    if (displayProducts.length === 0) return '';
    let newest = displayProducts[0];
    let maxTime = 0;
    for (const p of displayProducts) {
      if (p.createdAt) {
        const time = new Date(p.createdAt).getTime();
        if (time > maxTime) {
          maxTime = time;
          newest = p;
        }
      }
    }
    return maxTime > 0 ? newest.id : '';
  })();

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      {/* Drop countdown */}
      <div style={{ backgroundColor: "#1E1E1E", padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#7A5C3E", marginBottom: "1rem" }}>Exclusive</p>
        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 600, color: "#F7F4EE", letterSpacing: "-0.02em", marginBottom: "2.5rem" }}>
          Limited Drops
        </h1>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(247,244,238,0.5)", marginBottom: "2rem", letterSpacing: "0.05em" }}>
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
              badge={p.id === newestId ? "New" : p.badge}
            />
          ))}
        </div>
      </div>
    </div>
  );
}