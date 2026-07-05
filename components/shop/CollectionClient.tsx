"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { api } from "@/components/api/api";
import { PageLoader } from "@/components/ui/PageLoader";
import { groupProducts } from "@/utils/productGroup";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

interface CollectionClientProps {
  categoryParam: string;
  initialProducts?: any[];
  initialCollectionTitle?: string;
  initialCategories?: { title: string; handle: string }[];
}

export default function CollectionClient({
  categoryParam,
  initialProducts,
  initialCollectionTitle,
  initialCategories
}: CollectionClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ title: string; handle: string }[]>(
    initialCategories || [{ title: "All", handle: "all" }]
  );
  const [sortBy, setSortBy] = useState("Featured");
  const [loading, setLoading] = useState(!initialProducts);
  const [productsState, setProductsState] = useState<any[]>(initialProducts || []);
  const [mockups, setMockups] = useState<Record<string, string>>({});

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam.toLowerCase() === "all" ? "All" : 
    (categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1))
  );
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string>("All");

  // Fetch mockups on mount
  useEffect(() => {
    const fetchMockups = async () => {
      try {
        const mRes = await api.mockups.get();
        setMockups(mRes?.mockups || {});
      } catch (err) {
        console.error("Failed to load mockups in CollectionClient:", err);
      }
    };
    fetchMockups();
  }, []);

  // Fetch categories/collections list on mount if not provided
  useEffect(() => {
    if (initialCategories) return;
    const fetchCategories = async () => {
      try {
        const res = await api.collections.list();
        const edges = res?.collections?.edges || [];
        const list = edges.map((edge: any) => ({
          title: edge.node.title,
          handle: edge.node.handle
        }));
        setCategories([{ title: "All", handle: "all" }, ...list]);
      } catch (err) {
        console.error("Failed to fetch collections list:", err);
        setCategories([
          { title: "All", handle: "all" },
          { title: "Tops", handle: "tops" },
          { title: "Bottoms", handle: "bottoms" },
          { title: "Outerwear", handle: "outerwear" },
          { title: "Knits", handle: "knits" }
        ]);
      }
    };
    fetchCategories();
  }, [initialCategories]);

  // Load products client-side if initialProducts is not provided (fallback)
  useEffect(() => {
    if (initialProducts) {
      setProductsState(initialProducts);
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      setLoading(true);
      try {
        const isAll = categoryParam.toLowerCase() === "all";
        let res;
        if (isAll) {
          res = await api.products.list(50);
        } else {
          res = await api.collections.getByHandle(categoryParam, 50);
        }

        const edges = res?.collectionByHandle?.products?.edges || res?.products?.edges || [];
        const mapped = edges.map((edge: any) => {
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
            createdAt: node.createdAt || '',
            collections: node.collections?.edges?.map((e: any) => e.node.title) || [],
            variants: node.variants,
          };
        }) || [];
        setProductsState(mapped);
      } catch (err) {
        console.error("Failed to load collection products client-side:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryParam, initialProducts]);

  const handleCategoryChange = (handle: string) => {
    if (handle === "all") {
      router.push("/shop");
    } else {
      router.push(`/collections/${handle}`);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  const groupedProducts = groupProducts(productsState, mockups);

  // Apply filtering
  const filteredProducts = groupedProducts.filter(product => {
    if (selectedCategory !== "All") {
      const expectedCat = selectedCategory.toLowerCase();
      const matchesCollection = product.collections?.some((c: string) => c.toLowerCase() === expectedCat);
      const matchesType = (product.productType || product.category || "").toLowerCase() === expectedCat;
      if (!matchesCollection && !matchesType) return false;
    }
    if (selectedSize !== "All") {
      const hasSize = product.allVariants?.some((edge: any) => 
        edge.node?.title?.toLowerCase().includes(selectedSize.toLowerCase()) || 
        edge.node?.selectedOptions?.some((opt: any) => opt.name.toLowerCase() === "size" && opt.value.toLowerCase() === selectedSize.toLowerCase())
      );
      if (!hasSize) return false;
    }
    if (selectedColor !== "All") {
      const hasColor = product.allVariants?.some((edge: any) => 
        edge.node?.title?.toLowerCase().includes(selectedColor.toLowerCase()) || 
        edge.node?.selectedOptions?.some((opt: any) => opt.name.toLowerCase() === "color" && opt.value.toLowerCase() === selectedColor.toLowerCase())
      );
      if (!hasColor) return false;
    }
    return true;
  });

  // Apply sorting
  const finalProducts = (() => {
    let sorted = [...filteredProducts];
    if (sortBy === "Price: Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Newest") {
      sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else {
      const newestPart = [...sorted].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 3);
      const otherPart = sorted.filter(p => !newestPart.find(n => n.id === p.id));
      otherPart.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return [...newestPart, ...otherPart];
    }
    return sorted;
  })();

  const isAll = selectedCategory === "All";
  const pageTitle = initialCollectionTitle || (isAll ? "All Collections" : selectedCategory);
  const pageLabel = isAll ? "Explore" : "Collection";

  return (
    <div style={{ paddingTop: "0px", minHeight: "100vh", backgroundColor: "#FAF9F7" }}>
      {/* Header */}
      <div
        style={{
          height: "35vh",
          borderBottom: "1px solid rgba(30,30,30,0.1)",
          padding: "3rem 1.5rem 2rem",
          backgroundImage: "url('/shop-header.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Playfair Display', sans-serif", textAlign: "center", fontSize: "clamp(2.5rem, 3vw, 4rem)", color: "#1E1E1E", letterSpacing: "-0.02em", paddingTop: "4%" }}>
            {pageTitle}
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", textAlign: "center", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
            {pageLabel}
          </p>
        </div>
      </div>

      <ShopFilterBar 
        categories={categories.map(c => c.title)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        sortBy={sortBy}
        setSortBy={setSortBy}
        productCount={finalProducts.length}
      />

      {/* Products Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {finalProducts.map((p: any) => (
            <ProductCard
              key={p.id}
              {...p}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
