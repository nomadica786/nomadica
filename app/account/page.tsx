"use client";

import Link from "next/link";

export default function AccountPage() {
  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "1rem" }}>
            Account
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", margin: 0, color: "#1E1E1E", marginBottom: "1.5rem" }}>
            Your account hub.
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(30,30,30,0.72)", marginBottom: "2.5rem" }}>
            Access your profile, orders, wish list, and account settings all from one place.
          </p>

          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              { label: "Sign In", href: "/account/login", description: "Return to your account and manage orders.", accent: true },
              { label: "Create Account", href: "/account/signup", description: "Join Nomadica and save your favorites.", accent: false },
              { label: "Profile", href: "/account/profile", description: "View your orders, wishlist and saved addresses.", accent: false },
              { label: "Wishlist", href: "/account/wishlist", description: "Browse the pieces you want to own next.", accent: false },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "block",
                  borderRadius: "24px",
                  padding: "2rem",
                  textDecoration: "none",
                  backgroundColor: item.accent ? "#1E1E1E" : "#fff",
                  color: item.accent ? "#FFFFFF" : "#1E1E1E",
                  border: item.accent ? "none" : "1px solid rgba(30,30,30,0.08)",
                  boxShadow: "0 12px 32px rgba(30,30,30,0.06)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <h2 style={{ margin: 0, fontFamily: "'Playfair Display', sans-serif", fontSize: "1.25rem", marginBottom: "0.75rem" }}>{item.label}</h2>
                <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: item.accent ? "rgba(255, 255, 255,0.88)" : "rgba(30,30,30,0.72)" }}>
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
