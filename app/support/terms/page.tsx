// app/support/terms/page.tsx
"use client";

export default function TermsPage() {
  const sections = [
    {
      num: "1",
      title: "Acceptance of Terms",
      content: (
        <>
          1.1 Any person accessing or using the Platform (&quot;User&quot;, &quot;You&quot;, &quot;Your&quot;) agrees to be bound by these Terms and Conditions and all policies referenced herein.
          <br /><br />
          1.2 These Terms constitute a legally binding agreement between You and Nomadica in relation to your access and use of the Platform.
          <br /><br />
          1.3 Nomadica reserves the right to update, modify, or amend these Terms at any time without prior notice. Continued use of the Platform constitutes acceptance of such changes.
          <br /><br />
          1.4 If you do not agree with these Terms, please do not use the Platform.
        </>
      )
    },
    {
      num: "2",
      title: "Registration",
      content: (
        <>
          2.1 To access certain services, you may be required to register on the Platform. Registration is free of cost.
          <br /><br />
          2.2 You may register by:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Creating an account with your email and password, or</li>
            <li>Logging in through a third-party provider (such as Google or Facebook), subject to their terms.</li>
          </ul>
          2.3 You are responsible for maintaining confidentiality of your login credentials and for all activities under your account.
        </>
      )
    },
    {
      num: "3",
      title: "User Responsibilities and Restrictions",
      content: (
        <>
          3.1 You agree to use the Platform only for lawful purposes.
          <br /><br />
          3.2 You shall not:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0 1rem", lineHeight: 1.7 }}>
            <li>Modify or copy any content without authorization.</li>
            <li>Attempt to reverse engineer or hack the Platform.</li>
            <li>Post defamatory, obscene, abusive, or unlawful content.</li>
            <li>Upload viruses or harmful code.</li>
            <li>Impersonate another person.</li>
            <li>Engage in spamming, phishing, or fraudulent activities.</li>
          </ul>
          3.3 You confirm that:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>You are at least 18 years of age.</li>
            <li>All information provided by you is accurate and complete.</li>
          </ul>
        </>
      )
    },
    {
      num: "4",
      title: "Products and Orders",
      content: (
        <>
          4.1 Display of products on the Platform constitutes an invitation to offer. Placing an order constitutes your offer to purchase.
          <br /><br />
          4.2 All orders are subject to:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Product availability</li>
            <li>Acceptance by Nomadica</li>
            <li>Successful payment authorization</li>
          </ul>
          4.3 Nomadica reserves the right to cancel any order due to pricing errors, stock unavailability, or suspicious transactions.
          <br /><br />
          4.4 Prices are subject to change without prior notice.
        </>
      )
    },
    {
      num: "5",
      title: "Payments",
      content: (
        <>
          5.1 Nomadica accepts payments via:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Credit/Debit Cards</li>
            <li>Net Banking</li>
            <li>UPI</li>
            <li>Digital Wallets</li>
            <li>Cash on Delivery (if available)</li>
          </ul>
          5.2 You agree to provide accurate payment information.
          <br /><br />
          5.3 In case of failed transactions, Nomadica shall not be liable for any loss caused due to payment gateway issues.
        </>
      )
    },
    {
      num: "6",
      title: "Intellectual Property",
      content: (
        <>
          6.1 All content on the Platform including logos, designs, graphics, product images, text, and website layout is the intellectual property of Nomadica and protected under applicable laws.
          <br /><br />
          6.2 No content may be copied, reproduced, or used for commercial purposes without prior written permission.
        </>
      )
    },
    {
      num: "7",
      title: "User-Generated Content",
      content: (
        <>
          7.1 If you post reviews, comments, or feedback, you grant Nomadica a royalty-free, perpetual license to use, reproduce, and publish such content.
          <br /><br />
          7.2 Nomadica reserves the right to remove any content that violates these Terms.
        </>
      )
    },
    {
      num: "8",
      title: "Disclaimer of Warranties",
      content: (
        <>
          8.1 The Platform and Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis.
          <br /><br />
          8.2 Nomadica does not guarantee uninterrupted access, error-free functionality, or exact color accuracy of products.
          <br /><br />
          8.3 Nomadica&apos;s liability, if any, shall be limited to the order amount paid by the User.
        </>
      )
    },
    {
      num: "9",
      title: "Limitation of Liability",
      content: "Nomadica shall not be liable for indirect losses, loss of profits, delivery delays caused by courier partners, or unauthorized account access due to user negligence."
    },
    {
      num: "10",
      title: "Indemnification",
      content: "You agree to indemnify and hold harmless Nomadica from claims arising out of violation of these Terms or misuse of the Platform."
    },
    {
      num: "11",
      title: "Termination",
      content: "Nomadica may suspend or terminate your account for breach of Terms, false information, or fraudulent activities."
    },
    {
      num: "12",
      title: "Force Majeure",
      content: "Nomadica shall not be liable for failure to perform obligations due to events beyond reasonable control."
    },
    {
      num: "13",
      title: "Governing Law",
      content: "These Terms shall be governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra."
    },
    {
      num: "14",
      title: "Communication",
      content: "By registering, you consent to receive order updates and promotional communications. You may unsubscribe at any time."
    },
    {
      num: "15",
      title: "Grievance Redressal",
      content: (
        <>
          For any complaints or queries, contact:
          <br /><br />
          📧 <strong>support@nomadica.in</strong>
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
          Terms and Conditions
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
          Please read these terms carefully. Welcome to Nomadica!
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
          <div style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            <p style={{ margin: "0 0 1rem" }}>
              The website <strong>Nomadica.in</strong> (&quot;Platform&quot;) is owned and operated by Nomadica. By accessing or using this Platform, you agree to comply with and be bound by the following Terms and Conditions.
            </p>
            <p style={{ margin: 0 }}>
              This document is an electronic record in terms of the Information Technology Act, 2000 and rules made thereunder, including amended provisions relating to electronic records. This electronic record is generated by a computer system and does not require any physical or digital signatures.
            </p>
          </div>

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
            <p style={{ margin: 0 }}>Last Updated: February 19, 2026</p>
          </div>

        </div>
      </div>

    </div>
  );
}
