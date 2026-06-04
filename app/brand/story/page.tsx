import Link from "next/link";

const timeline = [
  {
    year: "2019",
    title: "First road trip collection",
    description: "A small capsule designed for long weekends and the open road.",
  },
  {
    year: "2021",
    title: "Expanded travel wardrobe",
    description: "Introduced weather-ready pieces and elevated minimal design language.",
  },
  {
    year: "2023",
    title: "Sustainable studio launch",
    description: "Built deeper transparency across material sourcing and production partners.",
  },
  {
    year: "2025",
    title: "Everyday travelwear defined",
    description: "Refined the brand ethos around destination-ready comfort and function.",
  },
];

export default function StoryPage() {
  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      <section style={{ padding: "5rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A5C3E", marginBottom: "1rem" }}>
            Our Story
          </p>
          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", margin: 0, color: "#1E1E1E", marginBottom: "1.5rem" }}>
            A design journey shaped by travel.
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", lineHeight: 1.85, color: "rgba(30,30,30,0.75)", marginBottom: "2.5rem" }}>
            Nomadica began as an experiment in elegant utility: a place where silhouettes, details, and materials all support a life in motion.
          </p>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {timeline.map((item) => (
              <div key={item.year} style={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid rgba(30,30,30,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", backgroundColor: "#7A5C3E", display: "grid", placeItems: "center", color: "#F7F4EE", fontFamily: "'Clash Display', sans-serif", fontSize: "1rem", fontWeight: 700 }}>
                    {item.year.slice(2)}
                  </div>
                  <h2 style={{ margin: 0, fontFamily: "'Clash Display', sans-serif", fontSize: "1.4rem", color: "#1E1E1E" }}>{item.title}</h2>
                </div>
                <p style={{ margin: 0, fontFamily: "'Satoshi', sans-serif", fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(30,30,30,0.72)" }}>{item.description}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <Link href="/brand/journal" style={{ textDecoration: "none" }}>
              <button style={{ border: "none", background: "#7A5C3E", color: "#F7F4EE", padding: "0.95rem 1.75rem", cursor: "pointer", letterSpacing: "0.08em" }}>
                Read the Journal
              </button>
            </Link>
            <Link href="/brand/sustainability" style={{ textDecoration: "none" }}>
              <button style={{ border: "1px solid #1E1E1E", background: "transparent", color: "#1E1E1E", padding: "0.95rem 1.75rem", cursor: "pointer", letterSpacing: "0.08em" }}>
                Sustainability Details
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
