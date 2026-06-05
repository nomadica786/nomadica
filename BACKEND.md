# Backend Integration Guide: Shopify API Setup

## Table of Contents
1. [Overview](#overview)
2. [Environment Configuration](#environment-configuration)
3. [API Architecture](#api-architecture)
4. [Shopify APIs Setup](#shopify-apis-setup)
5. [API Layer Implementation](#api-layer-implementation)
6. [Authentication Flow](#authentication-flow)
7. [Payment Gateway Integration](#payment-gateway-integration)
8. [Directory Structure](#directory-structure)
9. [Frontend Integration](#frontend-integration)
10. [Error Handling](#error-handling)

---

## Overview

This Next.js e-commerce application integrates with Shopify using two main approaches:

### API Types
- **Storefront API** (GraphQL): Public API for customer-facing operations (no authentication needed)
  - Product browsing, collections, search
  - Shopping cart management
  - Checkout process
  
- **Admin API** (GraphQL): For admin operations (requires authentication)
  - Customer management
  - Order management
  - Customer data retrieval

### Authentication Strategy
The application automatically detects the environment and switches authentication methods:

**Development Environment** (All three env vars present):
- Uses OAuth 2.0 with Client ID and Client Secret
- Token exchange mechanism
- Session-based authentication

**Production Environment** (Only SHOPIFY_APP_URL present):
- Uses Shopify App extensions
- Embedded app authentication
- Direct shop domain authentication

---

## Environment Configuration

### Setup .env.local

```env
# Production Environment (Minimum)
SHOPIFY_APP_URL=https://your-shop.myshopify.com

# Development Environment (All three)
SHOPIFY_APP_URL=https://dev-shop.myshopify.com
SHOPIFY_CLIENT_ID=your_client_id_here
SHOPIFY_CLIENT_SECRET=your_client_secret_here

# Storefront API Access Token (optional, for Storefront API)
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token

# API Endpoints
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
```

### Environment Detection Logic

```typescript
// utils/env.ts
export const getEnvironment = () => {
  const isDev =
    process.env.SHOPIFY_CLIENT_ID &&
    process.env.SHOPIFY_CLIENT_SECRET &&
    process.env.SHOPIFY_APP_URL;

  return {
    isDev,
    isProd: !isDev,
    shopUrl: process.env.SHOPIFY_APP_URL,
    clientId: process.env.SHOPIFY_CLIENT_ID,
    clientSecret: process.env.SHOPIFY_CLIENT_SECRET,
  };
};
```

---

## API Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│              (React Components)                          │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP Requests
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js API Routes                      │
│         (/app/api/*)                                     │
│  - Authentication                                        │
│  - Token Management                                      │
│  - Request Validation                                    │
└────────────────┬────────────────────────────────────────┘
                 │ GraphQL Queries/Mutations
                 ▼
┌─────────────────────────────────────────────────────────┐
│                 Shopify GraphQL APIs                     │
│  ┌──────────────────┐  ┌─────────────────────┐          │
│  │ Storefront API   │  │   Admin API          │          │
│  │ (Public)         │  │ (Authenticated)      │          │
│  └──────────────────┘  └─────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

---

## Shopify APIs Setup

### 1. Storefront API (For Customers)

**Endpoint**: `https://{shop}.myshopify.com/api/{version}/graphql.json`

**Authentication**: Access Token (no login required)

**Key Operations**:
- Browse products
- View collections
- Search products
- Create checkouts
- Add to cart

**Example Query**:
```graphql
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        description
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
    }
  }
}
```

### 2. Admin API (For Admin Operations)

**Endpoint**: `https://{shop}.myshopify.com/admin/api/{version}/graphql.json`

**Authentication**: 
- **Dev**: OAuth 2.0 with access token
- **Prod**: Admin session/custom app token

**Key Operations**:
- Fetch orders
- Manage customers
- Update inventory
- Process refunds
- Customer data retrieval

**Example Query**:
```graphql
query GetOrders($first: Int!) {
  orders(first: $first) {
    edges {
      node {
        id
        orderNumber
        email
        totalPrice
        lineItems(first: 10) {
          edges {
            node {
              id
              title
              quantity
              variant {
                price
              }
            }
          }
        }
      }
    }
  }
}
```

---

## API Layer Implementation

### 1. Create lib/shopify/client.ts

```typescript
// lib/shopify/client.ts
interface ShopifyRequest {
  query: string;
  variables?: Record<string, any>;
}

export class ShopifyClient {
  private shopUrl: string;
  private accessToken: string;
  private apiVersion: string;

  constructor(shopUrl: string, accessToken: string, apiVersion: string = '2024-01') {
    this.shopUrl = shopUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
  }

  private getEndpoint(api: 'storefront' | 'admin'): string {
    const baseUrl = `https://${this.shopUrl}/api/${this.apiVersion}`;
    return api === 'storefront' ? `${baseUrl}/graphql.json` : `${baseUrl}/graphql.json`;
  }

  async request<T>(
    query: string,
    variables?: Record<string, any>,
    api: 'storefront' | 'admin' = 'storefront'
  ): Promise<T> {
    const endpoint = this.getEndpoint(api);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': this.accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
    }

    return data.data as T;
  }
}

export class ShopifyAdminClient extends ShopifyClient {
  async request<T>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return super.request(query, variables, 'admin');
  }
}

export class ShopifyStorefrontClient extends ShopifyClient {
  async request<T>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return super.request(query, variables, 'storefront');
  }
}
```

### 2. Create lib/shopify/auth.ts

```typescript
// lib/shopify/auth.ts
import { getEnvironment } from '@/utils/env';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class ShopifyAuth {
  static async getAccessToken(
    authorizationCode: string,
    redirectUri: string
  ): Promise<TokenResponse> {
    const env = getEnvironment();

    if (!env.isDev) {
      throw new Error('Authorization code flow only available in development');
    }

    const response = await fetch(
      `https://${env.shopUrl}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.clientId,
          client_secret: env.clientSecret,
          code: authorizationCode,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code for access token');
    }

    return response.json();
  }

  static getAuthorizationUrl(scopes: string[], redirectUri: string): string {
    const env = getEnvironment();

    if (!env.isDev) {
      throw new Error('Authorization URL only available in development');
    }

    const params = new URLSearchParams({
      client_id: env.clientId!,
      redirect_uri: redirectUri,
      scope: scopes.join(','),
    });

    return `https://${env.shopUrl}/admin/oauth/authorize?${params.toString()}`;
  }

  static async validateAccessToken(accessToken: string): Promise<boolean> {
    // Validate by making a test request
    try {
      const response = await fetch(
        `https://${getEnvironment().shopUrl}/admin/api/2024-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: '{ shop { name } }',
          }),
        }
      );

      return response.ok;
    } catch {
      return false;
    }
  }
}
```

### 3. Create app/api/auth/callback/route.ts

```typescript
// app/api/auth/callback/route.ts
import { ShopifyAuth } from '@/lib/shopify/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');

  if (!code || !shop) {
    return NextResponse.json(
      { error: 'Missing authorization code or shop' },
      { status: 400 }
    );
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
    const tokenResponse = await ShopifyAuth.getAccessToken(code, redirectUri);

    // Store token securely (httpOnly cookie)
    const cookieStore = await cookies();
    cookieStore.set('shopify_access_token', tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.expires_in,
    });

    cookieStore.set('shopify_shop', shop, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    redirect('/account/profile');
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
```

### 4. Create app/api/products/route.ts

```typescript
// app/api/products/route.ts
import { ShopifyStorefrontClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { NextResponse } from 'next/server';

const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get('first') || '12');
    const after = searchParams.get('after');

    const env = getEnvironment();
    const client = new ShopifyStorefrontClient(
      env.shopUrl!,
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    );

    const data = await client.request(GET_PRODUCTS_QUERY, { first, after });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### 5. Create app/api/orders/route.ts

```typescript
// app/api/orders/route.ts
import { ShopifyAdminClient } from '@/lib/shopify/client';
import { getEnvironment } from '@/utils/env';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const GET_ORDERS_QUERY = `
  query GetOrders($first: Int!) {
    orders(first: $first, reverse: true) {
      edges {
        node {
          id
          orderNumber
          createdAt
          email
          totalPrice {
            amount
            currencyCode
          }
          status
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('shopify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const env = getEnvironment();
    const client = new ShopifyAdminClient(env.shopUrl!, accessToken);

    const data = await client.request(GET_ORDERS_QUERY, { first: 10 });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
```

---

## Authentication Flow

### Tokenless (Public) - Storefront API

```
┌─────────────────────┐
│  Customer Visits    │
│  Product Page       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  Next.js API Route (/api/products)      │
│  - Uses STOREFRONT_ACCESS_TOKEN         │
│  - No user context needed               │
│  - Public data only                     │
└──────────┬──────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Shopify Storefront API                  │
│  - Returns products, collections         │
│  - Search functionality                  │
│  - Cart operations                       │
└──────────────────────────────────────────┘
```

### Tokenful (Authenticated) - Admin API

```
┌──────────────────────┐
│  User Clicks Login   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  /api/auth/login                         │
│  - Redirects to Shopify OAuth            │
└──────────┬───────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  Shopify OAuth Authorization               │
│  - User logs in with Shopify account       │
│  - Returns authorization code              │
└──────────┬─────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  /api/auth/callback                        │
│  - Exchange code for access token          │
│  - Store token in httpOnly cookie          │
│  - Redirect to dashboard                   │
└──────────┬─────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  Protected Routes (/api/orders, etc.)      │
│  - Read token from cookie                  │
│  - Send with X-Shopify-Access-Token        │
│  - Get customer-specific data              │
└──────────┬─────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│  Shopify Admin API                         │
│  - Returns authenticated data              │
│  - Orders, customer info, etc.             │
└────────────────────────────────────────────┘
```

---

## Payment Gateway Integration

### Development Environment - Mocked Payment

Create `lib/payment/mock-gateway.ts`:

```typescript
// lib/payment/mock-gateway.ts
export interface MockPaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
}

export interface MockPaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'completed' | 'failed' | 'pending';
  message: string;
}

export class MockPaymentGateway {
  static async processPayment(
    request: MockPaymentRequest
  ): Promise<MockPaymentResponse> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 95% success rate in dev
    const isSuccessful = Math.random() > 0.05;

    if (isSuccessful) {
      return {
        success: true,
        transactionId: `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed',
        message: 'Payment processed successfully (mock)',
      };
    } else {
      return {
        success: false,
        transactionId: `MOCK_FAILED_${Date.now()}`,
        status: 'failed',
        message: 'Payment declined (simulated failure)',
      };
    }
  }

  static async validateCard(
    cardNumber: string,
    expiry: string,
    cvv: string
  ): Promise<boolean> {
    // Mock validation - accept all test cards
    return cardNumber.length === 16 && cvv.length === 3;
  }

  static getMockTestCards() {
    return {
      success: '4242424242424242',
      declined: '4000000000000002',
      authenticateRequired: '4000002500003155',
    };
  }
}
```

Create `app/api/checkout/route.ts`:

```typescript
// app/api/checkout/route.ts
import { getEnvironment } from '@/utils/env';
import { MockPaymentGateway } from '@/lib/payment/mock-gateway';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const env = getEnvironment();

    if (env.isDev) {
      // Use mock payment gateway in development
      const paymentResult = await MockPaymentGateway.processPayment({
        orderId: body.orderId,
        amount: body.totalPrice,
        currency: body.currency || 'USD',
        customerEmail: body.email,
      });

      return NextResponse.json(paymentResult);
    } else {
      // Use real Shopify payment processing in production
      // Implement Shopify checkout API
      return NextResponse.json({
        error: 'Production payment processing not configured',
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    );
  }
}
```

---

## Directory Structure

```
nomadica/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts           # OAuth redirect
│   │   │   └── callback/
│   │   │       └── route.ts           # OAuth token exchange
│   │   ├── products/
│   │   │   └── route.ts               # Storefront API - Product listing
│   │   ├── products/[id]/
│   │   │   └── route.ts               # Storefront API - Product detail
│   │   ├── collections/
│   │   │   └── route.ts               # Storefront API - Collections
│   │   ├── search/
│   │   │   └── route.ts               # Storefront API - Search products
│   │   ├── orders/
│   │   │   ├── route.ts               # Admin API - List orders
│   │   │   ├── [id]/
│   │   │   │   └── route.ts           # Admin API - Order detail
│   │   │   └── track/
│   │   │       └── route.ts           # Public order tracking
│   │   ├── customers/
│   │   │   ├── route.ts               # Admin API - Customer info
│   │   │   └── profile/
│   │   │       └── route.ts           # Admin API - Update profile
│   │   ├── wishlist/
│   │   │   └── route.ts               # Wishlist management
│   │   └── checkout/
│   │       └── route.ts               # Payment processing
│   ├── account/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   └── addresses/
│   │       └── page.tsx
│   ├── shop/
│   │   ├── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── collections/
│   │   │   └── page.tsx
│   │   ├── product-details/
│   │   │   └── page.tsx
│   │   ├── new-arrivals/
│   │   │   └── page.tsx
│   │   ├── best-sellers/
│   │   │   └── page.tsx
│   │   └── limited-drops/
│   │       └── page.tsx
│   ├── brand/
│   │   ├── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── story/
│   │   │   └── page.tsx
│   │   ├── journal/
│   │   │   └── page.tsx
│   │   └── sustainability/
│   │       └── page.tsx
│   ├── support/
│   │   ├── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── shipping-policy/
│   │   │   └── page.tsx
│   │   ├── return-policy/
│   │   │   └── page.tsx
│   │   ├── privacy-policy/
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   ├── order-tracking/
│   │   └── page.tsx
│   ├── maintenance/
│   │   └── page.tsx
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── lib/
│   ├── shopify/
│   │   ├── client.ts                  # GraphQL client
│   │   ├── auth.ts                    # OAuth/Auth logic
│   │   └── queries.ts                 # GraphQL queries/mutations
│   └── payment/
│       ├── mock-gateway.ts            # Dev payment mocking
│       └── stripe-gateway.ts          # Production payment (future)
│
├── utils/
│   ├── env.ts                         # Environment detection
│   └── hooks/
│       ├── useAuth.ts                 # Auth hook
│       ├── useCart.ts                 # Cart management
│       └── useProducts.ts             # Product fetching
│
├── components/
│   ├── api/
│   │   └── api.tsx                    # API layer (see below)
│   └── ... (existing components)
│
├── .env.local                         # Environment variables
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Frontend Integration

### Create components/api/api.tsx

```typescript
// components/api/api.tsx
import { getEnvironment } from '@/utils/env';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Centralized API client for all backend calls
 */
export const api = {
  /**
   * PRODUCTS - Storefront API (No auth needed)
   */
  products: {
    list: async (first: number = 12, after?: string) => {
      const params = new URLSearchParams({ first: first.toString() });
      if (after) params.append('after', after);

      const response = await fetch(`${API_BASE_URL}/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },

    get: async (productId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`
      );
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },

    search: async (query: string) => {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(
        `${API_BASE_URL}/api/search?${params}`
      );
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
  },

  /**
   * COLLECTIONS - Storefront API (No auth needed)
   */
  collections: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/api/collections`);
      if (!response.ok) throw new Error('Failed to fetch collections');
      return response.json();
    },

    get: async (collectionId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/api/collections/${collectionId}`
      );
      if (!response.ok) throw new Error('Failed to fetch collection');
      return response.json();
    },
  },

  /**
   * AUTH - OAuth flow
   */
  auth: {
    login: async () => {
      window.location.href = `${API_BASE_URL}/api/auth/login`;
    },

    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
      });
      if (response.ok) {
        window.location.href = '/';
      }
    },

    getStatus: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/status`);
      if (!response.ok) return null;
      return response.json();
    },
  },

  /**
   * ORDERS - Admin API (Requires auth)
   */
  orders: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/api/orders`);
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },

    get: async (orderId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}`
      );
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json();
    },

    track: async (orderNumber: string, email: string) => {
      const response = await fetch(`${API_BASE_URL}/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });
      if (!response.ok) throw new Error('Order not found');
      return response.json();
    },
  },

  /**
   * CUSTOMER - Admin API (Requires auth)
   */
  customer: {
    profile: async () => {
      const response = await fetch(`${API_BASE_URL}/api/customers/profile`);
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },

    updateProfile: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/api/customers/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },

    addresses: async () => {
      const response = await fetch(`${API_BASE_URL}/api/customers/addresses`);
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to fetch addresses');
      return response.json();
    },
  },

  /**
   * CART - Storefront API (No auth needed)
   */
  cart: {
    create: async (lineItems: any[]) => {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineItems }),
      });
      if (!response.ok) throw new Error('Failed to create cart');
      return response.json();
    },

    get: async (cartId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/cart/${cartId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      return response.json();
    },

    update: async (cartId: string, updates: any) => {
      const response = await fetch(`${API_BASE_URL}/api/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update cart');
      return response.json();
    },
  },

  /**
   * CHECKOUT - Payment processing
   */
  checkout: {
    process: async (checkoutData: any) => {
      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });
      if (!response.ok) throw new Error('Checkout failed');
      return response.json();
    },
  },

  /**
   * WISHLIST - Local/User data
   */
  wishlist: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      return response.json();
    },

    add: async (productId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error('Failed to add to wishlist');
      return response.json();
    },

    remove: async (productId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/api/wishlist/${productId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      return response.json();
    },
  },
};

/**
 * React Hook for API calls with loading/error states
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}
```

### Usage in Components

```typescript
// app/shop/page.tsx
'use client';

import { api, useApi } from '@/components/api/api';
import { ProductCard } from '@/components/shop/ProductCard';
import { PageLoader } from '@/components/ui/PageLoader';

export default function ShopPage() {
  const { data, loading, error } = useApi(() => api.products.list(12));

  if (loading) return <PageLoader />;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data?.products?.edges?.map((edge: any) => (
        <ProductCard key={edge.node.id} product={edge.node} />
      ))}
    </div>
  );
}
```

```typescript
// app/account/orders/page.tsx
'use client';

import { api, useApi } from '@/components/api/api';
import { PageLoader } from '@/components/ui/PageLoader';

export default function OrdersPage() {
  const { data, loading, error } = useApi(() => api.orders.list());

  if (loading) return <PageLoader />;
  if (error) return <div>Please log in to view orders</div>;

  return (
    <div className="space-y-4">
      {data?.orders?.edges?.map((edge: any) => (
        <div key={edge.node.id} className="border p-4 rounded">
          <h3>Order #{edge.node.orderNumber}</h3>
          <p>Total: {edge.node.totalPrice.amount}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Error Handling

### Create utils/errors.ts

```typescript
// utils/errors.ts
export class ShopifyError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ShopifyError';
  }
}

export const handleShopifyError = (error: any) => {
  if (error.response?.status === 401) {
    return new ShopifyError('UNAUTHORIZED', 'Authentication required', 401);
  }

  if (error.graphQLErrors) {
    return new ShopifyError(
      'GRAPHQL_ERROR',
      error.graphQLErrors[0].message,
      400
    );
  }

  if (error.message) {
    return new ShopifyError('API_ERROR', error.message, 500);
  }

  return new ShopifyError('UNKNOWN_ERROR', 'An unknown error occurred', 500);
};
```

---

## Summary Table

| Feature | Tokenless | Tokenful | Environment |
|---------|-----------|----------|------------|
| Products | ✓ | ✓ | Both |
| Collections | ✓ | ✓ | Both |
| Search | ✓ | ✓ | Both |
| Cart | ✓ | ✓ | Both |
| Orders | ✗ | ✓ | Both |
| Customer Data | ✗ | ✓ | Both |
| Checkout | ✓ | ✓ | Both |
| Payment (Mock) | ✓ | ✓ | Dev Only |

---

## Setup Checklist

- [ ] Create Shopify development store
- [ ] Set up OAuth app in Shopify admin
- [ ] Add environment variables to `.env.local`
- [ ] Create all API routes
- [ ] Implement API client in `components/api/api.tsx`
- [ ] Create authentication flow
- [ ] Test Storefront API (public products)
- [ ] Test Admin API (authenticated orders)
- [ ] Test mock payment gateway (dev)
- [ ] Set up error handling and logging
- [ ] Deploy to production

---

## Useful Resources

- [Shopify GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront-graphql)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Shopify OAuth](https://shopify.dev/docs/apps/auth-admin/oauth-onboarding)
