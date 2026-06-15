"use client";
import { Suspense } from "react";
import CollectionClient from "@/components/shop/CollectionClient";
import { PageLoader } from "@/components/ui/PageLoader";

export default function ShopPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CollectionClient categoryParam="all" />
    </Suspense>
  );
}