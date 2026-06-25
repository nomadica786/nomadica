// lib/shopify/queries.ts

/**
 * GraphQL Queries and Mutations for Shopify APIs
 */

// ============ STOREFRONT API QUERIES ============

export const STOREFRONT_QUERIES = {
  // Products
  GET_PRODUCTS: `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            description
            handle
            createdAt
            productType
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  available: availableForSale
                }
              }
            }
          }
        }
      }
    }
  `,

  GET_PRODUCT_BY_HANDLE: `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        productType
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              available: availableForSale
            }
          }
        }
      }
    }
  `,

  SEARCH_PRODUCTS: `
    query SearchProducts($query: String!, $first: Int!) {
      search(first: $first, query: $query, types: PRODUCT) {
        edges {
          node {
            ... on Product {
              id
              title
              handle
              productType
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  // Collections
  GET_COLLECTIONS: `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
            }
          }
        }
      }
    }
  `,

  GET_COLLECTION_BY_HANDLE: `
    query GetCollectionByHandle($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        id
        title
        description
        products(first: $first) {
          edges {
            node {
              id
              title
              description
              handle
              createdAt
              productType
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    available: availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  // Cart
  CREATE_CART: `
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  GET_CART: `
    query GetCart($id: ID!) {
      cart(id: $id) {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `,

  UPDATE_CART: `
    mutation UpdateCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  UPDATE_CART_QUANTITY: `
    mutation UpdateCartQuantity($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  REMOVE_CART_LINES: `
    mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  GET_PRODUCT_TYPE_MOCKUPS: `
    query GetProductTypeConfigurations {
      metaobjects(type: "product_type_configuration", first: 50) {
        nodes {
          id
          handle
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                }
              }
              ... on GenericFile {
                url
              }
            }
          }
        }
      }
    }
  `,
};

// ============ ADMIN API QUERIES ============

export const ADMIN_QUERIES = {
  // Orders
  GET_ORDERS: `
    query GetOrders($first: Int!, $after: String) {
      orders(first: $first, after: $after, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            createdAt
            email
            customer {
              id
              email
              firstName
              lastName
            }
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            totalTaxSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            displayFinancialStatus
            displayFulfillmentStatus
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    price
                  }
                }
              }
            }
          }
        }
      }
    }
  `,

  GET_ORDER_BY_NUMBER: `
    query GetOrderByNumber($query: String!) {
      orders(first: 1, query: $query) {
        edges {
          node {
            id
            name
            createdAt
            email
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            displayFulfillmentStatus
            lineItems(first: 100) {
              edges {
                node {
                  id
                  title
                  quantity
                }
              }
            }
          }
        }
      }
    }
  `,

  // Customers
  GET_CUSTOMER: `
    query GetCustomer($id: ID!) {
      customer(id: $id) {
        id
        email
        firstName
        lastName
        phone
        addresses(first: 10) {
          edges {
            node {
              id
              address1
              address2
              city
              province
              country
              zip
            }
          }
        }
      }
    }
  `,

  GET_CURRENT_USER: `
    query GetCurrentUser {
      appInstallation {
        id
      }
    }
  `,

  // Shop Info
  GET_SHOP_INFO: `
    query GetShopInfo {
      shop {
        name
        email
        url
        primaryDomain {
          url
        }
      }
    }
  `,
};

// ============ ADMIN API MUTATIONS ============

export const ADMIN_MUTATIONS = {
  UPDATE_CUSTOMER: `
    mutation UpdateCustomer($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          phone
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  CREATE_CUSTOMER_ADDRESS: `
    mutation CreateCustomerAddress($customerId: ID!, $address: MailingAddressInput!) {
      customerAddressCreate(customerId: $customerId, address: $address) {
        customerAddress {
          id
          address1
          address2
          city
          province
          country
          zip
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
};
