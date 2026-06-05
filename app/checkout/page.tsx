"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Truck, Shield, ChevronLeft, CheckCircle } from "lucide-react";
import { api } from "@/components/api/api";
import { useAuth } from "@/utils/hooks/useAuth";
import { PageLoader } from "@/components/ui/PageLoader";
import { MOCK_PRODUCTS } from "@/utils/mockData";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");

  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);

  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZip] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Payment states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Checkout states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  // Load cart details
  useEffect(() => {
    const fetchCartDetails = async () => {
      if (!cartId) {
        setLoadingCart(false);
        return;
      }
      try {
        const res = await api.cart.get(cartId);
        setCart(res.cart);
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCartDetails();
  }, [cartId]);

  // Load user addresses if logged in
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAddresses = async () => {
        try {
          const res = await api.customer.addresses();
          setAddresses(res.addresses || []);
          const defaultAddr = res.addresses?.find((a: any) => a.default);
          if (defaultAddr) {
            applyAddress(defaultAddr);
          }
        } catch (err) {
          console.error("Failed to load addresses:", err);
        }
      };
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const applyAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setFirstName(addr.name?.split(" ")[0] || "");
    setLastName(addr.name?.split(" ").slice(1).join(" ") || "");
    setAddress1(addr.address1 || "");
    setAddress2(addr.address2 || "");
    setCity(addr.city || "");
    setProvince(addr.province || "");
    setZip(addr.zip || "");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    if (!cart || cart.lines?.edges?.length === 0) {
      setErrorMessage("Your shopping bag is empty");
      setIsSubmitting(false);
      return;
    }

    const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || "0");
    const shipping = subtotal > 2000 ? 0 : 99;
    const totalPrice = subtotal + shipping;

    // Construct line items list for order tracking / receipt
    const lineItems = cart.lines.edges.map((edge: any) => {
      const line = edge.node;
      const rawId = line.merchandise?.product?.id || "1";
      const cleanId = String(rawId).split("/").pop() || "1";
      const numericId = cleanId.replace(/[^0-9]/g, "");
      const product = MOCK_PRODUCTS.find(p => p.id === numericId) || MOCK_PRODUCTS[0];

      return {
        title: line.merchandise?.product?.title || "Product",
        quantity: line.quantity,
        price: parseFloat(line.merchandise?.price?.amount || "0"),
        image: product?.image || "",
        variantId: line.merchandise?.id
      };
    });

    try {
      const result = await api.checkout.process({
        email,
        firstName,
        lastName,
        address1,
        address2,
        city,
        province,
        zip,
        lineItems,
        totalPrice,
        currency: "INR",
        cardNumber,
        expiry,
        cvv
      });

      if (result.success) {
        setOrderInfo(result);
        setCheckoutSuccess(true);
        // Clear local cart
        localStorage.removeItem("nomadica_cart_id");
        // Dispatch event to clear badge in navbar
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: { openDrawer: false } }));
        
        // Redirect to profile orders tab after 3 seconds
        setTimeout(() => {
          router.replace("/account/profile?tab=orders");
        }, 3000);
      } else {
        setErrorMessage(result.message || "Payment declined. Please check your details.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCart) {
    return <PageLoader />;
  }

  if (!cartId || !cart || cart.lines?.edges?.length === 0) {
    return (
      <div style={{ paddingTop: "100px", paddingBottom: "100px", textAlign: "center", backgroundColor: "#F7F4EE", minHeight: "100vh", fontFamily: "Satoshi" }}>
        <h1 style={{ fontFamily: "Clash Display", fontSize: "2rem", marginBottom: "1rem" }}>Checkout Not Active</h1>
        <p style={{ color: "rgba(30,30,30,0.6)", marginBottom: "2rem" }}>You don&apos;t have an active cart session to checkout.</p>
        <Link href="/shop" style={{ color: "#7A5C3E", textDecoration: "underline", fontWeight: 500 }}>Back to Shop</Link>
      </div>
    );
  }

  const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || "0");
  const shipping = subtotal > 2000 ? 0 : 99;
  const total = subtotal + shipping;

  if (checkoutSuccess) {
    return (
      <div style={{ backgroundColor: "#F7F4EE", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Satoshi" }}>
        <div style={{ backgroundColor: "#fff", border: "1px solid rgba(30,30,30,0.08)", padding: "3rem 2rem", maxWidth: "500px", width: "100%", textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
          <CheckCircle size={64} color="#4F6B5A" style={{ margin: "0 auto 1.5rem" }} />
          <h1 style={{ fontFamily: "Clash Display", fontSize: "2rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.5rem" }}>Order Confirmed!</h1>
          <p style={{ color: "#7A5C3E", fontWeight: 600, fontSize: "1.125rem", marginBottom: "1rem" }}>Order Number: {orderInfo?.orderNumber}</p>
          <p style={{ color: "rgba(30,30,30,0.6)", lineHeight: 1.6, marginBottom: "2rem" }}>
            Thank you for shopping with Nomadica. We have successfully processed your payment. You will be redirected to your profile dashboard shortly to track your shipment.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link href="/account/profile?tab=orders" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>Track Orders</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F7F4EE", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* Checkout Navbar */}
      <header style={{ borderBottom: "1px solid rgba(30,30,30,0.08)", height: "64px", display: "flex", alignItems: "center", padding: "0 2rem", backgroundColor: "#F7F4EE" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontFamily: "Clash Display", fontSize: "1.25rem", fontWeight: 600, color: "#1E1E1E", textDecoration: "none", letterSpacing: "-0.01em" }}>
            NOMADICA
          </Link>
          <Link href="/shop" style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "Satoshi", fontSize: "0.875rem", color: "rgba(30,30,30,0.6)", textDecoration: "none" }}>
            <ChevronLeft size={16} />
            Back to shop
          </Link>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main style={{ maxWidth: "1200px", margin: "3rem auto 0", padding: "0 1.5rem" }}>
        <h1 style={{ fontFamily: "Clash Display", fontSize: "2.25rem", fontWeight: 600, marginBottom: "2.5rem" }}>Checkout</h1>

        {errorMessage && (
          <div style={{ backgroundColor: "rgba(180,60,60,0.1)", borderLeft: "4px solid rgb(180,60,60)", color: "rgb(180,60,60)", padding: "1rem", marginBottom: "2rem", fontFamily: "Satoshi" }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "4rem" }} className="lg:grid-cols-[1fr_400px] grid-cols-1">
          {/* Left Column: Checkout Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Shipping Addresses (Authenticated) */}
            {isAuthenticated && addresses.length > 0 && (
              <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid rgba(30,30,30,0.08)" }}>
                <h3 style={{ fontFamily: "Clash Display", fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>Saved Shipping Addresses</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => applyAddress(addr)}
                      style={{
                        padding: "1rem",
                        border: selectedAddressId === addr.id ? "2px solid #7A5C3E" : "1px solid rgba(30,30,30,0.15)",
                        cursor: "pointer",
                        backgroundColor: selectedAddressId === addr.id ? "rgba(122,92,62,0.04)" : "transparent",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.25rem" }}>{addr.label} {addr.default && "(Default)"}</p>
                      <p style={{ fontSize: "0.8125rem", color: "rgba(30,30,30,0.7)", margin: 0 }}>{addr.name}</p>
                      <p style={{ fontSize: "0.8125rem", color: "rgba(30,30,30,0.7)", margin: 0 }}>{addr.address1}</p>
                      <p style={{ fontSize: "0.8125rem", color: "rgba(30,30,30,0.7)", margin: 0 }}>{addr.city}, {addr.province}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Details Form */}
            <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid rgba(30,30,30,0.08)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ fontFamily: "Clash Display", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Shipping Details</h3>
              
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>Address Line 1</label>
                <input
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="Street Address, PO Box"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Apartment, suite, unit"
                  className="form-input"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }} className="grid-cols-1 md:grid-cols-3">
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>State / Province</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>PIN / Zip Code</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Gateway Form */}
            <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid rgba(30,30,30,0.08)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ fontFamily: "Clash Display", fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Payment Method</h3>
                <span style={{ fontSize: "0.75rem", color: "#7A5C3E", border: "1px solid #7A5C3E", padding: "0.2rem 0.5rem", fontWeight: 600 }}>MOCK TEST GATEWAY</span>
              </div>

              <div style={{ padding: "0.875rem 1rem", backgroundColor: "rgba(122,92,62,0.08)", borderLeft: "4px solid #7A5C3E", fontSize: "0.8125rem", color: "#7A5C3E", lineHeight: 1.5 }}>
                <p style={{ margin: "0 0 0.25rem", fontWeight: 600 }}>Test Card Info:</p>
                Use card <strong>4242 4242 4242 4242</strong> for a successful mock purchase.
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.375rem" }}>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="form-input"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: "100%", padding: "1rem", justifyContent: "center", fontSize: "0.9375rem", letterSpacing: "0.05em", textTransform: "uppercase", height: "52px" }}
            >
              {isSubmitting ? "Processing Payment..." : `Pay ₹${total.toLocaleString("en-IN")}`}
            </button>
          </div>

          {/* Right Column: Order Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid rgba(30,30,30,0.08)", position: "sticky", top: "100px" }}>
              <h3 style={{ fontFamily: "Clash Display", fontSize: "1.25rem", fontWeight: 600, borderBottom: "1px solid rgba(30,30,30,0.08)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                Order Summary
              </h3>

              {/* Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                {cart.lines.edges.map((edge: any) => {
                  const line = edge.node;
                  const price = parseFloat(line.merchandise?.price?.amount || "0");
                  const title = line.merchandise?.product?.title || "Product";
                  const size = line.merchandise?.title || "Default";
                  const rawId = line.merchandise?.product?.id || "1";
                  const cleanId = String(rawId).split("/").pop() || "1";
                  const numericId = cleanId.replace(/[^0-9]/g, "");
                  const product = MOCK_PRODUCTS.find(p => p.id === numericId) || MOCK_PRODUCTS[0];

                  return (
                    <div key={line.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ width: "50px", aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#EDE9E1", flexShrink: 0 }}>
                        <img src={product?.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "0.8125rem", margin: "0 0 0.125rem" }}>{title}</p>
                          <p style={{ fontSize: "0.75rem", color: "rgba(30,30,30,0.5)", margin: 0 }}>Size: {size} · Qty: {line.quantity}</p>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                          ₹{(price * line.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1px solid rgba(30,30,30,0.08)", paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "rgba(30,30,30,0.6)" }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "rgba(30,30,30,0.6)" }}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
              </div>

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(30,30,30,0.08)", paddingTop: "1.25rem", fontSize: "1.125rem", fontWeight: 700, color: "#1E1E1E" }}>
                <span style={{ fontFamily: "Clash Display" }}>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              {/* Security badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2rem", padding: "1rem 0 0", borderTop: "1px solid rgba(30,30,30,0.05)" }}>
                <Shield size={16} style={{ color: "#4F6B5A" }} />
                <span style={{ fontSize: "0.6875rem", color: "rgba(30,30,30,0.5)", lineHeight: 1.4 }}>
                  Secure SSL 256-bit encrypted checkout connection. All mock transactions are processed safely.
                </span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CheckoutContent />
    </Suspense>
  );
}
