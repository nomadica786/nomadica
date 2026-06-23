"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, ShoppingCart, Star, ChevronDown } from "lucide-react";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { parseProduct, groupProducts } from "@/utils/productGroup";
import { useAuth } from "@/utils/hooks/useAuth";
import Image from "next/image";
import { getShopifyImageUrl } from "@/lib/images/shopifyImage";

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

const ThoughtfulIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C3F30" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V10" />
    <path d="M12 12c1.5-1.5 3-1.5 3-3.5S13.5 6 12 8.5" />
    <path d="M12 12c-1.5-1.5-3-1.5-3-3.5S10.5 6 12 8.5" />
    <path d="M2 14c2 2 4 4 7 4h6c3 0 5-2 7-4" />
  </svg>
);

const QualityIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C3F30" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M9 12.5l-2 5.5l5-2l5 2l-2-5.5" />
    <path d="M9.5 8l1.5 1.5l3.5-3.5" />
  </svg>
);

const SecureIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C3F30" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <rect x="9.5" y="11" width="5" height="4" rx="0.5" />
    <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
  </svg>
);

const IndiaIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C3F30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="1.5" />
    <path d="M12 4v16" />
    <path d="M4 12h16" />
    <path d="M6.34 6.34l11.32 11.32" />
    <path d="M17.66 6.34L6.34 17.66" />
  </svg>
);

const FreeShippingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C3F30" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="13" height="11" rx="1" />
    <polygon points="15 7 19 7 22 10 22 15 15 15" />
    <circle cx="6.5" cy="17" r="2" />
    <circle cx="17.5" cy="17" r="2" />
  </svg>
);

const AccordionItem = ({
  title,
  isOpen,
  onToggle,
  children
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div style={{ borderBottom: "1px solid rgba(30, 30, 30, 0.1)" }}>
      <button
        onClick={onToggle}
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
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#1E1E1E",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          textAlign: "left"
        }}
      >
        {title}
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            color: "#1E1E1E"
          }}
        />
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden"
        }}
      >
        <div style={{ minHeight: "0px" }}>
          <div style={{ paddingBottom: "1.25rem", color: "rgba(30,30,30,0.7)", fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", lineHeight: "1.6" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

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
    materials: rawProduct.materials || "100% Cotton. Premium quality.",
    sizes: rawProduct.sizes || ["XS - 36", "S - 38", "M - 40", "L - 42", "XL - 44", "XXL - 46"],
    colors: rawProduct.colors || ["#1E1E1E", "#1E1E1E"],
    images: rawProduct.images?.edges?.map((edge: any) => edge.node.url) || [rawProduct.image || ""],
    rating: rawProduct.rating || 4.5,
    reviews: rawProduct.reviews || 3448,
    badge: rawProduct.badge,
    handle: rawProduct.handle,
  };
};

export function ProductDetailContent({ initialProduct }: ProductDetailClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const queryHandle = searchParams.get("handle");

  const [product, setProduct] = useState<ProductDetails | null>(() => {
    return initialProduct ? mapRawProduct(initialProduct) : null;
  });
  const [variants, setVariants] = useState<any[]>(() => {
    return initialProduct?.variants?.edges?.map((edge: any) => edge.node) || [];
  });
  const [loading, setLoading] = useState(() => !initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("S - 38");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [cartAdding, setCartAdding] = useState(false);
  const [colorVariations, setColorVariations] = useState<any[]>([]);
  const [hoveredColorImage, setHoveredColorImage] = useState<string | null>(null);
  const [hoveredSwatchId, setHoveredSwatchId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [relatedActiveVariants, setRelatedActiveVariants] = useState<Record<string, any>>({});
  
  const [openAccordion, setOpenAccordion] = useState<Record<string, boolean>>({
    details: false,
    sizeChart: false,
    shipping: false,
    usage: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordion(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    const initOrFetchProduct = async () => {
      if (initialProduct) {
        const mapped = mapRawProduct(initialProduct);
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
            setSelectedSize("S - 38");
            setSelectedImage(0);
            setLoading(false);
            
            await loadVariationsAndRelated(rawProduct, mapped);
          }
        } catch (err) {
          console.error("Failed to load product details:", err);
          setLoading(false);
        }
      }
    };

    const loadVariationsAndRelated = async (rawProduct: any, mappedProduct: ProductDetails) => {
      try {
        const allRes = await api.products.list(50);
        const allEdges = allRes?.products?.edges || [];
        
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

        const currentGroup = groupedCombined.find(g => g.colorVariants.some(v => v.id === rawProduct.id));
        const baseName = currentGroup ? currentGroup.name : mappedProduct.name;

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
    
    const baseSize = selectedSize.split(" - ")[0] || selectedSize;
    const selectedVariant = variants.find(v => v.title.toLowerCase().includes(baseSize.toLowerCase())) || variants[0];
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
          {["Home", "Shop", product.name].map((crumb, i, arr) => (
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
                  <Image src={getShopifyImageUrl(v.image, 160)} alt={v.colorName} fill sizes="80px" style={{ objectFit: "cover" }} />
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
              <Image
                src={getShopifyImageUrl(hoveredColorImage || product.images[selectedImage], 800)}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "cover", transition: "opacity 0.3s ease" }}
              />

              {/* Floating Heart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleWishlistToggle();
                }}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  zIndex: 5,
                  transition: "transform 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                }}
                aria-label="Toggle wishlist"
              >
                <Heart size={20} fill={wishlisted ? "#1E1E1E" : "none"} color="#1E1E1E" />
              </button>
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
                    position: "relative",
                  }}
                >
                  <Image src={getShopifyImageUrl(img, 160)} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details Content (Right Side) */}
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
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#1E1E1E" }}>
              {product.rating}
            </span>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  fill={star <= Math.floor(product.rating) ? "#FF9800" : "none"}
                  stroke="#FF9800"
                />
              ))}
            </div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>
              ({product.reviews.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1E1E1E",
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
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
                backgroundColor: "#1E3A2F",
                color: "#FFFFFF",
                padding: "0.25rem 0.625rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: "2px",
              }}
            >
              {markupDiscount}% OFF
            </span>
          </div>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.4)", margin: "0 0 2rem 0" }}>
            Taxes Included
          </p>

          {/* Size */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 600, color: "#1E1E1E", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
              SIZE
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["XS - 36", "S - 38", "M - 40", "L - 42", "XL - 44", "XXL - 46"].map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      height: "44px",
                      padding: "0 1.25rem",
                      border: isSelected ? "1.5px solid #C1A886" : "1px solid rgba(30, 30, 30, 0.15)",
                      backgroundColor: isSelected ? "#C1A886" : "#FFFFFF",
                      color: isSelected ? "#FFFFFF" : "#1E1E1E",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 600, color: "#1E1E1E", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
              COLOR: <span style={{ fontWeight: 400, color: "rgba(30,30,30,0.6)" }}>{colorVariations.find(v => v.id === product.id)?.colorName || parseProduct({ name: product.rawName }).colorName}</span>
            </p>
            <div style={{ display: "flex", gap: "0.625rem" }}>
              {colorVariations.map((v) => {
                const isCurrent = product.id === v.id;
                const isHovered = hoveredSwatchId === v.id;
                return (
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
                      border: (isCurrent || isHovered)
                        ? "2px solid #1E1E1E"
                        : (isWhiteColor(v.colorHex) ? "1px solid #1E1E1E" : "1px solid rgba(0,0,0,0.1)"),
                      outline: isCurrent ? "1px solid #1E1E1E" : "none",
                      outlineOffset: "2px",
                      cursor: "pointer",
                      padding: 0,
                      transform: isCurrent ? "scale(1.1)" : (isHovered ? "scale(1.15)" : "scale(1)"),
                      transition: "transform 0.2s ease, border-color 0.2s ease",
                    }}
                    title={v.colorName}
                    onMouseEnter={() => {
                      setHoveredSwatchId(v.id);
                      setHoveredColorImage(v.image);
                    }}
                    onMouseLeave={() => {
                      setHoveredSwatchId(null);
                      setHoveredColorImage(null);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Qty + Add to cart */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 600, color: "#1E1E1E", textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
              QUANTITY
            </p>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: "44px",
                    height: "44px",
                    border: "1px solid rgba(30, 30, 30, 0.15)",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    color: "#1E1E1E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    transition: "border-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1E1E1E"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(30, 30, 30, 0.15)"}
                >
                  −
                </button>
                <span
                  style={{
                    width: "40px",
                    textAlign: "center",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#1E1E1E",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: "44px",
                    height: "44px",
                    border: "1px solid rgba(30, 30, 30, 0.15)",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    color: "#1E1E1E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    transition: "border-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1E1E1E"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(30, 30, 30, 0.15)"}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToBag}
                disabled={cartAdding}
                style={{
                  flex: 1,
                  height: "44px",
                  backgroundColor: "#C1A886",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  opacity: cartAdding ? 0.7 : 1,
                  transition: "background-color 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (!cartAdding) (e.currentTarget as HTMLElement).style.backgroundColor = "#A88E6D";
                }}
                onMouseLeave={(e) => {
                  if (!cartAdding) (e.currentTarget as HTMLElement).style.backgroundColor = "#C1A886";
                }}
              >
                <ShoppingCart size={16} />
                {cartAdding ? "ADDING..." : "ADD TO CART"}
              </button>
            </div>
          </div>

          {/* Buy Now */}
          <button
            onClick={async () => {
              await handleAddToBag();
              router.push("/checkout");
            }}
            style={{
              width: "100%",
              height: "48px",
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
              marginBottom: "2rem",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#000000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#1E1E1E";
            }}
          >
            BUY NOW
          </button>

          {/* Trust Badges */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(30, 30, 30, 0.05)",
              borderRadius: "8px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "0.25rem",
              padding: "1.25rem 0.5rem",
              marginBottom: "2rem",
              alignItems: "start"
            }}
          >
            {[
              { icon: ThoughtfulIcon, label: "Thoughtful Designs" },
              { icon: QualityIcon, label: "Quality Assured" },
              { icon: SecureIcon, label: "Secure Payments" },
              { icon: IndiaIcon, label: "Made in India" },
              { icon: FreeShippingIcon, label: "Free Shipping" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Icon />
                </div>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: "#1C3F30",
                    lineHeight: "1.3",
                    margin: 0,
                    padding: "0 2px"
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Accordion List */}
          <div style={{ borderTop: "1px solid rgba(30, 30, 30, 0.1)" }}>
            <AccordionItem
              title="Product Details"
              isOpen={openAccordion.details}
              onToggle={() => toggleAccordion("details")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <div>Unisex T-Shirts</div>
                <div>100% Cotton</div>
                <div>Premium quality</div>
                <div>Soft, breathable fabric</div>
                <div>Durable print that lasts</div>
              </div>
            </AccordionItem>

            <AccordionItem
              title="Size Chart"
              isOpen={openAccordion.sizeChart}
              onToggle={() => toggleAccordion("sizeChart")}
            >
              <div style={{ paddingTop: "0.5rem" }}>
                <img
                  src="/Size_Chart.jpg"
                  alt="Size Chart"
                  style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                />
              </div>
            </AccordionItem>

            <AccordionItem
              title="Shipping & Delivery"
              isOpen={openAccordion.shipping}
              onToggle={() => toggleAccordion("shipping")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <div>Orders are processed within 2–3 business days</div>
                <div>Delivery within 5–7 business days</div>
                <div>3-days return policy</div>
              </div>
            </AccordionItem>

            <AccordionItem
              title="Usage Instructions"
              isOpen={openAccordion.usage}
              onToggle={() => toggleAccordion("usage")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <div>Wash the T-shirt inside out</div>
                <div>Do not twist or wring the t-shirt while drying (this may damage the print)</div>
                <div>Do not tumble dry</div>
                <div>Iron inside out and do not use iron directly on the print</div>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div style={{ backgroundColor: "#F5F3F0", width: "100%", padding: "5rem 0", marginTop: "4rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', sans-serif",
              fontSize: "2rem",
              fontWeight: 600,
              color: "#1E1E1E",
              marginBottom: "3rem",
              letterSpacing: "-0.01em",
              textAlign: "center"
            }}
          >
            You May Also Like
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {relatedProducts.map((p) => {
              const isHovered = hoveredCardId === p.id;
              const activeVar = relatedActiveVariants[p.id] || p.colorVariants?.[0] || null;
              
              const price = (activeVar && activeVar.price) 
                ? (typeof activeVar.price === "number" ? activeVar.price : parseFloat(activeVar.price || "0")) 
                : (typeof p.price === "number" ? p.price : parseFloat(p.price || "0"));
              
              const originalPrice = (activeVar && activeVar.originalPrice) 
                ? activeVar.originalPrice 
                : p.originalPrice;
              
              const pTitle = activeVar ? (activeVar.name || p.name || p.title || "Product") : (p.name || p.title || "Product");
              const pImage = activeVar ? activeVar.image : (p.image || p.images?.[0]?.node?.url);
              const pHandle = activeVar ? (activeVar.handle || p.handle) : p.handle;

              return (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(30, 30, 30, 0.05)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: isHovered ? "0 8px 25px rgba(0,0,0,0.06)" : "0 4px 15px rgba(0,0,0,0.02)",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={() => setHoveredCardId(p.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  {/* Image Container */}
                  <Link href={`/products/${pHandle}`} style={{ textDecoration: "none", display: "block" }}>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "653.27 / 978",
                        overflow: "hidden",
                        backgroundColor: "#F9F9F9"
                      }}
                    >
                      <Image
                        src={getShopifyImageUrl(pImage, 600)}
                        alt={pTitle}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{
                          objectFit: "cover",
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                          transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
                        }}
                      />

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const event = new CustomEvent("add-to-wishlist", { detail: { handle: pHandle } });
                          window.dispatchEvent(event);
                        }}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#FFFFFF",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          zIndex: 5,
                          transition: "transform 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                        }}
                        aria-label="Add to wishlist"
                      >
                        <Heart size={18} color="#1E1E1E" />
                      </button>
                    </div>
                  </Link>

                  {/* Info Container */}
                  <div style={{ padding: "1.25rem", textAlign: "center" }}>
                    {/* Title */}
                    <Link href={`/products/${pHandle}`} style={{ textDecoration: "none" }}>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.125rem",
                          fontWeight: 600,
                          color: isHovered ? "#C1A886" : "#1E1E1E",
                          margin: "0 0 0.5rem 0",
                          transition: "color 0.2s ease"
                        }}
                      >
                        {pTitle}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: "#1E1E1E", fontSize: "1rem" }}>
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      {originalPrice && (
                        <span style={{ fontFamily: "'Montserrat', sans-serif", textDecoration: "line-through", color: "rgba(30,30,30,0.4)", fontSize: "0.875rem" }}>
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Swatches */}
                    {p.colorVariants && p.colorVariants.length > 1 && (
                      <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", minHeight: "22px" }}>
                        {p.colorVariants.map((v: any) => {
                          const isSelected = activeVar ? activeVar.id === v.id : false;
                          const isWhite = v.colorHex?.toLowerCase() === "#ffffff" || v.colorHex?.toLowerCase() === "white";
                          
                          return (
                            <div key={v.id} className="dest-swatch-wrap" style={{ width: "22px", height: "22px" }}>
                              <button
                                onMouseEnter={() => {
                                  setRelatedActiveVariants(prev => ({ ...prev, [p.id]: v }));
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setRelatedActiveVariants(prev => ({ ...prev, [p.id]: v }));
                                }}
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  borderRadius: "50%",
                                  backgroundColor: v.colorHex,
                                  border: isSelected 
                                    ? "2px solid #1E1E1E" 
                                    : (isWhite ? "1.5px solid rgba(30, 30, 30, 0.4)" : "1px solid rgba(0,0,0,0.15)"),
                                  boxShadow: isSelected ? "0 0 0 1.5px #FFFFFF inset" : "none",
                                  padding: 0,
                                  cursor: "pointer",
                                  transition: "all 0.15s ease",
                                  transform: isSelected ? "scale(1.25)" : "scale(1)",
                                }}
                                aria-label={`Select color ${v.colorName}`}
                                title={v.colorName}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
