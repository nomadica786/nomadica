"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);

  const slides = [
    { image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", quote: "Join a community of conscious travellers." },
    { image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", quote: "Premium gear, ethically made for every adventure." },
    { image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", quote: "Your journey, your style, your story." },
  ];

  return (
    <div style={{ paddingTop: "64px", minHeight: "100svh", display: "flex", backgroundColor: "#F7F4EE" }}>
      {/* Left – Image Slider (hidden on mobile) */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }} className="hidden md:block">
        {slides.map((slide, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: activeSlide === i ? 1 : 0, transition: "opacity 0.8s ease" }}>
            <img src={slide.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(30,30,30,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: "3rem", left: "3rem", right: "3rem" }}>
              <p style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.75rem", fontWeight: 500, color: "#F7F4EE", maxWidth: "360px" }}>&quot;{slide.quote}&quot;</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                {slides.map((_, idx) => (
                  <button key={idx} onClick={() => setActiveSlide(idx)} style={{ width: activeSlide === idx ? "24px" : "8px", height: "3px", backgroundColor: activeSlide === idx ? "#F7F4EE" : "rgba(247,244,238,0.4)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right – Form */}
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem 2rem", backgroundColor: "#F7F4EE" }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", width: "100%" }}>
          <Link href="/" style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#1E1E1E", textDecoration: "none", display: "block", marginBottom: "3rem" }}>
            NOMADICA
          </Link>

          <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "2.25rem", fontWeight: 600, color: "#1E1E1E", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            Create account
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.9375rem", color: "rgba(30,30,30,0.55)", marginBottom: "2.5rem" }}>
            Join the Nomadica community
          </p>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(30,30,30,0.35)" }} />
                <input type="text" placeholder="First name" className="form-input" style={{ paddingLeft: "2.5rem" }} />
              </div>
              <input type="text" placeholder="Last name" className="form-input" />
            </div>

            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(30,30,30,0.35)" }} />
              <input type="email" placeholder="Email address" className="form-input" style={{ paddingLeft: "2.75rem" }} />
            </div>

            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(30,30,30,0.35)" }} />
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="form-input" style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(30,30,30,0.35)" }}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
              <input type="checkbox" style={{ marginTop: "2px", accentColor: "#7A5C3E" }} />
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.8125rem", color: "rgba(30,30,30,0.6)", lineHeight: 1.6 }}>
                I agree to the{" "}
                <Link href="/support/terms" style={{ color: "#7A5C3E", textDecoration: "none" }}>Terms</Link>
                {" "}and{" "}
                <Link href="/support/privacy-policy" style={{ color: "#7A5C3E", textDecoration: "none" }}>Privacy Policy</Link>
              </span>
            </label>

            <button className="btn-primary" type="submit" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
              Create Account
            </button>
          </form>

          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", color: "rgba(30,30,30,0.5)", textAlign: "center", marginTop: "2rem" }}>
            Already have an account?{" "}
            <Link href="/account/login" style={{ color: "#7A5C3E", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}