import Link from "next/link";
import BrandHero from "@/components/brand/BrandHero";
import StoryGallery from "@/components/brand/StoryGallery";
import SearchInput from "@/components/ui/SearchInput";
import { CardSkeleton } from "@/components/ui/SnowBallLoader";

const highlights = [
  {
    title: "About Us",
    description: "A heritage born from travel, made for timeless journeys.",
    href: "/brand/about",
  },
  {
    title: "Our Story",
    description: "From trunk shows to travel capsules, how Nomadica evolved.",
    href: "/brand/story",
  },
  {
    title: "Journal",
    description: "Dispatches from the road, design notes, and seasonal edits.",
    href: "/brand/journal",
  },
  {
    title: "Sustainability",
    description: "Material transparency and earth-first production practices.",
    href: "/brand/sustainability",
  },
];

export default function BrandLandingPage() {
  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE" }}>
      <BrandHero />

      <section style={{ padding: "4rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A5C3E" }}>
              Discover the brand
            </p>
            <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem, 4vw, 3.4rem)", margin: 0, color: "#1E1E1E" }}>
              Crafted narratives, sustainable design, and thoughtful travelwear.
            </h2>
            <p style={{ maxWidth: "760px", margin: "0 auto", fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(30,30,30,0.7)" }}>
              Explore the pillars that shape Nomadica — from our origin story and editorial journal to the sustainability practices behind every collection.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {highlights.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                style={{
                  display: "block",
                  padding: "2rem",
                  borderRadius: "24px",
                  backgroundColor: "#fff",
                  border: "1px solid rgba(30,30,30,0.08)",
                  textDecoration: "none",
                  color: "#1E1E1E",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(event) => {
                  (event.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (event.currentTarget as HTMLElement).style.boxShadow = "0 18px 50px rgba(30,30,30,0.08)";
                }}
                onMouseLeave={(event) => {
                  (event.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (event.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <h3 style={{ margin: 0, fontFamily: "'Clash Display', sans-serif", fontSize: "1.25rem", marginBottom: "0.75rem" }}>{item.title}</h3>
                <p style={{ margin: 0, fontFamily: "'Satoshi', sans-serif", fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(30,30,30,0.75)" }}>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 1.5rem 4rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A5C3E", marginBottom: "0.75rem" }}>Search the journal</p>
            <SearchInput placeholder="Search Nomadica journal entries" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[1, 2, 3, 4].map((index) => (
              <div key={index} style={{ borderRadius: "24px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 10px 30px rgba(30,30,30,0.05)" }}>
                <CardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoryGallery />
    </div>
  );
}
