"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { PageLoader } from "@/components/ui/PageLoader";
import ProductCard from "@/components/shop/ProductCard";
import { api } from "@/components/api/api";
import { useAuth } from "@/utils/hooks/useAuth";

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.wishlist.list();
        setWishlistItems(res?.wishlist || []);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (authLoading || !isAuthenticated) {
    return <PageLoader />;
  }

  return (
    <div style={{ paddingTop: "80px", backgroundColor: "#FDFDFD", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
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
                My Wishlist
              </h1>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.5)", margin: "0.25rem 0 0" }}>
                Items you've saved for later
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

        {loading ? (
          <div style={{ padding: "4rem 0", display: "flex", justifyContent: "center" }}>
            <PageLoader />
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {wishlistItems.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name || product.title}
                price={product.price}
                image={product.image}
                handle={product.handle}
                category={product.category}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "6rem 0", backgroundColor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1E1E", margin: "0 0 0.5rem" }}>
              Your wishlist is empty
            </h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "rgba(30,30,30,0.5)", margin: "0 0 1.5rem" }}>
              Save your favorite items here to easily find them later.
            </p>
            <Link 
              href="/shop"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                borderRadius: "4px"
              }}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
