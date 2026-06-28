// app/order-tracking/page.tsx
"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageLoader } from "@/components/ui/PageLoader";
import { api } from "@/components/api/api";
import { 
  Truck, Calendar, DollarSign, Package, Check, 
  MapPin, ArrowLeft, Info, HelpCircle
} from "lucide-react";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/utils/mockData";
import { getShopifyImageUrl } from "@/lib/images/shopifyImage";

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if params exist in URL on mount
  useEffect(() => {
    const queryOrder = searchParams.get("order");
    const queryEmail = searchParams.get("email");

    if (queryOrder && queryEmail) {
      setOrderNumber(queryOrder);
      setEmail(queryEmail);
      triggerSearch(queryOrder, queryEmail);
    }
  }, [searchParams]);

  const triggerSearch = async (ordNum: string, mailAddr: string) => {
    setIsSearching(true);
    setErrorMsg("");
    setTrackingInfo(null);
    setHasSearched(true);
    
    try {
      const data = await api.orders.track(ordNum.trim(), mailAddr.trim());
      if (data && data.order) {
        setTrackingInfo(data.order);
      } else {
        setErrorMsg("Order not found. Please double-check details.");
      }
    } catch (err) {
      console.error("Tracking query failed:", err);
      setErrorMsg("Order not found. Please check order number (e.g. NMD-2047) and email.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(orderNumber, email);
  };

  const getFulfillmentLabel = (status: string, fulfillmentStatus: string) => {
    const upperStatus = (status || "").toUpperCase();
    const upperFulfillment = (fulfillmentStatus || "").toUpperCase();
    
    if (upperStatus === "DELIVERED" || upperFulfillment === "FULFILLED") {
      return "Delivered";
    }
    if (upperStatus === "SHIPPED" || upperStatus === "IN TRANSIT" || upperStatus === "IN_TRANSIT") {
      return "In Transit";
    }
    if (upperStatus === "CANCELLED" || upperStatus === "RESTOCKED") {
      return "Cancelled";
    }
    if (upperStatus === "PENDING COD" || upperStatus === "PENDING") {
      return "Payment Pending (COD)";
    }
    return "Processing";
  };

  return (
    <div style={{ paddingTop: "80px", backgroundColor: "#FDFDFD", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "2rem" }}>
          <Link 
            href="/account/orders" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "0.85rem", 
              color: "rgba(30, 30, 30, 0.5)", 
              textDecoration: "none",
              fontWeight: 500
            }}
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>

        <h1 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "clamp(2rem, 3.5vw, 2.5rem)", 
            fontWeight: 600, 
            color: "#1E1E1E",
            marginBottom: "2.5rem" 
          }}
        >
          Track Shipment
        </h1>

        {/* Tracking Input Form */}
        <div 
          style={{ 
            backgroundColor: "#FFFFFF", 
            padding: trackingInfo ? "1.5rem" : "2.5rem 2rem", 
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.01)",
            marginBottom: "2.5rem"
          }}
        >
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#1E1E1E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Order Number</label>
              <input
                type="text"
                placeholder="e.g. NMD-2047"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "4px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.85rem"
                }}
              />
            </div>
            
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#1E1E1E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Email Address</label>
              <input
                type="email"
                placeholder="e.g. arjun.mehta@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "4px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.85rem"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              style={{
                backgroundColor: "#C4B5A0",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "0.65rem 2rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                height: "38px",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B4E37"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C4B5A0"}
            >
              {isSearching ? "Tracking..." : "Track"}
            </button>
          </form>

          {errorMsg && (
            <p style={{ color: "#DC2626", fontSize: "0.8rem", fontFamily: "'Montserrat', sans-serif", margin: "1rem 0 0", fontWeight: 500 }}>
              {errorMsg}
            </p>
          )}
        </div>

        {isSearching && <PageLoader />}

        {/* Detailed Tracking Status Info */}
        {!isSearching && trackingInfo && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem" }} className="lg:grid-cols-[1fr_340px] grid-cols-1">
            
            {/* Left Column: Shipment Status details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              
              {/* Card 1: Order Status Header */}
              <div 
                style={{ 
                  backgroundColor: "#FFFFFF", 
                  border: "1px solid rgba(0,0,0,0.06)", 
                  borderRadius: "8px", 
                  padding: "2.5rem 2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.01)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "rgba(30,30,30,0.45)", letterSpacing: "0.08em", display: "block", textTransform: "uppercase" }}>Order Status</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "#1E1E1E", marginTop: "0.25rem", display: "block" }}>
                      {getFulfillmentLabel(trackingInfo.status, trackingInfo.fulfillmentStatus)}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.45)", display: "block" }}>Order Placed</span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#1E1E1E", display: "block", marginTop: "0.15rem" }}>
                      {new Date(trackingInfo.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Real-time Tracking Info from Shopify if present */}
                {trackingInfo.trackingInfo && (
                  <div 
                    style={{ 
                      marginTop: "2rem",
                      padding: "1.25rem",
                      backgroundColor: "rgba(196,181,160,0.08)",
                      border: "1px solid rgba(196,181,160,0.25)",
                      borderRadius: "6px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem"
                    }}
                  >
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#6B4E37", textTransform: "uppercase", letterSpacing: "0.05em" }}>Fulfillment tracking details</span>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "#1E1E1E" }}>
                      <strong>Courier Partner:</strong> {trackingInfo.trackingInfo.company || "Shopify Shipping Partner"}<br />
                      <strong>AWB Number:</strong> {trackingInfo.trackingInfo.number}
                    </div>
                    {trackingInfo.trackingInfo.url && (
                      <a 
                        href={trackingInfo.trackingInfo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#6B4E37",
                          textDecoration: "underline",
                          marginTop: "0.25rem",
                          display: "inline-block"
                        }}
                      >
                        Track shipment on carrier website →
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Card 2: Items in this Shipment */}
              <div 
                style={{ 
                  backgroundColor: "#FFFFFF", 
                  border: "1px solid rgba(0,0,0,0.06)", 
                  borderRadius: "8px", 
                  padding: "2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.01)"
                }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "#1E1E1E", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                  Items in Shipment
                </h3>

                <div style={{ display: "grid", gap: "1.5rem" }}>
                  {trackingInfo.lineItems?.edges?.map((edge: any) => {
                    const item = edge.node;
                    const title = item.title || "Product";
                    
                    const foundProd = MOCK_PRODUCTS.find(p => p.name.toLowerCase() === title.toLowerCase());
                    const liveImage = item.variant?.image?.url || item.image || "";
                    const itemImage = liveImage || foundProd?.image || "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=300&q=80";
                    const price = parseFloat(item.variant?.price?.amount || item.price || "599");

                    let size = "";
                    let color = "";
                    const variantTitle = item.variant?.title || "";
                    if (variantTitle && variantTitle !== "Default Title") {
                      const parts = variantTitle.split("/").map((p: string) => p.trim());
                      if (parts.length >= 1) size = parts[0];
                      if (parts.length >= 2) color = parts[1];
                    } else if (foundProd) {
                      size = foundProd.sizes[0] || "";
                      color = foundProd.colors[0] || "";
                    }

                    return (
                      <div key={item.id} style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                        <div 
                          style={{ 
                            position: "relative",
                            width: "70px", 
                            aspectRatio: "3/4", 
                            overflow: "hidden", 
                            borderRadius: "4px",
                            backgroundColor: "#F9F9F9",
                            flexShrink: 0
                          }}
                        >
                          <Image
                            src={getShopifyImageUrl(itemImage, 150)}
                            alt={title}
                            fill
                            sizes="70px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ flex: 1, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                          <div>
                            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "#1E1E1E", margin: "0 0 0.25rem" }}>{title}</h4>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.5)", margin: 0 }}>
                              {size && `Size: ${size}`} {size && color && `\u00A0·\u00A0`} {color && `Color: ${color}`} { (size || color) && `\u00A0·\u00A0` } Qty: {item.quantity}
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#1E1E1E" }}>
                              ₹{(price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Address & Pricing Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Shipping Address - ONLY RENDER IF shippingAddress EXISTS */}
              {trackingInfo.shippingAddress && (
                <div 
                  style={{ 
                    backgroundColor: "#FFFFFF", 
                    border: "1px solid rgba(0,0,0,0.06)", 
                    borderRadius: "8px", 
                    padding: "2rem",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                    <MapPin size={18} style={{ color: "#C4B5A0" }} />
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 600, color: "#1E1E1E", margin: 0 }}>
                      Delivery Address
                    </h3>
                  </div>
                  
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "1rem" }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#1E1E1E", margin: "0 0 0.5rem" }}>
                      {trackingInfo.shippingAddress.firstName} {trackingInfo.shippingAddress.lastName}
                    </p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(30, 30, 30, 0.65)", lineHeight: 1.6, margin: 0 }}>
                      {trackingInfo.shippingAddress.address1}
                      {trackingInfo.shippingAddress.address2 && <><br />{trackingInfo.shippingAddress.address2}</>}
                      <br />{trackingInfo.shippingAddress.city}, {trackingInfo.shippingAddress.province || trackingInfo.shippingAddress.state || ""} {trackingInfo.shippingAddress.zip}
                      <br />{trackingInfo.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}

              {/* Pricing details card */}
              <div 
                style={{ 
                  backgroundColor: "#FFFFFF", 
                  border: "1px solid rgba(0,0,0,0.06)", 
                  borderRadius: "8px", 
                  padding: "2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
                }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 600, color: "#1E1E1E", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
                  Summary
                </h3>

                <div style={{ display: "grid", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(30,30,30,0.5)" }}>Order Number</span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1E1E1E" }}>{trackingInfo.orderNumber}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(30,30,30,0.5)" }}>Placement Date</span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: "#1E1E1E" }}>
                      {new Date(trackingInfo.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <div style={{ height: "1px", backgroundColor: "rgba(0,0,0,0.05)", margin: "0.5rem 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600, color: "#1E1E1E" }}>Total Price</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700, color: "#1E1E1E" }}>
                      ₹{parseFloat(trackingInfo.totalPrice?.amount || '0').toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Empty state (when not searched or order not loaded yet) */}
        {!isSearching && !trackingInfo && (
          <div 
            style={{ 
              textAlign: "center", 
              padding: "4rem 1.5rem", 
              backgroundColor: "#FFFFFF", 
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
            }}
          >
            <Truck size={48} style={{ color: "rgba(0,0,0,0.15)", marginBottom: "1.5rem" }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.75rem" }}>
              Ready to Track Your Order?
            </h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.55)", maxWidth: "420px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
              Enter your Order Number and Email Address above to receive a real-time status update on your shipment.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OrderTrackingContent />
    </Suspense>
  );
}
