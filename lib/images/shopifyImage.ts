/**
 * Reusable utility to dynamically resize Shopify CDN image URLs
 */
export function getShopifyImageUrl(url: string | null | undefined, width: number): string {
  if (!url) return "";

  // Check if it is a Shopify CDN URL
  if (!url.includes("cdn.shopify.com")) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("width", String(width));
    return urlObj.toString();
  } catch (e) {
    console.error("Invalid URL passed to getShopifyImageUrl:", url, e);
    return url;
  }
}
