import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByHandle, getAllStorefrontProducts, getProductTypeMockups } from "@/lib/shopify/products";
import { constructMetadata } from "@/lib/seo/metadata";
import { getProductSchema } from "@/lib/schema/product";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import ProductDetailClient from "@/app/shop/product-details/ProductDetailClient";
import { parseProduct } from "@/utils/productGroup";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return constructMetadata({
      title: "Product Not Found - Nomadica",
      description: "The requested product could not be found.",
      path: `/products/${handle}`,
    });
  }

  const parsed = parseProduct({ name: product.title, colors: product.colors });
  const title = `${parsed.baseName || product.title} - Nomadica`;
  const description = product.description || `Shop ${product.title} at Nomadica. Premium travel-inspired apparel designed for exploration.`;
  const image = product.images?.edges?.[0]?.node?.url || "/opengraph-image.jpg";

  return constructMetadata({
    title,
    description,
    path: `/products/${handle}`,
    ogImage: image,
  });
}

const fallbackMockups: Record<string, { mockupImage: string; displayName?: string }> = {
  "Tee": { mockupImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", displayName: "Tee" },
  "Shirt": { mockupImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80", displayName: "Shirt" },
  "Trousers": { mockupImage: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", displayName: "Trousers" },
  "Jacket": { mockupImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", displayName: "Jacket" },
  "Sweater": { mockupImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", displayName: "Sweater" },
  "Polo": { mockupImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80", displayName: "Polo" },
  "Shorts": { mockupImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80", displayName: "Shorts" }
};

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const [product, allEdges, mockups] = await Promise.all([
    getProductByHandle(handle),
    getAllStorefrontProducts(50),
    getProductTypeMockups()
  ]);

  if (!product) {
    notFound();
  }

  const mergedMockups = { ...fallbackMockups, ...mockups };

  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: product.category || "Tops", path: `/collections/${(product.category || "Tops").toLowerCase()}` },
    { name: product.title, path: `/products/${handle}` },
  ]);

  return (
    <>
      <JsonLd schema={productSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <ProductDetailClient
        key={handle}
        initialProduct={product}
        initialAllEdges={allEdges}
        initialMockupLookup={mergedMockups}
      />
    </>
  );
}
