// components/api/api.tsx

import React from 'react';

const API_BASE_URL = typeof window !== 'undefined'
  ? ''
  : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');


/**
 * Centralized API client for all backend calls
 * Handles both Storefront API (public) and Admin API (authenticated) requests
 */
export const api = {
  /**
   * PRODUCTS - Storefront API (No auth required)
   * These endpoints are public and don't require authentication
   */
  products: {
    /**
     * List all products with pagination
     */
    list: async (first: number = 12, after?: string) => {
      const params = new URLSearchParams({ first: first.toString() });
      if (after) params.append('after', after);

      const response = await fetch(`${API_BASE_URL}/api/products?${params}`);
      if (!response.ok) {
        console.error('[API CLIENT ERROR] list products failed:', response.status, response.statusText);
        try {
          const text = await response.text();
          console.error('[API CLIENT ERROR] Response body:', text);
        } catch {}
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },

    /**
     * Get a single product by ID
     */
    get: async (productId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(productId)}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },

    /**
     * Get product by handle (URL-friendly slug)
     */
    getByHandle: async (handle: string) => {
      const response = await fetch(
        `${API_BASE_URL}/api/products/handle/${handle}`
      );
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },

    /**
     * Search products by query
     */
    search: async (query: string) => {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`${API_BASE_URL}/api/search?${params}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
  },

  /**
   * COLLECTIONS - Storefront API (No auth required)
   * Public collection browsing endpoints
   */
  collections: {
    /**
     * List all collections
     */
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/api/collections`);
      if (!response.ok) throw new Error('Failed to fetch collections');
      return response.json();
    },

    /**
     * Get a single collection by ID
     */
    get: async (collectionId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/api/collections/${encodeURIComponent(collectionId)}`
      );
      if (!response.ok) throw new Error('Failed to fetch collection');
      return response.json();
    },

    /**
     * Get collection by handle with products
     */
    getByHandle: async (handle: string, first: number = 20) => {
      const params = new URLSearchParams({ first: first.toString() });
      const response = await fetch(
        `${API_BASE_URL}/api/collections/handle/${handle}?${params}`
      );
      if (!response.ok) throw new Error('Failed to fetch collection');
      return response.json();
    },
  },

  /**
   * AUTH - OAuth flow
   * Development environment only
   */
  auth: {
    /**
     * Redirect to Shopify OAuth login
     */
    login: async () => {
      window.location.href = `${API_BASE_URL}/api/auth/login`;
    },

    /**
     * Logout and clear session
     */
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
      });
      if (response.ok) {
        window.location.href = '/';
      }
    },

    /**
     * Get current authentication status
     */
    getStatus: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/status`);
      if (!response.ok) return null;
      return response.json();
    },
  },

  /**
   * ORDERS - Admin API (Requires authentication)
   * These endpoints require user to be logged in
   */
  orders: {
    /**
     * List all user orders
     */
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/api/orders`);
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },

    /**
     * Get a single order by ID
     */
    get: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/orders/${encodeURIComponent(orderId)}`);
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json();
    },

    /**
     * Track order by order number and email (public endpoint)
     */
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
   * CUSTOMER - Admin API (Requires authentication)
   * Customer profile and address management
   */
  customer: {
    /**
     * Get current customer profile
     */
    profile: async () => {
      const response = await fetch(`${API_BASE_URL}/api/customers/profile`);
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },

    /**
     * Update customer profile information
     */
    updateProfile: async (data: unknown) => {
      const response = await fetch(`${API_BASE_URL}/api/customers/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },

    /**
     * Get customer addresses
     */
    addresses: async () => {
      const response = await fetch(`${API_BASE_URL}/api/customers/addresses`);
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to fetch addresses');
      return response.json();
    },

    /**
     * Create a new customer address
     */
    createAddress: async (address: unknown) => {
      const response = await fetch(`${API_BASE_URL}/api/customers/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to create address');
      return response.json();
    },

    updateAddress: async (address: unknown) => {
      const response = await fetch(`${API_BASE_URL}/api/customers/addresses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to update address');
      return response.json();
    },

    deleteAddress: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/api/customers/addresses`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.status === 401) throw new Error('Not authenticated');
      if (!response.ok) throw new Error('Failed to delete address');
      return response.json();
    },
  },

  /**
   * CART - Storefront API (No auth required)
   * Shopping cart management
   */
  cart: {
    /**
     * Create a new cart
     */
    create: async (lineItems: unknown[]) => {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineItems }),
      });
      if (!response.ok) throw new Error('Failed to create cart');
      return response.json();
    },

    /**
     * Get cart details
     */
    get: async (cartId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/cart/${encodeURIComponent(cartId)}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      return response.json();
    },

    /**
     * Update cart (add/remove items)
     */
    update: async (cartId: string, updates: unknown) => {
      const response = await fetch(`${API_BASE_URL}/api/cart/${encodeURIComponent(cartId)}`, {
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
   * Handles payment gateway integration (mocked in dev)
   */
  checkout: {
    /**
     * Process checkout and payment
     */
    process: async (checkoutData: unknown) => {
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
   * Wishlist management
   */
  wishlist: {
    /**
     * Get user wishlist
     */
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      return response.json();
    },

    /**
     * Add product to wishlist
     */
    add: async (productId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error('Failed to add to wishlist');
      return response.json();
    },

    /**
     * Remove product from wishlist
     */
    remove: async (productId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/api/wishlist/${encodeURIComponent(productId)}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      return response.json();
    },
  },

  /**
   * MOCKUPS - Shopify Metaobjects / Fallbacks
   */
  mockups: {
    get: async () => {
      const response = await fetch(`${API_BASE_URL}/api/mockups`);
      if (!response.ok) throw new Error('Failed to fetch mockups');
      return response.json();
    }
  }
};

/**
 * React Hook for managing API calls with loading/error states
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = []
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

export default api;
