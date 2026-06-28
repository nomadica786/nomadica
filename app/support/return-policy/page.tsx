// app/support/return-policy/page.tsx
"use client";

export default function ReturnPolicyPage() {
  const sections = [
    {
      num: "1",
      title: "Return Window",
      content: (
        <>
          We offer a 3-day return window from the date of delivery.
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Return requests must be initiated within 3 days of receiving your order.</li>
            <li>Items must be returned in their original condition with all tags attached.</li>
            <li>Products must be unworn, unwashed, and undamaged.</li>
          </ul>
          <strong>Note:</strong> Returns initiated after 3 days from delivery will not be accepted.
        </>
      )
    },
    {
      num: "2",
      title: "Eligible Items for Return",
      content: (
        <>
          The following items are eligible for return:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>T-shirts in original packaging with tags intact.</li>
            <li>Items with manufacturing defects.</li>
            <li>Wrong items delivered.</li>
            <li>Damaged items received during shipping.</li>
            <li>Size exchange requests (subject to availability).</li>
          </ul>
        </>
      )
    },
    {
      num: "3",
      title: "Non-Returnable Items",
      content: (
        <>
          The following items cannot be returned or exchanged:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Items that have been worn, washed, or altered.</li>
            <li>Items without original tags and packaging.</li>
            <li>Items purchased during clearance or final sale.</li>
            <li>Customized or personalized products.</li>
            <li>Items damaged due to customer misuse.</li>
            <li>Innerwear and accessories (for hygiene reasons).</li>
          </ul>
        </>
      )
    },
    {
      num: "4",
      title: "How to Initiate a Return",
      content: (
        <>
          To request a return or exchange, follow these steps:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0 1rem", lineHeight: 1.7 }}>
            <li>Email us at <strong>support@nomadica.in</strong> within 3 days of delivery.</li>
            <li>Include your Order ID and reason for return.</li>
            <li>Attach clear photos of the product (for defects or damage claims).</li>
            <li>Our team will review your request within 24-48 hours.</li>
            <li>Once approved, you will receive return instructions.</li>
          </ul>
          <div style={{ backgroundColor: "#F7F5F2", padding: "1rem", borderRadius: "6px", display: "inline-block" }}>
            📧 <strong>support@nomadica.in</strong>
          </div>
        </>
      )
    },
    {
      num: "5",
      title: "Return Shipping",
      content: (
        <>
          Return shipping guidelines:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li><strong>Defective/Wrong Items:</strong> We will arrange free pickup or reimburse shipping costs.</li>
            <li><strong>Change of Mind:</strong> Return shipping costs are borne by the customer.</li>
            <li><strong>Size Exchange:</strong> Free exchange shipping within India.</li>
          </ul>
          Please ensure the product is securely packed to prevent damage during transit. We recommend using the original packaging.
        </>
      )
    },
    {
      num: "6",
      title: "Exchanges",
      content: (
        <>
          We offer exchanges for:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Size exchanges (subject to stock availability).</li>
            <li>Color exchanges (subject to stock availability).</li>
            <li>Replacement of defective items.</li>
          </ul>
          If the requested size or color is not available, you may opt for a refund or store credit.
          <br /><br />
          <strong>Note:</strong> Exchange requests are processed within 5-7 business days after receiving the returned item.
        </>
      )
    },
    {
      num: "7",
      title: "Refund Process",
      content: (
        <>
          Once your return is received and inspected:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>We will notify you of the approval or rejection of your refund.</li>
            <li>Approved refunds will be processed within 5-7 business days.</li>
            <li>Refunds will be credited to the original payment method.</li>
            <li>Bank processing may take an additional 5-10 business days.</li>
          </ul>
          <strong>Refund Methods:</strong>
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li><strong>Credit/Debit Card:</strong> Refund to original card.</li>
            <li><strong>UPI/Net Banking:</strong> Refund to bank account.</li>
            <li><strong>Cash on Delivery:</strong> Refund via bank transfer (NEFT/IMPS).</li>
          </ul>
        </>
      )
    },
    {
      num: "8",
      title: "Refund Deductions",
      content: (
        <>
          Please note the following deductions that may apply:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Original shipping charges are non-refundable (unless item was defective).</li>
            <li>COD handling charges (if applicable) are non-refundable.</li>
            <li>Any promotional discounts will be adjusted in the refund amount.</li>
          </ul>
        </>
      )
    },
    {
      num: "9",
      title: "Damaged or Defective Items",
      content: (
        <>
          If you receive a damaged or defective item:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Report the issue within 24 hours of delivery.</li>
            <li>Provide photos of the damaged product and packaging.</li>
            <li>Do not discard the original packaging until the claim is resolved.</li>
            <li>We will arrange a free replacement or full refund.</li>
          </ul>
          <strong>Important:</strong> Claims for damage must be reported within 24 hours with photographic evidence.
        </>
      )
    },
    {
      num: "10",
      title: "Order Cancellation",
      content: (
        <>
          Order cancellation policy:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li><strong>Before Dispatch:</strong> Orders can be cancelled with a full refund.</li>
            <li><strong>After Dispatch:</strong> Cancellation not possible; please initiate a return after delivery.</li>
            <li><strong>COD Orders:</strong> May be cancelled before delivery by contacting customer support.</li>
          </ul>
          To cancel an order, email us immediately at <strong>support@nomadica.in</strong> with your Order ID.
        </>
      )
    },
    {
      num: "11",
      title: "Store Credit",
      content: (
        <>
          As an alternative to refunds, we offer store credit that can be used for future purchases on Nomadica.
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Store credit is valid for 12 months from the date of issue.</li>
            <li>Store credit cannot be converted to cash.</li>
            <li>Store credit can be used on any product without restrictions.</li>
          </ul>
        </>
      )
    },
    {
      num: "12",
      title: "International Orders",
      content: (
        <>
          For orders shipped outside India:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Returns must be shipped at the customer's expense.</li>
            <li>Customs duties and taxes are non-refundable.</li>
            <li>Refund will be processed after the item is received and inspected.</li>
            <li>International return shipping may take 2-4 weeks.</li>
          </ul>
        </>
      )
    },
    {
      num: "13",
      title: "Contact Us",
      content: (
        <>
          For any questions or concerns regarding returns and exchanges, please reach out to us:
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem", fontFamily: "'Montserrat', sans-serif" }}>
            <div>📧 <strong>Email:</strong> support@nomadica.in</div>
            <div>📞 <strong>Response Time:</strong> Within 24-48 hours</div>
            <div>🌐 <strong>Website:</strong> www.nomadica.in</div>
          </div>
        </>
      )
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
          Returns & Exchanges
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
          At Nomadica, we want you to be completely satisfied with your purchase. If for any reason you are not happy with your order, we offer a simple and hassle-free returns and exchange process.
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
          <p style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Please read this policy carefully to understand the terms and conditions for returns, exchanges, and refunds. By making a purchase on our Website, you agree to the terms outlined in this Returns Policy.
          </p>

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
              <div style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, margin: 0 }}>
                {sec.content}
              </div>
            </div>
          ))}

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
            <p style={{ margin: 0 }}>Last Updated: February 22, 2026</p>
          </div>

        </div>
      </div>

    </div>
  );
}
