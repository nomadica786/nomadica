"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search, ShoppingBag, User, Heart, Menu, X, ChevronDown,
} from "lucide-react";

const navLinks = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "New Arrivals", href: "/shop/new-arrivals" },
      { label: "Best Sellers", href: "/shop/best-sellers" },
      { label: "Collections", href: "/shop/collections" },
      { label: "Limited Drops", href: "/shop/limited-drops" },
    ],
  },
  {
    label: "Brand",
    href: "/brand",
    children: [
      { label: "About Us", href: "/brand/about" },
      { label: "Our Story", href: "/brand/story" },
      { label: "Journal", href: "/brand/journal" },
      { label: "Sustainability", href: "/brand/sustainability" },
    ],
  },
  { label: "Support", href: "/support/faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? "rgba(247, 244, 238, 0.95)" : "#F7F4EE",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(30,30,30,0.08)" : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "1.375rem",
              fontWeight: 600,
              color: "#1E1E1E",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              flexShrink: 0,
            }}
          >
            NOMADICA
          </Link>

          {/* Desktop Nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2.5rem",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <div
                key={link.label}
                style={{ position: "relative" }}
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: pathname.startsWith(link.href) ? "#7A5C3E" : "#1E1E1E",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0.5rem 0",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} />}
                </Link>

                {link.children && openDropdown === link.label && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#F7F4EE",
                      border: "1px solid rgba(30,30,30,0.1)",
                      minWidth: "180px",
                      padding: "0.5rem 0",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                      animation: "fade-up 0.2s ease",
                    }}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        style={{
                          display: "block",
                          padding: "0.625rem 1.25rem",
                          fontFamily: "'Satoshi', sans-serif",
                          fontSize: "0.875rem",
                          color: "#1E1E1E",
                          textDecoration: "none",
                          transition: "background 0.15s ease, color 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = "rgba(122, 92, 62, 0.08)";
                          (e.target as HTMLElement).style.color = "#7A5C3E";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = "transparent";
                          (e.target as HTMLElement).style.color = "#1E1E1E";
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/shop/search" style={{ color: "#1E1E1E", display: "flex" }}>
              <Search size={20} />
            </Link>
            <Link href="/account/wishlist" style={{ color: "#1E1E1E", display: "flex" }} className="hidden sm:flex">
              <Heart size={20} />
            </Link>
            <Link href="/account/login" style={{ color: "#1E1E1E", display: "flex" }} className="hidden sm:flex">
              <User size={20} />
            </Link>
            <button
              style={{
                position: "relative",
                color: "#1E1E1E",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <ShoppingBag size={20} />
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#7A5C3E",
                  color: "#fff",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 600,
                }}
              >
                0
              </span>
            </button>

            {/* Burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#1E1E1E",
                display: "flex",
                padding: "4px",
              }}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          backgroundColor: "#F7F4EE",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
          paddingTop: "64px",
        }}
        className="md:hidden"
      >
        <div style={{ padding: "2rem 1.5rem" }}>
          {navLinks.map((link) => (
            <div key={link.label} style={{ borderBottom: "1px solid rgba(30,30,30,0.08)" }}>
              {link.children ? (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.125rem 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: "1.375rem",
                      fontWeight: 500,
                      color: "#1E1E1E",
                      textAlign: "left",
                    }}
                  >
                    {link.label}
                    <ChevronDown
                      size={18}
                      style={{
                        transform: mobileExpanded === link.label ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>
                  {mobileExpanded === link.label && (
                    <div style={{ paddingBottom: "1rem" }}>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "0.625rem 1rem",
                            fontFamily: "'Satoshi', sans-serif",
                            fontSize: "0.9375rem",
                            color: "#7A5C3E",
                            textDecoration: "none",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "1.125rem 0",
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: "1.375rem",
                    fontWeight: 500,
                    color: "#1E1E1E",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}

          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/account/login" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Sign In
              </button>
            </Link>
            <Link href="/account/signup" style={{ textDecoration: "none" }}>
              <button className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                Create Account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}