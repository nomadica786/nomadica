"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search, ShoppingBag, User, Heart, Menu, X, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/utils/hooks/useAuth";
import { api } from "@/components/api/api";

const navLinks = [
  { label: "Home", href: "/" },
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
  { label: "Blogs", href: "/journal" },
  { label: "Stories", href: "/brand/story" },
  {
    label: "Brand",
    href: "/brand",
    children: [
      { label: "About Us", href: "/brand/about" },
      { label: "Our Story", href: "/brand/story" },
      { label: "Journal", href: "/journal" },
      { label: "Sustainability", href: "/brand/sustainability" },
    ],
  },
  { label: "Support", href: "/support/faq" },
];

const dropdownItemStyle = {
  display: "block",
  padding: "0.625rem 1.25rem",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: "0.8125rem",
  color: "#1E1E1E",
  textDecoration: "none",
  transition: "background 0.15s ease, color 0.15s ease",
};

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  // Cart Drawer State
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<any>(null);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    const cartId = typeof window !== "undefined" ? localStorage.getItem("nomadica_cart_id") : null;
    if (!cartId) {
      setCart(null);
      console.log("[NAVBAR] No cart ID in localStorage");
      return;
    }
    console.log(`[NAVBAR] Fetching cart: ${cartId}`);
    setCartLoading(true);
    try {
      const res = await api.cart.get(cartId);
      console.log(`[NAVBAR] ✅ Cart fetched:`, res.cart);
      setCart(res.cart);
    } catch (err) {
      console.error("[NAVBAR] Failed to fetch cart:", err);
    } finally {
      setCartLoading(false);
    }
  };

  const handleUpdateQuantity = async (lineId: string, quantity: number, merchandiseId: string) => {
    const cartId = localStorage.getItem("nomadica_cart_id");
    if (!cartId) return;

    try {
      await api.cart.update(cartId, {
        lines: [{ id: lineId, quantity, merchandiseId }]
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
    }
  };

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
    document.body.style.overflow = (mobileOpen || cartOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, cartOpen]);

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = (e: any) => {
      console.log("[NAVBAR] 🔔 cart-updated event received:", e.detail);
      fetchCart();
      if (e.detail?.openDrawer !== false) {
        console.log("[NAVBAR] Opening cart drawer...");
        setCartOpen(true);
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const totalItems = cart?.lines?.edges?.reduce((acc: number, edge: any) => acc + edge.node.quantity, 0) || 0;
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase() : "T";

  // Debug: Log cart structure with FULL detail
  if (cart && cart.lines) {
    const edges = cart.lines.edges || [];
    console.log("[NAVBAR DEBUG] Cart edges array:", {
      edgesCount: edges.length,
      edgesArray: edges,
      edgesMap: edges.map((e: any, i: number) => ({
        index: i,
        keys: Object.keys(e),
        edgeNode: e.node,
        nodeKeys: e.node ? Object.keys(e.node) : 'NO NODE',
        quantity: e.node?.quantity,
        title: e.node?.title || e.node?.merchandise?.title
      }))
    });
    console.log("[NAVBAR DEBUG] Reduce calculation:", {
      initialEdges: edges,
      reduceResult: edges.reduce((acc: number, edge: any) => {
        const qty = edge.node?.quantity || 0;
        console.log(`  Adding edge: quantity=${qty}`);
        return acc + qty;
      }, 0),
      totalItemsCalculated: totalItems
    });
  }

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "#FFFFFF",
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
              fontFamily: "'Playfair Display', sans-serif",
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
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: pathname.startsWith(link.href) ? "#1E1E1E" : "#1E1E1E",
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
                      backgroundColor: "#FFFFFF",
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
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.875rem",
                          color: "#1E1E1E",
                          textDecoration: "none",
                          transition: "background 0.15s ease, color 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = "rgba(122, 92, 62, 0.08)";
                          (e.target as HTMLElement).style.color = "#1E1E1E";
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
            <Link href="/account/wishlist" style={{ color: "#1E1E1E" }} className="hidden sm:flex">
              <Heart size={20} />
            </Link>

            {/* Profile Avatar / Login Icon */}
            {isAuthenticated ? (
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setOpenDropdown("user")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href="/account/profile"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#1E1E1E",
                    color: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display', sans-serif",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                  className="hidden sm:flex"
                >
                  {userInitials}
                </Link>
                {openDropdown === "user" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid rgba(30,30,30,0.1)",
                      minWidth: "150px",
                      padding: "0.5rem 0",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                      animation: "fade-up 0.2s ease",
                      zIndex: 1001,
                    }}
                  >
                    <Link
                      href="/account/profile?tab=overview"
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(122, 92, 62, 0.08)"; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}
                    >
                      Profile Hub
                    </Link>
                    <Link
                      href="/account/profile?tab=orders"
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(122, 92, 62, 0.08)"; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/account/profile?tab=wishlist"
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(122, 92, 62, 0.08)"; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}
                    >
                      My Wishlist
                    </Link>
                    <button
                      onClick={logout}
                      style={{
                        ...dropdownItemStyle,
                        width: "100%",
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        color: "rgba(180,60,60,0.8)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(180, 60, 60, 0.08)"; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/account/login" style={{ color: "#1E1E1E" }} className="hidden sm:flex">
                <User size={20} />
              </Link>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={() => setCartOpen(true)}
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
                  backgroundColor: "#1E1E1E",
                  color: "#fff",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                }}
              >
                {totalItems}
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
                padding: "4px",
              }}
              className="md:hidden flex"
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
          backgroundColor: "#FFFFFF",
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
                      fontFamily: "'Playfair Display', sans-serif",
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
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.9375rem",
                            color: "#1E1E1E",
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
                    fontFamily: "'Playfair Display', sans-serif",
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
            {isAuthenticated ? (
              <>
                <Link href="/account/profile" style={{ textDecoration: "none" }}>
                  <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Profile Hub
                  </button>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="btn-outline"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer Overlay */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            animation: "fade-in 0.2s ease",
          }}
        />
      )}

      {/* Cart Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "#FFFFFF",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
          zIndex: 2001,
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid rgba(30,30,30,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1E1E", margin: 0 }}>
            Shopping Bag ({totalItems})
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#1E1E1E", padding: "4px" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {cartLoading && !cart ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", color: "rgba(30, 30, 30, 0.5)" }}>Loading bag...</span>
            </div>
          ) : !cart || cart.lines?.edges?.length === 0 ? (
            <>
              {console.log("[NAVBAR RENDER] Cart empty state:", { cart: !!cart, itemCount: cart?.lines?.edges?.length || 0 })}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center" }}>
                <ShoppingBag size={48} style={{ color: "rgba(30,30,30,0.2)", marginBottom: "1rem" }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.9375rem", fontWeight: 500, color: "#1E1E1E", margin: "0 0 1.5rem" }}>
                  Your shopping bag is empty.
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="btn-primary"
                  style={{ fontSize: "0.8125rem", padding: "0.75rem 1.5rem" }}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          ) : (
            <>
              {console.log("[NAVBAR RENDER] Cart with items:", { itemCount: cart.lines?.edges?.length })}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {cart.lines.edges.map((edge: any) => {
                const line = edge.node;
                const price = parseFloat(line.merchandise?.price?.amount || "0");
                const title = line.merchandise?.product?.title || "Product";
                const size = line.merchandise?.title || "Default";
                const image = line.merchandise?.product?.images?.edges?.[0]?.node?.url || line.merchandise?.image || "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=300&q=80";

                return (
                  <div key={line.id} style={{ display: "flex", gap: "1rem", borderBottom: "1px solid rgba(30,30,30,0.05)", paddingBottom: "1.5rem" }}>
                    <div style={{ width: "80px", aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#FFFFFF", flexShrink: 0 }}>
                      <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#1E1E1E", margin: "0 0 0.25rem" }}>{title}</h4>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.5)", margin: "0 0 0.5rem" }}>Size: {size}</p>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1E1E1E", margin: 0 }}>₹{price.toLocaleString("en-IN")}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(30,30,30,0.15)" }}>
                          <button
                            onClick={() => handleUpdateQuantity(line.id, Math.max(0, line.quantity - 1), line.merchandise.id)}
                            style={{ width: "28px", height: "28px", border: "none", background: "none", cursor: "pointer", color: "#1E1E1E" }}
                          >
                            −
                          </button>
                          <span style={{ width: "28px", textAlign: "center", fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 500 }}>
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity + 1, line.merchandise.id)}
                            style={{ width: "28px", height: "28px", border: "none", background: "none", cursor: "pointer", color: "#1E1E1E" }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleUpdateQuantity(line.id, 0, line.merchandise.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(180,60,60,0.8)", textDecoration: "underline" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {cart && cart.lines?.edges?.length > 0 && (
          <div
            style={{
              padding: "1.5rem",
              borderTop: "1px solid rgba(30,30,30,0.08)",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", color: "rgba(30, 30, 30, 0.6)" }}>Subtotal</span>
              <span style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#1E1E1E" }}>
                ₹{parseFloat(cart.cost?.subtotalAmount?.amount || "0").toLocaleString("en-IN")}
              </span>
            </div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(30, 30, 30, 0.45)", margin: "0 0 1.5rem" }}>
              Shipping and taxes calculated at checkout.
            </p>
            <Link href={`/checkout?cartId=${cart.id}`} onClick={() => setCartOpen(false)} style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", height: "48px" }}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}