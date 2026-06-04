"use client";

interface SnowballLoaderProps {
  color?: string;
  size?: "sm" | "md" | "lg";
}

export default function SnowballLoader({ color = "#7A5C3E", size = "md" }: SnowballLoaderProps) {
  const dotSize = size === "sm" ? 6 : size === "lg" ? 12 : 8;
  return (
    <div
      style={{
        display: "flex",
        gap: `${dotSize * 0.75}px`,
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: "50%",
            backgroundColor: color,
            display: "inline-block",
            animation: `bounce-dot 1.4s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div>
      <div
        style={{
          aspectRatio: "3/4",
          backgroundColor: "#E8E4DC",
        }}
        className="skeleton"
      />
      <div style={{ paddingTop: "0.875rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ height: "12px", width: "40%", borderRadius: "2px" }} className="skeleton" />
        <div style={{ height: "16px", width: "75%", borderRadius: "2px" }} className="skeleton" />
        <div style={{ height: "14px", width: "30%", borderRadius: "2px" }} className="skeleton" />
      </div>
    </div>
  );
}