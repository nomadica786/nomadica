// utils/shopifySession.ts
import fs from 'fs';
import path from 'path';

interface ShopifySession {
  accessToken: string;
  shop: string;
}

const cachePath = path.join(process.cwd(), 'utils/shopifySession.json');

export function getShopifySession(): ShopifySession | null {
  // 1. Try reading from JSON cache first (fastest, no Next.js env load delay)
  try {
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      if (data.accessToken && data.shop) {
        return data;
      }
    }
  } catch {}
  
  // 2. Fallback to process.env if set
  if (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN && process.env.SHOPIFY_ADMIN_SHOP) {
    return {
      accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      shop: process.env.SHOPIFY_ADMIN_SHOP
    };
  }
  
  return null;
}

export function setShopifySession(session: ShopifySession) {
  try {
    // 1. Write to JSON cache
    fs.writeFileSync(cachePath, JSON.stringify(session, null, 2), 'utf8');

    // 2. Also write to .env for environment variable persistence
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update SHOPIFY_ADMIN_ACCESS_TOKEN
      if (envContent.includes('SHOPIFY_ADMIN_ACCESS_TOKEN=')) {
        envContent = envContent.replace(
          /SHOPIFY_ADMIN_ACCESS_TOKEN=.*/,
          `SHOPIFY_ADMIN_ACCESS_TOKEN=${session.accessToken}`
        );
      } else {
        envContent += `\nSHOPIFY_ADMIN_ACCESS_TOKEN=${session.accessToken}`;
      }
      
      // Update SHOPIFY_ADMIN_SHOP
      if (envContent.includes('SHOPIFY_ADMIN_SHOP=')) {
        envContent = envContent.replace(
          /SHOPIFY_ADMIN_SHOP=.*/,
          `SHOPIFY_ADMIN_SHOP=${session.shop}`
        );
      } else {
        envContent += `\nSHOPIFY_ADMIN_SHOP=${session.shop}`;
      }
      
      fs.writeFileSync(envPath, envContent, 'utf8');
    }
  } catch (err) {
    console.error('Failed to persist Shopify Admin Session:', err);
  }
}
