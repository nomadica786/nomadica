"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Heart } from "lucide-react";
import { PageLoader } from "@/components/ui/PageLoader";
import ProductCard from "@/components/shop/ProductCard";
import QuickViewModal from "@/components/shop/QuickViewModal";
import { api } from "@/components/api/api";
import { useAuth } from "@/utils/hooks/useAuth";

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/account/login?redirect=/account/wishlist");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleRemoveItem = async (id: string) => {
    try {
      await api.wishlist.remove(id);
      await fetchWishlist();
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const fetchWishlist = async () => {
    try {
      // Fetch wishlist
      const res = await api.wishlist.list();
      const rawWishlist = res?.wishlist || [];

      // If empty, just set and return
      if (rawWishlist.length === 0) {
        setWishlistItems([]);
        return;
      }

      // Fetch all products to group them and get other color variants
      const allRes = await api.products.list(250);
      const allEdges = allRes?.products?.edges || [];
      const mappedAll = allEdges.map((edge: any) => {
        const node = edge.node;
        return {
          id: node.id,
          name: node.title,
          price: parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || '0'),
          originalPrice: parseFloat(node.variants?.edges?.[0]?.node?.compareAtPrice?.amount || '0') || undefined,
          image: node.images?.edges?.[0]?.node?.url || '',
          hoverImage: node.images?.edges?.[1]?.node?.url || node.images?.edges?.[0]?.node?.url || '',
          badge: node.badge,
          category: node.productType || node.category || 'Tops',
          productType: node.productType || node.category || 'Tops',
          handle: node.handle,
          collections: node.collections?.edges?.map((e: any) => e.node.title) || [],
          variants: node.variants,
        };
      });

      // Fetch mockups for grouping
      let mockups = {};
      try {
        const mRes = await api.mockups.get();
        mockups = mRes?.mockups || {};
      } catch(e) {}

      // Dynamically import groupProducts
      const { groupProducts } = await import("@/utils/productGroup");
      const grouped = groupProducts(mappedAll.length ? mappedAll : rawWishlist, mockups);

      // Enrich wishlist items with colorVariants
      const enriched = rawWishlist.map((wishItem: any) => {
        const targetId = wishItem.productId || wishItem.id;
        const group = grouped.find((g: any) => g.colorVariants.some((cv: any) => cv.id === targetId));
        if (group) {
          const activeColor = group.colorVariants.find((cv: any) => cv.id === targetId);
          return {
            ...wishItem,
            id: targetId,
            productId: targetId,
            colorVariants: group.colorVariants,
            mockupImage: group.mockupImage || wishItem.mockupImage,
            name: activeColor && activeColor.colorName !== "Original" ? `${activeColor.colorName} ${group.name}` : group.name,
            image: activeColor?.image || group.image,
            price: activeColor?.price || group.price,
            originalPrice: activeColor?.originalPrice || group.originalPrice,
            allVariants: group.allVariants
          };
        }
        return wishItem;
      });

      setWishlistItems(enriched);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else if (!authLoading) {
      setLoading(false);
      setWishlistItems([]);
    }
    const handleWishlistUpdate = () => {
      if (isAuthenticated) fetchWishlist();
    };
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, [isAuthenticated, authLoading]);

  const handleClearAll = async () => {
    if (!wishlistItems.length) return;
    setLoading(true);
    try {
      await Promise.all(wishlistItems.map((item) => api.wishlist.remove(item.id)));
      await fetchWishlist();
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#FAF8F5",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "rgba(30,30,30,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heart size={32} color="#1E1E1E" />
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 500,
            color: "#1E1E1E",
            margin: 0,
          }}
        >
          Sign In to View Wishlist
        </h1>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.95rem",
            color: "#666",
            maxWidth: "420px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Save and track your favorite travel-inspired styles across all devices. Please sign in or create an account to view your wishlist.
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <Link href="/account/login?redirect=/account/wishlist" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "0.75rem 2rem" }}>
              Sign In
            </button>
          </Link>
          <Link href="/account/signup" style={{ textDecoration: "none" }}>
            <button className="btn-outline" style={{ padding: "0.75rem 2rem" }}>
              Create Account
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PageLoader />;
  }

  const itemsText = wishlistItems.length === 1 ? "1 item saved" : `${wishlistItems.length} items saved`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .wishlist-actions-bar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        .clear-all-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background: none;
            border: none;
            color: #8B7D6B;
            font-family: 'Montserrat', sans-serif;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        .clear-all-btn:hover {
            background: rgba(0,0,0,0.03);
            color: red;
        }
        .wishlist-image-hover {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .wishlist-product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
      `}} />

      <div style={{ backgroundColor: "#FDFDFD", minHeight: "100vh" }}>
        
        {/* Banner Section */}
        <div style={{
          width: "100%",
          height: "280px",
          backgroundImage: "url('/sand-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#1E1E1E",
          textAlign: "center",
          padding: "0 1.5rem"
        }}>
          <h1 style={{
            fontSize: "42px",
            fontWeight: 300,
            marginBottom: "16px",
            fontFamily: "'Playfair Display', serif",
            margin: "0 0 16px 0"
          }}>
            My Wishlist
          </h1>
          <p style={{
            fontSize: "16px",
            fontWeight: 400,
            fontFamily: "'Montserrat', sans-serif",
            margin: 0
          }}>
            {itemsText}
          </p>
        </div>

        {/* Content Section */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
          
          <div className="wishlist-actions-bar">
            <button className="clear-all-btn" onClick={handleClearAll} disabled={wishlistItems.length === 0 || loading}>
              <Trash2 size={14} />
              Clear All
            </button>
          </div>

          {loading ? (
            <div style={{ padding: "4rem 0", display: "flex", justifyContent: "center" }}>
              <PageLoader />
            </div>
          ) : wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  showAddToCart={true}
                  onAddToCart={() => setQuickViewProduct(product)}
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
      
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </>
  );
}
