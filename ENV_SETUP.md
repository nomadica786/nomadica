# Nomadica E-Commerce - Environment Configuration Guide

This file documents all environment variables needed for Nomadica e-commerce platform.

## ✨ Quick Start

Choose your environment:

### 🚀 Production Environment
Copy only these to `.env.local`:
```env
SHOPIFY_APP_URL=https://your-shop.myshopify.com
```

### 🛠️ Development Environment
Copy these to `.env.local`:
```env
SHOPIFY_APP_URL=https://dev-shop.myshopify.com
SHOPIFY_CLIENT_ID=your_client_id_here
SHOPIFY_CLIENT_SECRET=your_client_secret_here
```

---

## 📋 Complete Environment Variables

### Required Variables

#### `SHOPIFY_APP_URL`
- **Type**: String (URL)
- **Example**: `https://my-store.myshopify.com`
- **Description**: Your Shopify store URL
- **Used in**: Both dev and production
- **Required**: ✅ Always

#### `SHOPIFY_CLIENT_ID`
- **Type**: String
- **Example**: `f8c3a5d2e1b4c8f0...`
- **Description**: OAuth Client ID for Shopify app
- **Used in**: Development only (optional in production)
- **Required**: ✅ Only in development
- **Where to get**: Shopify Admin → Settings → Apps and Integrations → Develop apps → App credentials

#### `SHOPIFY_CLIENT_SECRET`
- **Type**: String
- **Example**: `shpca_8f1c3a5d2e1b4c8f0...`
- **Description**: OAuth Client Secret for Shopify app
- **Used in**: Development only (optional in production)
- **Required**: ✅ Only in development
- **Where to get**: Shopify Admin → Settings → Apps and Integrations → Develop apps → App credentials

### Optional/Public Variables

#### `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Type**: String
- **Example**: `e87f1c3a5d2e1b4c8f0...`
- **Description**: Public access token for Storefront API
- **Used in**: Both dev and production
- **Required**: ❌ Optional (if using public product endpoints)
- **Where to get**: Shopify Admin → Settings → Apps and Integrations → Storefront API → Public access token

#### `NEXT_PUBLIC_SHOPIFY_API_VERSION`
- **Type**: String
- **Default**: `2024-01`
- **Example**: `2024-01`
- **Description**: Shopify GraphQL API version
- **Used in**: Both dev and production
- **Required**: ❌ Optional (has default)

#### `NEXT_PUBLIC_APP_URL`
- **Type**: String (URL)
- **Default**: `http://localhost:3000` (dev), from deployment (prod)
- **Example**: `https://nomadica.com`, `http://localhost:3000`
- **Description**: Frontend application URL
- **Used in**: Both dev and production
- **Required**: ❌ Optional (has default for dev)

---

## 🔒 Environment Detection Logic

The application automatically detects the environment based on what variables are set:

### Development Environment Detected When:
```env
SHOPIFY_APP_URL=<provided>
SHOPIFY_CLIENT_ID=<provided>
SHOPIFY_CLIENT_SECRET=<provided>
```
→ All three must be present

### Production Environment Detected When:
```env
SHOPIFY_APP_URL=<provided>
# No CLIENT_ID or CLIENT_SECRET
```
→ Only SHOPIFY_APP_URL present

---

## 📝 Complete .env.local Example

### Dev Environment
```env
# Required for dev
SHOPIFY_APP_URL=https://dev-shop.myshopify.com
SHOPIFY_CLIENT_ID=f8c3a5d2e1b4c8f0a7b2c3d4e5f6a7b8
SHOPIFY_CLIENT_SECRET=shpca_8f1c3a5d2e1b4c8f0a7b2c3d4e5f6a7

# Optional
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=e87f1c3a5d2e1b4c8f0...
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node environment
NODE_ENV=development
```

### Prod Environment
```env
# Required for production
SHOPIFY_APP_URL=https://my-store.myshopify.com

# Optional but recommended
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=e87f1c3a5d2e1b4c8f0...
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
NEXT_PUBLIC_APP_URL=https://nomadica.com

# Node environment
NODE_ENV=production
```

---

## 🔐 Security Guidelines

### ✅ Do's
- ✅ Keep `SHOPIFY_CLIENT_SECRET` secure (never commit to git)
- ✅ Use `.env.local` for local development (already in .gitignore)
- ✅ Rotate secrets regularly in production
- ✅ Use environment variable management services in production
- ✅ Use `NEXT_PUBLIC_` prefix only for public variables

### ❌ Don'ts
- ❌ Never commit `.env.local` to git
- ❌ Never expose `CLIENT_SECRET` in client-side code
- ❌ Never share credentials via chat/email
- ❌ Never use same credentials across environments
- ❌ Never commit actual secrets to version control

---

## 🛠️ Step-by-Step Setup

### Step 1: Set Up Shopify Development Store

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com)
2. Create a Development Store
3. Get your store URL (will look like: `https://store-name.myshopify.com`)

### Step 2: Create Shopify App (For Dev)

1. In Shopify Admin → Settings → Apps and Integrations
2. Click "Develop apps"
3. Click "Create an app"
4. Name your app: "Nomadica Dev"
5. Under "Admin API scopes", select:
   - `read_products`
   - `read_orders`
   - `read_customers`
   - `write_customers`
   - `read_checkouts`
   - `write_checkouts`
6. Save
7. Click "Install app" and confirm
8. Go to "API credentials" tab
9. Copy:
   - Admin API access token → `SHOPIFY_CLIENT_SECRET`
   - Client ID → `SHOPIFY_CLIENT_ID`

### Step 3: Set Up Storefront API (Optional)

1. In Shopify Admin → Settings → Apps and Integrations
2. Click on "Storefront API"
3. Click "Generate token"
4. Copy the token → `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

### Step 4: Create .env.local

```bash
# In project root
cp .env.example .env.local
```

Fill in with your credentials from steps 1-3

### Step 5: Test Connection

```bash
npm run dev
# Visit http://localhost:3000
# Check browser console for any errors
```

---

## 🧪 Testing

### Test Public Endpoints (Storefront API)
```bash
# Should work without authentication
curl http://localhost:3000/api/products
```

### Test Authenticated Endpoints (Admin API)
```bash
# Should redirect to login first
curl http://localhost:3000/api/orders
```

### Test Payment (Dev Only)
Use mock test cards:
- Success: `4242424242424242`
- Declined: `4000000000000002`
- Auth Required: `4000002500003155`

---

## 🚀 Deployment

### Vercel/Production

1. Go to your Vercel project settings
2. Add environment variables:
   - `SHOPIFY_APP_URL`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` (if using public endpoints)
   - `NEXT_PUBLIC_APP_URL`

3. Do NOT add `SHOPIFY_CLIENT_ID` or `SHOPIFY_CLIENT_SECRET` in production
   - If needed, use OAuth flow only in production

4. Deploy:
```bash
git push origin main  # Triggers automatic deployment
```

---

## 🐛 Troubleshooting

### "Missing SHOPIFY_APP_URL"
- [ ] Check `.env.local` file exists
- [ ] Verify `SHOPIFY_APP_URL` is set
- [ ] Restart dev server: `npm run dev`

### "OAuth callback failed"
- [ ] Verify `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` are correct
- [ ] Check Shopify Admin → Apps → OAuth flow is enabled
- [ ] Verify redirect URI matches in Shopify settings

### "Products not loading"
- [ ] Check `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` is set
- [ ] Verify in Shopify Admin → Storefront API → Token is active
- [ ] Check browser console for errors

### "Orders return 401 Unauthorized"
- [ ] User must be logged in first
- [ ] Click login button to start OAuth flow
- [ ] Check authentication cookie is set

---

## 📚 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check environment setup
npm run check-env  # (create this script if needed)

# Run tests
npm test
```

---

## 📖 References

- [Shopify GraphQL Admin API Docs](https://shopify.dev/docs/api/admin-graphql)
- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront-graphql)
- [Shopify OAuth Setup](https://shopify.dev/docs/apps/auth-admin/oauth-onboarding)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [BACKEND.md](./BACKEND.md) - Full backend integration guide

---

## ✅ Setup Checklist

- [ ] Shopify development store created
- [ ] Shopify app credentials obtained
- [ ] `.env.local` file created with credentials
- [ ] `SHOPIFY_APP_URL` verified in `.env.local`
- [ ] Development environment detected (isDev = true)
- [ ] `npm run dev` starts without errors
- [ ] Public product endpoints working
- [ ] OAuth login flow working
- [ ] Mock payment gateway working (dev)
- [ ] All page routes accessible

---

**Last Updated**: 2024
**Node Version**: 18+ recommended
**Package Manager**: npm 9+ or yarn 4+
