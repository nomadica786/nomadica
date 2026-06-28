// app/account/login/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      window.location.href = "/account/profile";
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        backgroundColor: "#F5F5F0", 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "2rem 1.5rem"
      }}
    >
      {/* Content Card */}
      <div 
        style={{ 
          backgroundColor: "#FFFFFF", 
          border: "1px solid rgba(0,0,0,0.06)", 
          borderRadius: "8px", 
          padding: "3.5rem 3rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.02)",
          width: "100%",
          maxWidth: "480px"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 
            style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: "2rem", 
              fontWeight: 600, 
              color: "#1E1E1E",
              margin: "0 0 0.5rem"
            }}
          >
            Welcome Back
          </h1>
          <p 
            style={{ 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "0.85rem", 
              color: "rgba(30,30,30,0.5)",
              margin: 0
            }}
          >
            Sign in to your Nomadica account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {error && (
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "#DC2626", margin: 0, fontWeight: 500 }}>
              {error}
            </p>
          )}

          {/* Email field */}
          <div>
            <label 
              style={{ 
                display: "block", 
                fontFamily: "'Montserrat', sans-serif", 
                fontSize: "0.6875rem", 
                fontWeight: 700, 
                letterSpacing: "0.08em", 
                textTransform: "uppercase", 
                color: "#1E1E1E",
                marginBottom: "0.5rem"
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                backgroundColor: "#F5F3F0",
                border: "none",
                borderRadius: "4px",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.85rem",
                color: "#1E1E1E",
                outline: "none"
              }}
            />
          </div>

          {/* Password field */}
          <div>
            <label 
              style={{ 
                display: "block", 
                fontFamily: "'Montserrat', sans-serif", 
                fontSize: "0.6875rem", 
                fontWeight: 700, 
                letterSpacing: "0.08em", 
                textTransform: "uppercase", 
                color: "#1E1E1E",
                marginBottom: "0.5rem"
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 2.75rem 0.85rem 1rem",
                  backgroundColor: "#F5F3F0",
                  border: "none",
                  borderRadius: "4px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.85rem",
                  color: "#1E1E1E",
                  outline: "none"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(30,30,30,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0
                }}
              >
                {/* SVG for Closed Eye / Eye */}
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                )}
              </button>
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                style={{ 
                  fontFamily: "'Montserrat', sans-serif", 
                  fontSize: "0.75rem", 
                  color: "#C4B5A0", 
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: "100%", 
              padding: "0.85rem",
              backgroundColor: "#C4B5A0",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background-color 0.2s",
              marginTop: "0.5rem"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B4E37"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C4B5A0"}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(0,0,0,0.06)" }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", color: "rgba(30,30,30,0.35)", fontWeight: 700 }}>OR</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(0,0,0,0.06)" }} />
          </div>

          <p 
            style={{ 
              fontFamily: "'Montserrat', sans-serif", 
              fontSize: "0.8rem", 
              color: "rgba(30,30,30,0.6)", 
              textAlign: "center", 
              margin: 0 
            }}
          >
            Don't have an account?{" "}
            <Link 
              href="/account/signup" 
              style={{ 
                color: "#C4B5A0", 
                textDecoration: "none", 
                fontWeight: 600 
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#6B4E37"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#C4B5A0"}
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}