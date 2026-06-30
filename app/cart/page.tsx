// app/cart/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Heart, ArrowLeft, Shield, RotateCcw, Truck, ShoppingBag, X } from "lucide-react";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import Image from "next/image";
import { getShopifyImageUrl } from "@/lib/images/shopifyImage";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0); // in percentage
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const fetchCart = async () => {
    const cartId = typeof window !== "undefined" ? localStorage.getItem("nomadica_cart_id") : null;
    if (!cartId) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.cart.get(cartId);
      setCart(res.cart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (lineId: string, quantity: number, merchandiseId: string) => {
    const cartId = localStorage.getItem("nomadica_cart_id");
    if (!cartId) return;
    try {
      await api.cart.update(cartId, {
        lines: [{ id: lineId, quantity, merchandiseId }]
      });
      fetchCart();
      // Notify other components
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
    }
  };

  const handleMoveToWishlist = async (productId: string, lineId: string, merchandiseId: string) => {
    try {
      // Add to wishlist
      await api.wishlist.add(productId);
      // Remove from cart
      await handleUpdateQuantity(lineId, 0, merchandiseId);
      alert("Item moved to Wishlist!");
    } catch (err) {
      console.error("Failed to move item to wishlist:", err);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      setCouponDiscount(10);
      setCouponApplied(true);
    } else if (code === "EXPLORE20") {
      setCouponDiscount(20);
      setCouponApplied(true);
    } else if (code === "") {
      setCouponError("Please enter a coupon code");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
  };

  // Helper to determine original compare prices
  const getComparePrice = (price: number) => {
    // If the price is 1797 (which is three 599 tees), original was 2997
    if (price === 1797) return 2997;
    // If price is 599, original was 999
    if (price === 599) return 999;
    // Otherwise, generate a nice compare price (e.g. price * 1.5)
    return Math.round((price * 1.5) / 10) * 10 - 3;
  };

  if (loading) {
    return <PageLoader />;
  }

  const items = cart?.lines?.edges || [];
  const totalItems = items.reduce((acc: number, edge: any) => acc + edge.node.quantity, 0) || 0;

  // Compute pricing
  let subtotalMRP = 0;
  let currentSubtotal = 0;

  items.forEach((edge: any) => {
    const line = edge.node;
    const qty = line.quantity;
    const price = parseFloat(line.merchandise?.price?.amount || "0");
    const originalPrice = getComparePrice(price);
    
    subtotalMRP += originalPrice * qty;
    currentSubtotal += price * qty;
  });

  const totalSavings = subtotalMRP - currentSubtotal;
  const couponSavings = Math.round((currentSubtotal * couponDiscount) / 100);
  const finalSavings = totalSavings + couponSavings;
  const totalAmount = currentSubtotal - couponSavings;

  return (
    <div style={{ paddingTop: "0px", backgroundColor: "#F5F5F0", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        {/* Title */}
        <h1 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "clamp(2rem, 3.5vw, 2.5rem)", 
            fontWeight: 600, 
            color: "#1E1E1E",
            marginBottom: "2.5rem" 
          }}
        >
          Shopping Cart <span style={{ fontSize: "1.15rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 400, color: "rgba(30,30,30,0.5)", marginLeft: "0.5rem" }}>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
        </h1>

        {items.length === 0 ? (
          <div 
            style={{ 
              textAlign: "center", 
              width: "40%",
              height: "40vh",
              margin: "auto",
              padding: "5rem 1.5rem",
              borderRadius: "8px" 
            }}
          >
            <ShoppingBag size={60} style={{ color: "rgba(0,0,0,0.15)", marginBottom: "0.5rem"}} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: "#1E1E1E", marginBottom: "0.5rem" }}>
              Your Travel Bag is Empty
              </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 400, color: "rgba(30,30,30,0.5)", marginLeft: "0.5rem", marginBottom: "1rem" }}>
            Start your adventure by adding some travel-inspired pieces to your cart.
            </p>
            <Link href="/shop" style={{ textDecoration: "none" }}>
              <button
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c4a77dd6"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C4A77D"}
                style={{
                  backgroundColor: "#C4A77D",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.85rem 2rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Explore Collection
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "2.5rem" }} className="lg:grid-cols-[1fr_420px] grid-cols-1">
            
            {/* Left Column: Items List */}
            <div>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {items.map((edge: any) => {
                  const line = edge.node;
                  const price = parseFloat(line.merchandise?.price?.amount || "0");
                  const originalPrice = getComparePrice(price);
                  const title = line.merchandise?.product?.title || "Product";
                  const image = line.merchandise?.product?.images?.edges?.[0]?.node?.url || line.merchandise?.image || "";
                  const productId = line.merchandise?.product?.id || "";

                  // Parse size and color
                  let size = "Default";
                  let color = "Default";
                  const variantTitle = line.merchandise?.title || "";
                  if (variantTitle && variantTitle !== "Default Title") {
                    const parts = variantTitle.split("/").map((p: string) => p.trim());
                    if (parts.length >= 1) size = parts[0];
                    if (parts.length >= 2) color = parts[1];
                  }

                  return (
                    <div 
                      key={line.id}
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid rgba(0,0,0,0.06)",
                        borderRadius: "8px",
                        padding: "1.5rem",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.01)",
                        flexWrap: "wrap"
                      }}
                    >
                      {/* Image */}
                      <div 
                        style={{
                          position: "relative",
                          width: "120px",
                          aspectRatio: "3/4",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: "#F9F9F9",
                          border: "1px solid rgba(0,0,0,0.03)"
                        }}
                      >
                        <Image
                          src={getShopifyImageUrl(image, 240)}
                          alt={title}
                          fill
                          sizes="120px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      {/* Item Details */}
                      <div style={{ flex: 1, minWidth: "240px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                            <h3 
                              style={{ 
                                fontFamily: "'Playfair Display', serif", 
                                fontSize: "1.25rem", 
                                fontWeight: 600, 
                                color: "#1E1E1E",
                                margin: 0 
                              }}
                            >
                              {title}
                            </h3>
                            <div style={{ textAlign: "right" }}>
                              <span 
                                style={{ 
                                  fontFamily: "'Playfair Display', serif", 
                                  fontSize: "1.2rem", 
                                  fontWeight: 600, 
                                  color: "#1E1E1E" 
                                }}
                              >
                                ₹{(price * line.quantity).toLocaleString("en-IN")}
                              </span>
                              {originalPrice > price && (
                                <span 
                                  style={{ 
                                    fontFamily: "'Montserrat', sans-serif", 
                                    fontSize: "0.85rem", 
                                    color: "rgba(30,30,30,0.35)", 
                                    textDecoration: "line-through",
                                    marginLeft: "0.5rem" 
                                  }}
                                >
                                  ₹{(originalPrice * line.quantity).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.5)", margin: "0 0 1rem" }}>
                            Size: <span style={{ fontWeight: 500, color: "#1E1E1E" }}>{size}</span> &nbsp;·&nbsp; Color: <span style={{ fontWeight: 500, color: "#1E1E1E" }}>{color}</span>
                          </p>

                          {/* Quantity Selector */}
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(30,30,30,0.15)", borderRadius: "4px", width: "fit-content", marginBottom: "1rem" }}>
                            <button
                              onClick={() => handleUpdateQuantity(line.id, Math.max(1, line.quantity - 1), line.merchandise.id)}
                              style={{ width: "32px", height: "32px", border: "none", background: "none", cursor: "pointer", color: "#1E1E1E", fontWeight: 600 }}
                            >
                              −
                            </button>
                            <span style={{ width: "36px", textAlign: "center", fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>
                              {line.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(line.id, line.quantity + 1, line.merchandise.id)}
                              style={{ width: "32px", height: "32px", border: "none", background: "none", cursor: "pointer", color: "#1E1E1E", fontWeight: 600 }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: "1.5rem", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "1rem" }}>
                          <button
                            onClick={() => handleMoveToWishlist(productId, line.id, line.merchandise.id)}
                            style={{
                              background: "none",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              color: "rgba(30,30,30,0.5)",
                              cursor: "pointer",
                              padding: 0,
                              transition: "color 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#1E1E1E"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(30,30,30,0.5)"}
                          >
                            <Heart size={14} />
                            Move to Wishlist
                          </button>
                          <span style={{ color: "rgba(0,0,0,0.1)" }}>|</span>
                          <button
                            onClick={() => handleUpdateQuantity(line.id, 0, line.merchandise.id)}
                            style={{
                              background: "none",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              color: "rgba(30,30,30,0.5)",
                              cursor: "pointer",
                              padding: 0,
                              transition: "color 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#DC2626"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(30,30,30,0.5)"}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping */}
              <div style={{ marginTop: "2rem" }}>
                <Link 
                  href="/shop" 
                  style={{ 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "0.5rem", 
                    fontFamily: "'Montserrat', sans-serif", 
                    fontSize: "0.9rem", 
                    color: "#1E1E1E", 
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div>
              <div 
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(30,30,30,0.06)",
                  borderRadius: "8px",
                  padding: "2.5rem 2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
                  position: "sticky",
                  top: "100px"
                }}
              >
                <h2 
                  style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: "1.35rem", 
                    fontWeight: 600, 
                    color: "#1E1E1E",
                    margin: "0 0 1.5rem"
                  }}
                >
                  Order Summary
                </h2>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem" }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    style={{
                      flex: 1,
                      padding: "0.65rem 1rem",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.85rem",
                      textTransform: "uppercase"
                    }}
                  />
                  {couponApplied ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      style={{
                        backgroundColor: "#FEF2F2",
                        color: "#DC2626",
                        border: "1px solid rgba(220,38,38,0.2)",
                        borderRadius: "4px",
                        padding: "0.65rem 1rem",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem"
                      }}
                    >
                      <X size={14} />
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#FFFFFF",
                        color: "#1E1E1E",
                        border: "1px solid #C4B5A0",
                        borderRadius: "4px",
                        padding: "0.65rem 1.25rem",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(196,181,160,0.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FFFFFF"}
                    >
                      Apply
                    </button>
                  )}
                </form>
                {couponError && (
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "#DC2626", marginTop: "-1.25rem", marginBottom: "1rem" }}>
                    {couponError}
                  </p>
                )}
                {couponApplied && (
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "#16A34A", marginTop: "-1.25rem", marginBottom: "1rem", fontWeight: 500 }}>
                    Coupon applied! {couponDiscount}% savings on subtotal.
                  </p>
                )}

                {/* Subtotal list */}
                <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.6)" }}>
                      Subtotal (MRP)
                    </span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#1E1E1E" }}>
                      ₹{subtotalMRP.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.6)" }}>
                      Total Savings
                    </span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#16A34A" }}>
                      -₹{finalSavings.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.6)", display: "block" }}>
                        Shipping
                      </span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "rgba(30,30,30,0.4)", display: "block", marginTop: "0.15rem" }}>
                        Free Shipping on all orders
                      </span>
                    </div>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#16A34A" }}>
                      Free
                    </span>
                  </div>
                </div>

                <div style={{ height: "1px", backgroundColor: "rgba(0,0,0,0.08)", marginBottom: "1.5rem" }} />

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "#1E1E1E" }}>
                    Total Amount
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.65rem", fontWeight: 700, color: "#1E1E1E" }}>
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Savings highlight badge */}
                {finalSavings > 0 && (
                  <div 
                    style={{ 
                      backgroundColor: "#F0FDF4", 
                      borderRadius: "6px", 
                      padding: "0.6rem 1rem", 
                      textAlign: "center",
                      marginBottom: "1.5rem" 
                    }}
                  >
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#16A34A" }}>
                      You saved ₹{finalSavings.toLocaleString("en-IN")} on this order 🥳
                    </span>
                  </div>
                )}

                {/* Secure Checkout Button */}
                <Link href={`/checkout?cartId=${cart.id}`} style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      width: "100%",
                      backgroundColor: "#C4B5A0",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "4px",
                      padding: "1rem 1.5rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(196,181,160,0.25)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "background-color 0.2s, transform 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#6B4E37";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#C4B5A0";
                    }}
                  >
                    SECURE CHECKOUT →
                  </button>
                </Link>

                {/* Trust badges */}
                <div style={{ display: "grid", gap: "0.75rem", marginTop: "2rem" }}>
                  {[
                    { icon: Shield, label: "100% Secure Payments" },
                    { icon: RotateCcw, label: "7-Day Easy Returns" },
                    { icon: Truck, label: "Free Shipping Across India" }
                  ].map((badge, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <badge.icon size={16} style={{ color: "#16A34A" }} />
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 500, color: "rgba(30,30,30,0.6)" }}>
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
