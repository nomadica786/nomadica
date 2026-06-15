import Link from "next/link";

export default function BrandHero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "82vh",
        display: "grid",
        placeItems: "center",
        padding: "3rem 1.5rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(135deg, rgba(26, 26, 26, 0.18), rgba(255, 255, 255, 0.02) 45%, rgba(255, 255, 255, 0.82))",
          pointerEvents: "none",
        }}
      />
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
        alt="Travel lifestyle"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          filter: "brightness(0.9)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "880px",
          textAlign: "center",
          color: "#FFFFFF",
          display: "grid",
          gap: "1.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "0.8rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255,0.85)",
          }}
        >
          Crafted for journeys that leave a mark
        </span>
        <h1
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(3rem, 5vw, 5.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            margin: 0,
          }}
        >
          The brand behind every path.
        </h1>
        <p
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "1rem",
            maxWidth: "680px",
            margin: "0 auto",
            color: "rgba(255, 255, 255,0.85)",
            lineHeight: 1.8,
          }}
        >
          Nomadica blends considered design, sustainable materials, and immersive storytelling for a travel wardrobe built to move with you.
        </p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem" }}>
          <Link href="/brand/about" style={{ textDecoration: "none" }}>
            <button
              style={{
                border: "1px solid rgba(255, 255, 255,0.7)",
                background: "transparent",
                color: "#FFFFFF",
                padding: "0.95rem 2rem",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.9rem",
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              About Us
            </button>
          </Link>
          <Link href="/brand/story" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "#FFFFFF",
                color: "#1E1E1E",
                border: "none",
                padding: "0.95rem 2rem",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.9rem",
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              Our Story
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
