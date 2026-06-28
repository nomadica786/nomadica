async function test() {
  const shopUrl = 'https://cstjac-4d.myshopify.com';
  const storefrontToken = '6cec455322cd9c4cfb7ead74eda57e4a';
  console.log('Shop URL:', shopUrl);
  console.log('Storefront Token:', storefrontToken);

  try {
    const url = `${shopUrl}/api/2024-01/graphql.json`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({
        query: `
          query {
            products(first: 5) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        `
      })
    });

    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Success! Products:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching storefront products:', err);
  }
}

test();
