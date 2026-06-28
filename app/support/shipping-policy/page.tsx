// app/support/shipping-policy/page.tsx
"use client";

export default function ShippingPolicyPage() {
  const sections = [
    {
      num: "1",
      title: "Order Processing Time",
      content: "All orders are processed within 1-3 business days after order confirmation. Orders are not processed or shipped on Sundays or public holidays."
    },
    {
      num: "2",
      title: "Shipping Time",
      content: "Once dispatched, orders are typically delivered within 4-7 business days depending on the delivery location. Delivery timelines may vary due to unforeseen circumstances or courier delays."
    },
    {
      num: "3",
      title: "Shipping Charges",
      content: "Shipping charges, if applicable, will be calculated and displayed at checkout before completing your purchase."
    },
    {
      num: "4",
      title: "Order Tracking",
      content: "Once your order is shipped, you will receive a confirmation email with tracking details to monitor your shipment."
    },
    {
      num: "5",
      title: "Delays",
      content: "Nomadica is not responsible for delays caused by courier partners, natural events, or circumstances beyond our control. However, we will assist you in resolving any shipping-related concerns."
    },
    {
      num: "6",
      title: "Incorrect Address",
      content: "Please ensure that your shipping details are accurate. Nomadica is not responsible for orders delivered to incorrectly provided addresses."
    }
  ];

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
          Shipping Policy
        </h1>
        <p 
          style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontSize: "1.05rem", 
            fontWeight: 400,
            opacity: 0.9,
            margin: "0 auto",
            maxWidth: "680px",
            lineHeight: 1.6
          }}
        >
          Thank you for shopping with Nomadica. We are committed to delivering your orders in a timely and secure manner.
        </p>
      </div>

      {/* Content Card */}
      <div style={{ maxWidth: "800px", margin: "-3rem auto 0", padding: "0 1.5rem" }}>
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
          {/* Policy Sections */}
          {sections.map((sec) => (
            <div key={sec.num} style={{ marginBottom: "2.5rem" }}>
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
                {sec.num}. {sec.title}
              </h3>
              <p style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, margin: 0 }}>
                {sec.content}
              </p>
            </div>
          ))}

          {/* Need Help? Section */}
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
              Need Help?
            </h3>
            <p style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, margin: 0 }}>
              If you have any questions regarding shipping or need assistance with your order, please contact us at:{" "}
              <a 
                href="mailto:support@nomadica.in" 
                style={{ 
                  color: "#C4B5A0", 
                  fontWeight: 600, 
                  textDecoration: "none" 
                }}
              >
                support@nomadica.in
              </a>
            </p>
          </div>

          {/* Footer Metadata */}
          <div 
            style={{ 
              textAlign: "center", 
              paddingTop: "2rem", 
              borderTop: "1px solid rgba(0,0,0,0.06)",
              fontSize: "0.8rem",
              color: "rgba(30,30,30,0.4)"
            }}
          >
            <p style={{ margin: "0 0 0.25rem" }}>Effective Date: February 2026</p>
            <p style={{ margin: 0 }}>Last Updated: February 19, 2026</p>
          </div>

        </div>
      </div>

    </div>
  );
}
