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
  name: string; // Product group display name (e.g. "Cool Oversized Tee")
  displayName: string; // Metaobject Display Name
  groupKey: string; // Stable Metaobject ID/GID (e.g. "gid://shopify/Metaobject/...") or product.id fallback
  metaobjectId?: string;
  metaobjectName?: string;
  mockupImage?: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage: string;
  badge?: string;
  category: string;
  productType?: string;
  handle: string;
  colorVariants: ColorVariant[];
  products: any[]; // Array of all Shopify products in this group
  representativeProduct: any; // Deterministic canonical representative product
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

export interface ProductTypeConfig {
  id: string;
  handle?: string;
  entryName?: string;
  displayName?: string;
  mockupImage?: string;
}

/**
 * Resolves the referenced Product Type Configuration metaobject for a Shopify product.
 * Returns the metaobject's stable ID/GID, handle, entry name, display name, and mockup image.
 */
export function resolveProductTypeConfiguration(
  product: any,
  mockupLookup: Record<string, any> = {}
): ProductTypeConfig | null {
  if (!product) return null;

  // 1. Direct GraphQL Metaobject reference in productTypeConfig or metafieldProductType
  const directMetafields = [
    product.productTypeConfig,
    product.metafieldProductType,
    product.productTypeConfiguration,
    product.metafield
  ].filter(Boolean);

  for (const mf of directMetafields) {
    const ref = mf.reference || (mf.id && mf.fields ? mf : null);
    if (ref && (ref.id || ref.__typename === "Metaobject" || ref.type === "product_type_configuration")) {
      const refId = ref.id;
      const fields = ref.fields || [];
      const ptField = fields.find((f: any) => f.key === "product_type");
      const dnField = fields.find((f: any) => f.key === "display_name");
      const miField = fields.find((f: any) => f.key === "mockup_image");

      const entryName = ptField?.value?.trim() || "";
      const displayName = dnField?.value?.trim() || "";
      const imageUrl = miField?.reference?.image?.url || miField?.reference?.url || "";

      // Lookup in mockupLookup if it has enriched entries
      const lookupEntry = refId ? mockupLookup[refId] : null;

      return {
        id: refId || lookupEntry?.id || "",
        handle: ref.handle || lookupEntry?.handle,
        entryName: entryName || lookupEntry?.entryName,
        displayName: displayName || lookupEntry?.displayName || entryName,
        mockupImage: imageUrl || lookupEntry?.mockupImage
      };
    }

    // Check if metafield value is a metaobject GID string or matches a lookup key
    const val = typeof mf.value === "string" ? mf.value.trim() : "";
    if (val && mockupLookup[val]) {
      const entry = mockupLookup[val];
      return {
        id: entry.id || val,
        handle: entry.handle,
        entryName: entry.entryName,
        displayName: entry.displayName,
        mockupImage: entry.mockupImage
      };
    }
  }

  // 2. Direct reference object passed as productTypeConfiguration (e.g. { id: "gid://shopify/Metaobject/123" })
  if (product.productTypeConfiguration && typeof product.productTypeConfiguration === "object") {
    const ptc = product.productTypeConfiguration;
    const ptcId = ptc.id;
    if (ptcId) {
      const lookupEntry = mockupLookup[ptcId];
      return {
        id: ptcId,
        handle: ptc.handle || lookupEntry?.handle,
        entryName: ptc.entryName || lookupEntry?.entryName,
        displayName: ptc.displayName || lookupEntry?.displayName,
        mockupImage: ptc.mockupImage || lookupEntry?.mockupImage
      };
    }
  }

  // 3. Match product.productType or product.category in mockupLookup
  const rawType = (product.productType || product.category || "").trim();
  if (rawType && mockupLookup[rawType]) {
    const entry = mockupLookup[rawType];
    return {
      id: entry.id || `gid://shopify/Metaobject/ptc-${rawType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      handle: entry.handle,
      entryName: entry.entryName || rawType,
      displayName: entry.displayName || rawType,
      mockupImage: entry.mockupImage
    };
  }

  // 4. Case-insensitive lookup check
  if (rawType) {
    const lowerType = rawType.toLowerCase();
    for (const [key, val] of Object.entries(mockupLookup)) {
      if (key.toLowerCase() === lowerType && typeof val === "object") {
        return {
          id: val.id || `gid://shopify/Metaobject/ptc-${lowerType.replace(/[^a-z0-9]+/g, "-")}`,
          handle: val.handle,
          entryName: val.entryName || key,
          displayName: val.displayName || key,
          mockupImage: val.mockupImage
        };
      }
    }
  }

  return null;
}

export function groupProducts(products: any[], mockupLookup: Record<string, any> = {}): GroupedProduct[] {
  const groups = new Map<string, GroupedProduct>();

  for (const product of products) {
    if (!product) continue;

    const name = (product.name || product.title || "").trim();
    const parsedColor = parseProduct(product);

    // Resolve the Product Type Configuration metaobject
    const metaConfig = resolveProductTypeConfiguration(product, mockupLookup);

    // Source of Truth Grouping Key: Stable metaobject ID/GID if referenced; fallback to product.id
    const groupKey = metaConfig?.id || product.id;

    // Display Name: Metaobject Display Name -> Metaobject Entry Name -> Product title
    const displayName = metaConfig?.displayName || metaConfig?.entryName || name;
    const metaobjectName = metaConfig?.entryName;
    const metaobjectId = metaConfig?.id;
    const mockupImage = metaConfig?.mockupImage;

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

    if (!groups.has(groupKey)) {
      // Create new group representing this logical product
      groups.set(groupKey, {
        id: product.id, // Deterministic representative product ID
        groupKey: groupKey,
        name: displayName,
        displayName: displayName,
        metaobjectId: metaobjectId,
        metaobjectName: metaobjectName,
        mockupImage: mockupImage || undefined,
        price: product.price,
        originalPrice: product.originalPrice,
        image: mockupImage || product.image || product.images?.[0]?.node?.url || product.images?.[0] || "",
        hoverImage: product.hoverImage || product.images?.[1]?.node?.url || product.images?.[1] || product.image || "",
        badge: product.badge,
        category: product.category || "Tops",
        productType: metaobjectName || product.productType || "Tops",
        handle: product.handle,
        colorVariants: [variant],
        products: [product],
        representativeProduct: product,
        createdAt: product.createdAt,
        collections: Array.from(
          new Set([
            ...(product.collections || []),
            ...(product.category ? [product.category] : []),
            ...(metaobjectName ? [metaobjectName] : [])
          ])
        ),
        allVariants: product.variants?.edges ? [...product.variants.edges] : [],
        sizes: productSizes,
        colors: parsedColor.colorName !== "Original" ? [parsedColor.colorName] : [],
        tags: [...(product.tags || [])]
      });
    } else {
      const existing = groups.get(groupKey)!;
      existing.products.push(product);

      // Add variant only if not already present by ID or by same color
      const isDuplicate = existing.colorVariants.some(
        (v) =>
          v.id === variant.id ||
          (v.colorHex && variant.colorHex && v.colorHex.toLowerCase() === variant.colorHex.toLowerCase()) ||
          (v.colorName &&
            variant.colorName &&
            v.colorName.toLowerCase() === variant.colorName.toLowerCase() &&
            v.colorName !== "Original")
      );
      if (!isDuplicate) {
        existing.colorVariants.push(variant);
      }

      // Merge unique colors
      if (parsedColor.colorName && parsedColor.colorName !== "Original") {
        if (!existing.colors) existing.colors = [];
        if (!existing.colors.includes(parsedColor.colorName)) {
          existing.colors.push(parsedColor.colorName);
        }
      }

      if (product.variants?.edges) {
        existing.allVariants?.push(...product.variants.edges);
      }

      if (product.collections) {
        for (const col of product.collections) {
          if (!existing.collections?.includes(col)) {
            existing.collections?.push(col);
          }
        }
      }

      // Merge sizes
      for (const s of productSizes) {
        if (!existing.sizes?.includes(s)) {
          existing.sizes?.push(s);
        }
      }

      // Merge tags
      if (product.tags) {
        for (const t of product.tags) {
          if (!existing.tags?.includes(t)) {
            existing.tags?.push(t);
          }
        }
      }

      // Bubble up badge if variant has one and group doesn't
      if (!existing.badge && variant.badge) {
        existing.badge = variant.badge;
      }

      // Bubble up latest createdAt date
      if (product.createdAt) {
        const prodTime = new Date(product.createdAt).getTime();
        const curTime = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        if (!isNaN(prodTime) && (isNaN(curTime) || prodTime > curTime)) {
          existing.createdAt = product.createdAt;
        }
      }
    }
  }

  // Ensure every group's colorVariants is sorted consistently
  for (const group of groups.values()) {
    group.colorVariants.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

    // Make sure colors array has unique values matching colorVariants
    const variantColors = group.colorVariants
      .map((v) => v.colorName)
      .filter((c) => c && c !== "Original");
    group.colors = Array.from(new Set([...(group.colors || []), ...variantColors]));
  }

  return Array.from(groups.values());
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
