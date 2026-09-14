// utils/productFilters.ts

const COLLECTION_RULES: Record<string, { tags: string[]; handles: string[]; titles: string[]; keywords: string[] }> = {
  "adventure and trekking collection": {
    tags: ["trekking", "adventure-trekking"],
    handles: [
      "adventure-and-trekking-collection",
      "adventure-and-trekking-collections",
      "adventure-and-trekking",
      "trekking"
    ],
    titles: [
      "adventure and trekking collection",
      "adventure & trekking collection",
      "adventure and trekking",
      "adventure & trekking"
    ],
    keywords: ["trekking"]
  },
  "beach vibes collection": {
    tags: ["beach", "beach-vibes"],
    handles: ["beach-vibes-collection", "beach-vibes", "beach"],
    titles: ["beach vibes collection", "beach vibes"],
    keywords: ["beach"]
  },
  "destination collection": {
    tags: ["destination"],
    handles: ["destination-collection", "destination"],
    titles: ["destination collection", "destination"],
    keywords: ["destination"]
  },
  "travel quotes collection": {
    tags: ["travel", "travel-quotes", "quotes"],
    handles: ["travel-quotes-collection", "travel-quotes", "quotes"],
    titles: ["travel quotes collection", "travel quotes"],
    keywords: ["quote", "quotes"]
  },
  "wildlife and safari collection": {
    tags: ["safari", "wildlife"],
    handles: ["wildlife-and-safari-collection", "wildlife-and-safari", "safari", "wildlife"],
    titles: [
      "wildlife and safari collection",
      "wildlife & safari collection",
      "wildlife and safari",
      "wildlife & safari"
    ],
    keywords: ["safari", "wildlife", "tiger"]
  }
};

export function normalizeCollectionKey(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/&/g, "and")
    .replace(/\bcollections?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const CANONICAL_COLLECTION_TITLES: Record<string, string> = {
  "adventure and trekking": "Adventure and Trekking Collection",
  "beach vibes": "Beach Vibes Collection",
  "destination": "Destination Collection",
  "travel quotes": "Travel Quotes Collection",
  "wildlife and safari": "Wildlife and Safari Collection",
};

export const DEFAULT_COLLECTION_OPTIONS = [
  "Destination Collection",
  "Wildlife and Safari Collection",
  "Adventure and Trekking Collection",
  "Travel Quotes Collection",
  "Beach Vibes Collection"
];

export function extractCollectionOptions(
  collectionsList?: any[],
  collectionEdges?: any[],
  products?: any[],
  configurations?: any[]
): string[] {
  const rawSet = new Set<string>();

  // 1. From fetched collections list
  if (collectionsList && Array.isArray(collectionsList)) {
    for (const item of collectionsList) {
      if (typeof item === "string" && item.trim()) {
        rawSet.add(item.trim());
      } else if (item && typeof item === "object") {
        if (item.title) rawSet.add(String(item.title).trim());
        else if (item.name) rawSet.add(String(item.name).trim());
      }
    }
  }

  // 2. From collectionEdges
  if (collectionEdges && Array.isArray(collectionEdges)) {
    for (const edge of collectionEdges) {
      const node = edge.node || edge;
      if (node?.title) {
        rawSet.add(String(node.title).trim());
      }
    }
  }

  // 3. From products' attached collections
  if (products && Array.isArray(products)) {
    for (const p of products) {
      if (p.collections && Array.isArray(p.collections)) {
        for (const col of p.collections) {
          if (typeof col === "string" && col.trim()) {
            rawSet.add(col.trim());
          }
        }
      }
    }
  }

  // Explicitly exclude metaobjects and generic category names
  const metaNames = new Set(
    (configurations || []).flatMap((c: any) => [
      (c.displayName || "").toLowerCase().trim(),
      (c.entryName || "").toLowerCase().trim(),
    ]).filter(Boolean)
  );

  const genericExclude = new Set([
    "tops",
    "bottoms",
    "outerwear",
    "knits",
    "all",
    "default",
    "t-shirts",
    "tshirts",
    "tees"
  ]);

  const titleMap = new Map<string, string>();

  for (const rawItem of rawSet) {
    const trimmed = rawItem.trim();
    const lower = trimmed.toLowerCase();
    if (!lower || lower === "all") continue;
    if (genericExclude.has(lower)) continue;
    if (metaNames.has(lower)) continue;

    const normKey = normalizeCollectionKey(trimmed);
    if (!normKey) continue;
    if (genericExclude.has(normKey)) continue;

    // Determine the canonical display title for this collection
    let displayTitle = CANONICAL_COLLECTION_TITLES[normKey];

    if (!displayTitle) {
      if (!trimmed.includes("-") && !trimmed.includes("_")) {
        displayTitle = trimmed
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
      } else {
        const cleanWords = trimmed.replace(/[-_]+/g, " ").trim();
        displayTitle = cleanWords
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
        if (!displayTitle.toLowerCase().endsWith("collection")) {
          displayTitle = `${displayTitle} Collection`;
        }
      }
    }

    // Always prefer a canonical title or clean title (without hyphens/underscores)
    if (!titleMap.has(normKey)) {
      titleMap.set(normKey, displayTitle);
    } else {
      const existing = titleMap.get(normKey)!;
      if (
        CANONICAL_COLLECTION_TITLES[normKey] === displayTitle ||
        (!displayTitle.includes("-") && existing.includes("-"))
      ) {
        titleMap.set(normKey, displayTitle);
      }
    }
  }

  let result = Array.from(titleMap.values());

  if (result.length === 0) {
    result = [...DEFAULT_COLLECTION_OPTIONS];
  } else {
    // Sort according to preferred store presentation order
    const desiredOrder = [
      "destination",
      "wildlife and safari",
      "adventure and trekking",
      "travel quotes",
      "beach vibes"
    ];
    result.sort((a, b) => {
      const keyA = normalizeCollectionKey(a);
      const keyB = normalizeCollectionKey(b);
      const idxA = desiredOrder.indexOf(keyA);
      const idxB = desiredOrder.indexOf(keyB);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });
  }

  return result;
}

export function matchesCategoryFilter(product: any, selectedCategory: string[]): boolean {
  if (!selectedCategory || selectedCategory.length === 0) return true;
  const activeFilters = selectedCategory.filter((c) => c && c.trim().toLowerCase() !== "all");
  if (activeFilters.length === 0) return true;

  return activeFilters.some((catName) => {
    const target = catName.trim().toLowerCase();
    if (!target) return true;

    const normTarget = normalizeCollectionKey(target);

    // Check child products if this is a grouped product
    if (product.products && Array.isArray(product.products)) {
      if (product.products.some((child: any) => matchesCategoryFilter(child, [catName]))) {
        return true;
      }
    }

    // 1. Check if target is one of the known Shopify collections
    const ruleKey = Object.keys(COLLECTION_RULES).find(
      (k) => k === target || normalizeCollectionKey(k) === normTarget
    );
    const rule = ruleKey ? COLLECTION_RULES[ruleKey] : null;

    if (rule) {
      // Check collection titles, handles, and normalized keys
      if (product.collections && Array.isArray(product.collections)) {
        if (product.collections.some((c: string) => {
          const col = String(c).trim().toLowerCase();
          const normCol = normalizeCollectionKey(col);
          return (
            rule.titles.includes(col) ||
            rule.handles.includes(col) ||
            (normCol && normTarget && normCol === normTarget)
          );
        })) return true;
      }
      // Check product tags
      if (product.tags && Array.isArray(product.tags)) {
        if (product.tags.some((t: string) => {
          const tag = String(t).trim().toLowerCase();
          return rule.tags.includes(tag);
        })) return true;
      }
      // Check product title keywords
      const pName = (product.name || product.title || "").toLowerCase();
      if (rule.keywords.some((kw) => {
        const regex = new RegExp(`(^|[^a-z])${kw}([^a-z]|$)`, "i");
        return regex.test(pName);
      })) return true;

      return false;
    }

    // 2. Direct collection matching on product.collections (including normalized comparison)
    if (product.collections && Array.isArray(product.collections)) {
      if (product.collections.some((c: string) => {
        const col = String(c).trim().toLowerCase();
        const normCol = normalizeCollectionKey(col);
        return (
          col === target ||
          col.includes(target) ||
          target.includes(col) ||
          (normCol && normTarget && normCol === normTarget)
        );
      })) return true;
    }

    if (product.tags && Array.isArray(product.tags)) {
      if (product.tags.some((t: string) => {
        const tag = String(t).trim().toLowerCase();
        if (tag === target) return true;
        if (tag.length >= 3) {
          const regex = new RegExp(`(^|[^a-z])${tag}([^a-z]|$)`, "i");
          if (regex.test(target)) return true;
        }
        return false;
      })) return true;
    }

    // 4. Fallback check on Product Type Configuration Display Name or entry name or metaobjectId if passed
    const pDisplayName = (product.displayName || "").trim().toLowerCase();
    const pMetaName = (product.metaobjectName || "").trim().toLowerCase();
    const pMetaId = (product.metaobjectId || "").trim().toLowerCase();
    const pGroupKey = (product.groupKey || "").trim().toLowerCase();

    if (
      (pDisplayName && (pDisplayName === target || pDisplayName.includes(target) || target.includes(pDisplayName))) ||
      (pMetaName && (pMetaName === target || pMetaName.includes(target) || target.includes(pMetaName))) ||
      (pMetaId && pMetaId === target) ||
      (pGroupKey && pGroupKey === target)
    ) {
      return true;
    }

    const pType = (product.productType || "").trim().toLowerCase();
    const pCat = (product.category || "").trim().toLowerCase();
    const pName = (product.name || product.title || "").trim().toLowerCase();

    if (pType === target || pCat === target) return true;
    if (pName.includes(target)) return true;

    return false;
  });
}

export function matchesColorFilter(product: any, selectedColor: string[]): boolean {
  if (!selectedColor || selectedColor.length === 0) return true;
  const activeColors = selectedColor.filter((c) => c && c.trim().toLowerCase() !== "all");
  if (activeColors.length === 0) return true;

  return activeColors.some((colorName) => {
    const sc = colorName.trim().toLowerCase();
    if (!sc) return true;

    const checkMatch = (nameStr: string, hexStr: string = "") => {
      const n = (nameStr || "").trim().toLowerCase();
      const h = (hexStr || "").trim().toLowerCase();

      const regex = new RegExp(`(^|[^a-z])${sc}([^a-z]|$)`, "i");
      if (regex.test(n)) return true;

      if (sc === "white" && (h === "#ffffff" || h === "#fff" || h === "#faf9f6" || h === "#fffdd0" || n.includes("white"))) return true;
      if (sc === "black" && (h === "#1e1e1e" || h === "#000000" || h === "#383838" || n.includes("black"))) return true;
      if (sc === "blue" && (h === "#1976d2" || h === "#4e6e82" || h === "#5c768d" || n.includes("blue") || n.includes("denim"))) return true;
      if (sc === "navy" && (h === "#1a237e" || n.includes("navy"))) return true;
      if ((sc === "grey" || sc === "gray") && (h === "#808080" || n.includes("grey") || n.includes("gray"))) return true;
      if (sc === "green" && (h === "#388e3c" || h === "#4f6b5a" || n.includes("green") || n.includes("olive"))) return true;
      if (sc === "red" && (h === "#d32f2f" || n.includes("red"))) return true;
      if (sc === "maroon" && (h === "#800000" || n.includes("maroon"))) return true;
      if (sc === "pink" && (h === "#e89ba8" || n.includes("pink"))) return true;
      if (sc === "yellow" && (h === "#fbc02d" || n.includes("yellow") || n.includes("gold"))) return true;
      return false;
    };

    // 1. Check colorVariants (from groupProducts)
    if (product.colorVariants && Array.isArray(product.colorVariants)) {
      const matchVariant = product.colorVariants.some((v: any) =>
        checkMatch(v.colorName, v.colorHex) || checkMatch(v.name || "", v.colorHex)
      );
      if (matchVariant) return true;
    }

    // 2. Check product.colors array
    if (product.colors && Array.isArray(product.colors)) {
      const matchColors = product.colors.some((c: string) => checkMatch(c, c));
      if (matchColors) return true;
    }

    // 3. Check allVariants
    if (product.allVariants && Array.isArray(product.allVariants)) {
      const matchVariants = product.allVariants.some((edge: any) => {
        const title = (edge.node?.title || edge.title || "").toLowerCase();
        const hasOpt = edge.node?.selectedOptions?.some((opt: any) =>
          (opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour") && checkMatch(opt.value, "")
        );
        return hasOpt || checkMatch(title, "");
      });
      if (matchVariants) return true;
    }

    // 4. Check product name
    const pName = (product.name || product.title || "").toLowerCase();
    if (checkMatch(pName, "")) return true;

    return false;
  });
}

export function matchesSizeFilter(product: any, selectedSize: string[]): boolean {
  if (!selectedSize || selectedSize.length === 0) return true;
  const activeSizes = selectedSize.filter((s) => s && s.trim().toUpperCase() !== "ALL");
  if (activeSizes.length === 0) return true;

  const SIZE_ALIASES: Record<string, string[]> = {
    "XS": ["XS", "EXTRA SMALL", "X-SMALL"],
    "S": ["S", "SMALL"],
    "M": ["M", "MEDIUM"],
    "L": ["L", "LARGE"],
    "XL": ["XL", "EXTRA LARGE", "X-LARGE"],
    "XXL": ["XXL", "2XL", "DOUBLE LARGE"]
  };

  return activeSizes.some((sizeName) => {
    const targetSize = sizeName.trim().toUpperCase();
    if (!targetSize) return true;

    const aliases = SIZE_ALIASES[targetSize] || [targetSize];

    const testSizeStr = (rawStr: string) => {
      if (!rawStr) return false;
      const clean = rawStr.trim().toUpperCase();
      if (aliases.includes(clean)) return true;
      const parts = clean.split(/[\s\-_/()]+/);
      if (parts.some((p) => aliases.includes(p))) return true;
      return aliases.some((a) => {
        const regex = new RegExp(`(^|[^A-Z0-9])${a}([^A-Z0-9]|$)`, "i");
        return regex.test(clean);
      });
    };

    // 1. Check sizes array
    if (product.sizes && Array.isArray(product.sizes)) {
      if (product.sizes.some((s: string) => testSizeStr(s))) return true;
    }

    // 2. Check options array
    if (product.options && Array.isArray(product.options)) {
      const sizeOpt = product.options.find((o: any) => o.name?.toLowerCase() === "size");
      if (sizeOpt?.values && Array.isArray(sizeOpt.values)) {
        if (sizeOpt.values.some((v: string) => testSizeStr(v))) return true;
      }
    }

    // 3. Check allVariants
    if (product.allVariants && Array.isArray(product.allVariants)) {
      const matchAllVariants = product.allVariants.some((edge: any) => {
        const title = edge.node?.title || edge.title || "";
        if (title !== "Default Title" && testSizeStr(title)) return true;
        const optVal =
          edge.node?.selectedOptions?.find((o: any) => o.name.toLowerCase() === "size")?.value ||
          edge.selectedOptions?.find((o: any) => o.name.toLowerCase() === "size")?.value;
        return optVal && testSizeStr(optVal);
      });
      if (matchAllVariants) return true;
    }

    // 4. Check colorVariants
    if (product.colorVariants && Array.isArray(product.colorVariants)) {
      const matchColorVars = product.colorVariants.some((v: any) => {
        if (v.allVariants && Array.isArray(v.allVariants)) {
          return v.allVariants.some((edge: any) => {
            const title = edge.node?.title || edge.title || "";
            if (title !== "Default Title" && testSizeStr(title)) return true;
            const optVal = edge.node?.selectedOptions?.find((o: any) => o.name.toLowerCase() === "size")?.value;
            return optVal && testSizeStr(optVal);
          });
        }
        return false;
      });
      if (matchColorVars) return true;
    }

    return false;
  });
}

export function sortProducts(products: any[], sortBy: string): any[] {
  const sorted = [...products];

  const getColorCount = (p: any): number => {
    const variantCount = Array.isArray(p.colorVariants) ? p.colorVariants.length : 0;
    const colorsCount = Array.isArray(p.colors) ? p.colors.length : 0;
    return Math.max(variantCount, colorsCount, 1);
  };

  const getProductTime = (p: any): number => {
    if (p.createdAt) {
      const t = new Date(p.createdAt).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    if (p.colorVariants && Array.isArray(p.colorVariants)) {
      for (const v of p.colorVariants) {
        if (v.createdAt) {
          const t = new Date(v.createdAt).getTime();
          if (!isNaN(t) && t > 0) return t;
        }
      }
    }
    return 0;
  };

  const getIdNum = (id?: string): number => {
    if (!id) return 0;
    const matches = String(id).match(/\d+/g);
    return matches ? parseInt(matches[matches.length - 1], 10) : 0;
  };

  if (sortBy === "Price: Low to High") {
    return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
  }

  if (sortBy === "Price: High to Low") {
    return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  if (sortBy === "Newest") {
    return sorted.sort((a, b) => {
      // Prioritize explicit "New" badge
      const isNewA = a.badge?.toLowerCase() === "new" ? 1 : 0;
      const isNewB = b.badge?.toLowerCase() === "new" ? 1 : 0;
      if (isNewB !== isNewA) return isNewB - isNewA;

      const timeA = getProductTime(a);
      const timeB = getProductTime(b);
      if (timeB !== timeA) return timeB - timeA;

      // Tie-break with ID descending (higher Shopify product ID = created later)
      return getIdNum(b.id) - getIdNum(a.id);
    });
  }

  // Default: "Featured"
  // User requirement: "the products with highest colors should be shown first as default"
  return sorted.sort((a, b) => {
    const countA = getColorCount(a);
    const countB = getColorCount(b);
    if (countB !== countA) {
      return countB - countA; // Highest number of color variations first!
    }

    const timeA = getProductTime(a);
    const timeB = getProductTime(b);
    if (timeB !== timeA) return timeB - timeA;

    return getIdNum(b.id) - getIdNum(a.id);
  });
}
