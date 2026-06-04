"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/shop/ProductCard";

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

const drops = [
  { id: "3", name: "Horizon Canvas Jacket", price: 8999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", badge: "Limited", category: "Outerwear" },
  { id: "10", name: "Eclipse Silk Scarf", price: 2299, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80", badge: "Limited", category: "Accessories" },
  { id: "11", name: "Terrain Leather Belt", price: 1799, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", badge: "Limited", category: "Accessories" },
];

export default function LimitedDropsPage() {
  // eslint-disable-next-line react-hooks/purity
  const target = new Date(Date.now() + 48 * 3600 * 1000);

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
          {drops.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  );
}