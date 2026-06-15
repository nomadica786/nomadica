// utils/list_products.js
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

let shop = '';
let token = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key === 'SHOPIFY_ADMIN_SHOP') {
        shop = value;
      } else if (key === 'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN') {
        token = value;
      }
    }
  }
} catch (err) {}

const url = `https://${shop.replace(/^https?:\/\//, '')}/api/2024-01/graphql.json`;

const query = `
  query {
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          productType
          images(first: 2) {
            edges {
              node {
                url
              }
            }
          }
        }
      }
    }
  }
`;

async function run() {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  const products = data.data?.products?.edges || [];
  console.log(`TOTAL PRODUCTS: ${products.length}`);
  products.forEach((edge, index) => {
    const p = edge.node;
    console.log(`${index + 1}. Title: "${p.title}" | Handle: "${p.handle}" | Type: "${p.productType}" | Images: ${p.images?.edges?.map(e => e.node.url).join(', ')}`);
  });
}

run();
