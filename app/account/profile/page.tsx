// app/account/profile/page.tsx
"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Plus, X, Edit, MapPin } from "lucide-react";
import { useAuth } from "@/utils/hooks/useAuth";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

function ProfileContent() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading, logout } = useAuth();
  
  // Data States
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Address Modal States
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<any>({
    name: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    phone: "",
    label: "Home"
  });

  // Edit Profile Modal States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  // Auth protection redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch addresses and sync profile form
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAddresses = async () => {
        setLoadingData(true);
        try {
          const res = await api.customer.addresses();
          setAddresses(res?.addresses || []);
        } catch (err) {
          console.error("Failed to load customer addresses:", err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchAddresses();

      if (user) {
        setProfileData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: (user as any).phone || ""
        });
      }
    }
  }, [isAuthenticated, user]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditingAddress) {
        await api.customer.updateAddress({
          ...newAddr,
          label: newAddr.label || "Home"
        });
      } else {
        await api.customer.createAddress({
          ...newAddr,
          label: newAddr.label || "Home"
        });
      }
      const addressesRes = await api.customer.addresses();
      setAddresses(addressesRes?.addresses || []);
      closeAddressModal();
    } catch (err) {
      console.error("Failed to add/update address:", err);
    }
  };

  const closeAddressModal = () => {
    setShowAddAddress(false);
    setIsEditingAddress(false);
    setNewAddr({
      name: "",
      address1: "",
      address2: "",
      city: "",
      province: "",
      zip: "",
      phone: "",
      label: "Home"
    });
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.customer.deleteAddress(id);
      const addressesRes = await api.customer.addresses();
      setAddresses(addressesRes?.addresses || []);
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleMakeDefault = async (addr: any) => {
    try {
      await api.customer.updateAddress({ ...addr, default: true });
      const addressesRes = await api.customer.addresses();
      setAddresses(addressesRes?.addresses || []);
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  const openEditAddress = (addr: any) => {
    setNewAddr({ ...addr, label: addr.label || "Home" });
    setIsEditingAddress(true);
    setShowAddAddress(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.customer.updateProfile(profileData);
      // Trigger local storage refresh or page refresh to pull latest user
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <PageLoader />;
  }

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Traveler";

  return (
    <div style={{ paddingTop: "0px", backgroundColor: "#FDFDFD", minHeight: "50vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        {/* Header Title with Logout */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            paddingBottom: "1.5rem",
            marginBottom: "2.5rem" 
          }}
        >
          <h1 
            style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: "clamp(2rem, 3.5vw, 2.75rem)", 
              fontWeight: 500, 
              color: "#1E1E1E",
              margin: 0
            }}
          >
            Profile
          </h1>
          <button
            onClick={logout}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#1E1E1E",
              border: "1px solid rgba(30, 30, 30, 0.4)",
              borderRadius: "4px",
              padding: "0.6rem 1.5rem",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "background-color 0.2s ease, border-color 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)";
              e.currentTarget.style.borderColor = "#1E1E1E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "rgba(30, 30, 30, 0.4)";
            }}
          >
            LOGOUT
          </button>
        </div>

        {/* Navigation Tabs */}
        <div 
          style={{ 
            display: "flex", 
            gap: "2rem", 
            borderBottom: "1px solid rgba(0,0,0,0.06)", 
            marginBottom: "2.5rem",
            paddingBottom: "0.25rem"
          }}
        >
          <Link 
            href="/account/profile" 
            style={{ 
              textDecoration: "none", 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "0.85rem", 
              fontWeight: 600, 
              color: "#1E1E1E", 
              borderBottom: "2.5px solid #C4B5A0", 
              paddingBottom: "0.75rem",
              letterSpacing: "0.05em"
            }}
          >
            PROFILE DETAILS
          </Link>
          <Link 
            href="/account/orders" 
            style={{ 
              textDecoration: "none", 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "0.85rem", 
              fontWeight: 500, 
              color: "rgba(30,30,30,0.45)", 
              paddingBottom: "0.75rem",
              letterSpacing: "0.05em",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1E1E1E"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(30,30,30,0.45)"}
          >
            MY ORDERS
          </Link>
          <Link 
            href="/account/wishlist" 
            style={{ 
              textDecoration: "none", 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "0.85rem", 
              fontWeight: 500, 
              color: "rgba(30,30,30,0.45)", 
              paddingBottom: "0.75rem",
              letterSpacing: "0.05em",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1E1E1E"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(30,30,30,0.45)"}
          >
            MY WISHLIST
          </Link>
        </div>

        {/* Two-Column Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          
          {/* Card 1: Personal Details */}
          <div 
            style={{ 
              backgroundColor: "#FFFFFF", 
              border: "1px solid rgba(0,0,0,0.06)", 
              borderRadius: "8px", 
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1E1E", margin: 0 }}>
                Personal Details
              </h2>
              <button
                onClick={() => setShowEditProfile(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  borderRadius: "4px",
                  padding: "0.5rem 0.85rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "#1E1E1E"
                }}
              >
                <Edit size={12} />
                Edit Profile
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(30,30,30,0.45)", margin: "0 0 0.5rem" }}>
                  First Name
                </p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", color: "#1E1E1E", fontWeight: 500, margin: 0 }}>
                  {user?.firstName || "-"}
                </p>
              </div>

              <div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(30,30,30,0.45)", margin: "0 0 0.5rem" }}>
                  Last Name
                </p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", color: "#1E1E1E", fontWeight: 500, margin: 0 }}>
                  {user?.lastName || "-"}
                </p>
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(30,30,30,0.45)", margin: "0 0 0.5rem" }}>
                  Email
                </p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", color: "#1E1E1E", fontWeight: 500, margin: 0 }}>
                  {user?.email || "-"}
                </p>
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(30,30,30,0.45)", margin: "0 0 0.5rem" }}>
                  Phone Number
                </p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", color: "#1E1E1E", fontWeight: 500, margin: 0 }}>
                  {(user as any)?.phone || "Not added yet"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Addresses */}
          <div 
            style={{ 
              backgroundColor: "#FFFFFF", 
              border: "1px solid rgba(0,0,0,0.06)", 
              borderRadius: "8px", 
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1E1E", margin: 0 }}>
                Addresses
              </h2>
              <button
                onClick={() => setShowAddAddress(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  borderRadius: "4px",
                  padding: "0.5rem 0.85rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "#1E1E1E"
                }}
              >
                <Plus size={12} />
                Add Address
              </button>
            </div>

            {loadingData ? (
              <div style={{ padding: "2rem 0", textAlign: "center" }}><PageLoader /></div>
            ) : addresses.length === 0 ? (
              <div 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  padding: "3rem 1rem", 
                  border: "1px dashed rgba(0,0,0,0.1)", 
                  borderRadius: "6px",
                  textAlign: "center"
                }}
              >
                <MapPin size={32} style={{ color: "rgba(0,0,0,0.15)", marginBottom: "1rem" }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", color: "rgba(30, 30, 30, 0.6)", margin: "0 0 0.5rem" }}>
                  No saved addresses yet
                </p>
                <button
                  onClick={() => {
                    setIsEditingAddress(false);
                    setShowAddAddress(true);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#1E1E1E",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  + Add your first address
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {addresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    style={{ 
                      padding: "1.25rem", 
                      border: addr.default ? "1px solid #1E1E1E" : "1px solid rgba(0,0,0,0.08)", 
                      borderRadius: "6px",
                      position: "relative", 
                      backgroundColor: "#FFFFFF" 
                    }}
                  >
                    {addr.default && (
                      <span 
                        style={{ 
                          position: "absolute", 
                          top: "0.75rem", 
                          right: "0.75rem", 
                          fontFamily: "'Montserrat', sans-serif", 
                          fontSize: "0.6rem", 
                          fontWeight: 600, 
                          letterSpacing: "0.1em", 
                          textTransform: "uppercase", 
                          backgroundColor: "#1E1E1E", 
                          color: "#FFFFFF", 
                          padding: "0.2rem 0.5rem",
                          borderRadius: "2px"
                        }}
                      >
                        Default
                      </span>
                    )}
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C4B5A0", margin: "0 0 0.5rem" }}>
                      {addr.label || "Address"}
                    </p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "#1E1E1E", margin: "0 0 0.25rem" }}>
                      {addr.name}
                    </p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(30,30,30,0.6)", lineHeight: 1.5, margin: 0 }}>
                      {addr.address1} {addr.address2 ? `, ${addr.address2}` : ""}
                    </p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(30,30,30,0.6)", margin: 0 }}>
                      {addr.city}, {addr.province} {addr.zip}
                    </p>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                      <button onClick={() => openEditAddress(addr)} style={{ background: "none", border: "none", color: "#1E1E1E", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, padding: 0, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: "none", border: "none", color: "rgba(180,60,60,0.8)", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, padding: 0, cursor: "pointer" }}>Delete</button>
                      {!addr.default && (
                        <button onClick={() => handleMakeDefault(addr)} style={{ background: "none", border: "none", color: "#1E1E1E", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, padding: 0, cursor: "pointer", marginLeft: "auto" }}>Set as Default</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Address Modal */}
        {showAddAddress && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 3000,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem"
            }}
          >
            <div 
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                width: "100%",
                maxWidth: "600px",
                padding: "2rem",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <button
                onClick={() => setShowAddAddress(false)}
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(0,0,0,0.4)"
                }}
              >
                <X size={20} />
              </button>

              <h2 
                style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: "1.5rem", 
                  fontWeight: 600, 
                  color: "#1E1E1E",
                  margin: "0 0 2rem" 
                }}
              >
                Add New Address
              </h2>

              <form onSubmit={handleAddAddress} style={{ display: "grid", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      placeholder="e.g. Arjun Mehta"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem"
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      placeholder="10-digit number"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={newAddr.address1}
                    onChange={(e) => setNewAddr({ ...newAddr, address1: e.target.value })}
                    placeholder="House no, Building, Street"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={newAddr.address2}
                    onChange={(e) => setNewAddr({ ...newAddr, address2: e.target.value })}
                    placeholder="Landmark, Area"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem"
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                      State
                    </label>
                    <select
                      value={newAddr.province}
                      onChange={(e) => setNewAddr({ ...newAddr, province: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
                        backgroundColor: "#FFFFFF",
                        height: "45px"
                      }}
                      required
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={newAddr.zip}
                      onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: "4px",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem"
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={closeAddressModal}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFFFFF",
                      color: "#1E1E1E",
                      border: "1px solid rgba(30, 30, 30, 0.4)",
                      borderRadius: "4px",
                      padding: "0.85rem 1.5rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      backgroundColor: "#C4B5A0",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.85rem 1.5rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#6B4E37"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#C4B5A0"; }}
                  >
                    {isEditingAddress ? "SAVE CHANGES" : "SAVE ADDRESS"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 3000,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem"
            }}
          >
            <div 
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                width: "100%",
                maxWidth: "500px",
                padding: "2rem",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                position: "relative"
              }}
            >
              <button
                onClick={() => setShowEditProfile(false)}
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(0,0,0,0.4)"
                }}
              >
                <X size={20} />
              </button>

              <h2 
                style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: "1.5rem", 
                  fontWeight: 600, 
                  color: "#1E1E1E",
                  margin: "0 0 2rem" 
                }}
              >
                Edit Profile
              </h2>

              <form onSubmit={handleUpdateProfile} style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.9rem"
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: "4px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFFFFF",
                      color: "#1E1E1E",
                      border: "1px solid rgba(30, 30, 30, 0.4)",
                      borderRadius: "4px",
                      padding: "0.85rem 1.5rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      backgroundColor: "#C4B5A0",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.85rem 1.5rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#6B4E37"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#C4B5A0"; }}
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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