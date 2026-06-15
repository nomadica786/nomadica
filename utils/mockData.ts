// utils/mockData.ts

export interface MockProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  category: string;
  handle: string;
  description: string;
  materials: string;
  sizes: string[];
  colors: string[];
  images: string[];
  rating: number;
  reviews: number;
  createdAt?: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    name: "Nomad Linen Shirt",
    price: 3499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    badge: "New",
    category: "Tops",
    handle: "nomad-linen-shirt",
    description: "Crafted from 100% European linen, the Nomad Linen Shirt is designed for the traveller who refuses to sacrifice style for comfort. Its relaxed silhouette breathes beautifully in tropical climates while looking effortlessly polished at dinner.",
    materials: "100% European Linen. Machine wash cold. Hang dry.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#D4C5B0", "#4F6B5A", "#7A5C3E"],
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    ],
    rating: 4.8,
    reviews: 124,
    createdAt: "2025-05-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Desert Trek Trousers",
    price: 4299,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    badge: "Best Seller",
    category: "Bottoms",
    handle: "desert-trek-trousers",
    description: "Built for versatility and comfort on the road. Features dynamic stretch fabric, reinforced stitching, and security pockets for travel essentials.",
    materials: "97% Cotton, 3% Elastane. Machine wash warm. Tumble dry low.",
    sizes: ["30", "32", "34", "36"],
    colors: ["#7A5C3E", "#1E1E1E"],
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80"],
    rating: 4.6,
    reviews: 82,
    createdAt: "2025-05-12T12:00:00Z",
  },
  {
    id: "3",
    name: "Horizon Canvas Jacket",
    price: 8999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    badge: "Limited",
    category: "Outerwear",
    handle: "horizon-canvas-jacket",
    description: "A rugged, classic outer layer that gets better with age. Weather-resistant waxed canvas shell with organic cotton flannel lining.",
    materials: "100% Waxed Cotton Canvas. Flannel lining. Spot clean only.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#7A5C3E", "#4F6B5A"],
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"],
    rating: 4.9,
    reviews: 43,
    createdAt: "2025-05-15T15:00:00Z",
  },
  {
    id: "4",
    name: "Terra Wool Sweater",
    price: 5499,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    badge: "Sale",
    category: "Knits",
    handle: "terra-wool-sweater",
    description: "Knitted from super-soft Merino wool. Outstanding temperature regulation keeps you warm in transit and cool at your destination.",
    materials: "100% Extra-fine Merino Wool. Hand wash cold. Dry flat.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#EDEAE2", "#1E1E1E"],
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"],
    rating: 4.7,
    reviews: 57,
    createdAt: "2025-05-18T18:00:00Z",
  },
  {
    id: "5",
    name: "Drift Cotton Tee",
    price: 1999,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    category: "Tops",
    handle: "drift-cotton-tee",
    description: "The ultimate travel tee. Mid-weight organic cotton slub with a vintage wash and a fit that looks clean tucked or untucked.",
    materials: "100% Organic Cotton. Machine wash cold. Tumble dry low.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#EDEAE2", "#1E1E1E", "#D4C5B0"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
    rating: 4.5,
    reviews: 190,
    createdAt: "2025-05-20T20:00:00Z",
  },
  {
    id: "6",
    name: "Summit Cargo Pants",
    price: 5299,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    category: "Bottoms",
    handle: "summit-cargo-pants",
    description: "Functional cargo design without the bulk. Water-repellent ripstop fabric with secure zip pockets and articulated knees for mobility.",
    materials: "90% Nylon, 10% Spandex Ripstop. Machine wash cold.",
    sizes: ["30", "32", "34", "36"],
    colors: ["#4F6B5A", "#1E1E1E"],
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80"],
    rating: 4.4,
    reviews: 29,
    createdAt: "2025-05-22T22:00:00Z",
  },
  {
    id: "7",
    name: "Dusk Linen Trousers",
    price: 3799,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    category: "Bottoms",
    handle: "dusk-linen-trousers",
    description: "Breathable linen woven with cotton for structure and wrinkle-resistance. Perfect for sunset dinners and warm-weather transit.",
    materials: "55% Linen, 45% Cotton. Dry clean recommended or hand wash.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#D4C5B0", "#1E1E1E"],
    images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80"],
    rating: 4.7,
    reviews: 64,
    createdAt: "2025-05-25T08:00:00Z",
  },
  {
    id: "8",
    name: "Wander Merino Hoodie",
    price: 6299,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    category: "Outerwear",
    handle: "wander-merino-hoodie",
    description: "Lightweight merino hoodie built for layering. Odour-resistant, highly breathable, and packs down small in your carry-on.",
    materials: "100% Merino Wool. Machine wash cold on wool cycle.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#1E1E1E", "#7A5C3E"],
    images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80"],
    rating: 4.8,
    reviews: 73,
    createdAt: "2025-05-28T09:00:00Z",
  },
  {
    id: "9",
    name: "Route Linen Shorts",
    price: 2499,
    image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&q=80",
    badge: "New",
    category: "Bottoms",
    handle: "route-linen-shorts",
    description: "Easy-wearing linen shorts with an elastic drawstring waist. Lightweight, comfortable, and perfect for exploring coastal cities.",
    materials: "100% Linen. Machine wash cold.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#D4C5B0", "#4F6B5A"],
    images: ["https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80"],
    rating: 4.5,
    reviews: 18,
    createdAt: "2025-05-30T11:00:00Z",
  }
];

export function formatProductGraphQL(product: MockProduct) {
  return {
    id: product.id,
    title: product.name,
    description: product.description,
    handle: product.handle,
    category: product.category,
    badge: product.badge,
    rating: product.rating,
    reviews: product.reviews,
    materials: product.materials,
    sizes: product.sizes,
    colors: product.colors,
    price: product.price, // Include raw price for search filtering/sorting
    originalPrice: product.originalPrice,
    createdAt: product.createdAt,
    images: {
      edges: product.images.map((img) => ({
        node: { url: img, altText: product.name }
      }))
    },
    variants: {
      edges: product.sizes.map((size, idx) => ({
        node: {
          id: `gid://shopify/ProductVariant/${product.id}00${idx}`,
          title: size,
          price: {
            amount: String(product.price),
            currencyCode: "INR"
          },
          available: true
        }
      }))
    }
  };
}

export function formatCollectionGraphQL(collection: MockCollection) {
  const collectionProducts = MOCK_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === collection.title.toLowerCase()
  );

  return {
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    description: collection.description,
    image: {
      url: collection.image
    },
    products: {
      edges: collectionProducts.map((p) => ({
        node: formatProductGraphQL(p)
      }))
    }
  };
}

export interface MockCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
}

export const MOCK_COLLECTIONS: MockCollection[] = [
  {
    id: "c1",
    title: "Tops",
    handle: "tops",
    description: "Lightweight shirts, tees, and knits designed for comfort in motion.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=800&q=80",
  },
  {
    id: "c2",
    title: "Bottoms",
    handle: "bottoms",
    description: "Versatile trousers, cargo pants, and linen shorts built for exploration.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
  },
  {
    id: "c3",
    title: "Outerwear",
    handle: "outerwear",
    description: "Rugged wax jackets and packs-small hoodies for layering across climates.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  },
  {
    id: "c4",
    title: "Knits",
    handle: "knits",
    description: "Merino wool sweaters and hoodies crafted for natural performance.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
  }
];

export interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  createdAt: string;
  status: string;
  total: number;
  itemsCount: number;
  image: string;
  email: string;
  lineItems: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
  }>;
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "gid://shopify/Order/1111",
    orderNumber: "NMD-2047",
    date: "28 May 2025",
    createdAt: "2025-05-28T14:30:00Z",
    status: "Delivered",
    total: 8998,
    itemsCount: 2,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=300&q=80",
    email: "arjun.mehta@email.com",
    lineItems: [
      { id: "l1", title: "Nomad Linen Shirt", quantity: 1, price: 3499 },
      { id: "l2", title: "Terra Wool Sweater", quantity: 1, price: 5499 },
    ],
  },
  {
    id: "gid://shopify/Order/2222",
    orderNumber: "NMD-2031",
    date: "14 Apr 2025",
    createdAt: "2025-04-14T09:15:00Z",
    status: "In Transit",
    total: 4299,
    itemsCount: 1,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80",
    email: "arjun.mehta@email.com",
    lineItems: [
      { id: "l3", title: "Desert Trek Trousers", quantity: 1, price: 4299 },
    ],
  },
  {
    id: "gid://shopify/Order/3333",
    orderNumber: "NMD-1987",
    date: "02 Mar 2025",
    createdAt: "2025-03-02T18:45:00Z",
    status: "Delivered",
    total: 13498,
    itemsCount: 3,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80",
    email: "arjun.mehta@email.com",
    lineItems: [
      { id: "l4", title: "Horizon Canvas Jacket", quantity: 1, price: 8999 },
      { id: "l5", title: "Desert Trek Trousers", quantity: 1, price: 4299 },
      { id: "l6", title: "Drift Cotton Tee", quantity: 1, price: 1999 },
    ],
  }
];

export interface MockAddress {
  id: string;
  label: string;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  default: boolean;
}

export const MOCK_ADDRESSES: MockAddress[] = [
  {
    id: "gid://shopify/MailingAddress/1",
    label: "Home",
    name: "Arjun Mehta",
    address1: "204, Sea View Apartments",
    address2: "Carter Road",
    city: "Mumbai",
    province: "Maharashtra",
    country: "India",
    zip: "400006",
    default: true,
  },
  {
    id: "gid://shopify/MailingAddress/2",
    label: "Office",
    name: "Arjun Mehta",
    address1: "12, BKC Business Park, Floor 7",
    address2: "Bandra Kurla Complex",
    city: "Mumbai",
    province: "Maharashtra",
    country: "India",
    zip: "400051",
    default: false,
  }
];
