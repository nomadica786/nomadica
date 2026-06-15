import Link from "next/link";
import Image from "next/image";

const tiles = [
  {
    title: "The first capsule",
    subtitle: "Minimal travel uniforms, built for bold trips.",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=80",
    href: "/brand/story",
  },
  {
    title: "Sustainably sourced",
    subtitle: "Traceable fabrics for every climate.",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b9c5d0?w=900&q=80",
    href: "/brand/sustainability",
  },
  {
    title: "Journal highlights",
    subtitle: "Field notes from recent expeditions.",
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=900&q=80",
    href: "/brand/journal",
  },
  {
    title: "Design stories",
    subtitle: "The details that make each piece feel alive.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
    href: "/brand/about",
  },
];

export default function StoryGallery() {
  return (
    <section style={{ padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.9rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
              Brand stories
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", margin: 0, color: "#1E1E1E" }}>
              Moments worth slowing down for.
            </h2>
          </div>
          <p style={{ maxWidth: "520px", fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8 }}>
            Discover how Nomadica bridges sustainable design, editorial journeys, and handcrafted details through rich visual storytelling.
          </p>
        </div>

        <div className="bento-grid" style={{ gridTemplateAreas: '"a b" "c d"', gap: "1rem" }}>
          {tiles.map((tile, index) => (
            <Link
              key={tile.title}
              href={tile.href}
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: index === 0 ? "420px" : "240px",
                display: "block",
                borderRadius: "18px",
                backgroundColor: "#FFFFFF",
                textDecoration: "none",
              }}
              className="img-hover-zoom"
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.62))",
                }}
              />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem", color: "#FFFFFF" }}>
                <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.9 }}>
                  {index === 0 ? "Featured" : "Story"}
                </p>
                <h3 style={{ margin: "0.35rem 0 0", fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", lineHeight: 1.1 }}>
                  {tile.title}
                </h3>
                <p style={{ margin: "0.85rem 0 0", fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", color: "rgba(255, 255, 255,0.92)", lineHeight: 1.6 }}>
                  {tile.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
