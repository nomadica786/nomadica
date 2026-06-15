"use client";
import Link from "next/link";

const Mail = ({ size }: { size: number }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      fontSize: size * 0.9,
    }}
  >
    ✉
  </span>
);

const Instagram = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>📷</span>
);
const Twitter = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>🐦</span>
);
const Facebook = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>📘</span>
);
const Youtube = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>▶</span>
);

const footerLinks = {
  Shop: [
    { label: "New Arrivals", href: "/shop/new-arrivals" },
    { label: "Best Sellers", href: "/shop/best-sellers" },
    { label: "Collections", href: "/shop/collections" },
    { label: "Limited Drops", href: "/shop/limited-drops" },
  ],
  Brand: [
    { label: "About Us", href: "/brand/about" },
    { label: "Our Story", href: "/brand/story" },
    { label: "Journal", href: "/brand/journal" },
    { label: "Sustainability", href: "/brand/sustainability" },
  ],
  Support: [
    { label: "FAQ", href: "/support/faq" },
    { label: "Contact Us", href: "/support/contact" },
    { label: "Shipping Policy", href: "/support/shipping-policy" },
    { label: "Return Policy", href: "/support/return-policy" },
    { label: "Order Tracking", href: "/utility/order-tracking" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/support/privacy-policy" },
    { label: "Terms & Conditions", href: "/support/terms" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1E1E1E",
        color: "#FFFFFF",
        paddingTop: "5rem",
        paddingBottom: "2rem",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "3rem",
            paddingBottom: "4rem",
            borderBottom: "1px solid rgba(255, 255, 255,0.1)",
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 2" }} className="col-span-2 sm:col-span-1">
            <div
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "1.75rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#FFFFFF",
              }}
            >
              NOMADICA
            </div>
            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255,0.55)",
                lineHeight: 1.7,
                maxWidth: "260px",
                marginBottom: "1.5rem",
              }}
            >
              Premium travel lifestyle brand. Designed for those who move through the world with intention.
            </p>

            {/* Newsletter */}
            <div style={{ display: "flex", gap: "0", marginBottom: "1.5rem", maxWidth: "280px" }}>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  background: "rgba(255, 255, 255,0.07)",
                  border: "1px solid rgba(255, 255, 255,0.15)",
                  borderRight: "none",
                  color: "#FFFFFF",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.8125rem",
                  outline: "none",
                }}
              />
              <button
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#1E1E1E",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                }}
              >
                <Mail size={16} />
              </button>
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: "1rem" }}>
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    color: "rgba(255, 255, 255,0.4)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#1E1E1E")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255,0.4)")}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  marginBottom: "1.25rem",
                }}
              >
                {section}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: "'Satoshi', sans-serif",
                        fontSize: "0.875rem",
                        color: "rgba(255, 255, 255,0.5)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255,0.5)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.8125rem",
              color: "rgba(255, 255, 255,0.3)",
            }}
          >
            © 2025 Nomadica. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {["Visa", "Mastercard", "UPI", "Razorpay"].map((method) => (
              <span
                key={method}
                style={{
                  padding: "0.25rem 0.5rem",
                  border: "1px solid rgba(255, 255, 255,0.15)",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.625rem",
                  color: "rgba(255, 255, 255,0.35)",
                  letterSpacing: "0.05em",
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}