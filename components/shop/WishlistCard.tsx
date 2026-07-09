"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { getShopifyImageUrl } from "@/lib/images/shopifyImage";
import { api } from "@/components/api/api";

export default function WishlistCard({ product, onQuickView, onRemove }: { product: any, onQuickView: (product: any) => void, onRemove: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const colorVariants = product.colorVariants || [];
  
  const displayColors = colorVariants.slice(0, 4);
  const extraColors = colorVariants.length > 4 ? colorVariants.length - 4 : 0;

  const isWhite = (c: string) => c.toLowerCase() === 'white' || c.toLowerCase() === '#ffffff';

  // Determine main image based on hovered state and color
  let currentImage = product.mockupImage || product.image;
  if (hoveredColor && colorVariants.length > 0) {
    const matchingVariant = colorVariants.find((v: any) => v.colorHex === hoveredColor);
    if (matchingVariant?.image) {
      currentImage = matchingVariant.image;
    } else {
      currentImage = product.image || currentImage;
    }
  } else if (hovered && product.image) {
    currentImage = product.image;
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(product.id);
  };

  return (
    <div 
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(30, 30, 30, 0.05)",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: hovered ? "0 8px 25px rgba(0,0,0,0.06)" : "0 4px 15px rgba(0,0,0,0.02)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/shop/product-details?handle=${product.handle}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* Heart Icon */}
        <button
          onClick={handleRemove}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 10,
            background: "#FFFFFF",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#D32F2F" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Image Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "750 / 978",
            overflow: "hidden",
            backgroundColor: "#F9F9F9"
          }}
        >
          <Image
            src={getShopifyImageUrl(currentImage, 600)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{
              objectFit: "cover",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
            }}
          />
        </div>

        {/* Info Container */}
        <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#1E1E1E",
            margin: "0 0 0.5rem 0",
            lineHeight: "1.2",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {product.name}
          </h3>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#1E1E1E" }}>
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "rgba(30,30,30,0.4)", textDecoration: "line-through" }}>
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Color circles inline */}
            {colorVariants.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {displayColors.map((v: any) => (
                  <div
                    key={v.id}
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredColor(v.colorHex);
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredColor(null);
                    }}
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: v.colorHex.toLowerCase(),
                      border: isWhite(v.colorHex) ? "1px solid rgba(0,0,0,0.2)" : "1px solid rgba(0,0,0,0.05)"
                    }}
                    title={v.colorName}
                  />
                ))}
                {extraColors > 0 && (
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", color: "rgba(30,30,30,0.5)", marginLeft: "2px" }}>
                    +{extraColors}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            style={{
              marginTop: "auto",
              width: "100%",
              backgroundColor: "#C6BAA8",
              color: "#FFFFFF",
              border: "none",
              padding: "0.6rem 1rem",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "transform 0.2s ease, background-color 0.2s ease",
              transform: hovered ? "scale(1.02)" : "scale(1)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b0a390"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C6BAA8"}
          >
            <ShoppingCart size={14} />
            ADD TO CART
          </button>
        </div>
      </Link>
    </div>
  );
}
