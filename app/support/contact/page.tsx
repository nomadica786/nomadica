// app/support/contact/page.tsx
"use client";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "#F9F8F6", minHeight: "100vh", paddingBottom: "5rem" }}>
      
      {/* Top Banner */}
      <div 
        style={{ 
          backgroundColor: "#C4B5A0", 
          padding: "5rem 1.5rem", 
          textAlign: "center",
          color: "#FFFFFF"
        }}
      >
        <h1 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)", 
            fontWeight: 500, 
            margin: "0 0 0.5rem" 
          }}
        >
          Contact Us
        </h1>
        <p 
          style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontSize: "1rem", 
            fontWeight: 400,
            opacity: 0.9,
            margin: 0
          }}
        >
          We're here to help
        </p>
      </div>

      {/* Content Card */}
      <div style={{ maxWidth: "800px", margin: "2rem auto 0", padding: "0 1.5rem" }}>
        <div 
          style={{ 
            backgroundColor: "#FFFFFF", 
            border: "1px solid rgba(0,0,0,0.06)", 
            borderRadius: "12px", 
            padding: "3.5rem 3rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          {/* Section: Get in Touch */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "1.75rem", 
                fontWeight: 600, 
                color: "#1E1E1E",
                margin: "0 0 1.25rem"
              }}
            >
              Get in Touch
            </h2>
            <p style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, margin: 0 }}>
              We value your feedback and are committed to providing excellent customer service. Whether you have questions about our products, need help with an order, or just want to say hello, we'd love to hear from you.
            </p>
          </div>

          <div style={{ height: "1px", backgroundColor: "rgba(0,0,0,0.06)", marginBottom: "2.5rem" }} />

          {/* Section: Email Us */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "1.35rem", 
                fontWeight: 600, 
                color: "#1E1E1E",
                margin: "0 0 1rem",
                borderBottom: "1px solid #C4B5A0",
                paddingBottom: "0.5rem"
              }}
            >
              Email Us
            </h3>
            
            {/* Beige Info Box */}
            <div 
              style={{ 
                backgroundColor: "#F7F5F2", 
                borderRadius: "8px", 
                padding: "1.5rem", 
                display: "flex", 
                gap: "1.25rem", 
                alignItems: "center" 
              }}
            >
              <div 
                style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "6px", 
                  backgroundColor: "#C4B5A0", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  color: "#FFFFFF",
                  flexShrink: 0
                }}
              >
                <Mail size={22} />
              </div>
              <div>
                <a 
                  href="mailto:support@nomadica.in" 
                  style={{ 
                    fontFamily: "'Montserrat', sans-serif", 
                    fontSize: "1.1rem", 
                    fontWeight: 600, 
                    color: "#C4B5A0", 
                    textDecoration: "none"
                  }}
                >
                  support@nomadica.in
                </a>
                <p style={{ fontSize: "0.8rem", color: "rgba(30,30,30,0.65)", margin: "0.25rem 0 0", lineHeight: 1.5 }}>
                  For any queries regarding orders, returns, or general information, feel free to reach out to us.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Response Time */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "1.35rem", 
                fontWeight: 600, 
                color: "#1E1E1E",
                margin: "0 0 1rem",
                borderBottom: "1px solid #C4B5A0",
                paddingBottom: "0.5rem"
              }}
            >
              Response Time
            </h3>
            <p style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, margin: 0 }}>
              We typically respond to all inquiries within 24-48 business hours. During peak seasons or holidays, response times may be slightly longer.
            </p>
          </div>

          {/* Section: Business Hours */}
          <div style={{ marginBottom: "3rem" }}>
            <h3 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "1.35rem", 
                fontWeight: 600, 
                color: "#1E1E1E",
                margin: "0 0 1rem",
                borderBottom: "1px solid #C4B5A0",
                paddingBottom: "0.5rem"
              }}
            >
              Business Hours
            </h3>
            <p style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, margin: 0 }}>
              Our customer support team is available Monday through Saturday, 10:00 AM to 6:00 PM IST.
            </p>
          </div>

          {/* Thank You Note */}
          <div style={{ textAlign: "center", paddingTop: "1.5rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <p 
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "1rem", 
                fontStyle: "italic", 
                color: "rgba(30,30,30,0.5)",
                margin: 0
              }}
            >
              Thank you for choosing Nomadica!
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
