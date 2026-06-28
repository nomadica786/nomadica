// app/support/privacy-policy/page.tsx
"use client";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      num: "1",
      title: "Legal Compliance",
      content: (
        <>
          This Privacy Policy is published in accordance with:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Section 43A of the Information Technology Act, 2000.</li>
            <li>The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</li>
            <li>Applicable provisions under Indian data protection laws.</li>
          </ul>
        </>
      )
    },
    {
      num: "2",
      title: "What Information We Collect",
      content: (
        <>
          We collect the following categories of information:
          <br /><br />
          <strong>2.1 Personal Information</strong><br />
          Personal information refers to information that can identify you directly or indirectly, including:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0 1rem", lineHeight: 1.7 }}>
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Mobile Number</li>
            <li>Shipping and Billing Address</li>
            <li>Gender (if voluntarily provided)</li>
            <li>Date of Birth (if voluntarily provided)</li>
          </ul>
          Providing this information is voluntary. However, certain services (such as placing an order) require such information.
          <br /><br />
          <strong>2.2 Sensitive Personal Data or Information (SPDI)</strong><br />
          Sensitive information may include:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0 1rem", lineHeight: 1.7 }}>
            <li>Account password</li>
            <li>Payment details such as credit/debit card information or bank details</li>
            <li>Any other financial information required to process transactions</li>
          </ul>
          Note: Nomadica does not store full card details. All payment transactions are processed securely through authorized third-party payment gateways.
          <br /><br />
          Information freely available in the public domain or provided under applicable law shall not be considered sensitive personal information.
        </>
      )
    },
    {
      num: "3",
      title: "Purpose of Collection",
      content: (
        <>
          We collect and process your information for the following purposes:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>To process and deliver your orders</li>
            <li>To manage returns, exchanges, and refunds</li>
            <li>To provide customer support</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To improve user experience</li>
            <li>To personalize content and offers</li>
            <li>To prevent fraud and unauthorized transactions</li>
            <li>To comply with legal and regulatory requirements</li>
            <li>To send promotional emails (only if you opt-in)</li>
          </ul>
        </>
      )
    },
    {
      num: "4",
      title: "Payment Information",
      content: "All payments made on Nomadica are processed through secure third-party payment gateways that use encryption and secure protocols. We do not store your complete debit/credit card details on our servers. Verification and authentication are handled directly by the payment gateway provider."
    },
    {
      num: "5",
      title: "Cookies and Tracking Technologies",
      content: (
        <>
          Nomadica uses cookies to:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Improve website functionality</li>
            <li>Remember user preferences</li>
            <li>Analyze traffic and user behavior</li>
            <li>Provide a smoother shopping experience</li>
          </ul>
          You may disable cookies through your browser settings. However, disabling cookies may affect certain features of the Website. We do not store personally identifiable information in cookies.
        </>
      )
    },
    {
      num: "6",
      title: "Automatic Information Collection",
      content: (
        <>
          When you visit our Website, we may automatically collect:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Pages visited</li>
            <li>Time spent on Website</li>
            <li>Referral source</li>
          </ul>
          This data is used for analytics, performance improvement, and security purposes.
        </>
      )
    },
    {
      num: "7",
      title: "Sharing of Information",
      content: (
        <>
          We may share your information with:
          <ul style={{ paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.7 }}>
            <li>Payment gateway providers</li>
            <li>Courier and logistics partners</li>
            <li>IT and hosting service providers</li>
            <li>Marketing service providers (only where permitted)</li>
            <li>Government authorities, when required by law</li>
          </ul>
          We do not sell your personal information to third parties. All third parties receiving your data are required to maintain confidentiality and use it only for specified purposes.
        </>
      )
    },
    {
      num: "8",
      title: "Data Security",
      content: "We implement reasonable security practices and procedures including secure servers, SSL encryption, firewalls, and access controls. However, while we strive to protect your information, no system can guarantee 100% security. Users are advised to exercise caution while sharing personal data online."
    },
    {
      num: "9",
      title: "User Rights",
      content: (
        <>
          You may access your personal information, correct inaccurate information, request deletion of your data (subject to legal obligations), or withdraw consent for marketing communications.
          <br /><br />
          To exercise these rights, please contact us at: 📧 <strong>support@nomadica.in</strong>
        </>
      )
    },
    {
      num: "10",
      title: "Third-Party Links",
      content: "Our Website may contain links to third-party websites. Nomadica is not responsible for the privacy practices or content of those websites. Users are advised to review the privacy policies of external websites before providing personal information."
    },
    {
      num: "11",
      title: "Children's Privacy",
      content: "Nomadica does not knowingly collect personal information from individuals under the age of 18. If we become aware of such collection, we will take steps to delete the information."
    },
    {
      num: "12",
      title: "Business Transfers",
      content: "In case of merger, acquisition, restructuring, or sale of assets, user information may be transferred to the acquiring entity, subject to applicable data protection laws."
    },
    {
      num: "13",
      title: "Testimonials & Reviews",
      content: "By submitting reviews or testimonials on Nomadica, you consent to the publication of such content along with your name and city (if provided) on the Website or social media platforms. We may edit reviews for clarity without altering the intent."
    },
    {
      num: "14",
      title: "Updates to This Policy",
      content: "We may update this Privacy Policy from time to time. Updated versions will be posted on this page with a revised effective date. Your continued use of the Website after changes are posted constitutes your acceptance of the revised policy."
    },
    {
      num: "15",
      title: "Grievance Officer",
      content: (
        <>
          In accordance with the Information Technology Act, 2000, the Grievance Officer details are as follows:
          <br /><br />
          <strong>Name:</strong> Grievance Officer, Nomadica<br />
          <strong>Email:</strong> support@nomadica.in
        </>
      )
    },
    {
      num: "16",
      title: "Contact Us",
      content: (
        <>
          If you have any questions regarding this Privacy Policy, you may contact us at:
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
            <div>📧 <strong>Email:</strong> support@nomadica.in</div>
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
          Privacy Policy
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
          Your privacy is important to us. This Privacy Policy describes how we collect, use, disclose, process, and protect your information when you visit or use our Website.
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
          <div style={{ fontSize: "0.925rem", color: "rgba(30,30,30,0.65)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            <p style={{ margin: "0 0 1rem" }}>
              Nomadica is owned and operated by <strong>Nomadica Lifestyle Pvt. Ltd.</strong>, a company incorporated under the laws of India, having its registered office at Mumbai, Maharashtra, India (hereinafter referred to as &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
            </p>
            <p style={{ margin: 0 }}>
              Nomadica operates the website <strong>www.nomadica.in</strong> (the &quot;Website&quot;), which offers travel-inspired and travel-themed T-shirts and lifestyle products for sale to users across India and other permitted regions.
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
