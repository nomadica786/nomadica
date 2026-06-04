"use client";
import ProductCard from "@/components/shop/ProductCard";

const bestSellers = [
  { id: "2", name: "Desert Trek Trousers", price: 4299, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", badge: "Best Seller", category: "Bottoms" },
  { id: "1", name: "Nomad Linen Shirt", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80", badge: "Best Seller", category: "Tops" },
  { id: "4", name: "Terra Wool Sweater", price: 5499, originalPrice: 6999, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", badge: "Sale", category: "Knits" },
  { id: "3", name: "Horizon Canvas Jacket", price: 8999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", badge: "Limited", category: "Outerwear" },
];

export default function BestSellersPage() {
  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      <div style={{ position: "relative", height: "300px", overflow: "hidden", backgroundColor: "#7A5C3E" }}>
        <img src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1600&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(247,244,238,0.7)", marginBottom: "0.75rem" }}>Community Picks</p>
          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 600, color: "#F7F4EE", letterSpacing: "-0.02em" }}>Best Sellers</h1>
        </div>
      </div>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {bestSellers.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  );
}