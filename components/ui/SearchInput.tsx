"use client";
import { Search } from "lucide-react";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search stories, collections, sustainability..." }: SearchInputProps) {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: "720px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Search
        size={20}
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(30,30,30,0.35)",
        }}
      />
      <input
        type="search"
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{
          width: "100%",
          padding: "1rem 1rem 1rem 3rem",
          backgroundColor: "rgba(255, 255, 255,0.95)",
          border: "1px solid rgba(30,30,30,0.1)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.95rem",
          color: "#1E1E1E",
        }}
      />
    </div>
  );
}
