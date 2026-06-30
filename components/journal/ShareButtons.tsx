// components/journal/ShareButtons.tsx
"use client";
import React, { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";

export function ShareButtons() {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  return (
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "1rem", 
        flexWrap: "wrap",
        fontFamily: "'Montserrat', sans-serif",
        padding: "1.5rem 0",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        width: "100%",
        justifyContent: "flex-start",
        margin: "3rem 0"
      }}
    >
      <span style={{ fontSize: "0.85rem", color: "rgba(30,30,30,0.6)", fontWeight: 600 }}>
        Share this article:
      </span>
      
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {/* Twitter / X */}
        <button
          onClick={shareTwitter}
          title="Share on Twitter"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#000000",
            color: "#FFFFFF",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          <X size={14} fill="#FFFFFF" />
        </button>

        {/* Facebook */}
        <button
          onClick={shareFacebook}
          title="Share on Facebook"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#1877F2",
            color: "#FFFFFF",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          <X size={14} fill="#FFFFFF" />
        </button>

        {/* LinkedIn */}
        <button
          onClick={shareLinkedin}
          title="Share on LinkedIn"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#0A66C2",
            color: "#FFFFFF",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          <X size={14} fill="#FFFFFF" />
        </button>

        {/* Copy Link */}
        <div style={{ position: "relative" }}>
          <button
            onClick={handleCopy}
            title="Copy link"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#EAEAE5",
              color: "#333333",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#DFDFDA"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#EAEAE5"}
          >
            {copied ? <Check size={14} style={{ color: "#22C55E" }} /> : <Copy size={14} />}
          </button>
          {copied && (
            <span 
              style={{
                position: "absolute",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#333333",
                color: "#FFFFFF",
                fontSize: "0.7rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                fontWeight: 500,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
              }}
            >
              Copied!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
