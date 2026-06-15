/**
 * Generates an absolute, domain-agnostic canonical URL for a given route path.
 */
export function getCanonicalUrl(path: string = ''): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000');
  
  const cleanBase = siteUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Ensure we don't end with a trailing slash unless it's just the root
  const url = `${cleanBase}${cleanPath === '/' ? '' : cleanPath}`;
  return url.replace(/\/$/, '');
}
