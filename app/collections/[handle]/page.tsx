import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/shopify/products";
import { constructMetadata } from "@/lib/seo/metadata";
import { getCollectionSchema } from "@/lib/schema/collection";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import CollectionClient from "@/components/shop/CollectionClient";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return constructMetadata({
      title: "Collection Not Found - Nomadica",
      description: "The requested collection could not be found.",
      path: `/collections/${handle}`,
    });
  }

  const title = `${collection.title} - Nomadica`;
  const description = collection.description || `Browse the latest ${collection.title} at Nomadica. Premium travel-inspired apparel.`;
  const image = collection.image?.url || "/opengraph-image.jpg";

  return constructMetadata({
    title,
    description,
    path: `/collections/${handle}`,
    ogImage: image,
  });
}

export default async function CollectionPage({ params }: PageProps) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  // Map Shopify GraphQL product nodes back to standard ProductCard props
  const edges = collection.products?.edges || [];
  const mappedProducts = edges.map((edge: any) => {
    const node = edge.node;
    const priceVal = node.price || parseFloat(node.variants?.edges?.[0]?.node?.price?.amount || '0');
    const origPriceVal = node.originalPrice || (node.variants?.edges?.[0]?.node?.compareAtPrice ? parseFloat(node.variants?.edges?.[0]?.node?.compareAtPrice?.amount || '0') : undefined);
    return {
      id: node.id,
      name: node.title,
      handle: node.handle,
      price: priceVal,
      originalPrice: origPriceVal,
      image: node.images?.edges?.[0]?.node?.url || '',
      hoverImage: node.images?.edges?.[1]?.node?.url || node.images?.edges?.[0]?.node?.url || '',
      badge: node.badge,
      category: node.productType || node.category || 'Tops',
      productType: node.productType || node.category || 'Tops',
      productTypeConfig: node.productTypeConfig,
      metafieldProductType: node.metafieldProductType,
      productTypeConfiguration: node.productTypeConfiguration,
      createdAt: node.createdAt || '',
      collections: [
        collection.title,
        handle,
        ...(node.collections?.edges?.flatMap((e: any) => [e.node.title, e.node.handle]) || []),
        ...(node.category ? [node.category] : []),
        ...(node.productType ? [node.productType] : [])
      ],
      tags: node.tags || [],
      options: node.options || [],
      sizes: node.sizes || node.options?.find((o: any) => o.name?.toLowerCase() === "size")?.values || [],
      colors: node.colors || [],
      variants: node.variants,
    };
  });

  const collectionSchema = getCollectionSchema(collection, mappedProducts);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: collection.title, path: `/collections/${handle}` },
  ]);

  return (
    <>
      <JsonLd schema={collectionSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <CollectionClient
        categoryParam={handle}
        initialProducts={mappedProducts}
        initialCollectionTitle={collection.title}
      />
    </>
  );
}
