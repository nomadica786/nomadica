"use client";
import { useState } from "react";
import Link from "next/link";
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Star } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

const orders = [
  { id: "NMD-2047", date: "28 May 2025", status: "Delivered", total: 8998, items: 2, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=300&q=80" },
  { id: "NMD-2031", date: "14 Apr 2025", status: "In Transit", total: 4299, items: 1, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80" },
  { id: "NMD-1987", date: "02 Mar 2025", status: "Delivered", total: 13498, items: 3, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80" },
  { id: "NMD-1923", date: "19 Jan 2025", status: "Delivered", total: 5499, items: 1, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&q=80" },
  { id: "NMD-1856", date: "03 Dec 2024", status: "Delivered", total: 9798, items: 2, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80" },
];

const wishlistItems = [
  { id: "3", name: "Horizon Canvas Jacket", price: 8999, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", badge: "Limited", category: "Outerwear" },
  { id: "6", name: "Summit Cargo Pants", price: 5299, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", category: "Bottoms" },
  { id: "8", name: "Wander Merino Hoodie", price: 6299, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", category: "Outerwear" },
  { id: "5", name: "Drift Cotton Tee", price: 1999, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "Tops" },
];

const addresses = [
  { id: 1, label: "Home", name: "Arjun Mehta", line: "204, Sea View Apartments", city: "Mumbai, Maharashtra 400006", default: true },
  { id: 2, label: "Office", name: "Arjun Mehta", line: "12, BKC Business Park, Floor 7", city: "Mumbai, Maharashtra 400051", default: false },
];

function statusColor(status: string) {
  if (status === "Delivered") return "#4F6B5A";
  if (status === "In Transit") return "#7A5C3E";
  return "#1E1E1E";
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
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
                <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 600, color: "#F7F4EE" }}>A</span>
              </div>
              <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#1E1E1E" }}>Arjun Mehta</p>
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>arjun.mehta@email.com</p>
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
                    color: activeTab === id ? "#F7F4EE" : "rgba(30,30,30,0.6)",
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "rgba(30,30,30,0.6)",
                  cursor: "pointer",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  transition: "color 0.15s ease",
                }}
              >
                <Settings size={16} />
                Settings
              </button>

              <button
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
            {activeTab === "overview" && (
              <div>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "2rem" }}>
                  My Account
                </h2>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
                  {[
                    { label: "Total Orders", value: "12" },
                    { label: "Wishlist Items", value: "4" },
                    { label: "Total Spent", value: "₹62,398" },
                    { label: "Rewards Points", value: "1,240" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ backgroundColor: "#EDEAE2", padding: "1.5rem 1.25rem" }}>
                      <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.5rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.25rem" }}>{value}</p>
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.5)", letterSpacing: "0.04em" }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent orders preview */}
                <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "1.25rem" }}>Recent Orders</h3>
                <div className="horizontal-scroll" style={{ paddingBottom: "1rem" }}>
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} style={{ flexShrink: 0, width: "260px", backgroundColor: "#fff", padding: "1.25rem", border: "1px solid rgba(30,30,30,0.07)" }}>
                      <img src={order.image} alt="" style={{ width: "100%", height: "120px", objectFit: "cover", marginBottom: "0.875rem" }} />
                      <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.25rem" }}>{order.id}</p>
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.5)", marginBottom: "0.5rem" }}>{order.date}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: statusColor(order.status), fontWeight: 600 }}>{order.status}</span>
                        <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1E1E1E" }}>₹{order.total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "2rem" }}>My Orders</h2>
                <div className="horizontal-scroll">
                  {orders.map((order) => (
                    <div key={order.id} style={{ flexShrink: 0, width: "280px", backgroundColor: "#fff", border: "1px solid rgba(30,30,30,0.07)" }}>
                      <img src={order.image} alt="" style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                      <div style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1E1E1E" }}>{order.id}</p>
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
                          <button style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", color: "#7A5C3E", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "2rem" }}>My Wishlist</h2>
                <div className="horizontal-scroll">
                  {wishlistItems.map((item) => (
                    <div key={item.id} style={{ flexShrink: 0, width: "240px" }}>
                      <ProductCard {...item} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                  <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E" }}>Addresses</h2>
                  <Link href="/account/addresses">
                    <button className="btn-outline" style={{ fontSize: "0.8125rem", padding: "0.625rem 1.25rem" }}>Add New</button>
                  </Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                  {addresses.map((addr) => (
                    <div key={addr.id} style={{ padding: "1.5rem", border: addr.default ? "1px solid #1E1E1E" : "1px solid rgba(30,30,30,0.15)", position: "relative" }}>
                      {addr.default && (
                        <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", fontFamily: "'Satoshi', sans-serif", fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "#1E1E1E", color: "#F7F4EE", padding: "0.2rem 0.5rem" }}>
                          Default
                        </span>
                      )}
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7A5C3E", marginBottom: "0.625rem" }}>{addr.label}</p>
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9375rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.25rem" }}>{addr.name}</p>
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.6)", lineHeight: 1.6 }}>{addr.line}</p>
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.6)" }}>{addr.city}</p>
                      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "#7A5C3E", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Edit</button>
                        <button style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.4)", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}