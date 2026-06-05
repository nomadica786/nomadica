// utils/env.ts

interface Environment {
  isDev: boolean;
  isProd: boolean;
  shopUrl: string | undefined;
  clientId: string | undefined;
  clientSecret: string | undefined;
}

/**
 * Detects environment and returns configuration
 * Dev: SHOPIFY_APP_URL + SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET
 * Prod: Only SHOPIFY_APP_URL
 */
export const getEnvironment = (): Environment => {
  const isDev =
    !!process.env.SHOPIFY_CLIENT_ID &&
    !!process.env.SHOPIFY_CLIENT_SECRET &&
    !!process.env.SHOPIFY_APP_URL;

  return {
    isDev,
    isProd: !isDev,
    shopUrl: process.env.SHOPIFY_APP_URL,
    clientId: process.env.SHOPIFY_CLIENT_ID,
    clientSecret: process.env.SHOPIFY_CLIENT_SECRET,
  };
};

export const isProduction = () => !getEnvironment().isDev;
export const isDevelopment = () => getEnvironment().isDev;
