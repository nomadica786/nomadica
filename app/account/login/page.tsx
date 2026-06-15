"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    quote: "Clothes that carry your stories across every border.",
  },
  {
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    quote: "Designed for those who move through the world with intention.",
  },
  {
    image: "https://images.unsplash.com/photo-1528543606781-2f6e8759f1c1?w=800&q=80",
    quote: "Every journey begins with the right outfit.",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
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
    <div style={{ paddingTop: "64px", minHeight: "100svh", display: "flex", backgroundColor: "#FFFFFF" }}>
      {/* Left – Image Slider */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          display: "none",
        }}
        className="md:block"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: activeSlide === i ? 1 : 0,
              transition: "opacity 0.8s ease",
              pointerEvents: activeSlide === i ? "all" : "none",
            }}
          >
            <img src={slide.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(30,30,30,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: "3rem", left: "3rem", right: "3rem" }}>
              <p style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: "1.75rem", fontWeight: 500, color: "#FFFFFF", lineHeight: 1.3, maxWidth: "400px" }}>
                &quot;{slide.quote}&quot;
              </p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    style={{
                      width: activeSlide === idx ? "24px" : "8px",
                      height: "3px",
                      backgroundColor: activeSlide === idx ? "#FFFFFF" : "rgba(255, 255, 255,0.4)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right – Form */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 2rem",
          backgroundColor: "#FFFFFF",
        }}
        className="md:max-w-sm lg:max-w-md"
      >
        <div style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Playfair Display', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#1E1E1E",
              textDecoration: "none",
              display: "block",
              marginBottom: "3rem",
            }}
          >
            NOMADICA
          </Link>

          <h1
            style={{
              fontFamily: "'Playfair Display', sans-serif",
              fontSize: "2.25rem",
              fontWeight: 600,
              color: "#1E1E1E",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.9375rem", color: "rgba(30,30,30,0.55)", marginBottom: "2.5rem" }}>
            Sign in to your Nomadica account
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <p style={{ fontFamily: "Montserrat", fontSize: "0.875rem", color: "#d9534f", margin: "0.5rem 0" }}>
                {error}
              </p>
            )}
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(30,30,30,0.35)" }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>

            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(30,30,30,0.35)" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
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
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <a href="#" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8125rem", color: "#1E1E1E", textDecoration: "none" }}>
                Forgot password?
              </a>
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(30,30,30,0.1)" }} />
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", color: "rgba(30,30,30,0.4)" }}>OR</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(30,30,30,0.1)" }} />
            </div>

            <button
              type="button"
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "1px solid rgba(30,30,30,0.2)",
                backgroundColor: "transparent",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.875rem",
                color: "#1E1E1E",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                transition: "background 0.2s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.5)", textAlign: "center", marginTop: "2rem" }}>
            Don&lsquo;t have an account?{" "}
            <Link href="/account/signup" style={{ color: "#1E1E1E", textDecoration: "none", fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}