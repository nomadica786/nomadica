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
import { Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
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