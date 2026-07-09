// utils/productGroup.ts

export interface ColorVariant {
  id: string;
  name?: string; // Actual product title for the variant
  colorName: string;
  colorHex: string;
  image: string;
  hoverImage: string;
  price: number;
  originalPrice?: number;
  handle: string;
  badge?: string;
  category?: string;
  createdAt?: string;
  allVariants?: any[];
}

export interface GroupedProduct {
  variants?: any; // kept for backwards compatibility just in case
  id: string;
  name: string; // Product type name (e.g. "Tee")
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage: string;
  badge?: string;
  category: string;
  productType?: string;
  mockupImage?: string;
  handle: string;
  colorVariants: ColorVariant[];
  createdAt?: string;
  collections?: string[];
  allVariants?: any[];
}

export const COLOR_HEX_MAP: Record<string, string> = {
  "Denim": "#4E6E82",
  "White": "#FFFFFF",
  "Black": "#1E1E1E",
  "Brown": "#8B5A2B",
  "Denim Wash": "#5C768D",
  "Red": "#D32F2F",
  "Blue": "#1976D2",
  "Green": "#388E3C",
  "Navy Blue": "#1A237E",
  "Maroon": "#800000",
  "Original": "#D4C5B0",
};

// Known multi-word colors in the shop
const MULTI_WORD_COLORS = ["navy blue", "denim wash"];

export function parseProduct(product: any) {
  const name = product.name || product.title || "";
  const lowerName = name.toLowerCase();

  // 1. Check for multi-word colors
  for (const mc of MULTI_WORD_COLORS) {
    if (lowerName.startsWith(mc + " ")) {
      const colorName = name.slice(0, mc.length);
      const baseName = name.slice(mc.length + 1).trim();
      return {
        colorName,
        colorHex: COLOR_HEX_MAP[colorName] || "#FFFFFF",
        baseName,
        isClothVariation: true
      };
    }
  }

  // 2. Check for single-word colors (split by spaces)
  const parts = name.split(" ");
  if (parts.length > 1) {
    const colorName = parts[0];
    const baseName = parts.slice(1).join(" ");
    
    // Check if the first word matches a known color or if we want to treat it general
    const knownColors = Object.keys(COLOR_HEX_MAP);
    const isKnownColor = knownColors.some(c => c.toLowerCase() === colorName.toLowerCase());
    
    // If it's a known color, we treat it as a cloth variation
    if (isKnownColor) {
      return {
        colorName,
        colorHex: COLOR_HEX_MAP[colorName] || "#FFFFFF",
        baseName,
        isClothVariation: true
      };
    }
  }

  // 3. Fallback for mock products or unrecognized structures
  return {
    colorName: "Original",
    colorHex: product.colors?.[0] || "#D4C5B0",
    baseName: name,
    isClothVariation: false
  };
}

export function groupProducts(products: any[], mockupLookup: Record<string, any> = {}): GroupedProduct[] {
  const groups: Record<string, GroupedProduct> = {};

  for (const product of products) {
    if (!product) continue;
    
    // Normalize names/types
    const name = (product.name || product.title || "").trim();
    const rawType = product.productType || product.category || "Tops";
    const productType = rawType.trim();

    // Parse the color name and hex for this product
    const parsedColor = parseProduct(product);

    const variant: ColorVariant = {
      id: product.id,
      name: name,
      colorName: parsedColor.colorName,
      colorHex: parsedColor.colorHex,
      image: product.image || product.images?.[0]?.node?.url || product.images?.[0] || "",
      hoverImage: product.hoverImage || product.images?.[1]?.node?.url || product.images?.[1] || product.image || "",
      price: product.price,
      originalPrice: product.originalPrice,
      handle: product.handle,
      badge: product.badge,
      category: product.category,
      createdAt: product.createdAt,
      allVariants: product.variants?.edges ? [...product.variants.edges] : []
    };

    const groupKey = productType.toLowerCase();
    const config = mockupLookup[productType];
    const mockupImage = typeof config === "object" ? config.mockupImage : config;
    const displayName = (typeof config === "object" && config.displayName) ? config.displayName : productType;

    if (!groups[groupKey]) {
      // First product in the group is the default variant
      groups[groupKey] = {
        id: product.id,
        name: displayName, // Use Display Name from configuration
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || product.images?.[0]?.node?.url || product.images?.[0] || "",
        hoverImage: product.hoverImage || product.images?.[1]?.node?.url || product.images?.[1] || product.image || "",
        badge: product.badge,
        category: product.category || "Tops",
        productType: productType,
        mockupImage: mockupImage || undefined,
        handle: product.handle,
        colorVariants: [variant],
        createdAt: product.createdAt,
        collections: product.collections || [],
        allVariants: product.variants?.edges ? [...product.variants.edges] : [],
      };
    } else {
      // Add variant
      groups[groupKey].colorVariants.push(variant);
      
      if (product.variants?.edges) {
        groups[groupKey].allVariants?.push(...product.variants.edges);
      }

      // Bubble up badge if variant has one
      if (!groups[groupKey].badge && variant.badge) {
        groups[groupKey].badge = variant.badge;
      }

      // Bubble up latest createdAt date
      if (product.createdAt) {
        if (!groups[groupKey].createdAt || new Date(product.createdAt).getTime() > new Date(groups[groupKey].createdAt || 0).getTime()) {
          groups[groupKey].createdAt = product.createdAt;
        }
      }
    }
  }

  return Object.values(groups);
}

export function sortNewArrivalsFirst(products: GroupedProduct[], count: number = 3): { sorted: GroupedProduct[], newestIds: Set<string> } {
  if (products.length === 0) return { sorted: [], newestIds: new Set() };

  // 1. Find the newest products by date
  const sortedByDate = [...products].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const newestIds = new Set<string>();
  let markedCount = 0;
  for (const p of sortedByDate) {
    if (p.createdAt && markedCount < count) {
      newestIds.add(p.id);
      markedCount++;
    }
  }

  // 2. Separate into newest and other products
  const newestList = products.filter(p => newestIds.has(p.id));
  const otherList = products.filter(p => !newestIds.has(p.id));

  // Sort the newest subset descending so the absolute newest is index 0
  newestList.sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return {
    sorted: [...newestList, ...otherList],
    newestIds
  };
}
