"use client";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowRight } from "lucide-react";

const newArrivals = [
  { id: "1", name: "Nomad Linen Shirt", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80", badge: "New", category: "Tops" },
  { id: "5", name: "Drift Cotton Tee", price: 1999, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", badge: "New", category: "Tops" },
  { id: "6", name: "Summit Cargo Pants", price: 5299, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", badge: "New", category: "Bottoms" },
  { id: "7", name: "Dusk Linen Trousers", price: 3799, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80", badge: "New", category: "Bottoms" },
  { id: "8", name: "Wander Merino Hoodie", price: 6299, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", badge: "New", category: "Outerwear" },
  { id: "9", name: "Route Linen Shorts", price: 2499, image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&q=80", badge: "New", category: "Bottoms" },
];

export default function NewArrivalsPage() {
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
          {newArrivals.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  );
}