# Nomadica Post-SEO Deployment Checklist

Use this checklist after connecting the final production domain to Vercel.

## 1. Domain & Canonical URLs Configuration
Since Nomadica is domain-agnostic, canonical links adapt automatically using the `NEXT_PUBLIC_APP_URL` environment variable.

- [ ] Update the Vercel project environment variables:
  - Set `NEXT_PUBLIC_APP_URL` to your final domain (e.g. `https://www.nomadica.com`).
- [ ] Redeploy the site in Vercel to rebuild pages with the correct domain base.
- [ ] Confirm canonical links on major pages point to the absolute production URL (e.g. view source on `/products/nomad-linen-shirt` and check `<link rel="canonical" href="https://www.nomadica.com/products/nomad-linen-shirt" />`).

## 2. Google Search Console & Verification
Google Search Console (GSC) is crucial for indexing clean paths.

- [ ] Add the domain property in Google Search Console.
- [ ] Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel environment variables to your GSC token.
- [ ] Redeploy and click **Verify** in Search Console.
- [ ] Submit the XML sitemap URL: `https://www.nomadica.com/sitemap.xml`.

## 3. Web Analytics Activation
Activate tracking for customer conversions and catalog searches.

- [ ] Set `NEXT_PUBLIC_GA_ID` in production environment variables (e.g., `G-XXXXXXXXXX`).
- [ ] Set `NEXT_PUBLIC_GTM_ID` if utilizing Google Tag Manager container (optional).
- [ ] Confirm tracking is working via Google Analytics Realtime DebugView.

## 4. Crawling & Robots Checks
Ensure crawlers are guided to search-friendly paths while blocking checkout panels.

- [ ] Visit `https://www.nomadica.com/robots.txt` and verify it contains:
  - `Allow: /`
  - `Disallow: /cart`
  - `Disallow: /checkout`
  - `Disallow: /account`
  - `Sitemap: https://www.nomadica.com/sitemap.xml`
- [ ] Visit `https://www.nomadica.com/sitemap.xml` and verify all dynamic collection, product, and journal routes are listed.

## 5. Rich Schema Structured Data Audits
Confirm rich search features like product reviews, pricing, availability, and sitelink search box are active.

- [ ] Copy the HTML source of a product page (e.g., `/products/nomad-linen-shirt`) and paste it into the [Schema Markup Validator](https://validator.schema.org/).
- [ ] Confirm the following JSON-LD schemas are successfully validated with zero errors:
  - `Product` (on `/products/[handle]`)
  - `CollectionPage` (on `/collections/[handle]`)
  - `BlogPosting` (on `/journal/[slug]`)
  - `BreadcrumbList` (on products, collections, and articles)
  - `Organization` & `WebSite` (on the homepage `/`)
