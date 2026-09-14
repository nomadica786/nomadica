"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, ShoppingCart, Star, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import ProductCard from "@/components/shop/ProductCard";
import { ProductCarouselSection } from "@/components/shop/ProductCarouselSection";
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
  initialAllEdges?: any[];
  initialMockupLookup?: Record<string, any>;
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

// Module-level cache for grouped color variations so they are instantly available across navigations in stable order
const cachedVariationsByGroup: Record<string, any[]> = {};

function getInitialMockup(rawProduct: any, mockupLookup: Record<string, any>) {
  if (!rawProduct) return undefined;
  const productType = rawProduct.productType || rawProduct.category || "Tee";
  let config = mockupLookup[productType];
  if (!config) {
    const lowerType = productType.toLowerCase();
    for (const [key, val] of Object.entries(mockupLookup)) {
      if (lowerType.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerType)) {
        config = val;
        break;
      }
    }
  }
  if (!config && (productType.toLowerCase().includes("tee") || productType.toLowerCase().includes("t-shirt"))) {
    config = mockupLookup["Tee"];
  }
  return typeof config === "object" ? config.mockupImage : config;
}

function computeVariations(rawProduct: any, allEdges: any[], mockupLookup: Record<string, any>) {
  if (!rawProduct || !allEdges?.length) return [];
  const allMapped = allEdges.map((edge: any) => {
    const node = edge.node;
    if (node.id === rawProduct.id) {
      return {
        id: rawProduct.id,
        name: rawProduct.title,
        handle: rawProduct.handle,
        price: parseFloat(rawProduct.variants?.edges?.[0]?.node?.price?.amount || "0"),
        originalPrice: parseFloat(rawProduct.variants?.edges?.[0]?.node?.compareAtPrice?.amount || "0") || undefined,
        image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || "",
        category: rawProduct.productType || rawProduct.category || "Tops",
        productType: rawProduct.productType || rawProduct.category || "Tops",
        createdAt: rawProduct.createdAt || node.createdAt || ""
      };
    }
    return {
      id: node.id,
      name: node.title,
      handle: node.handle,
      price: node.price || parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || "0"),
      image: node.images?.edges?.[0]?.node?.url || "",
      category: node.productType || node.category || "Tops",
      productType: node.productType || node.category || "Tops",
      createdAt: node.createdAt || ""
    };
  });
  if (!allMapped.some((p: any) => p.id === rawProduct.id)) {
    allMapped.push({
      id: rawProduct.id,
      name: rawProduct.title,
      handle: rawProduct.handle,
      price: parseFloat(rawProduct.variants?.edges?.[0]?.node?.price?.amount || "0"),
      originalPrice: parseFloat(rawProduct.variants?.edges?.[0]?.node?.compareAtPrice?.amount || "0") || undefined,
      image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || "",
      category: rawProduct.productType || rawProduct.category || "Tops",
      productType: rawProduct.productType || rawProduct.category || "Tops",
      createdAt: rawProduct.createdAt || ""
    });
  }
  const grouped = groupProducts(allMapped, mockupLookup);
  const currentGroup = grouped.find(g => 
    g.colorVariants.some(v => v.id === rawProduct.id) ||
    g.productType?.toLowerCase() === (rawProduct.productType || rawProduct.category || "").toLowerCase()
  );
  if (!currentGroup) return [];
  const vars = currentGroup.colorVariants.map(v => ({
    id: v.id,
    handle: v.handle,
    colorName: v.colorName,
    colorHex: v.colorHex,
    image: v.image,
    createdAt: v.createdAt
  }));
  if (!vars.some(v => v.id === rawProduct.id)) {
    const parsed = parseProduct({ name: rawProduct.title, colors: rawProduct.colors });
    const matchIdx = vars.findIndex(v => v.colorHex.toLowerCase() === (parsed.colorHex || "").toLowerCase());
    const rep = {
      id: rawProduct.id,
      handle: rawProduct.handle,
      colorName: parsed.colorName || "Original",
      colorHex: parsed.colorHex || "#FFFFFF",
      image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || "",
      createdAt: rawProduct.createdAt || ""
    };
    if (matchIdx !== -1) {
      vars[matchIdx] = rep;
    } else {
      vars.push(rep);
    }
  }
  vars.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });
  return vars;
}

export function ProductDetailContent({ initialProduct, initialAllEdges, initialMockupLookup }: ProductDetailClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const queryHandle = searchParams.get("handle");

  const [mockupLookupState, setMockupLookupState] = useState<Record<string, any>>(() => initialMockupLookup || {});
  const [allProductsList, setAllProductsList] = useState<any[]>(() => {
    const list = initialAllEdges?.map((e: any) => e.node || e) || [];
    if (initialProduct && !list.some((p: any) => p.id === initialProduct.id)) {
      list.push(initialProduct);
    }
    return list;
  });

  const [product, setProduct] = useState<ProductDetails | null>(() => {
    if (!initialProduct) return null;
    const mapped = mapRawProduct(initialProduct);
    const mock = getInitialMockup(initialProduct, initialMockupLookup || {});
    if (mock) {
      const filtered = (mapped.images || []).filter(img => img !== mock);
      const actualImg = initialProduct.image || initialProduct.images?.edges?.[0]?.node?.url || "";
      if (filtered.length === 0 && actualImg) {
        filtered.push(actualImg);
      }
      mapped.images = [mock, ...filtered];
    }
    return mapped;
  });
  const [variants, setVariants] = useState<any[]>(() => {
    return initialProduct?.variants?.edges?.map((edge: any) => edge.node) || [];
  });
  const [loading, setLoading] = useState(() => !initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("XS - 36");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [cartAdding, setCartAdding] = useState(false);
  const initialGroupKey = (initialProduct?.productType || initialProduct?.category || "Tee").toLowerCase();
  const [colorVariations, setColorVariations] = useState<any[]>(() => {
    if (initialProduct && initialAllEdges && initialAllEdges.length > 0) {
      const computed = computeVariations(initialProduct, initialAllEdges, initialMockupLookup || {});
      if (computed.length > 0) {
        cachedVariationsByGroup[initialGroupKey] = computed;
        return computed;
      }
    }
    return cachedVariationsByGroup[initialGroupKey] || [];
  });
  const [hoveredColorImage, setHoveredColorImage] = useState<string | null>(null);
  const [hoveredSwatchId, setHoveredSwatchId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [relatedActiveVariants, setRelatedActiveVariants] = useState<Record<string, any>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxVariantIndex, setLightboxVariantIndex] = useState(0);

  // Unique color variations strictly deduplicated by id and colorHex
  const uniqueColorVariations = colorVariations.filter(
    (v, idx, arr) =>
      arr.findIndex(
        (other) =>
          other.id === v.id ||
          (other.colorHex && v.colorHex && other.colorHex.toLowerCase() === v.colorHex.toLowerCase())
      ) === idx
  );

  const currentVariantId = uniqueColorVariations.some(v => v.id === product?.id)
    ? product?.id
    : (uniqueColorVariations[0]?.id || product?.id);

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
        const [allRes, mockupsRes] = await Promise.all([
          api.products.list(50),
          api.mockups.get().catch(() => ({ mockups: {} }))
        ]);
        const mockupLookup = mockupsRes?.mockups || initialMockupLookup || {};
        setMockupLookupState(mockupLookup);
        const allEdges = allRes?.products?.edges || initialAllEdges || [];
        const mappedList = allEdges.map((e: any) => e.node || e);
        if (rawProduct && !mappedList.some((p: any) => p.id === rawProduct.id)) {
          mappedList.push(rawProduct);
        }
        setAllProductsList(mappedList);
        
        // Map all products preserving their natural, stable catalog order from allEdges
        const allMappedForGroup = allEdges.map((edge: any) => {
          const node = edge.node;
          if (node.id === rawProduct.id) {
            return {
              id: rawProduct.id,
              name: rawProduct.title,
              handle: rawProduct.handle,
              price: mappedProduct.price,
              originalPrice: mappedProduct.originalPrice,
              image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || "",
              category: rawProduct.productType || rawProduct.category || "Tops",
              productType: rawProduct.productType || rawProduct.category || "Tops",
              createdAt: rawProduct.createdAt || node.createdAt || ""
            };
          }
          return {
            id: node.id,
            name: node.title,
            handle: node.handle,
            price: node.price || parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || "0"),
            image: node.images?.edges?.[0]?.node?.url || "",
            category: node.productType || node.category || "Tops",
            productType: node.productType || node.category || "Tops",
            createdAt: node.createdAt || ""
          };
        });

        if (!allMappedForGroup.some((p: any) => p.id === rawProduct.id)) {
          allMappedForGroup.push({
            id: rawProduct.id,
            name: rawProduct.title,
            handle: rawProduct.handle,
            price: mappedProduct.price,
            originalPrice: mappedProduct.originalPrice,
            image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || "",
            category: rawProduct.productType || rawProduct.category || "Tops",
            productType: rawProduct.productType || rawProduct.category || "Tops",
            createdAt: rawProduct.createdAt || ""
          });
        }

        const groupedCombined = groupProducts(allMappedForGroup, mockupLookup);

        const currentGroup = groupedCombined.find(g => 
          g.colorVariants.some(v => v.id === rawProduct.id) ||
          g.productType?.toLowerCase() === (rawProduct.productType || rawProduct.category || "").toLowerCase()
        );
        const baseName = currentGroup ? currentGroup.name : mappedProduct.name;

        if (baseName) {
          setProduct(prev => prev ? { ...prev, name: baseName } : null);
        }

        let variations = currentGroup
          ? currentGroup.colorVariants.map(v => ({
              id: v.id,
              handle: v.handle,
              colorName: v.colorName,
              colorHex: v.colorHex,
              image: v.image,
              createdAt: v.createdAt
            }))
          : [];

        if (!variations.some(v => v.id === rawProduct.id)) {
          const parsed = parseProduct({ name: rawProduct.title, colors: rawProduct.colors });
          const matchIdx = variations.findIndex(v => v.colorHex.toLowerCase() === (parsed.colorHex || "").toLowerCase());
          const rep = {
            id: rawProduct.id,
            handle: rawProduct.handle,
            colorName: parsed.colorName || "Original",
            colorHex: parsed.colorHex || "#FFFFFF",
            image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || "",
            createdAt: rawProduct.createdAt || ""
          };
          if (matchIdx !== -1) {
            variations[matchIdx] = rep;
          } else {
            variations.push(rep);
          }
        }

        // Stable sort by createdAt ascending so the index of each variant NEVER changes on click
        variations.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          return 0;
        });

        if (variations.length === 0) {
          const parsed = parseProduct({ name: rawProduct.title, colors: rawProduct.colors });
          variations.push({
            id: rawProduct.id,
            handle: rawProduct.handle,
            colorName: parsed.colorName || "Original",
            colorHex: parsed.colorHex || "#FFFFFF",
            image: rawProduct.images?.edges?.[0]?.node?.url || rawProduct.image || "",
            createdAt: rawProduct.createdAt || ""
          });
        }

        const groupKey = (rawProduct.productType || rawProduct.category || "Tee").toLowerCase();
        cachedVariationsByGroup[groupKey] = variations;
        setColorVariations(variations);

        // Ensure mock image is always the first image
        const productTypeKey = rawProduct.productType || rawProduct.category || "Tee";
        const mockupConfig = mockupLookup[productTypeKey] || mockupLookup["Tee"];
        const mockupImg = currentGroup?.mockupImage || (typeof mockupConfig === "object" ? mockupConfig?.mockupImage : mockupConfig);

        if (mockupImg) {
          setProduct(prev => {
            if (!prev) return null;
            const existingImages = prev.images || [];
            const filtered = existingImages.filter(img => img !== mockupImg);
            const actualImg = rawProduct.image || rawProduct.images?.edges?.[0]?.node?.url || "";
            if (filtered.length === 0 && actualImg) {
              filtered.push(actualImg);
            }
            return {
              ...prev,
              images: [mockupImg, ...filtered]
            };
          });
          setSelectedImage(prev => (prev === 0 ? 0 : prev));
        }

        const currentVarIdx = variations.findIndex(v => v.id === rawProduct.id);
        if (currentVarIdx >= 0) {
          setLightboxVariantIndex(currentVarIdx);
        }

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
            productType: node.productType || node.category || "Tops",
          };
        }) || [];
        
        const groupedList = groupProducts(listMapped, mockupLookup).filter((p: any) => p.id !== rawProduct.id && p.name.toLowerCase() !== baseName.toLowerCase());
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
              productType: node.productType || node.category || "Tops",
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

  useEffect(() => {
    if (colorVariations.length > 0 && product?.id) {
      const idx = colorVariations.findIndex(v => v.id === product.id);
      if (idx >= 0) {
        setLightboxVariantIndex(idx);
      }
    }
  }, [product?.id, colorVariations]);

  const handleColorSelect = (v: any, idx: number) => {
    setHoveredColorImage(null);
    setHoveredSwatchId(null);
    setLightboxVariantIndex(idx);

    if (v.id === product?.id) {
      // User clicked the currently selected color:
      // If currently showing mock image (selectedImage === 0), switch to the product photo for this color
      setSelectedImage(1);
      return;
    }

    // User clicked a different color variant
    const matchingNode = allProductsList.find((p: any) => p.id === v.id || (v.handle && p.handle === v.handle)) ||
      initialAllEdges?.map((e: any) => e.node || e).find((p: any) => p.id === v.id || (v.handle && p.handle === v.handle));

    if (matchingNode) {
      const mapped = mapRawProduct(matchingNode);
      const productTypeKey = matchingNode.productType || matchingNode.category || "Tee";
      const mockupConfig = mockupLookupState[productTypeKey] || mockupLookupState["Tee"];
      const currentGroup = groupProducts([matchingNode], mockupLookupState)[0];
      const mockupImg = currentGroup?.mockupImage || (typeof mockupConfig === "object" ? mockupConfig?.mockupImage : mockupConfig);

      const colorImg = v.image || matchingNode.images?.edges?.[0]?.node?.url || matchingNode.image || "";
      const rawImages = matchingNode.images?.edges?.map((edge: any) => edge.node.url) || (matchingNode.image ? [matchingNode.image] : []);
      const filtered = rawImages.filter((img: string) => img !== mockupImg);
      if (colorImg && !filtered.includes(colorImg)) {
        filtered.unshift(colorImg);
      }

      mapped.images = mockupImg ? [mockupImg, ...filtered] : filtered;
      if (mapped.images.length === 1 && colorImg && mockupImg) {
        mapped.images.push(colorImg);
      }

      setProduct(prev => ({
        ...mapped,
        name: prev?.name || mapped.name,
      }));
      setVariants(matchingNode.variants?.edges?.map((edge: any) => edge.node) || []);
      setSelectedImage(1); // Show color product photo instead of mock image

      if (v.handle) {
        window.history.replaceState(null, "", `/products/${v.handle}`);
      }
    } else {
      setSelectedImage(1);
      if (v.handle) {
        router.push(`/products/${v.handle}`);
      } else {
        router.push(`/shop/product-details?id=${v.id}`);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const match = pathname.match(/\/products\/([^/?#]+)/);
      if (match && match[1]) {
        const handleFromUrl = match[1];
        const vIdx = colorVariations.findIndex(v => v.handle === handleFromUrl);
        if (vIdx >= 0) {
          const v = colorVariations[vIdx];
          handleColorSelect(v, vIdx);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [colorVariations, allProductsList]);

  const handleCloseLightbox = (syncVariant: boolean = false) => {
    setIsLightboxOpen(false);
    if (syncVariant) {
      const target = colorVariations[lightboxVariantIndex];
      if (target) {
        handleColorSelect(target, lightboxVariantIndex);
      }
    }
  };

  const handlePrevLightbox = () => {
    if (colorVariations.length > 1) {
      const prevIdx = (lightboxVariantIndex - 1 + colorVariations.length) % colorVariations.length;
      setLightboxVariantIndex(prevIdx);
    } else if (product?.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleNextLightbox = () => {
    if (colorVariations.length > 1) {
      const nextIdx = (lightboxVariantIndex + 1) % colorVariations.length;
      setLightboxVariantIndex(nextIdx);
    } else if (product?.images && product.images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseLightbox();
      } else if (e.key === "ArrowLeft") {
        handlePrevLightbox();
      } else if (e.key === "ArrowRight") {
        handleNextLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, colorVariations, lightboxVariantIndex, product?.images]);

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
    <div style={{ paddingTop: "0px", backgroundColor: "#FBF9F7", minHeight: "100vh", paddingBottom: "2rem" }}>
      {/* Main content grid */}
      <div
        className="product-detail-grid"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2.5rem 2rem",
        }}
      >
        {/* Left Side: Sticky Gallery Container */}
        <div
          className="product-detail-sticky-left"
          style={{
            display: "flex",
            gap: "1.25rem",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* Vertical Thumbnail Strip: Mockup photo first, then all available color variants */}
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
              width: "64px",
              flexShrink: 0,
              maxHeight: "calc(100vh - 130px)",
              overflowY: "auto",
            }}
          >
            {/* Mockup photo is ALWAYS the first thumbnail */}
            {product.images && product.images[0] && (
              <button
                onClick={() => {
                  setSelectedImage(0);
                  setHoveredColorImage(null);
                  setHoveredSwatchId(null);
                }}
                style={{
                  width: "64px",
                  height: "auto",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: (selectedImage === 0 && !hoveredColorImage) ? "2px solid #C1A886" : "1px solid rgba(30, 30, 30, 0.2)",
                  cursor: "pointer",
                  padding: 0,
                  background: "#FFFFFF",
                  position: "relative",
                  transition: "border-color 0.2s ease, transform 0.2s ease",
                  flexShrink: 0,
                }}
                title="Lifestyle mockup photo"
                onMouseEnter={(e) => {
                  if (selectedImage !== 0 || !!hoveredColorImage) (e.currentTarget as HTMLElement).style.borderColor = "#1E1E1E";
                }}
                onMouseLeave={(e) => {
                  if (selectedImage !== 0 || !!hoveredColorImage) (e.currentTarget as HTMLElement).style.borderColor = "rgba(30, 30, 30, 0.2)";
                }}
              >
                <Image
                  src={getShopifyImageUrl(product.images[0], 160)}
                  alt="Lifestyle mockup"
                  fill
                  sizes="64px"
                  style={{ objectFit: "cover" }}
                />
              </button>
            )}

            {/* All available color variants */}
            {uniqueColorVariations.map((v, idx) => {
              const isCurrentProduct = v.id === currentVariantId;
              const isSelected = (isCurrentProduct && selectedImage !== 0 && !hoveredColorImage) || hoveredSwatchId === v.id;

              return (
                <button
                  key={v.id || idx}
                  onClick={() => handleColorSelect(v, idx)}
                  onMouseEnter={() => {
                    setHoveredColorImage(v.image);
                    setHoveredSwatchId(v.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredColorImage(null);
                    setHoveredSwatchId(null);
                  }}
                  style={{
                    width: "64px",
                    height: "auto",
                    aspectRatio: "3/4",
                    overflow: "hidden",
                    borderRadius: "6px",
                    border: isSelected ? "2px solid #C1A886" : "1px solid rgba(30, 30, 30, 0.2)",
                    cursor: "pointer",
                    padding: 0,
                    background: "#FFFFFF",
                    position: "relative",
                    transition: "border-color 0.2s ease, transform 0.2s ease",
                    flexShrink: 0,
                  }}
                  title={v.colorName}
                >
                  <Image
                    src={getShopifyImageUrl(v.image, 160)}
                    alt={v.colorName}
                    fill
                    sizes="64px"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Main Image */}
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <div
              onClick={() => {
                const currentIdx = colorVariations.findIndex(v => v.id === product.id);
                setLightboxVariantIndex(currentIdx >= 0 ? currentIdx : 0);
                setIsLightboxOpen(true);
              }}
              style={{
                position: "relative",
                aspectRatio: "3/4",
                maxHeight: "calc(100vh - 130px)",
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                cursor: "zoom-in",
              }}
              title="Click to expand"
            >
              {(() => {
                const activeVariant = uniqueColorVariations.find(v => v.id === currentVariantId);
                const activeDisplayImage = hoveredColorImage ||
                  (selectedImage === 0
                    ? (product.images[0] || activeVariant?.image || "")
                    : (product.images[selectedImage] || product.images[1] || activeVariant?.image || product.images[0] || ""));
                return (
                  <Image
                    src={getShopifyImageUrl(activeDisplayImage, 1000)}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 700px"
                    style={{ objectFit: "cover", transition: "opacity 0.3s ease" }}
                  />
                );
              })()}

              {/* Floating Bestseller Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  backgroundColor: "#1E1E1E",
                  color: "#FFFFFF",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "4px",
                  zIndex: 5,
                }}
              >
                {product.badge || "BESTSELLER"}
              </div>

              {/* Floating Wishlist Heart Button */}
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
                <Heart
                  size={20}
                  fill={wishlisted ? "#E53935" : "none"}
                  color={wishlisted ? "#E53935" : "#1E1E1E"}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Details Content */}
        <div style={{ paddingTop: "0.25rem" }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              {["Home", "Shop", product.name].map((crumb, i, arr) => (
                <span key={crumb} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Link
                    href={i === 0 ? "/" : i === 1 ? "/shop" : "#"}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.8125rem",
                      color: i === arr.length - 1 ? "#1E1E1E" : "rgba(30,30,30,0.5)",
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

          {/* Product Title */}
          <h1
            style={{
              fontFamily: "'Playfair Display', sans-serif",
              fontSize: "clamp(2rem, 3.2vw, 2.75rem)",
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "#1E1E1E",
              }}
            >
              {product.rating}
            </span>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.floor(product.rating) ? "#FF9800" : star - 0.5 <= product.rating ? "#FF9800" : "none"}
                  stroke="#FF9800"
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.8125rem",
                color: "#3B82F6",
                fontWeight: 500,
              }}
            >
              ({product.reviews.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "1.75rem",
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
                backgroundColor: "#1C3F30",
                color: "#FFFFFF",
                padding: "0.25rem 0.625rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                borderRadius: "3px",
              }}
            >
              {markupDiscount}% OFF
            </span>
          </div>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.45)", margin: "0 0 2.25rem 0" }}>
            Taxes Included
          </p>

          {/* Size */}
          <div style={{ marginBottom: "2.25rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 700, color: "#1E1E1E", textTransform: "uppercase", marginBottom: "0.875rem", letterSpacing: "0.05em" }}>
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
                      border: isSelected ? "1.5px solid #C1A886" : "1px solid rgba(30, 30, 30, 0.4)",
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
          <div style={{ marginBottom: "2.25rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 700, color: "#1E1E1E", textTransform: "uppercase", marginBottom: "0.875rem", letterSpacing: "0.05em" }}>
              COLOR: <span style={{ fontWeight: 400, color: "rgba(30,30,30,0.6)" }}>
                {hoveredSwatchId
                  ? uniqueColorVariations.find((v) => v.id === hoveredSwatchId)?.colorName
                  : (uniqueColorVariations.find((v) => v.id === currentVariantId)?.colorName || parseProduct({ name: product.rawName }).colorName)}
              </span>
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              {uniqueColorVariations.map((v, idx) => {
                const isCurrent = v.id === currentVariantId;
                const isHovered = hoveredSwatchId === v.id;
                return (
                  <button
                    key={v.id || idx}
                    onClick={() => handleColorSelect(v, idx)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: v.colorHex,
                      border: isWhiteColor(v.colorHex) ? "1px solid rgba(30,30,30,0.2)" : "1px solid rgba(0,0,0,0.08)",
                      outline: isCurrent ? "2px solid #1E1E1E" : (isHovered ? "2px solid rgba(30,30,30,0.4)" : "none"),
                      outlineOffset: "3px",
                      cursor: "pointer",
                      padding: 0,
                      transform: isCurrent ? "scale(1.05)" : (isHovered ? "scale(1.1)" : "scale(1)"),
                      transition: "transform 0.2s ease, outline 0.2s ease",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
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

          {/* Quantity + Add to Cart */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", fontWeight: 700, color: "#1E1E1E", textTransform: "uppercase", marginBottom: "0.875rem", letterSpacing: "0.05em" }}>
              QUANTITY
            </p>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: "46px",
                    height: "46px",
                    border: "1px solid rgba(30, 30, 30, 0.2)",
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    color: "#1E1E1E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1E1E1E"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(30, 30, 30, 0.2)"}
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
                    width: "46px",
                    height: "46px",
                    border: "1px solid rgba(30, 30, 30, 0.2)",
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    color: "#1E1E1E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1E1E1E"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(30, 30, 30, 0.2)"}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToBag}
                disabled={cartAdding}
                style={{
                  flex: 1,
                  height: "46px",
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
                  transition: "background-color 0.2s ease",
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
              height: "50px",
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
              marginBottom: "2.5rem",
              transition: "background-color 0.2s ease",
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

          {/* Features Image Section (instead of the trust badges section) */}
          <div
            style={{
              marginBottom: "2.5rem",
              width: "100%",
              overflow: "hidden",
              borderRadius: "6px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
            }}
          >
            <img
              src="/features.jpg"
              alt="Nomadica Features"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "6px",
              }}
            />
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

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => handleCloseLightbox(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          {/* Close (Cross) Icon in Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseLightbox(false);
            }}
            aria-label="Close image popup"
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#FFFFFF",
              zIndex: 10001,
              transition: "background-color 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.25)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.12)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <X size={28} color="#FFFFFF" strokeWidth={2.5} />
          </button>

          {/* Chevron Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevLightbox();
            }}
            aria-label="Previous color variant"
            style={{
              position: "absolute",
              left: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#FFFFFF",
              zIndex: 10001,
              backdropFilter: "blur(8px)",
              transition: "background-color 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.15)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)";
            }}
          >
            <ChevronLeft size={36} color="#FFFFFF" strokeWidth={2.5} />
          </button>

          {/* Chevron Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextLightbox();
            }}
            aria-label="Next color variant"
            style={{
              position: "absolute",
              right: "24px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#FFFFFF",
              zIndex: 10001,
              backdropFilter: "blur(8px)",
              transition: "background-color 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.15)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-50%) scale(1)";
            }}
          >
            <ChevronRight size={36} color="#FFFFFF" strokeWidth={2.5} />
          </button>

          {/* Center Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "85vw",
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                maxHeight: "68vh",
                maxWidth: "80vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                key={colorVariations[lightboxVariantIndex]?.id || lightboxVariantIndex}
                src={getShopifyImageUrl(
                  (colorVariations.length > 0 && colorVariations[lightboxVariantIndex]?.image) ||
                  product.images[selectedImage] ||
                  product.images[0],
                  1400
                )}
                alt={colorVariations[lightboxVariantIndex]?.colorName || product.name}
                style={{
                  maxHeight: "66vh",
                  maxWidth: "75vw",
                  objectFit: "contain",
                  borderRadius: "8px",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                  display: "block",
                }}
              />
            </div>

            {/* Active Color Variant Name / Indicator & Mini Swatch Strip */}
            {colorVariations.length > 0 && (
              <div
                style={{
                  marginTop: "0.875rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.625rem",
                }}
              >
                {/* Info pill with color dot + name + counter + quick select */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    padding: "0.45rem 1.15rem",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: colorVariations[lightboxVariantIndex]?.colorHex || "#FFFFFF",
                      border: "1.5px solid rgba(255, 255, 255, 0.9)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.875rem",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {colorVariations[lightboxVariantIndex]?.colorName} ({lightboxVariantIndex + 1} of {colorVariations.length})
                  </span>

                  {colorVariations[lightboxVariantIndex]?.handle &&
                    colorVariations[lightboxVariantIndex].handle !== product.handle && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseLightbox(true);
                      }}
                      style={{
                        marginLeft: "0.25rem",
                        backgroundColor: "#C1A886",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "14px",
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Montserrat', sans-serif",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#A88E6E";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "#C1A886";
                      }}
                    >
                      Select Color
                    </button>
                  )}
                </div>

                {/* Mini Swatches Strip */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    maxWidth: "90vw",
                  }}
                >
                  {uniqueColorVariations.map((v, idx) => {
                    const isActive = idx === lightboxVariantIndex;
                    return (
                      <button
                        key={v.id || idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxVariantIndex(idx);
                        }}
                        style={{
                          width: "36px",
                          height: "46px",
                          borderRadius: "4px",
                          overflow: "hidden",
                          border: isActive ? "2px solid #C1A886" : "1px solid rgba(255, 255, 255, 0.3)",
                          outline: isActive ? "2px solid #FFFFFF" : "none",
                          padding: 0,
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                          transform: isActive ? "scale(1.1)" : "scale(1)",
                          transition: "all 0.15s ease",
                          position: "relative",
                        }}
                        title={v.colorName}
                      >
                        <img
                          src={getShopifyImageUrl(v.image, 100)}
                          alt={v.colorName}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <ProductCarouselSection
          title="You May Also Like"
          products={relatedProducts}
          loading={false}
          backgroundColor="#F5F3F0"
        />
      )}
    </div>
  );
}

export default function ProductDetailClient(props: ProductDetailClientProps) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductDetailContent {...props} />
    </Suspense>
  );
}
