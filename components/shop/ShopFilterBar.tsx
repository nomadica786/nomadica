"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const SIZES = ["All", "XS", "S", "M", "L", "XL", "XXL"];
export const COLORS = ["All", "White", "Black", "Red", "Blue", "Green", "Yellow", "Navy", "Grey"];
export const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

interface ShopFilterBarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  productCount: number;
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
  productCount
}: ShopFilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<"category" | "size" | "color" | null>(null);
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

  const toggleDropdown = (dropdown: "category" | "size" | "color") => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#FAF9F7",
    border: "1px solid #0000001f",
    borderRadius: "4px",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 450,
    color: "#1E1E1E",
    cursor: "pointer",
    transition: "border-color 0.2s ease"
  };

  const dropdownMenuStyle = {
    position: "absolute" as const,
    top: "100%",
    left: 0,
    marginTop: "0.5rem",
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(30,30,30,0.1)",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    minWidth: "160px",
    zIndex: 50,
    display: "flex",
    flexDirection: "column" as const,
    padding: "0.5rem 0"
  };

  const dropdownItemStyle = (isSelected: boolean) => ({
    padding: "0.5rem 1rem",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.8125rem",
    color: isSelected ? "#c4a77d" : "#1E1E1E",
    fontWeight: isSelected ? 600 : 400,
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    textAlign: "left" as const,
    width: "100%"
  });

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
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div style={{ display: "flex", gap: "1rem", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => toggleDropdown("category")} style={buttonStyle}>
              {selectedCategory === "All" ? "Category" : selectedCategory}
              <ChevronDown size={14} />
            </button>
            {openDropdown === "category" && (
              <div style={dropdownMenuStyle}>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setOpenDropdown(null);
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      fontFamily: "'Inter', sans-serif",
                      color: selectedCategory === cat ? "#1E1E1E" : "#666",
                      fontWeight: selectedCategory === cat ? 500 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backgroundColor: selectedCategory === cat ? "rgba(0,0,0,0.03)" : "transparent"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedCategory === cat ? "rgba(0,0,0,0.03)" : "transparent")}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Size Dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => toggleDropdown("size")} style={buttonStyle}>
              {selectedSize === "All" ? "Size" : `Size: ${selectedSize}`}
              <ChevronDown size={14} />
            </button>
            {openDropdown === "size" && (
              <div style={dropdownMenuStyle}>
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setOpenDropdown(null); }}
                    style={dropdownItemStyle(selectedSize === size)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9F9F9")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => toggleDropdown("color")} style={buttonStyle}>
              {selectedColor === "All" ? "Color" : `Color: ${selectedColor}`}
              <ChevronDown size={14} />
            </button>
            {openDropdown === "color" && (
              <div style={dropdownMenuStyle}>
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setOpenDropdown(null); }}
                    style={dropdownItemStyle(selectedColor === color)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9F9F9")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Product Count and Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.5)" }}>
            {productCount} Products
          </span>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "#1E1E1E", fontWeight: 500 }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.8125rem",
                color: "rgba(30,30,30,0.7)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
                appearance: "none", // Remove default arrow if we want, but standard is fine
                paddingRight: "0.5rem"
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
