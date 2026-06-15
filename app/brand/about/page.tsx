import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <section style={{ padding: "5rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "1rem" }}>
            About Nomadica
          </p>
          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", margin: 0, color: "#1E1E1E", marginBottom: "1.5rem" }}>
            A travel brand built for life on the move.
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "1.05rem", lineHeight: 1.9, color: "rgba(30,30,30,0.75)", marginBottom: "2rem" }}>
            Nomadica began with a simple belief: wardrobe essentials should support stories, not define them. We create functional pieces with elegant silhouettes, durable fabrics, and thoughtful finishes for modern travellers.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
            {[
              {
                label: "Material integrity",
                detail: "Organic cotton, recycled nylon, and certified trims curated for comfort and resilience.",
              },
              {
                label: "Ethical production",
                detail: "Partnerships with makers who share our focus on fair labor, low waste, and regional craftsmanship.",
              },
              {
                label: "Designed to last",
                detail: "Practical silhouettes with hidden pockets, easy layering, and season-spanning versatility.",
              },
            ].map((item) => (
              <div key={item.label} style={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "22px", border: "1px solid rgba(30,30,30,0.08)" }}>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.2rem", margin: "0 0 0.75rem", color: "#1E1E1E" }}>{item.label}</h2>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(30,30,30,0.7)" }}>{item.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ padding: "2rem", backgroundColor: "#1E1E1E", color: "#FFFFFF", borderRadius: "22px" }}>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9rem", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.85 }}>
                The philosophy
              </p>
              <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.45rem", lineHeight: 1.2, margin: 0 }}>
                Every piece is designed to feel effortless in transit and grounded at every destination.
              </p>
            </div>
            <div style={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "22px", border: "1px solid rgba(30,30,30,0.08)" }}>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9rem", marginBottom: "0.75rem", color: "#1E1E1E", textTransform: "uppercase", letterSpacing: "0.18em" }}>
                Joined by travel lovers
              </p>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(30,30,30,0.75)" }}>
                From adventurers to city commuters, Nomadica is made for people who seek understated performance and enduring style.
              </p>
            </div>
          </div>
          <div style={{ marginTop: "3rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/brand/story" style={{ textDecoration: "none" }}>
              <button style={{ border: "1px solid #1E1E1E", background: "transparent", color: "#1E1E1E", padding: "0.95rem 1.75rem", cursor: "pointer", fontFamily: "'Satoshi', sans-serif", letterSpacing: "0.08em" }}>
                Read Our Story
              </button>
            </Link>
            <Link href="/brand/sustainability" style={{ textDecoration: "none" }}>
              <button style={{ border: "none", background: "#1E1E1E", color: "#FFFFFF", padding: "0.95rem 1.75rem", cursor: "pointer", fontFamily: "'Satoshi', sans-serif", letterSpacing: "0.08em" }}>
                Sustainability Report
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
