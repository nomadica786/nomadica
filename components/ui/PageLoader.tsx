// components/ui/PageLoader.tsx
"use client";

export function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        width: "100%",
        fontFamily: "'Montserrat', sans-serif"
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          border: "2px solid rgba(196, 181, 160, 0.2)",
          borderTop: "2px solid #C4B5A0",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginRight: "0.75rem"
        }}
      />
      <span style={{ fontSize: "0.8rem", color: "rgba(30, 30, 30, 0.5)", fontWeight: 600, letterSpacing: "0.08em" }}>
        LOADING
      </span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}