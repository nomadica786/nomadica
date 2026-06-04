"use client";

import { useState } from "react";
import Link from "next/link";
import SearchInput from "@/components/ui/SearchInput";
import ProductCard from "@/components/shop/ProductCard";

const articles = [
  { id: "1", title: "Field notes from Kashmir", category: "Travel", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&q=80" },
  { id: "2", title: "The case for fewer, better layers", category: "Style", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80" },
  { id: "3", title: "Material stories: hemp and linen", category: "Sustainability", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700&q=80" },
  { id: "4", title: "How travel shaped our latest collection", category: "Design", image: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d0?w=700&q=80" },
];

const allEntries = articles.map((article) => ({
  ...article,
  description: "A short editorial glimpse at the inspiration and craft behind Nomadica.",
  price: 0,
}));

export default function JournalPage() {
  const [query, setQuery] = useState("");

  const filtered = query
    ? allEntries.filter((entry) =>
        entry.title.toLowerCase().includes(query.toLowerCase()) ||
        entry.category.toLowerCase().includes(query.toLowerCase())
      )
    : allEntries;

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "center", marginBottom: "2rem" }}>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A5C3E" }}>
              Journal
            </p>
            <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", margin: 0, color: "#1E1E1E" }}>
              Notes from the road.
            </h1>
            <p style={{ maxWidth: "700px", margin: "0 auto", fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(30,30,30,0.7)" }}>
              Explore curated stories, editorial insights, and the ideas that shape our collections.
            </p>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search journal stories..." />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {filtered.map((entry) => (
              <Link
                key={entry.id}
                href="#"
                style={{
                  display: "block",
                  borderRadius: "24px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  textDecoration: "none",
                  boxShadow: "0 10px 30px rgba(30,30,30,0.06)",
                }}
              >
                <img src={entry.image} alt={entry.title} style={{ width: "100%", height: "240px", objectFit: "cover" }} />
                <div style={{ padding: "1.5rem" }}>
                  <p style={{ margin: 0, fontFamily: "'Satoshi', sans-serif", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#7A5C3E" }}>
                    {entry.category}
                  </p>
                  <h2 style={{ margin: "0.75rem 0", fontFamily: "'Clash Display', sans-serif", fontSize: "1.35rem", color: "#1E1E1E" }}>{entry.title}</h2>
                  <p style={{ margin: 0, fontFamily: "'Satoshi', sans-serif", fontSize: "0.95rem", color: "rgba(30,30,30,0.72)", lineHeight: 1.75 }}>
                    {entry.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
