"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, ShoppingBag, Star, ChevronDown, Truck, RotateCcw, Shield } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { parseProduct, groupProducts } from "@/utils/productGroup";
import { useAuth } from "@/utils/hooks/useAuth";

function getMarkupPrice(id: string, price: number) {
  let hash = 0;
  const str = String(id || "");
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const percent = 30 + Math.abs(hash % 11); // 30-40%
  const rawOriginalPrice = price * (1 + percent / 100);
  
  // Round to nearest 50 and subtract 1 (e.g., 149, 199, 249, 299)
  let roundedOriginalPrice = Math.round(rawOriginalPrice / 50) * 50 - 1;
  
  // Ensure it's higher than the actual price
  if (roundedOriginalPrice <= price) {
    roundedOriginalPrice = Math.ceil(rawOriginalPrice / 10) * 10 - 1;
  }
  
  const discountPercent = Math.round(((roundedOriginalPrice - price) / roundedOriginalPrice) * 100);
  
  return {
    originalPrice: roundedOriginalPrice,
    discount: discountPercent
  };
}

const isWhiteColor = (colorHex: string) => {
  if (!colorHex) return false;
  const normalized = colorHex.trim().toLowerCase();
  return normalized === "#ffffff" || normalized === "white" || normalized === "#fff";
};

interface ProductDetails {
  id: string;
  name: string;
  rawName: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  materials: string;
  sizes: string[];
  colors: string[];
  images: string[];
  rating: number;
  reviews: number;
  badge?: string;
  handle?: string;
}

interface ProductDetailClientProps {
  initialProduct?: any;
}

export function ProductDetailContent({ initialProduct }: ProductDetailClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const queryHandle = searchParams.get("handle");

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [cartAdding, setCartAdding] = useState(false);
  const [colorVariations, setColorVariations] = useState<any[]>([]);
  const [hoveredColorImage, setHoveredColorImage] = useState<string | null>(null);

  // Parse product helper
  const mapRawProduct = (rawProduct: any): ProductDetails => {
    const parsed = parseProduct({ name: rawProduct.title, colors: rawProduct.colors });
    const priceVal = rawProduct.price || parseFloat(rawProduct.variants?.edges?.[0]?.node?.price?.amount || "0");
    const origPriceVal = rawProduct.originalPrice || (rawProduct.variants?.edges?.[0]?.node?.compareAtPrice ? parseFloat(rawProduct.variants?.edges?.[0]?.node?.compareAtPrice?.amount || "0") : undefined);
    return {
      id: rawProduct.id,
      name: parsed.baseName,
      rawName: rawProduct.title,
      price: priceVal,
      originalPrice: origPriceVal,
      category: rawProduct.category || "Tops",
      description: rawProduct.description || "",
      materials: rawProduct.materials || "100% Organic Material. Machine wash cold.",
      sizes: rawProduct.sizes || ["S", "M", "L", "XL"],
      colors: rawProduct.colors || ["#1E1E1E", "#1E1E1E"],
      images: rawProduct.images?.edges?.map((edge: any) => edge.node.url) || [rawProduct.image || ""],
      rating: rawProduct.rating || 4.7,
      reviews: rawProduct.reviews || 48,
      badge: rawProduct.badge,
      handle: rawProduct.handle,
    };
  };

  useEffect(() => {
    const initOrFetchProduct = async () => {
      if (initialProduct) {
        const mapped = mapRawProduct(initialProduct);
        setProduct(mapped);
        setVariants(initialProduct.variants?.edges?.map((edge: any) => edge.node) || []);
        setSelectedColor(mapped.colors[0] || "");
        setSelectedSize(mapped.sizes[0] || "");
        setSelectedImage(0);
        setLoading(false);
        
        // Fetch variations and related products for initial product
        await loadVariationsAndRelated(initialProduct, mapped);
      } else {
        setLoading(true);
        try {
          let res;
          if (queryHandle) {
            res = await api.products.getByHandle(queryHandle);
          } else {
            res = await api.products.get(id || "1");
          }

          const rawProduct = res?.product || res?.productByHandle;
          if (rawProduct) {
            const mapped = mapRawProduct(rawProduct);
            setProduct(mapped);
            setVariants(rawProduct.variants?.edges?.map((edge: any) => edge.node) || []);
            setSelectedColor(mapped.colors[0] || "");
            setSelectedSize(mapped.sizes[0] || "");
            setSelectedImage(0);
            
            await loadVariationsAndRelated(rawProduct, mapped);
          }
        } catch (err) {
          console.error("Failed to load product details:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    const loadVariationsAndRelated = async (rawProduct: any, mappedProduct: ProductDetails) => {
      // Query all products to find matching color variations of the same base cloth name
      try {
        const allRes = await api.products.list(50);
        const allEdges = allRes?.products?.edges || [];
        
        // Map raw product and all other products for suffix matching
        const rawMappedForGroup = {
          id: rawProduct.id,
          name: rawProduct.title,
          handle: rawProduct.handle,
          price: mappedProduct.price,
          originalPrice: mappedProduct.originalPrice,
          image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || "",
          createdAt: rawProduct.createdAt || ""
        };

        const otherMappedForGroup = allEdges
          .filter((edge: any) => edge.node.id !== rawProduct.id)
          .map((edge: any) => {
            const node = edge.node;
            return {
              id: node.id,
              name: node.title,
              handle: node.handle,
              price: node.price || parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || "0"),
              image: node.images?.edges?.[0]?.node?.url || "",
              createdAt: node.createdAt || ""
            };
          });

        const combinedProducts = [rawMappedForGroup, ...otherMappedForGroup];
        const groupedCombined = groupProducts(combinedProducts);

        // Find the group containing the current product
        const currentGroup = groupedCombined.find(g => g.colorVariants.some(v => v.id === rawProduct.id));
        const baseName = currentGroup ? currentGroup.name : mappedProduct.name;

        // Update product name to base name from the group
        if (baseName) {
          setProduct(prev => prev ? { ...prev, name: baseName } : null);
        }

        const variations = currentGroup
          ? currentGroup.colorVariants.map(v => ({
              id: v.id,
              handle: v.handle,
              colorName: v.colorName,
              colorHex: v.colorHex,
              image: v.image
            }))
          : [];

        if (variations.length === 0) {
          const parsed = parseProduct({ name: rawProduct.title, colors: rawProduct.colors });
          variations.push({
            id: rawProduct.id,
            handle: rawProduct.handle,
            colorName: parsed.colorName || "Original",
            colorHex: parsed.colorHex || "#FFFFFF",
            image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || ""
          });
        }

        setColorVariations(variations);

        // Fetch related products and group them
        const listRes = await api.products.list(24);
        const listMapped = listRes?.products?.edges?.map((edge: any) => {
          const node = edge.node;
          return {
            id: node.id,
            name: node.title,
            handle: node.handle,
            price: node.price || parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || "0"),
            image: node.images?.edges?.[0]?.node?.url || "",
            category: node.productType || node.category || "Tops",
          };
        }) || [];
        
        const groupedList = groupProducts(listMapped).filter((p: any) => p.id !== rawProduct.id && p.name.toLowerCase() !== baseName.toLowerCase());
        setRelatedProducts(groupedList.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch variations or related products:", err);
        // Fallback related products
        try {
          const listRes = await api.products.list(6);
          const listMapped = listRes?.products?.edges?.map((edge: any) => {
            const node = edge.node;
            return {
              id: node.id,
              name: node.title,
              handle: node.handle,
              price: node.price || parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || "0"),
              image: node.images?.edges?.[0]?.node?.url || "",
              category: node.productType || node.category || "Tops",
            };
          }).filter((p: any) => p.id !== rawProduct.id) || [];
          setRelatedProducts(listMapped.slice(0, 4));
        } catch (innerErr) {
          console.error("Fallback related products failed:", innerErr);
        }
      }
    };

    initOrFetchProduct();
  }, [id, queryHandle, initialProduct]);

  // Fetch initial wishlist state
  useEffect(() => {
    const checkWishlist = async () => {
      if (!product?.id) return;
      try {
        const res = await api.wishlist.list();
        const isInWishlist = res?.wishlist?.some((item: any) => item.id === product.id);
        setWishlisted(!!isInWishlist);
      } catch (err) {
        console.error("Failed to check wishlist status:", err);
      }
    };
    checkWishlist();
  }, [product?.id]);

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      router.push("/account/login");
      return;
    }
    try {
      if (wishlisted) {
        await api.wishlist.remove(product.id);
        setWishlisted(false);
      } else {
        await api.wishlist.add(product.id);
        setWishlisted(true);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const handleAddToBag = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      router.push("/account/login");
      return;
    }
    setCartAdding(true);
    
    // Find matching variant
    const selectedVariant = variants.find(v => v.title.toLowerCase().includes(selectedSize.toLowerCase())) || variants[0];
    const variantId = selectedVariant?.id || (product.id && product.id.startsWith("gid://shopify/")
      ? product.id.replace("/Product/", "/ProductVariant/")
      : `gid://shopify/ProductVariant/${product.id}`);
    
    try {
      let cartId = localStorage.getItem("nomadica_cart_id");
      let updatedCart;
      
      if (!cartId) {
        const res = await api.cart.create([{
          merchandiseId: variantId,
          quantity: quantity,
          title: selectedSize,
          price: product.price,
          productTitle: product.name,
          image: product.images[0] || ""
        }]);
        const newCart = res?.cartCreate?.cart || res?.cart;
        if (newCart?.id) {
          cartId = newCart.id;
          localStorage.setItem("nomadica_cart_id", newCart.id);
          updatedCart = newCart;
        }
      } else {
        const res = await api.cart.update(cartId, {
          lines: [{
            merchandiseId: variantId,
            quantity: quantity,
            title: selectedSize,
            price: product.price,
            productTitle: product.name,
            image: product.images[0] || ""
          }]
        });
        updatedCart = res?.cartLinesUpdate?.cart || res?.cart;
      }
      
      // Notify Navbar to update and open Cart Drawer
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: { openDrawer: true } }));
    } catch (err) {
      console.error("Failed to add to bag:", err);
    } finally {
      setCartAdding(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div style={{ paddingTop: "100px", paddingBottom: "100px", textAlign: "center", backgroundColor: "#FFFFFF", minHeight: "100vh", fontFamily: "Montserrat" }}>
        <h1 style={{ fontFamily: "Playfair Display" }}>Product Not Found</h1>
        <p style={{ margin: "1rem 0" }}>The product you are looking for could not be found.</p>
        <Link href="/shop" style={{ color: "#1E1E1E", textDecoration: "underline", fontWeight: 500 }}>Back to Shop</Link>
      </div>
    );
  }

  const { originalPrice: markupPrice, discount: markupDiscount } = getMarkupPrice(product.id, product.price);

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {["Home", "Shop", product.category, product.name].map((crumb, i, arr) => (
            <span key={crumb} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link
                href={i === 0 ? "/" : i === 1 ? "/shop" : "#"}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.8125rem",
                  color: i === arr.length - 1 ? "#1E1E1E" : "rgba(30,30,30,0.4)",
                  textDecoration: "none",
                  fontWeight: i === arr.length - 1 ? 500 : 400,
                }}
              >
                {crumb}
              </Link>
              {i < arr.length - 1 && (
                <span style={{ color: "rgba(30,30,30,0.3)", fontSize: "0.75rem" }}>/</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4rem",
          alignItems: "start",
        }}
      >
        {/* Images */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "start" }}>
          {/* Color Variations Stack (Vertical, on the left) */}
          {colorVariations.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "80px", flexShrink: 0 }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(30,30,30,0.5)", margin: 0, textAlign: "center" }}>
                Variants
              </p>
              {colorVariations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    if (v.handle) {
                      router.push(`/products/${v.handle}`);
                    } else {
                      router.push(`/shop/product-details?id=${v.id}`);
                    }
                  }}
                  onMouseEnter={() => {
                    setHoveredColorImage(v.image);
                  }}
                  onMouseLeave={() => {
                    setHoveredColorImage(null);
                  }}
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3/4",
                    overflow: "hidden",
                    border: product.id === v.id ? "2px solid #1E1E1E" : "1px solid rgba(30, 30, 30, 0.15)",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                    transition: "all 0.2s ease",
                  }}
                  title={v.colorName}
                >
                  <img src={v.image} alt={v.colorName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {/* Small Color Dot Indicator in bottom-right corner of thumbnail */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      right: "4px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: v.colorHex,
                      border: isWhiteColor(v.colorHex) ? "1px solid #1E1E1E" : "1px solid rgba(255, 255, 255,0.8)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image + Standard Thumbnails */}
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            {/* Main image */}
            <div
              style={{
                position: "relative",
                aspectRatio: "3/4",
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
                marginBottom: "0.75rem",
              }}
            >
              <img
                src={hoveredColorImage || product.images[selectedImage]}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s ease" }}
              />
            </div>

            {/* Thumbnails (for standard photos of current color product) */}
            <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    flexShrink: 0,
                    width: "80px",
                    aspectRatio: "1",
                    overflow: "hidden",
                    border: selectedImage === i ? "2px solid #1E1E1E" : "2px solid transparent",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ paddingTop: "0.5rem" }}>
          {product.badge && (
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                backgroundColor: "#4F6B5A",
                color: "#FFFFFF",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              {product.badge}
            </span>
          )}

          <h1
            style={{
              fontFamily: "'Playfair Display', sans-serif",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 600,
              color: "#1E1E1E",
              letterSpacing: "-0.01em",
              marginBottom: "0.75rem",
              lineHeight: 1.15,
            }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  fill={star <= Math.floor(product.rating) ? "#1E1E1E" : "none"}
                  stroke="#1E1E1E"
                />
              ))}
            </div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "1.125rem",
                color: "rgba(30,30,30,0.35)",
                textDecoration: "line-through",
              }}
            >
              ₹{markupPrice.toLocaleString("en-IN")}
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', sans-serif",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#1E1E1E",
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span
              style={{
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                padding: "0.2rem 0.5rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {markupDiscount}% OFF
            </span>
          </div>

          {/* Color */}
          <div style={{ marginBottom: "1.5rem" }}>
            {colorVariations.length > 1 ? (
              <>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 500, color: "#1E1E1E", marginBottom: "0.75rem" }}>
                  Colour: <span style={{ fontWeight: 400, color: "rgba(30,30,30,0.6)" }}>{colorVariations.find(v => v.id === product.id)?.colorName || parseProduct({ name: product.rawName }).colorName}</span>
                </p>
                <div style={{ display: "flex", gap: "0.625rem" }}>
                  {colorVariations.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        if (v.handle) {
                          router.push(`/products/${v.handle}`);
                        } else {
                          router.push(`/shop/product-details?id=${v.id}`);
                        }
                      }}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: v.colorHex,
                        border: product.id === v.id
                          ? "2px solid #1E1E1E"
                          : (isWhiteColor(v.colorHex) ? "1px solid #1E1E1E" : "2px solid transparent"),
                        outline: product.id === v.id ? "1px solid #1E1E1E" : "none",
                        outlineOffset: "2px",
                        cursor: "pointer",
                        padding: 0,
                        transition: "transform 0.15s ease",
                      }}
                      title={v.colorName}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                        setHoveredColorImage(v.image);
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                        setHoveredColorImage(null);
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 500, color: "#1E1E1E", marginBottom: "0.75rem" }}>
                  Colour
                </p>
                <div style={{ display: "flex", gap: "0.625rem" }}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        border: selectedColor === color
                          ? "2px solid #1E1E1E"
                          : (isWhiteColor(color) ? "1px solid #1E1E1E" : "2px solid transparent"),
                        outline: selectedColor === color ? "1px solid #1E1E1E" : "none",
                        outlineOffset: "2px",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Size */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 500, color: "#1E1E1E" }}>
                Size
              </p>
              <button style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "#1E1E1E", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Size Guide
              </button>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: "48px",
                    height: "48px",
                    border: selectedSize === size ? "1px solid #1E1E1E" : "1px solid rgba(30,30,30,0.2)",
                    backgroundColor: selectedSize === size ? "#1E1E1E" : "transparent",
                    color: selectedSize === size ? "#FFFFFF" : "#1E1E1E",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add to cart */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(30,30,30,0.2)",
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: "44px",
                  height: "52px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                  color: "#1E1E1E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span
                style={{
                  width: "44px",
                  textAlign: "center",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "#1E1E1E",
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: "44px",
                  height: "52px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                  color: "#1E1E1E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToBag}
              disabled={cartAdding}
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center", opacity: cartAdding ? 0.7 : 1 }}
            >
              <ShoppingBag size={16} />
              {cartAdding ? "Adding..." : "Add to Bag"}
            </button>

            <button
              onClick={handleWishlistToggle}
              style={{
                width: "52px",
                height: "52px",
                border: "1px solid rgba(30,30,30,0.2)",
                backgroundColor: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: wishlisted ? "#1E1E1E" : "#1E1E1E",
                flexShrink: 0,
              }}
            >
              <Heart size={18} fill={wishlisted ? "#1E1E1E" : "none"} />
            </button>
          </div>

          {/* Service badges */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              padding: "1.5rem 0",
              borderTop: "1px solid rgba(30,30,30,0.1)",
              borderBottom: "1px solid rgba(30,30,30,0.1)",
              marginBottom: "1.5rem",
            }}
          >
            {[
              { icon: Truck, label: "Free Delivery", sub: "On orders over ₹2000" },
              { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
              { icon: Shield, label: "Secure Pay", sub: "UPI, Cards, Wallets" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <Icon size={18} style={{ marginBottom: "0.375rem", color: "#1E1E1E" }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "0.125rem" }}>{label}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.6875rem", color: "rgba(30,30,30,0.5)" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Accordion */}
          {[
            { id: "description", label: "Description", content: product.description },
            { id: "materials", label: "Materials & Care", content: product.materials },
          ].map((section) => (
            <div key={section.id} style={{ borderBottom: "1px solid rgba(30,30,30,0.1)" }}>
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.125rem 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "#1E1E1E",
                }}
              >
                {section.label}
                <ChevronDown
                  size={16}
                  style={{
                    transform: openSection === section.id ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {openSection === section.id && (
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.9rem",
                    color: "rgba(30,30,30,0.65)",
                    lineHeight: 1.8,
                    paddingBottom: "1.25rem",
                  }}
                >
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related products */}
      <div style={{ maxWidth: "1400px", margin: "4rem auto 0", padding: "0 1.5rem 5rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "2rem", fontWeight: 600, color: "#1E1E1E", marginBottom: "2rem", letterSpacing: "-0.01em" }}>
          You May Also Like
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {relatedProducts.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductDetailContent initialProduct={initialProduct} />
    </Suspense>
  );
}
