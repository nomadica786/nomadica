import Link from "next/link";

const metrics = [
  { label: "Recycled fabrics", value: "72%", description: "Used across our latest collection." },
  { label: "Carbon reduction", value: "38%", description: "Production emissions compared to prior season." },
  { label: "Water savings", value: "25M L", description: "Saved through closed-loop finishing." },
  { label: "Local production", value: "84%", description: "Small batch runs close to design studios." },
];

export default function SustainabilityPage() {
  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      <section style={{ padding: "4.5rem 1.5rem" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ display: "grid", gap: "1.5rem", textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A5C3E" }}>
              Sustainability
            </p>
            <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", margin: 0, color: "#1E1E1E" }}>
              Better choices for every journey.
            </h1>
            <p style={{ margin: "0 auto", maxWidth: "760px", fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(30,30,30,0.72)" }}>
              Our sustainability work is grounded in responsible fabrics, reduced waste, and transparent craftsmanship.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "3rem" }}>
            {metrics.map((metric) => (
              <div key={metric.label} style={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid rgba(30,30,30,0.08)" }}>
                <p style={{ margin: 0, fontFamily: "'Clash Display', sans-serif", fontSize: "2.5rem", color: "#1E1E1E" }}>{metric.value}</p>
                <p style={{ margin: "0.75rem 0 0", fontFamily: "'Satoshi', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "#1E1E1E" }}>{metric.label}</p>
                <p style={{ margin: "0.75rem 0 0", fontFamily: "'Satoshi', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(30,30,30,0.72)" }}>{metric.description}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1.4fr 1fr" }}>
            <div style={{ padding: "2.5rem", borderRadius: "28px", backgroundColor: "#1E1E1E", color: "#F7F4EE" }}>
              <h2 style={{ margin: 0, fontFamily: "'Clash Display', sans-serif", fontSize: "2rem" }}>Responsible materials</h2>
              <p style={{ marginTop: "1.25rem", fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(247,244,238,0.88)" }}>
                We source recycled nylon, organic cotton, and low-impact plant-based dyes to reduce our footprint without losing performance.
              </p>
            </div>
            <div style={{ padding: "2.5rem", borderRadius: "28px", backgroundColor: "#fff", border: "1px solid rgba(30,30,30,0.08)" }}>
              <h2 style={{ margin: 0, fontFamily: "'Clash Display', sans-serif", fontSize: "2rem" }}>Continued progress</h2>
              <p style={{ marginTop: "1.25rem", fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(30,30,30,0.72)" }}>
                Each season we refine production processes, measure our carbon impact, and share our progress transparently.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/brand/about" style={{ textDecoration: "none" }}>
              <button style={{ border: "1px solid #1E1E1E", background: "transparent", color: "#1E1E1E", padding: "0.95rem 1.75rem", cursor: "pointer", letterSpacing: "0.08em" }}>
                About the Craft
              </button>
            </Link>
            <Link href="/brand/journal" style={{ textDecoration: "none" }}>
              <button style={{ border: "none", background: "#7A5C3E", color: "#F7F4EE", padding: "0.95rem 1.75rem", cursor: "pointer", letterSpacing: "0.08em" }}>
                Read the Journal
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
