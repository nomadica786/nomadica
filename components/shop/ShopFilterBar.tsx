"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import { normalizeCollectionKey } from "@/utils/productFilters";

export const SIZES = ["All", "XS", "S", "M", "L", "XL", "XXL"];
export const COLORS = ["All", "White", "Black", "Red", "Blue", "Green", "Yellow", "Navy", "Grey", "Pink", "Maroon"];
export const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

interface ShopFilterBarProps {
  categories: string[];
  selectedCategory: string[];
  setSelectedCategory: (cat: string[]) => void;
  selectedSize: string[];
  setSelectedSize: (size: string[]) => void;
  selectedColor: string[];
  setSelectedColor: (color: string[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  productCount: number;
  pageFilterLabel?: string;
  onClearPageFilter?: () => void;
  categoryLabel?: string;
}

export function ShopFilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  sortBy,
  setSortBy,
  productCount,
  pageFilterLabel,
  onClearPageFilter,
  categoryLabel = "Collection"
}: ShopFilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<"category" | "size" | "color" | "sort" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown: "category" | "size" | "color" | "sort") => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "4px",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 450,
    color: "#1E1E1E",
    cursor: "pointer",
    transition: "all 0.2s ease"
  };

  const activeButtonStyle = (isActive: boolean) => ({
    ...buttonStyle,
    backgroundColor: isActive ? "#C4A77D" : buttonStyle.backgroundColor,
    color: isActive ? "#FFFFFF" : buttonStyle.color,
    border: isActive ? "1px solid #C4A77D" : buttonStyle.border
  });

  const dropdownMenuStyle = {
    position: "absolute" as const,
    top: "100%",
    left: 0,
    marginTop: "0.5rem",
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(30,30,30,0.1)",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    width: "100%",
    minWidth: "280px",
    zIndex: 50,
    display: "flex",
    flexDirection: "column" as const,
    padding: "0.5rem 0"
  };

  const dropdownItemStyle = (isSelected: boolean) => ({
    padding: "0.5rem 1rem",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.8125rem",
    color: "#1E1E1E",
    fontWeight: isSelected ? 600 : 400,
    cursor: "pointer",
    backgroundColor: isSelected ? "#F3E2CA" : "transparent",
    border: "none",
    textAlign: "left" as const,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "0.75rem"
  });

  const checkboxStyle = (isSelected: boolean) => ({
    width: "18px",
    height: "18px",
    borderRadius: "3px",
    border: "1px solid #C4A77D",
    backgroundColor: isSelected ? "#C4A77D" : "transparent",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0
  });

  const getColorHex = (colorName: string) => {
    const c = colorName.toLowerCase();
    if (c === "white") return "#FFFFFF";
    if (c === "black") return "#1E1E1E";
    if (c === "red") return "#D32F2F";
    if (c === "blue") return "#1976D2";
    if (c === "green") return "#388E3C";
    if (c === "yellow") return "#FBC02D";
    if (c === "navy") return "#1A237E";
    if (c === "grey" || c === "gray") return "#808080";
    if (c === "pink") return "#E89BA8";
    if (c === "maroon") return "#800000";
    return c;
  };

  const filterItems = (selected: string[], setSelected: (next: string[]) => void) => {
    return (item: string) => {
      if (item === "All") {
        setSelected([]);
        return;
      }
      const cleanSelected = selected.filter((value) => value !== "All");
      if (cleanSelected.includes(item)) {
        setSelected(cleanSelected.filter((value) => value !== item));
      } else {
        setSelected([...cleanSelected, item]);
      }
    };
  };

  const isCategorySelected = (cat: string) => {
    return selectedCategory.some((sc) => {
      if (!sc || !cat) return false;
      const cleanSc = sc.trim().toLowerCase();
      const cleanCat = cat.trim().toLowerCase();
      return (
        cleanSc === cleanCat ||
        normalizeCollectionKey(cleanSc) === normalizeCollectionKey(cleanCat)
      );
    });
  };

  const toggleCategoryItem = (cat: string) => {
    if (cat === "All") {
      setSelectedCategory([]);
      return;
    }
    const isSelected = isCategorySelected(cat);
    if (isSelected) {
      setSelectedCategory(
        selectedCategory.filter((sc) => {
          const cleanSc = sc.trim().toLowerCase();
          const cleanCat = cat.trim().toLowerCase();
          return (
            cleanSc !== cleanCat &&
            normalizeCollectionKey(cleanSc) !== normalizeCollectionKey(cleanCat)
          );
        })
      );
    } else {
      const clean = selectedCategory.filter((sc) => sc !== "All");
      setSelectedCategory([...clean, cat]);
    }
  };

  const categoryButtonLabel = useMemo(() => {
    if (selectedCategory.length === 0) return categoryLabel;
    if (selectedCategory.length === 1) {
      const match = categories.find((c) => isCategorySelected(c));
      return match || selectedCategory[0];
    }
    return `${categoryLabel} (${selectedCategory.length})`;
  }, [selectedCategory, categories, categoryLabel]);

  const hasActiveFilters = selectedCategory.length > 0 || selectedSize.length > 0 || selectedColor.length > 0;
  const resetFilters = () => {
    setSelectedCategory([]);
    setSelectedSize([]);
    setSelectedColor([]);
  };

  return (
    <div
      style={{
        top: "64px",
        zIndex: 100,
        backgroundColor: "#FAF9F7",
        borderBottom: "1px solid #e5e7eb",
        padding: "2.5rem 1.5rem",
      }}
    >
      <div
        ref={dropdownRef}
        style={{
          maxWidth: "1350px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div style={{ display: "flex", gap: "1rem", position: "relative", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => toggleDropdown("category")} style={activeButtonStyle(openDropdown === "category" || selectedCategory.length > 0) }>
              {categoryButtonLabel}
              <ChevronDown size={14} />
            </button>
            {openDropdown === "category" && (
              <div style={dropdownMenuStyle}>
                {categories.filter((cat) => cat !== "All").map((cat) => {
                  const isSelected = isCategorySelected(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategoryItem(cat)}
                      style={dropdownItemStyle(isSelected)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isSelected ? "#F3E2CA" : "#F9F9F9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSelected ? "#F3E2CA" : "transparent")}
                    >
                      <span style={checkboxStyle(isSelected)}>
                        {isSelected && <Check size={14} color="white" />}
                      </span>
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Size Dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => toggleDropdown("size")} style={activeButtonStyle(openDropdown === "size" || selectedSize.length > 0) }>
              {selectedSize.length === 0 ? "Size" : selectedSize.length === 1 ? selectedSize[0] : `Size (${selectedSize.length})`}
              <ChevronDown size={14} />
            </button>
            {openDropdown === "size" && (
              <div style={dropdownMenuStyle}>
                {SIZES.filter((size) => size !== "All").map(size => {
                  const isSelected = selectedSize.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => filterItems(selectedSize, setSelectedSize)(size)}
                      style={dropdownItemStyle(isSelected)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9F9F9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSelected ? "#F3E2CA" : "transparent")}
                    >
                      <span style={checkboxStyle(isSelected)}>
                        {isSelected && <Check size={14} color="white" />}
                      </span>
                      <span>{size}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Color Dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => toggleDropdown("color")} style={activeButtonStyle(openDropdown === "color" || selectedColor.length > 0) }>
              {selectedColor.length === 1 && (
                <span style={{ 
                  display: "inline-block",
                  width: "14px", 
                  height: "14px", 
                  borderRadius: "50%", 
                  backgroundColor: getColorHex(selectedColor[0]), 
                  border: selectedColor[0].toLowerCase() === "white" ? "1px solid rgba(0,0,0,0.15)" : "none"
                }} />
              )}
              {selectedColor.length === 0 ? "Color" : selectedColor.length === 1 ? selectedColor[0] : `Color (${selectedColor.length})`}
              <ChevronDown size={14} />
            </button>
            {openDropdown === "color" && (
              <div style={dropdownMenuStyle}>
                {COLORS.filter(color => color !== "All").map(color => {
                  const isSelected = selectedColor.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => filterItems(selectedColor, setSelectedColor)(color)}
                      style={dropdownItemStyle(isSelected)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9F9F9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSelected ? "#F3E2CA" : "transparent")}
                    >
                      <span style={checkboxStyle(isSelected)}>
                        {isSelected && <Check size={14} color="white" />}
                      </span>
                      <span style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: getColorHex(color),
                        border: color.toLowerCase() === "white" ? "1px solid rgba(0,0,0,0.2)" : "none",
                        display: "inline-block",
                        flexShrink: 0
                      }} />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Page pill (route) + Selected category pills + Clear All */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {pageFilterLabel && (
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <span style={{ backgroundColor: "#C4A77D", color: "#FFFFFF", padding: "0.5rem 0.9rem", borderRadius: "999px", fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{pageFilterLabel}</span>
                  <button onClick={() => onClearPageFilter && onClearPageFilter()} style={{ background: "transparent", border: "none", color: "#FFFFFF", cursor: "pointer", padding: 0, marginLeft: "2px", fontSize: "0.95rem" }} aria-label={`Remove ${pageFilterLabel}`}>
                    ✕
                  </button>
                </span>
              </div>
            )}
            {/* No pills for dropdown options — only show route/page pill above */}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  border: "1px solid rgba(30,30,30,0.1)",
                  backgroundColor: "transparent",
                  color: "#1E1E1E",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.875rem",
                  cursor: "pointer"
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Product Count and Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>
            {productCount} Products
          </span>
          
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "#1E1E1E", fontWeight: 500 }}>
              Sort:
            </span>
            <button onClick={() => toggleDropdown("sort")} style={activeButtonStyle(openDropdown === "sort") }>
              {sortBy}
              <ChevronDown size={14} />
            </button>
            {openDropdown === "sort" && (
              <div style={dropdownMenuStyle}>
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option}
                    onClick={() => { setSortBy(option); setOpenDropdown(null); }}
                    style={dropdownItemStyle(sortBy === option)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sortBy === option ? "#C4A77D" : "#F9F9F9")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sortBy === option ? "#C4A77D" : "transparent")}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
