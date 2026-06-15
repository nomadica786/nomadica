# Nomadica SEO Implementation Task

You are a Staff SEO Engineer, Senior Next.js Engineer, Technical SEO Consultant, and Ecommerce Growth Expert.

Your task is NOT to explain SEO concepts.

Your task is to AUDIT, PLAN, and IMPLEMENT SEO directly inside the codebase.

## Project Context

Brand: Nomadica

Type:

* Travel-inspired apparel brand
* Headless Shopify architecture
* Next.js App Router frontend
* Shopify Storefront API backend
* Deployed on Vercel

Current Status:

* Site is live
* Final custom domain has NOT been purchased yet
* Website is currently hosted on a temporary Vercel URL
* SEO preparation must be completed before the final domain is connected

Important:
Do NOT optimize specifically for the temporary Vercel domain.
Everything must be implemented in a domain-agnostic way so it works immediately after the final domain is connected.

---

# PHASE 1 — REPOSITORY AUDIT

Scan the entire codebase.

Identify:

* Existing metadata implementation
* Existing OpenGraph implementation
* Existing Twitter card implementation
* Existing sitemap implementation
* Existing robots.txt implementation
* Existing schema markup
* Existing canonical URLs
* Existing structured data
* Existing page titles
* Existing meta descriptions
* Existing image SEO
* Existing performance optimizations

Generate a report showing:

* What exists
* What is missing
* Priority level
* Exact files requiring modification

---

# PHASE 2 — METADATA IMPLEMENTATION

Implement production-grade metadata.

For every route:

Homepage

Collections

Products

Journal

About

Contact

Policies

Implement:

* SEO title
* Meta description
* OpenGraph title
* OpenGraph description
* OpenGraph image
* Twitter card
* Robots directives
* Canonical URL support

Use Next.js Metadata API.

Create reusable metadata utilities.

Generate:

lib/seo/

metadata.ts

canonical.ts

seo.ts

or equivalent structure.

---

# PHASE 3 — OPEN GRAPH

Implement complete OpenGraph support.

Requirements:

Homepage preview

Product preview

Collection preview

Journal preview

Generate:

* Dynamic OG titles
* Dynamic OG descriptions
* Dynamic OG images

If dynamic OG generation is missing:

Create a reusable OG image generation strategy using Next.js.

---

# PHASE 4 — STRUCTURED DATA

Implement JSON-LD schema.

Required schemas:

1. Organization

2. Website

3. Product

4. Collection

5. Breadcrumb

6. Article

7. FAQ

8. Brand

Inject schemas correctly.

Ensure schemas validate in Google's Rich Results Test.

Create:

lib/schema/

organization.ts

product.ts

article.ts

breadcrumb.ts

website.ts

faq.ts

brand.ts

or equivalent structure.

---

# PHASE 5 — ROBOTS.TXT

Create production-ready robots configuration.

Requirements:

Allow crawling of:

Products

Collections

Journal

Block:

Admin routes

API routes

Internal routes

Generate complete configuration.

---

# PHASE 6 — SITEMAP.XML

Generate dynamic sitemap.

Include:

Homepage

Collections

Products

Journal Articles

Static Pages

Requirements:

Automatically update when:

New product added

New collection added

New article added

Use Next.js App Router compatible solution.

---

# PHASE 7 — URL STRUCTURE AUDIT

Verify all URLs follow:

/products/product-name

/collections/collection-name

/journal/article-name

Avoid:

Query parameter URLs

Duplicate URLs

Pagination SEO issues

Provide fixes.

---

# PHASE 8 — PERFORMANCE OPTIMIZATION

Audit performance.

Targets:

LCP < 2.5s

CLS < 0.1

INP < 200ms

Inspect:

Images

Fonts

Hydration

Bundle size

Shopify requests

Caching

Revalidation

Server Components

Lazy loading

Generate exact code changes.

---

# PHASE 9 — IMAGE SEO

Audit all images.

Requirements:

Descriptive alt text

Proper dimensions

WebP or AVIF

Lazy loading

Responsive sizing

OG image support

Generate fixes.

---

# PHASE 10 — JOURNAL SEO FOUNDATION

Create SEO architecture for:

/journal

Requirements:

SEO metadata

Article schema

Breadcrumb schema

Author schema

Social sharing metadata

Related article linking

Generate reusable implementation.

---

# PHASE 11 — KEYWORD STRATEGY

Create keyword mapping.

Homepage:

* travel clothing india
* travel apparel india
* wanderlust fashion

Collections:

* oversized travel tshirts
* adventure apparel

Journal:

* backpacking guides
* travel fashion
* travel essentials

Generate:

Page → Target Keyword Mapping

Keyword Clusters

Internal Linking Opportunities

---

# PHASE 12 — ANALYTICS PREPARATION

Prepare codebase for:

Google Analytics

Google Tag Manager

Google Search Console verification

Requirements:

Feature flags

Environment variables

Production-ready setup

No hardcoded IDs.

---

# PHASE 13 — IMPLEMENTATION REPORT

Generate:

1. Files Created

2. Files Modified

3. Code Changes

4. SEO Improvements

5. Remaining Tasks After Domain Purchase

---

# AFTER DOMAIN PURCHASE

Provide a separate checklist.

Day 1:

* Connect domain
* Configure canonical URLs
* Verify redirects

Day 2:

* Setup Google Search Console
* Submit sitemap

Day 3:

* Request indexing

Day 4+:

* Backlinks
* Pinterest
* Guest posts
* Content distribution

---

# OUTPUT FORMAT

Return:

1. Audit Report
2. Missing SEO Components
3. Implementation Plan
4. Code Changes
5. New Files
6. Modified Files
7. Performance Fixes
8. Keyword Mapping
9. Journal SEO Plan
10. Post-Domain SEO Checklist

Do not provide generic advice.

Act as if you are responsible for shipping the implementation into production.
