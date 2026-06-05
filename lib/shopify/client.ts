// lib/shopify/client.ts

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; extensions?: any }>;
}

interface ShopifyClientOptions {
  apiVersion?: string;
}

/**
 * Base Shopify GraphQL Client
 */
export class ShopifyClient {
  private shopUrl: string;
  private accessToken: string;
  private apiVersion: string;

  constructor(
    shopUrl: string,
    accessToken: string,
    options: ShopifyClientOptions = {}
  ) {
    this.shopUrl = shopUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    this.accessToken = accessToken;
    this.apiVersion = options.apiVersion || '2024-01';
  }

  protected getEndpoint(api: 'storefront' | 'admin' = 'storefront'): string {
    const pathPrefix = api === 'admin' ? 'admin/' : '';
    const baseUrl = `https://${this.shopUrl}/${pathPrefix}api/${this.apiVersion}`;
    return `${baseUrl}/graphql.json`;
  }

  async request<T = any>(
    query: string,
    variables?: Record<string, any>,
    api: 'storefront' | 'admin' = 'storefront'
  ): Promise<T> {
    const endpoint = this.getEndpoint(api);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Use appropriate header based on API type
    if (api === 'storefront') {
      headers['X-Shopify-Storefront-Access-Token'] = this.accessToken;
    } else {
      headers['X-Shopify-Access-Token'] = this.accessToken;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const data: GraphQLResponse<T> = await response.json();

      if (data.errors && data.errors.length > 0) {
        const errorMessage = data.errors.map((e) => e.message).join(', ');
        throw new Error(`GraphQL Error: ${errorMessage}`);
      }

      return data.data as T;
    } catch (error) {
      console.error('Shopify API request failed:', error);
      throw error;
    }
  }
}

/**
 * Shopify Storefront API Client (public, no auth needed)
 */
export class ShopifyStorefrontClient extends ShopifyClient {
  async request<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return super.request<T>(query, variables, 'storefront');
  }
}

/**
 * Shopify Admin API Client (requires authentication)
 */
export class ShopifyAdminClient extends ShopifyClient {
  async request<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return super.request<T>(query, variables, 'admin');
  }
}
