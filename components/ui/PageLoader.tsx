"use client";
import { useEffect, useState } from "react";

export default function PageLoader() {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#1E1E1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        transition: "opacity 0.5s ease",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      {/* Animated text */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Clash Display', sans-serif",
            color: "#F7F4EE",
            fontSize: phase === "hold" ? "clamp(4rem, 12vw, 9rem)" : phase === "exit" ? "clamp(1rem, 3vw, 2rem)" : "clamp(2rem, 6vw, 5rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            transition: "font-size 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            opacity: phase === "enter" ? 0 : phase === "exit" ? 0 : 1,
            transform: phase === "enter" ? "translateY(40px)" : phase === "exit" ? "translateY(-20px) scale(0.3)" : "translateY(0) scale(1)",
            display: "block",
            textAlign: "center",
          }}
        >
          NOMADICA
        </span>
        <span
          style={{
            fontFamily: "'Satoshi', sans-serif",
            color: "#7A5C3E",
            fontSize: "clamp(0.75rem, 2vw, 1rem)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 500,
            transition: "opacity 0.5s ease 0.3s",
            opacity: phase === "hold" ? 1 : 0,
          }}
        >
          Travel. Wear. Live.
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "1px",
          backgroundColor: "rgba(247, 244, 238, 0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "#7A5C3E",
            width: phase === "enter" ? "0%" : phase === "hold" ? "70%" : "100%",
            transition: "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}