// lib/shopify/auth.ts

import { getEnvironment } from '@/utils/env';

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

/**
 * Shopify Authentication Handler
 * Manages OAuth flow for development environment
 */
export class ShopifyAuth {
  /**
   * Generate authorization URL for OAuth flow
   */
  static getAuthorizationUrl(
    scopes: string[],
    redirectUri: string
  ): string {
    const env = getEnvironment();

    if (!env.isDev) {
      throw new Error(
        'Authorization URL only available in development environment'
      );
    }

    if (!env.clientId || !env.shopUrl) {
      throw new Error('Missing SHOPIFY_CLIENT_ID or SHOPIFY_APP_URL');
    }

    const cleanShopUrl = env.shopUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    const params = new URLSearchParams({
      client_id: env.clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(','),
      state: this.generateState(),
    });

    return `https://${cleanShopUrl}/admin/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async getAccessToken(
    authorizationCode: string,
    redirectUri: string
  ): Promise<TokenResponse> {
    const env = getEnvironment();

    if (!env.isDev) {
      throw new Error(
        'Token exchange only available in development environment'
      );
    }

    if (!env.clientId || !env.clientSecret || !env.shopUrl) {
      throw new Error(
        'Missing SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, or SHOPIFY_APP_URL'
      );
    }

    const cleanShopUrl = env.shopUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    try {
      const response = await fetch(
        `https://${cleanShopUrl}/admin/oauth/access_token`,
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
        const error = await response.json();
        throw new Error(
          `Token exchange failed: ${error.error_description || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('OAuth token exchange failed:', error);
      throw error;
    }
  }

  /**
   * Validate access token by making a test request
   */
  static async validateAccessToken(
    accessToken: string,
    shopUrl: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `https://${shopUrl.replace(/^https?:\/\//, '')}/admin/api/2024-01/graphql.json`,
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
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Generate random state string for OAuth security
   */
  private static generateState(): string {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  /**
   * Required OAuth scopes for admin operations
   */
  static getRequiredScopes(): string[] {
    return [
      'read_products',
      'read_orders',
      'read_customers',
      'write_customers',
      'read_checkouts',
      'write_checkouts',
      'write_storefront_access_tokens',
    ];
  }
}
