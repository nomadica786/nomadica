"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { PageLoader } from "@/components/ui/PageLoader";
import WishlistCard from "@/components/shop/WishlistCard";
import QuickViewModal from "@/components/shop/QuickViewModal";
import { api } from "@/components/api/api";
import { useAuth } from "@/utils/hooks/useAuth";

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

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
    fetchWishlist();
    const handleWishlistUpdate = () => fetchWishlist();
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, []);

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

  if (authLoading || !isAuthenticated) {
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
        <div style={{ maxWidth: "1800px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
          
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {wishlistItems.map((product) => (
                <WishlistCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  onRemove={handleRemoveItem}
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
