// utils/productGroup.ts

export interface ColorVariant {
  id: string;
  colorName: string;
  colorHex: string;
  image: string;
  hoverImage: string;
  price: number;
  originalPrice?: number;
  handle: string;
  badge?: string;
  category?: string;
}

export interface GroupedProduct {
  id: string;
  name: string; // Base cloth name (e.g. "Tees", "Boxy Fit Tees", etc.)
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage: string;
  badge?: string;
  category: string;
  handle: string;
  colorVariants: ColorVariant[];
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
        colorHex: COLOR_HEX_MAP[colorName] || "#EDEAE2",
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
        colorHex: COLOR_HEX_MAP[colorName] || "#EDEAE2",
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

export function groupProducts(products: any[]): GroupedProduct[] {
  const groups: Record<string, GroupedProduct> = {};

  for (const product of products) {
    const { colorName, colorHex, baseName } = parseProduct(product);

    const variant: ColorVariant = {
      id: product.id,
      colorName,
      colorHex,
      image: product.image || product.images?.[0] || "",
      hoverImage: product.hoverImage || product.images?.[1] || product.image || "",
      price: product.price,
      originalPrice: product.originalPrice,
      handle: product.handle,
      badge: product.badge,
      category: product.category
    };

    if (!groups[baseName]) {
      groups[baseName] = {
        id: product.id,
        name: baseName,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || product.images?.[0] || "",
        hoverImage: product.hoverImage || product.images?.[1] || product.image || "",
        badge: product.badge,
        category: product.category || "Tops",
        handle: product.handle,
        colorVariants: [variant]
      };
    } else {
      // Add variant
      groups[baseName].colorVariants.push(variant);
      // Bubble up badge if the group doesn't have one but a variant does
      if (!groups[baseName].badge && variant.badge) {
        groups[baseName].badge = variant.badge;
      }
    }
  }

  // Convert back to array
  return Object.values(groups);
}
