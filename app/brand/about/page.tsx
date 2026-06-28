// app/brand/about/page.tsx
"use client";
import Link from "next/link";
import { Sparkles, Leaf, Check } from "lucide-react";

export default function AboutPage() {
  const standForItems = [
    {
      icon: <Sparkles size={28} style={{ color: "#8E7F6A" }} />,
      title: "Premium Quality",
      desc: "We use carefully selected cotton blends that are soft, breathable, and long-lasting. Every piece is made to feel luxurious while being durable enough for everyday adventures."
    },
    {
      icon: <Leaf size={28} style={{ color: "#8E7F6A" }} />,
      title: "Original Designs",
      desc: "Each design is created by our team of travel-loving artists. We transform real destinations and experiences into distinctive, story-driven artwork you won't find anywhere else."
    }
  ];

  const whyChooseItems = [
    {
      title: "Unisex Sizing",
      desc: "Designed for all body types with a comfortable, flattering fit for everyone."
    },
    {
      title: "Durable Prints",
      desc: "High-quality printing that stays vibrant wash after wash."
    },
    {
      title: "All India Shipping",
      desc: "We deliver across India — bringing the spirit of adventure right to your doorstep."
    },
    {
      title: "Soft Fabrics",
      desc: "Premium cotton blends that feel soft from day one and get even better over time."
    },
    {
      title: "Easy 3-Day Returns",
      desc: "Not satisfied? Enjoy hassle-free returns and exchanges within 3 days."
    }
  ];

  return (
    <div style={{ backgroundColor: "#FDFDFD", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* 1. Top Banner Image - Fills page width and height constraint */}
      <div 
        style={{ 
          position: "relative", 
          width: "100%", 
          height: "clamp(300px, 50vw, 570px)", 
          overflow: "hidden" 
        }}
      >
        <img 
          src="/About-us.jpg" 
          alt="About Nomadica Banner" 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            display: "block"
          }} 
        />
      </div>

      {/* Main Section */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        
        {/* 2. Page Title Header */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <h1 
            style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)", 
              fontWeight: 500, 
              color: "#1E1E1E",
              margin: "0 0 0.5rem" 
            }}
          >
            About Nomadica
          </h1>
          <p 
            style={{ 
              fontSize: "1rem", 
              color: "rgba(30,30,30,0.5)", 
              letterSpacing: "0.05em",
              margin: 0
            }}
          >
            Where wanderlust meets timeless design
          </p>
        </div>

        {/* 3. Our Story Section */}
        <div style={{ maxWidth: "800px", margin: "0 auto 6rem", textAlign: "center" }}>
          <h2 
            style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: "2rem", 
              fontWeight: 600, 
              color: "#1E1E1E", 
              marginBottom: "2rem" 
            }}
          >
            Our Story
          </h2>
          <div 
            style={{ 
              fontSize: "0.95rem", 
              color: "rgba(30, 30, 30, 0.72)", 
              lineHeight: 1.9, 
              display: "flex", 
              flexDirection: "column", 
              gap: "1.5rem" 
            }}
          >
            <p>
              Born from a passion for travel and timeless design, Nomadica celebrates the spirit of exploration through premium apparel crafted for modern wanderers.
            </p>
            <p>
              Every piece we create reflects the beauty of destinations, wildlife, and adventures that inspire us to move, explore, and dream beyond borders.
            </p>
            <p>
              We believe in quality over quantity, sustainability over fast fashion, and designs that tell meaningful stories. Our collections are thoughtfully crafted using premium fabrics and high-end printing techniques to ensure they last through countless journeys.
            </p>
            <p style={{ fontStyle: "italic", color: "rgba(30, 30, 30, 0.5)", margin: "0.5rem 0" }}>
              From the romantic streets of Paris to the wild African safaris...<br />
              From the serene mountains of Patagonia to golden coastal sunsets...
            </p>
            <p style={{ fontWeight: 600, color: "#1E1E1E" }}>
              We bring these moments to life — not just as memories, but as wearable art.
            </p>
          </div>
        </div>

        {/* 4. What We Stand For Section */}
        <div style={{ marginBottom: "6rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "2rem", 
                fontWeight: 600, 
                color: "#1E1E1E", 
                margin: "0 0 0.5rem" 
              }}
            >
              What We Stand For
            </h2>
            <p style={{ fontSize: "0.95rem", color: "rgba(30,30,30,0.5)" }}>
              Our values guide everything we create.
            </p>
          </div>

          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: "2.5rem",
              maxWidth: "960px",
              margin: "0 auto" 
            }}
          >
            {standForItems.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "12px",
                  padding: "3rem 2rem",
                  textAlign: "center",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.015)"
                }}
              >
                <div style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
                  {item.icon}
                </div>
                <h3 
                  style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: "1.35rem", 
                    fontWeight: 600, 
                    color: "#1E1E1E", 
                    marginBottom: "1rem" 
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(30,30,30,0.6)", lineHeight: 1.7, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Why Choose Nomadica Section */}
        <div style={{ marginBottom: "6rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "2.25rem", 
                fontWeight: 600, 
                color: "#1E1E1E", 
                margin: 0 
              }}
            >
              Why Choose Nomadica
            </h2>
          </div>

          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
              gap: "2rem 4rem",
              maxWidth: "1000px",
              margin: "0 auto" 
            }}
          >
            {whyChooseItems.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div 
                  style={{ 
                    width: "20px", 
                    height: "20px", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: "#8E7F6A",
                    flexShrink: 0,
                    marginTop: "0.2rem"
                  }}
                >
                  <Check size={16} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E1E1E", margin: "0 0 0.4rem" }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: "0.825rem", color: "rgba(30,30,30,0.6)", lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Join Our Community Banner */}
      <div 
        style={{ 
          backgroundColor: "#3A2E26", 
          padding: "5rem 1.5rem", 
          textAlign: "center", 
          color: "#FFFFFF" 
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h2 
            style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: "clamp(2rem, 4vw, 2.5rem)", 
              fontWeight: 500, 
              marginBottom: "1rem" 
            }}
          >
            Join Our Community
          </h2>
          <p 
            style={{ 
              fontSize: "0.95rem", 
              color: "rgba(255,255,255,0.75)", 
              lineHeight: 1.8, 
              marginBottom: "2.5rem" 
            }}
          >
            Wear your wanderlust. Start your collection today and join thousands of travelers expressing their passion for adventure.
          </p>

          <Link href="/shop" style={{ textDecoration: "none" }}>
            <button
              style={{
                backgroundColor: "#C4B5A0",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "1rem 2.5rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B4E37"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C4B5A0"}
            >
              SHOP THE COLLECTION
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
