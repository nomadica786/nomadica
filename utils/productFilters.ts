// utils/productFilters.ts

const COLLECTION_RULES: Record<string, { tags: string[]; handles: string[]; titles: string[]; keywords: string[] }> = {
  "adventure and trekking collection": {
    tags: ["trekking", "adventure-trekking"],
    handles: ["adventure-and-trekking-collection", "adventure-and-trekking", "trekking"],
    titles: ["adventure and trekking collection", "adventure and trekking"],
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
    titles: ["wildlife and safari collection", "wildlife and safari"],
    keywords: ["safari", "wildlife", "tiger"]
  }
};

export function matchesCategoryFilter(product: any, selectedCategory: string[]): boolean {
  if (!selectedCategory || selectedCategory.length === 0) return true;
  const activeFilters = selectedCategory.filter((c) => c && c.trim().toLowerCase() !== "all");
  if (activeFilters.length === 0) return true;

  return activeFilters.some((catName) => {
    const target = catName.trim().toLowerCase();
    if (!target) return true;

    // 1. Check if target is one of the known Shopify collections
    const rule = COLLECTION_RULES[target];
    if (rule) {
      // Check collection titles & handles
      if (product.collections && Array.isArray(product.collections)) {
        if (product.collections.some((c: string) => {
          const col = String(c).trim().toLowerCase();
          return rule.titles.includes(col) || rule.handles.includes(col);
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

    // 2. Semantic category mappings
    const pType = (product.productType || "").trim().toLowerCase();
    const pCat = (product.category || "").trim().toLowerCase();
    const pName = (product.name || product.title || "").trim().toLowerCase();

    if (target === "tops") {
      if (pCat.includes("top") || pType.includes("tee") || pType.includes("shirt") || pType.includes("polo") || pType.includes("top") || pName.includes("shirt") || pName.includes("tee") || pName.includes("polo") || pName.includes("top")) return true;
      return false;
    }
    if (target === "bottoms") {
      if (pCat.includes("bottom") || pType.includes("trouser") || pType.includes("pant") || pType.includes("short") || pType.includes("bottom") || pName.includes("trouser") || pName.includes("short") || pName.includes("pant")) return true;
      return false;
    }
    if (target === "outerwear") {
      if (pCat.includes("outerwear") || pType.includes("jacket") || pType.includes("coat") || pType.includes("hoodie") || pName.includes("jacket") || pName.includes("coat") || pName.includes("hoodie")) return true;
      return false;
    }
    if (target === "knits") {
      if (pCat.includes("knit") || pType.includes("sweater") || pType.includes("knit") || pName.includes("sweater") || pName.includes("knit")) return true;
      return false;
    }

    // 3. Fallback generic match for any other collection
    if (product.collections && Array.isArray(product.collections)) {
      if (product.collections.some((c: string) => {
        const col = String(c).trim().toLowerCase();
        return col === target || col.includes(target) || target.includes(col);
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
