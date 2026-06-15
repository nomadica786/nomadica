import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientLayout from "./ClientLayout";
import { constructMetadata } from "@/lib/seo/metadata";
import { getOrganizationSchema } from "@/lib/schema/organization";
import { getWebsiteSchema } from "@/lib/schema/website";
import JsonLd from "@/components/seo/JsonLd";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Nomadica | Premium Travel Lifestyle Apparel & Adventure Wear",
    description: "Discover premium travel-inspired apparel, adventure wear, and lifestyle essentials crafted for explorers, creators, and modern nomads.",
    path: "/",
    ogImage: "/opengraph-image.jpg",
  }),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-placeholder",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics />
        <JsonLd schema={organizationSchema} />
        <JsonLd schema={websiteSchema} />
        <ClientLayout>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}