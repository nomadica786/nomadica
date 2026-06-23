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
      handle: node.handle,
    };
  }) || [];

  const groupedProducts = groupProducts(allProducts);
  const drops = groupedProducts.filter((p: any) => p.badge?.toLowerCase() === 'limited');
  const baseList = drops.length > 0 ? drops : groupedProducts.slice(0, 3);

  const { sorted: displayProducts, newestIds } = sortNewArrivalsFirst(baseList, 3);

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