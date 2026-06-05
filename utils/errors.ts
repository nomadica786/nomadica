// utils/errors.ts

/**
 * Custom error class for Shopify-related errors
 */
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

/**
 * Handle and normalize Shopify API errors
 */
export const handleShopifyError = (error: any): ShopifyError => {
  // HTTP errors
  if (error.response?.status === 401) {
    return new ShopifyError('UNAUTHORIZED', 'Authentication required', 401);
  }

  if (error.response?.status === 403) {
    return new ShopifyError('FORBIDDEN', 'Access denied', 403);
  }

  if (error.response?.status === 404) {
    return new ShopifyError('NOT_FOUND', 'Resource not found', 404);
  }

  if (error.response?.status === 429) {
    return new ShopifyError(
      'RATE_LIMITED',
      'Too many requests, please try again later',
      429
    );
  }

  // GraphQL errors
  if (error.graphQLErrors?.length) {
    const message = error.graphQLErrors.map((e: any) => e.message).join(', ');
    return new ShopifyError('GRAPHQL_ERROR', message, 400);
  }

  // Network errors
  if (error.message?.includes('Failed to fetch')) {
    return new ShopifyError('NETWORK_ERROR', 'Network request failed', 500);
  }

  // Generic error
  if (error.message) {
    return new ShopifyError('API_ERROR', error.message, 500);
  }

  return new ShopifyError('UNKNOWN_ERROR', 'An unknown error occurred', 500);
};

/**
 * Format error for display to users
 */
export const formatErrorMessage = (error: ShopifyError): string => {
  switch (error.code) {
    case 'UNAUTHORIZED':
      return 'Please log in to continue';
    case 'FORBIDDEN':
      return "You don't have permission to access this resource";
    case 'NOT_FOUND':
      return 'The resource you are looking for was not found';
    case 'RATE_LIMITED':
      return 'Too many requests. Please try again later';
    case 'NETWORK_ERROR':
      return 'Network error. Please check your connection';
    case 'GRAPHQL_ERROR':
      return error.message;
    default:
      return 'An error occurred. Please try again';
  }
};
