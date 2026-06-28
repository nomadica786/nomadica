// app/account/orders/page.tsx
"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, HelpCircle, FileText, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/utils/hooks/useAuth";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { MOCK_PRODUCTS } from "@/utils/mockData";
import { getShopifyImageUrl } from "@/lib/images/shopifyImage";

function OrdersContent() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Auth protection redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/account/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch orders
  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        setLoadingData(true);
        try {
          const ordersRes = await api.orders.list();
          const rawOrders = ordersRes?.orders?.edges || [];
          
          const mappedOrders = rawOrders.map((edge: any) => {
            const node = edge.node;
            
            // Format line items
            const lineItems = node.lineItems?.edges?.map((itemEdge: any) => {
              const itemNode = itemEdge.node;
              const title = itemNode.title || "Product Item";
              const quantity = itemNode.quantity || 1;
              const price = parseFloat(itemNode.variant?.price?.amount || itemNode.variant?.price || "0");
              
              // Extract size and color from variant title (e.g. "Medium / Black" or "M / Black")
              let size = "Default";
              let color = "Default";
              const variantTitle = itemNode.variant?.title || "";
              
              if (variantTitle && variantTitle !== "Default Title") {
                const parts = variantTitle.split("/").map((p: string) => p.trim());
                if (parts.length >= 1) size = parts[0];
                if (parts.length >= 2) color = parts[1];
              }

              // Try to find image from mock products or fallback
              let image = itemNode.variant?.image?.url || "";
              if (!image) {
                const foundProd = MOCK_PRODUCTS.find(p => p.name.toLowerCase() === title.toLowerCase());
                image = foundProd?.image || "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=300&q=80";
              }

              return {
                id: itemNode.id,
                title,
                quantity,
                price,
                size,
                color,
                image
              };
            }) || [];

            // Parse creation date
            const dateStr = new Date(node.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            });

            // Normalize status (SHIPPED, DELIVERED, RETURNED, CANCELLED)
            let status = (node.status || "").toUpperCase();
            if (!status) {
              if (node.fulfillmentStatus === "FULFILLED") {
                status = "DELIVERED";
              } else if (node.fulfillmentStatus === "PARTIALLY_FULFILLED" || node.fulfillmentStatus === "RESTOCKED") {
                status = "SHIPPED";
              } else {
                // If transit/shipped mock status
                status = "SHIPPED";
              }
            }
            if (status === "DELIVERED" || status === "FULFILLED") status = "DELIVERED";
            if (status === "IN TRANSIT" || status === "UNFULFILLED") status = "SHIPPED";
            if (status === "CANCELLED" || status === "CANCELED") status = "CANCELLED";

            return {
              id: node.id,
              orderNumber: node.orderNumber || `#${node.id.split("/").pop()}`,
              date: dateStr,
              rawDate: new Date(node.createdAt),
              status: status,
              total: parseFloat(node.totalPrice?.amount || node.totalPrice || "0"),
              lineItems
            };
          });

          setOrders(mappedOrders);
        } catch (err) {
          console.error("Failed to load user orders:", err);
        } finally {
          setLoadingData(false);
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated]);

  // Handle Download Invoice Mock
  const handleDownloadInvoice = (orderNumber: string) => {
    alert(`Downloading Invoice for order ${orderNumber}...`);
  };

  // Filter & Sort Logic
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.lineItems.some((item: any) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "NEWEST") {
      return b.rawDate.getTime() - a.rawDate.getTime();
    }
    if (sortBy === "OLDEST") {
      return a.rawDate.getTime() - b.rawDate.getTime();
    }
    if (sortBy === "PRICE_HIGH") {
      return b.total - a.total;
    }
    if (sortBy === "PRICE_LOW") {
      return a.total - b.total;
    }
    return 0;
  });

  if (authLoading || !isAuthenticated) {
    return <PageLoader />;
  }

  // Helper for Status Badge Styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DELIVERED":
      case "DELIVERED ":
        return { color: "#16A34A", backgroundColor: "#F0FDF4" };
      case "SHIPPED":
        return { color: "#2563EB", backgroundColor: "#EFF6FF" };
      case "RETURNED":
        return { color: "#7C3AED", backgroundColor: "#F5F3FF" };
      case "CANCELLED":
        return { color: "#DC2626", backgroundColor: "#FEF2F2" };
      default:
        return { color: "#4B5563", backgroundColor: "#F3F4F6" };
    }
  };

  // Helper for Status Date Detail text
  const getStatusDetailText = (status: string, date: string) => {
    switch (status) {
      case "DELIVERED":
        return `Delivered on ${date}`;
      case "SHIPPED":
        return `Arriving soon (Estimated 5-7 business days)`;
      case "RETURNED":
        return `Returned on ${date}`;
      case "CANCELLED":
        return `Cancelled on ${date}`;
      default:
        return `Processed on ${date}`;
    }
  };

  return (
    <div style={{ paddingTop: "80px", backgroundColor: "#FDFDFD", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        {/* Title Header with Back Arrow */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link 
              href="/account/profile" 
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#1E1E1E",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FFFFFF"}
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 600, color: "#1E1E1E", margin: 0 }}>
                My Orders
              </h1>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.5)", margin: "0.25rem 0 0" }}>
                Track, view and manage your orders
              </p>
            </div>
          </div>
          
          <Link 
            href="/support" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.4rem", 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "0.85rem", 
              color: "rgba(30, 30, 30, 0.5)", 
              textDecoration: "none"
            }}
          >
            <HelpCircle size={16} />
            Need Help?
          </Link>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          
          {/* Search Input */}
          <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
            <Search 
              size={18} 
              style={{ 
                position: "absolute", 
                left: "1rem", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "rgba(30,30,30,0.4)" 
              }} 
            />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "8px",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.875rem",
                backgroundColor: "#FFFFFF"
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowSortDropdown(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "8px",
                backgroundColor: "#FFFFFF",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1E1E1E",
                cursor: "pointer"
              }}
            >
              <SlidersHorizontal size={14} />
              Filter: {statusFilter === "ALL" ? "All Status" : statusFilter}
              <ChevronDown size={14} />
            </button>

            {showFilterDropdown && (
              <div 
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  zIndex: 100,
                  marginTop: "0.5rem",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  width: "180px",
                  padding: "0.5rem"
                }}
              >
                {["ALL", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.6rem 1rem",
                      textAlign: "left",
                      backgroundColor: statusFilter === status ? "rgba(196,181,160,0.1)" : "transparent",
                      border: "none",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.8rem",
                      color: statusFilter === status ? "#C4B5A0" : "#1E1E1E",
                      fontWeight: statusFilter === status ? 600 : 400,
                      cursor: "pointer",
                      borderRadius: "4px"
                    }}
                  >
                    {status === "ALL" ? "All Status" : status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowFilterDropdown(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "8px",
                backgroundColor: "#FFFFFF",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#1E1E1E",
                cursor: "pointer"
              }}
            >
              Sort: {sortBy === "NEWEST" ? "Newest First" : sortBy === "OLDEST" ? "Oldest First" : sortBy === "PRICE_HIGH" ? "Price: High to Low" : "Price: Low to High"}
              <ChevronDown size={14} />
            </button>

            {showSortDropdown && (
              <div 
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  zIndex: 100,
                  marginTop: "0.5rem",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  width: "200px",
                  padding: "0.5rem"
                }}
              >
                {[
                  { key: "NEWEST", label: "Newest First" },
                  { key: "OLDEST", label: "Oldest First" },
                  { key: "PRICE_HIGH", label: "Price: High to Low" },
                  { key: "PRICE_LOW", label: "Price: Low to High" }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setSortBy(item.key);
                      setShowSortDropdown(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.6rem 1rem",
                      textAlign: "left",
                      backgroundColor: sortBy === item.key ? "rgba(196,181,160,0.1)" : "transparent",
                      border: "none",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.8rem",
                      color: sortBy === item.key ? "#C4B5A0" : "#1E1E1E",
                      fontWeight: sortBy === item.key ? 600 : 400,
                      cursor: "pointer",
                      borderRadius: "4px"
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Order Cards Container */}
        {loadingData ? (
          <div style={{ padding: "4rem 0" }}><PageLoader /></div>
        ) : filteredOrders.length === 0 ? (
          <div 
            style={{ 
              textAlign: "center", 
              padding: "4rem 1.5rem", 
              backgroundColor: "#FFFFFF", 
              borderRadius: "8px", 
              border: "1px solid rgba(0,0,0,0.06)" 
            }}
          >
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", color: "rgba(30,30,30,0.5)" }}>
              No orders found matching your search.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "2rem" }}>
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.01)"
                }}
              >
                
                {/* Card Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.25rem 1.5rem",
                    backgroundColor: "#FAF9F7",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    flexWrap: "wrap",
                    gap: "1rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#1E1E1E" }}>
                      {order.orderNumber}
                    </span>
                    <span style={{ color: "rgba(0,0,0,0.2)", fontSize: "0.85rem" }}>·</span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(30,30,30,0.6)" }}>
                      Order Placed on {order.date}
                    </span>
                    <span style={{ color: "rgba(0,0,0,0.2)", fontSize: "0.85rem" }}>·</span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(30,30,30,0.6)" }}>
                      {order.lineItems.length} item{order.lineItems.length > 1 ? "s" : ""}
                    </span>
                    
                    {/* Status Badge */}
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "4px",
                        ...getStatusStyle(order.status)
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 600, color: "#1E1E1E" }}>
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Card Items List */}
                <div style={{ padding: "1.5rem" }}>
                  {order.lineItems.map((item: any, idx: number) => (
                    <div 
                      key={item.id || idx}
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        paddingBottom: idx === order.lineItems.length - 1 ? 0 : "1.5rem",
                        marginBottom: idx === order.lineItems.length - 1 ? 0 : "1.5rem",
                        borderBottom: idx === order.lineItems.length - 1 ? "none" : "1px solid rgba(0,0,0,0.05)",
                        alignItems: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      {/* Product Image */}
                      <div 
                        style={{
                          position: "relative",
                          width: "80px",
                          aspectRatio: "3/4",
                          borderRadius: "4px",
                          overflow: "hidden",
                          flexShrink: 0,
                          backgroundColor: "#F9F9F9",
                          border: "1px solid rgba(0,0,0,0.03)"
                        }}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                      </div>

                      {/* Product Text Details */}
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <h3 
                          style={{ 
                            fontFamily: "'Playfair Display', serif", 
                            fontSize: "1.1rem", 
                            fontWeight: 600, 
                            color: "#1E1E1E",
                            margin: "0 0 0.4rem" 
                          }}
                        >
                          {item.title}
                        </h3>
                        <p 
                          style={{ 
                            fontFamily: "'Montserrat', sans-serif", 
                            fontSize: "0.8rem", 
                            color: "rgba(30,30,30,0.5)", 
                            margin: "0 0 0.625rem" 
                          }}
                        >
                          Size: {item.size} &nbsp;·&nbsp; Colour: {item.color} &nbsp;·&nbsp; Quantity: {item.quantity}
                        </p>
                        
                        <p 
                          style={{ 
                            fontFamily: "'Montserrat', sans-serif", 
                            fontSize: "0.8rem", 
                            fontWeight: 500,
                            color: order.status === "DELIVERED" ? "#16A34A" : order.status === "CANCELLED" ? "#DC2626" : "#2563EB",
                            margin: 0
                          }}
                        >
                          {getStatusDetailText(order.status, order.date)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div 
                        style={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          alignItems: "flex-end", 
                          gap: "0.75rem", 
                          minWidth: "160px",
                          justifyContent: "center"
                        }}
                      >
                        {order.status === "SHIPPED" ? (
                          <Link 
                            href={`/order-tracking?order=${order.orderNumber}&email=${user?.email}`}
                            style={{ textDecoration: "none", width: "100%" }}
                          >
                            <button
                              style={{
                                width: "100%",
                                backgroundColor: "#C4B5A0",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.65rem 1.25rem",
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                cursor: "pointer",
                                transition: "background-color 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B4E37"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C4B5A0"}
                            >
                              Track Order
                            </button>
                          </Link>
                        ) : (
                          <Link href="/shop" style={{ textDecoration: "none", width: "100%" }}>
                            <button
                              style={{
                                width: "100%",
                                backgroundColor: "#C4B5A0",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "4px",
                                padding: "0.65rem 1.25rem",
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                cursor: "pointer",
                                transition: "background-color 0.2s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B4E37"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C4B5A0"}
                            >
                              Buy Again
                            </button>
                          </Link>
                        )}
                        
                        <button
                          onClick={() => handleDownloadInvoice(order.orderNumber)}
                          style={{
                            background: "none",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.75rem",
                            color: "rgba(30,30,30,0.5)",
                            cursor: "pointer",
                            padding: 0,
                            transition: "color 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#1E1E1E"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(30,30,30,0.5)"}
                        >
                          <FileText size={12} />
                          Download Invoice
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OrdersContent />
    </Suspense>
  );
}
