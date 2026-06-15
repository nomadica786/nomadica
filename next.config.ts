import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/brand/journal",
        destination: "/journal",
        permanent: true,
      },
      {
        source: "/brand/journal/:slug*",
        destination: "/journal/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
