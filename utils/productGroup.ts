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
  createdAt?: string;
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
  createdAt?: string;
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

export function groupProducts(products: any[]): GroupedProduct[] {
  // 1. Prepare word arrays for suffix matching
  const items = products.map((product) => {
    const name = (product.name || product.title || "").trim();
    const words = name.split(/\s+/);
    return {
      product,
      name,
      words,
      maxSuffixLength: 0,
    };
  });

  // 2. Perform pairwise suffix matching to find the maximum suffix match for each product
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const itemA = items[i];
      const itemB = items[j];

      let suffixLen = 0;
      let idxA = itemA.words.length - 1;
      let idxB = itemB.words.length - 1;

      while (idxA >= 0 && idxB >= 0) {
        if (itemA.words[idxA].toLowerCase() === itemB.words[idxB].toLowerCase()) {
          suffixLen++;
          idxA--;
          idxB--;
        } else {
          break;
        }
      }

      if (suffixLen > 0) {
        if (suffixLen > itemA.maxSuffixLength) {
          itemA.maxSuffixLength = suffixLen;
        }
        if (suffixLen > itemB.maxSuffixLength) {
          itemB.maxSuffixLength = suffixLen;
        }
      }
    }
  }

  // 3. Construct groups based on suffix match or fallback
  const groups: Record<string, GroupedProduct> = {};

  for (const item of items) {
    let baseName = "";
    let colorName = "";

    if (item.maxSuffixLength > 0) {
      // Base name is the matching suffix words (preserve case of the original name)
      const suffixWords = item.words.slice(item.words.length - item.maxSuffixLength);
      baseName = suffixWords.join(" ");

      // Color name is the remaining prefix words
      const prefixWords = item.words.slice(0, item.words.length - item.maxSuffixLength);
      colorName = prefixWords.join(" ");

      if (!colorName) {
        colorName = "Original";
      }
    } else {
      // Standalone product fallback
      const parsed = parseProduct(item.product);
      baseName = parsed.baseName;
      colorName = parsed.colorName;
    }

    // Resolve color hex code case-insensitively
    const cleanColor = colorName.trim();
    const mapKey = Object.keys(COLOR_HEX_MAP).find(k => k.toLowerCase() === cleanColor.toLowerCase());
    let colorHex = mapKey ? COLOR_HEX_MAP[mapKey] : undefined;

    if (!colorHex) {
      const lastWord = cleanColor.split(" ").pop() || "";
      const wordKey = Object.keys(COLOR_HEX_MAP).find(k => k.toLowerCase() === lastWord.toLowerCase());
      colorHex = wordKey ? COLOR_HEX_MAP[wordKey] : "#FFFFFF";
    }

    const variant: ColorVariant = {
      id: item.product.id,
      colorName,
      colorHex,
      image: item.product.image || item.product.images?.[0] || "",
      hoverImage: item.product.hoverImage || item.product.images?.[1] || item.product.image || "",
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      handle: item.product.handle,
      badge: item.product.badge,
      category: item.product.category,
      createdAt: item.product.createdAt
    };

    const groupKey = baseName.toLowerCase();

    if (!groups[groupKey]) {
      groups[groupKey] = {
        id: item.product.id,
        name: baseName,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        image: item.product.image || item.product.images?.[0] || "",
        hoverImage: item.product.hoverImage || item.product.images?.[1] || item.product.image || "",
        badge: item.product.badge,
        category: item.product.category || "Tops",
        handle: item.product.handle,
        colorVariants: [variant],
        createdAt: item.product.createdAt
      };
    } else {
      // Add variant
      groups[groupKey].colorVariants.push(variant);
      // Bubble up badge if the group doesn't have one but a variant does
      if (!groups[groupKey].badge && variant.badge) {
        groups[groupKey].badge = variant.badge;
      }
      // Bubble up the newest/latest createdAt date
      if (item.product.createdAt) {
        if (!groups[groupKey].createdAt || new Date(item.product.createdAt).getTime() > new Date(groups[groupKey].createdAt || 0).getTime()) {
          groups[groupKey].createdAt = item.product.createdAt;
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
