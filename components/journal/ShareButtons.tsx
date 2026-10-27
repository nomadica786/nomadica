// components/journal/ShareButtons.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title?: string;
  url?: string;
}

export function ShareButtons({ title = "", url = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (url) {
      setShareUrl(url);
    } else if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, [url]);

  const activeUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
  const activeTitle = title || (typeof document !== "undefined" ? document.title : "Nomadica Journal");

  const openSharePopup = (targetUrl: string, width = 600, height = 450) => {
    if (typeof window === "undefined") return;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      targetUrl,
      "_blank",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = activeUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareX = () => {
    const text = encodeURIComponent(activeTitle);
    const u = encodeURIComponent(activeUrl);
    openSharePopup(`https://x.com/intent/post?url=${u}&text=${text}`);
  };

  const shareFacebook = () => {
    const u = encodeURIComponent(activeUrl);
    openSharePopup(`https://www.facebook.com/sharer/sharer.php?u=${u}`);
  };

  const shareLinkedIn = () => {
    const u = encodeURIComponent(activeUrl);
    openSharePopup(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`, 600, 500);
  };

  const shareWhatsApp = () => {
    const message = encodeURIComponent(`${activeTitle}\n${activeUrl}`);
    if (typeof window !== "undefined") {
      window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: activeTitle,
          url: activeUrl,
        });
      } catch (err) {
        // User cancelled or share failed, silent fallback
      }
    }
  };

  const iconBtnStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  };

  return (
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "1.25rem", 
        flexWrap: "wrap",
        fontFamily: "'Montserrat', sans-serif",
        padding: "1.75rem 0",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        width: "100%",
        justifyContent: "space-between",
        margin: "3rem 0"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "1.1rem", 
            color: "#1E1E1E", 
            fontWeight: 600,
            letterSpacing: "0.01em"
          }}
        >
          Share this article:
        </span>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        {/* X (formerly Twitter) */}
        <button
          onClick={shareX}
          title="Share on X"
          aria-label="Share on X"
          style={{
            ...iconBtnStyle,
            backgroundColor: "#000000",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={shareFacebook}
          title="Share on Facebook"
          aria-label="Share on Facebook"
          style={{
            ...iconBtnStyle,
            backgroundColor: "#1877F2",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(24,119,242,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          onClick={shareLinkedIn}
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
          style={{
            ...iconBtnStyle,
            backgroundColor: "#0A66C2",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(10,102,194,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareWhatsApp}
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
          style={{
            ...iconBtnStyle,
            backgroundColor: "#25D366",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(37,211,102,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.42 1.01 2.59c.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
          </svg>
        </button>

        {/* Native Web Share Button (if supported) */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            title="More share options"
            aria-label="More share options"
            style={{
              ...iconBtnStyle,
              backgroundColor: "#FAF9F7",
              color: "#1E1E1E",
              borderColor: "rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.backgroundColor = "#F0EEE9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.backgroundColor = "#FAF9F7";
            }}
          >
            <Share2 size={16} />
          </button>
        )}

        {/* Copy Link */}
        <div style={{ position: "relative" }}>
          <button
            onClick={handleCopy}
            title="Copy link"
            aria-label="Copy article link"
            style={{
              ...iconBtnStyle,
              backgroundColor: copied ? "#22C55E" : "#FFFFFF",
              color: copied ? "#FFFFFF" : "#1E1E1E",
              borderColor: copied ? "#22C55E" : "rgba(0,0,0,0.12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              if (!copied) e.currentTarget.style.backgroundColor = "#F8F7F5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              if (!copied) e.currentTarget.style.backgroundColor = "#FFFFFF";
            }}
          >
            {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}
          </button>
          
          {copied && (
            <span 
              style={{
                position: "absolute",
                bottom: "48px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                fontSize: "0.75rem",
                padding: "0.35rem 0.65rem",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                zIndex: 20,
                animation: "fade-in 0.2s ease"
              }}
            >
              Link copied!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
