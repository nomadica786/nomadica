import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientLayout from "./ClientLayout";

export const metadata = {
  metadataBase: new URL("https://nomadica-orcin.vercel.app/"),

  title: "Nomadica | Premium Travel Lifestyle Apparel & Adventure Wear",

  description:
    "Discover premium travel-inspired apparel, adventure wear, and lifestyle essentials crafted for explorers, creators, and modern nomads.",

  openGraph: {
    title:
      "Nomadica | Premium Travel Lifestyle Apparel & Adventure Wear",

    description:
      "Travel-inspired apparel and lifestyle essentials designed for modern explorers. Wear your journey with Nomadica.",

    siteName: "Nomadica",

    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nomadica Travel Lifestyle Collection",
      },
    ],

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Nomadica | Premium Travel Lifestyle Apparel & Adventure Wear",

    description:
      "Travel-inspired apparel and lifestyle essentials designed for modern explorers.",

    images: ["/opengraph-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <ClientLayout>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}