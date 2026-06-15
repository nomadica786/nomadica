// app/account/profile/page.tsx
"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Star, Plus, X } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { useAuth } from "@/utils/hooks/useAuth";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const { isAuthenticated, user, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // State for fetched data
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: "Home",
    name: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
  });

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Auth protection redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch data if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          // Fetch orders
          const ordersRes = await api.orders.list();
          const ordersList = ordersRes?.orders?.edges?.map((edge: any) => {
            const node = edge.node;
            return {
              id: node.id,
              orderNumber: node.orderNumber,
              date: new Date(node.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
              status: node.status || (node.fulfillmentStatus === 'FULFILLED' ? 'Delivered' : 'In Transit'),
              total: parseFloat(node.totalPrice?.amount || '0'),
              items: node.lineItems?.edges?.length || 0,
              image: node.lineItems?.edges?.[0]?.node?.variant?.image?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=300&q=80',
            };
          }) || [];
          setOrders(ordersList);

          // Fetch wishlist
          const wishlistRes = await api.wishlist.list();
          const wishlistItems = wishlistRes?.wishlist || [];
          setWishlist(wishlistItems);

          // Fetch addresses
          const addressesRes = await api.customer.addresses();
          setAddresses(addressesRes?.addresses || []);
        } catch (err) {
          console.error("Failed to load customer profile details:", err);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.customer.createAddress(newAddr);
      const addressesRes = await api.customer.addresses();
      setAddresses(addressesRes?.addresses || []);
      setShowAddAddress(false);
      setNewAddr({
        label: "Home",
        name: "",
        address1: "",
        address2: "",
        city: "",
        province: "",
        zip: "",
      });
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handleRemoveWishlist = async (productId: string) => {
    try {
      await api.wishlist.remove(productId);
      const wishlistRes = await api.wishlist.list();
      setWishlist(wishlistRes?.wishlist || []);
    } catch (err) {
      console.error("Failed to remove wishlisted item:", err);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <PageLoader />;
  }

  function statusColor(status: string) {
    if (status === "Delivered" || status === "FULFILLED") return "#4F6B5A";
    if (status === "In Transit" || status === "PARTIALLY_FULFILLED") return "#1E1E1E";
    return "#1E1E1E";
  }

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Traveler";
  const userInitials = user?.firstName ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase() : "T";
  const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "3rem", alignItems: "start" }} className="lg:grid-cols-[240px_1fr] grid-cols-1">
          
          {/* Sidebar */}
          <div>
            {/* Avatar */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#1E1E1E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 600, color: "#FFFFFF" }}>
                  {userInitials}
                </span>
              </div>
              <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#1E1E1E" }}>{displayName}</p>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>{user?.email}</p>
            </div>
 
            {/* Nav tabs */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    border: "none",
                    backgroundColor: activeTab === id ? "#1E1E1E" : "transparent",
                    color: activeTab === id ? "#FFFFFF" : "rgba(30,30,30,0.6)",
                    cursor: "pointer",
                    fontFamily: "'Satoshi', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: activeTab === id ? 500 : 400,
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
 
              <div style={{ height: "1px", backgroundColor: "rgba(30,30,30,0.1)", margin: "0.75rem 0" }} />
 
              <button
                onClick={logout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "rgba(180,60,60,0.7)",
                  cursor: "pointer",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.875rem",
                  textAlign: "left",
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </nav>
          </div>
 
          {/* Main content */}
          <div>
            {loadingData ? (
              <div style={{ padding: "4rem 0" }}><PageLoader /></div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div>
                    <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "2rem" }}>
                      My Account
                    </h2>
 
                    {/* Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
                      {[
                        { label: "Total Orders", value: orders.length.toString() },
                        { label: "Wishlist Items", value: wishlist.length.toString() },
                        { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}` },
                        { label: "Rewards Points", value: (orders.length * 100).toString() },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ backgroundColor: "#FFFFFF", padding: "1.5rem 1.25rem" }}>
                          <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.25rem" }}>{value}</p>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.5)", letterSpacing: "0.04em" }}>{label}</p>
                        </div>
                      ))}
                    </div>
 
                    {/* Recent orders preview */}
                    <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "1.25rem" }}>Recent Orders</h3>
                    {orders.length === 0 ? (
                      <p style={{ fontFamily: "Satoshi", color: "rgba(30,30,30,0.5)" }}>You have no orders yet.</p>
                    ) : (
                      <div className="horizontal-scroll" style={{ display: "flex", gap: "1.5rem", paddingBottom: "1rem", overflowX: "auto" }}>
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} style={{ flexShrink: 0, width: "260px", backgroundColor: "#fff", padding: "1.25rem", border: "1px solid rgba(30,30,30,0.07)" }}>
                            <img src={order.image} alt="" style={{ width: "100%", height: "120px", objectFit: "cover", marginBottom: "0.875rem" }} />
                            <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.25rem" }}>{order.orderNumber}</p>
                            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.5)", marginBottom: "0.5rem" }}>{order.date}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: statusColor(order.status), fontWeight: 600 }}>{order.status}</span>
                              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1E1E1E" }}>₹{order.total.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
 
                {activeTab === "orders" && (
                  <div>
                    <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "2rem" }}>My Orders</h2>
                    {orders.length === 0 ? (
                      <p style={{ fontFamily: "Satoshi", color: "rgba(30,30,30,0.5)" }}>You have no orders yet.</p>
                    ) : (
                      <div className="horizontal-scroll" style={{ display: "flex", gap: "1.5rem", overflowX: "auto" }}>
                        {orders.map((order) => (
                          <div key={order.id} style={{ flexShrink: 0, width: "280px", backgroundColor: "#fff", border: "1px solid rgba(30,30,30,0.07)" }}>
                            <img src={order.image} alt="" style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                            <div style={{ padding: "1.25rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1E1E1E" }}>{order.orderNumber}</p>
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    fontFamily: "'Satoshi', sans-serif",
                                    fontWeight: 600,
                                    color: statusColor(order.status),
                                    backgroundColor: `${statusColor(order.status)}15`,
                                    padding: "0.2rem 0.5rem",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.45)", marginBottom: "0.75rem" }}>{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1E1E1E" }}>₹{order.total.toLocaleString("en-IN")}</span>
                                <Link href={`/order-tracking?order=${order.orderNumber}&email=${user?.email}`} style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: "#1E1E1E", textDecoration: "none", fontWeight: 500 }}>
                                  Track Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
 
                {activeTab === "wishlist" && (
                  <div>
                    <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "2rem" }}>My Wishlist</h2>
                    {wishlist.length === 0 ? (
                      <p style={{ fontFamily: "Satoshi", color: "rgba(30,30,30,0.5)" }}>Your wishlist is empty.</p>
                    ) : (
                      <div className="horizontal-scroll" style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "1.5rem" }}>
                        {wishlist.map((item) => (
                          <div key={item.id} style={{ flexShrink: 0, width: "240px", position: "relative" }}>
                            <button
                              onClick={() => handleRemoveWishlist(item.id)}
                              style={{
                                position: "absolute",
                                top: "0.75rem",
                                right: "0.75rem",
                                zIndex: 10,
                                backgroundColor: "rgba(255, 255, 255,0.9)",
                                border: "none",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <X size={14} color="#1E1E1E" />
                            </button>
                            <ProductCard {...item} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
 
                {activeTab === "addresses" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                      <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E" }}>Addresses</h2>
                      <button
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        className="btn-outline"
                        style={{ fontSize: "0.8125rem", padding: "0.625rem 1.25rem", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        {showAddAddress ? <X size={14} /> : <Plus size={14} />}
                        {showAddAddress ? "Cancel" : "Add New"}
                      </button>
                    </div>
 
                    {/* Add Address Form */}
                    {showAddAddress && (
                      <form
                        onSubmit={handleAddAddress}
                        style={{
                          backgroundColor: "#fff",
                          padding: "2rem",
                          border: "1px solid rgba(30,30,30,0.08)",
                          marginBottom: "2rem",
                          display: "grid",
                          gap: "1rem"
                        }}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                          <div>
                            <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>Label</label>
                            <input
                              type="text"
                              value={newAddr.label}
                              onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                              placeholder="e.g. Home, Office"
                              className="form-input"
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>Recipient Name</label>
                            <input
                              type="text"
                              value={newAddr.name}
                              onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                              placeholder="Full Name"
                              className="form-input"
                              required
                            />
                          </div>
                        </div>
 
                        <div>
                          <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>Address Line 1</label>
                          <input
                            type="text"
                            value={newAddr.address1}
                            onChange={(e) => setNewAddr({ ...newAddr, address1: e.target.value })}
                            placeholder="Street address, P.O. box, company name"
                            className="form-input"
                            required
                          />
                        </div>
 
                        <div>
                          <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            value={newAddr.address2}
                            onChange={(e) => setNewAddr({ ...newAddr, address2: e.target.value })}
                            placeholder="Apartment, suite, unit, building, floor, etc."
                            className="form-input"
                          />
                        </div>
 
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }} className="grid-cols-1 md:grid-cols-3">
                          <div>
                            <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>City</label>
                            <input
                              type="text"
                              value={newAddr.city}
                              onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                              className="form-input"
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>State / Province</label>
                            <input
                              type="text"
                              value={newAddr.province}
                              onChange={(e) => setNewAddr({ ...newAddr, province: e.target.value })}
                              className="form-input"
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>PIN / Zip Code</label>
                            <input
                              type="text"
                              value={newAddr.zip}
                              onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                              className="form-input"
                              required
                            />
                          </div>
                        </div>
 
                        <button className="btn-primary" type="submit" style={{ justifySelf: "start", marginTop: "0.5rem" }}>
                          Save Address
                        </button>
                      </form>
                    )}
 
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                      {addresses.map((addr) => (
                        <div key={addr.id} style={{ padding: "1.5rem", border: addr.default ? "1px solid #1E1E1E" : "1px solid rgba(30,30,30,0.15)", position: "relative", backgroundColor: "#fff" }}>
                          {addr.default && (
                            <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", fontFamily: "'Satoshi', sans-serif", fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "#1E1E1E", color: "#FFFFFF", padding: "0.2rem 0.5rem" }}>
                              Default
                            </span>
                          )}
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.625rem" }}>{addr.label}</p>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9375rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.25rem" }}>{addr.name}</p>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.6)", lineHeight: 1.6 }}>{addr.address1} {addr.address2 ? `, ${addr.address2}` : ""}</p>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.6)" }}>{addr.city}, {addr.province} {addr.zip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProfileContent />
    </Suspense>
  );
}