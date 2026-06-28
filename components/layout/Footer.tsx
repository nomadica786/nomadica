// components/layout/Footer.tsx
"use client";
import Link from "next/link";

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const MailIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function Footer() {
  const collectionsLinks = [
    { label: "Destination", href: "/collections/destination-collection" },
    { label: "Wildlife & Safari", href: "/collections/wildlife-and-safari" },
    { label: "Adventure & Trekking", href: "/collections/adventure-and-trekking-collections" },
    { label: "Travel Quotes", href: "/collections/travel-quotes" },
    { label: "Beach Vibes", href: "/collections/beach-vibes" },
  ];

  const customerServiceLinks = [
    { label: "Contact Us", href: "/support/contact" },
    { label: "Shipping Policy", href: "/support/shipping-policy" },
    { label: "Returns & Exchanges", href: "/support/return-policy" },
    { label: "Privacy Policy", href: "/support/privacy-policy" },
    { label: "Terms and Conditions", href: "/support/terms" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#2E2E2E",
        color: "#FFFFFF",
        paddingTop: "4rem",
        paddingBottom: "2rem",
        fontFamily: "'Montserrat', sans-serif"
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
        
        {/* Main Grid Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "3rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Column 1: Brand Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "block" }}>
              <img 
                src="/Dark-Nomadica-Log.jpg" 
                alt="Nomadica" 
                style={{ 
                  height: "70px", 
                  width: "auto", 
                  display: "block",
                  objectFit: "contain"
                }} 
              />
            </div>
            
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: "1.7",
                margin: 0,
                maxWidth: "320px",
              }}
            >
              Wear your wanderlust. Premium travel-inspired apparel for the modern explorer.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.25rem" }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#FFFFFF",
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#FFFFFF",
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="mailto:support@nomadica.com"
                style={{
                  color: "#FFFFFF",
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <MailIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                marginBottom: "1.5rem",
              }}
            >
              COLLECTIONS
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {collectionsLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255, 0.7)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service Links */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                marginBottom: "1.5rem",
              }}
            >
              CUSTOMER SERVICE
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {customerServiceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255, 0.7)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div
          style={{
            paddingTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(255, 255, 255, 0.5)",
              margin: 0,
            }}
          >
            © 2026 Nomadica. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}