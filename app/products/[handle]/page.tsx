import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/shopify/products";
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

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

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
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
