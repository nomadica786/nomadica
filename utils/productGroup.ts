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
  sizes?: string[];
  colors?: string[];
  tags?: string[];
}

export const COLOR_HEX_MAP: Record<string, string> = {
  "Denim": "#4E6E82",
  "White": "#FFFFFF",
  "Black": "#1E1E1E",
  "Brown": "#8B5A2B",
  "Denim Wash": "#5C768D",
  "Black Washed": "#383838",
  "Washed Black": "#383838",
  "Red": "#D32F2F",
  "Blue": "#1976D2",
  "Green": "#388E3C",
  "Navy Blue": "#1A237E",
  "Navy": "#1A237E",
  "Maroon": "#800000",
  "Pink": "#E89BA8",
  "Grey": "#808080",
  "Gray": "#808080",
  "Yellow": "#FBC02D",
  "Gold": "#FBC02D",
  "Coffee": "#6F4E37",
  "Olive": "#4F6B5A",
  "Original": "#D4C5B0",
};

// Known multi-word colors in the shop
const MULTI_WORD_COLORS = [
  "navy blue",
  "denim wash",
  "black washed",
  "washed black",
  "off white",
  "light blue",
  "dark grey",
  "dark gray"
];

export function parseProduct(product: any) {
  const name = (product.name || product.title || "").trim();
  const lowerName = name.toLowerCase();

  // 1. Check for multi-word colors at start
  for (const mc of MULTI_WORD_COLORS) {
    if (lowerName.startsWith(mc + " ")) {
      const colorName = name.slice(0, mc.length);
      const matchedKey = Object.keys(COLOR_HEX_MAP).find((k) => k.toLowerCase() === colorName.toLowerCase()) || colorName;
      const baseName = name.slice(mc.length + 1).trim();
      return {
        colorName: matchedKey,
        colorHex: COLOR_HEX_MAP[matchedKey] || "#FFFFFF",
        baseName,
        isClothVariation: true
      };
    }
  }

  // 2. Check for single-word colors (first word)
  const parts = name.split(" ");
  if (parts.length > 1) {
    const colorName = parts[0];
    const baseName = parts.slice(1).join(" ");

    const knownColors = Object.keys(COLOR_HEX_MAP);
    const matchedKey = knownColors.find(
      (c) => c.toLowerCase() === colorName.toLowerCase() && c.toLowerCase() !== "original"
    );

    if (matchedKey) {
      return {
        colorName: matchedKey,
        colorHex: COLOR_HEX_MAP[matchedKey] || "#FFFFFF",
        baseName,
        isClothVariation: true
      };
    }
  }

  // 3. Check for color at the end (e.g., "Tee - White", "Travel Tee White")
  for (const [colorKey, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (colorKey.toLowerCase() === "original") continue;
    const lk = colorKey.toLowerCase();
    const endRegex = new RegExp(`[-/\\s]+${lk}$`, "i");
    if (endRegex.test(lowerName)) {
      const baseName = name.replace(new RegExp(`[-/\\s]+${lk}$`, "i"), "").trim();
      if (baseName) {
        return {
          colorName: colorKey,
          colorHex: hex,
          baseName,
          isClothVariation: true
        };
      }
    }
  }

  // 4. Check for variant selectedOptions "Color" or "Colour"
  if (product.variants?.edges && Array.isArray(product.variants.edges)) {
    for (const edge of product.variants.edges) {
      const opt = edge.node?.selectedOptions?.find(
        (o: any) => o.name?.toLowerCase() === "color" || o.name?.toLowerCase() === "colour"
      );
      if (opt && opt.value) {
        const val = opt.value.trim();
        const matchedKey = Object.keys(COLOR_HEX_MAP).find((k) => k.toLowerCase() === val.toLowerCase()) || val;
        return {
          colorName: matchedKey,
          colorHex: COLOR_HEX_MAP[matchedKey] || "#FFFFFF",
          baseName: name,
          isClothVariation: true
        };
      }
    }
  }

  // 5. Fallback for mock products or unrecognized structures
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

    const groupKey = (parsedColor.isClothVariation && parsedColor.baseName)
      ? parsedColor.baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : (productType || name).toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Smart mockup resolution with fallback
    let config = mockupLookup[parsedColor.baseName] || mockupLookup[productType];
    if (!config) {
      const lowerBase = (parsedColor.baseName || "").toLowerCase();
      const lowerType = productType.toLowerCase();
      for (const [key, val] of Object.entries(mockupLookup)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerBase.includes(lowerKey) ||
          lowerKey.includes(lowerBase) ||
          lowerType.includes(lowerKey) ||
          lowerKey.includes(lowerType)
        ) {
          config = val;
          break;
        }
      }
    }
    if (!config && (name.toLowerCase().includes("tee") || productType.toLowerCase().includes("tee"))) {
      config = mockupLookup["Tee"];
    }

    const mockupImage = typeof config === "object" ? config.mockupImage : config;
    const displayName = (parsedColor.isClothVariation && parsedColor.baseName)
      ? parsedColor.baseName
      : ((typeof config === "object" && config.displayName) ? config.displayName : (name || productType));

    const productSizes = Array.from(
      new Set([
        ...(product.sizes || []),
        ...(product.options?.find((o: any) => o.name?.toLowerCase() === "size")?.values || []),
        ...(product.variants?.edges?.map((e: any) => e.node?.title).filter((t: string) => t && t !== "Default Title") || [])
      ])
    );

    const productColors = Array.from(
      new Set([
        ...(product.colors || []),
        ...(parsedColor.colorName !== "Original" ? [parsedColor.colorName] : []),
        ...(parsedColor.colorHex ? [parsedColor.colorHex] : [])
      ])
    );

    if (!groups[groupKey]) {
      // First product in the group is the default variant
      groups[groupKey] = {
        id: product.id,
        name: displayName,
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
        collections: Array.from(
          new Set([
            ...(product.collections || []),
            ...(product.category ? [product.category] : []),
            ...(productType ? [productType] : [])
          ])
        ),
        allVariants: product.variants?.edges ? [...product.variants.edges] : [],
        sizes: productSizes,
        colors: productColors,
        tags: [...(product.tags || [])]
      };
    } else {
      // Add variant only if not already present by ID or by same color
      const isDuplicate = groups[groupKey].colorVariants.some(
        (v) =>
          v.id === variant.id ||
          (v.colorHex && variant.colorHex && v.colorHex.toLowerCase() === variant.colorHex.toLowerCase()) ||
          (v.colorName &&
            variant.colorName &&
            v.colorName.toLowerCase() === variant.colorName.toLowerCase() &&
            v.colorName !== "Original")
      );
      if (!isDuplicate) {
        groups[groupKey].colorVariants.push(variant);
      }

      if (product.variants?.edges) {
        groups[groupKey].allVariants?.push(...product.variants.edges);
      }

      if (product.collections) {
        for (const col of product.collections) {
          if (!groups[groupKey].collections?.includes(col)) {
            groups[groupKey].collections?.push(col);
          }
        }
      }
      if (product.category && !groups[groupKey].collections?.includes(product.category)) {
        groups[groupKey].collections?.push(product.category);
      }
      if (productType && !groups[groupKey].collections?.includes(productType)) {
        groups[groupKey].collections?.push(productType);
      }

      // Merge sizes
      for (const s of productSizes) {
        if (!groups[groupKey].sizes?.includes(s)) {
          groups[groupKey].sizes?.push(s);
        }
      }

      // Merge colors
      for (const c of productColors) {
        if (!groups[groupKey].colors?.includes(c)) {
          groups[groupKey].colors?.push(c);
        }
      }

      // Merge tags
      if (product.tags) {
        for (const t of product.tags) {
          if (!groups[groupKey].tags?.includes(t)) {
            groups[groupKey].tags?.push(t);
          }
        }
      }

      // Bubble up badge if variant has one
      if (!groups[groupKey].badge && variant.badge) {
        groups[groupKey].badge = variant.badge;
      }

      // Bubble up latest createdAt date
      if (product.createdAt) {
        const prodTime = new Date(product.createdAt).getTime();
        const curTime = groups[groupKey].createdAt ? new Date(groups[groupKey].createdAt!).getTime() : 0;
        if (!isNaN(prodTime) && (isNaN(curTime) || prodTime > curTime)) {
          groups[groupKey].createdAt = product.createdAt;
        }
      }
    }
  }

  // Ensure every group's colorVariants is sorted consistently by createdAt ascending for stable indexing
  for (const group of Object.values(groups)) {
    group.colorVariants.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });
  }

  return Object.values(groups);
}

export function sortNewArrivalsFirst(
  products: GroupedProduct[],
  count: number = 3
): { sorted: GroupedProduct[]; newestIds: Set<string> } {
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
  const newestList = products.filter((p) => newestIds.has(p.id));
  const otherList = products.filter((p) => !newestIds.has(p.id));

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
