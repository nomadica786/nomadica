// app/api/customers/addresses/route.ts
import { ShopifyAdminClient, ShopifyStorefrontClient } from '@/lib/shopify/client';
import { ADMIN_QUERIES, ADMIN_MUTATIONS } from '@/lib/shopify/queries';
import { getEnvironment } from '@/utils/env';
import { MOCK_ADDRESSES } from '@/utils/mockData';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  const env = getEnvironment();
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customer_access_token')?.value;
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;

  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

  // 1. Storefront Customer Addresses
  if (customerAccessToken) {
    if (isStorefrontConfigured) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl!, storefrontToken!);
        const query = `
          query GetCustomerAddresses($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
              defaultAddress {
                id
              }
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
                    firstName
                    lastName
                    phone
                  }
                }
              }
            }
          }
        `;
        const data = await client.request(query, { customerAccessToken });
        const defaultAddressId = data?.customer?.defaultAddress?.id;
        const addressesEdges = data?.customer?.addresses?.edges || [];

        const mappedAddresses = addressesEdges.map((edge: any) => {
          const node = edge.node;
          return {
            id: node.id,
            label: 'Address',
            name: `${node.firstName} ${node.lastName}`.trim() || 'Traveler',
            address1: node.address1,
            address2: node.address2,
            city: node.city,
            province: node.province,
            country: node.country,
            zip: node.zip,
            default: node.id === defaultAddressId
          };
        });

        return NextResponse.json({ addresses: mappedAddresses });
      } catch (error) {
        console.error('Failed to fetch storefront customer addresses, falling back to mock:', error);
      }
    }

    // Customer fallback
    const savedAddresses = cookieStore.get('mock_addresses')?.value;
    if (savedAddresses) {
      try {
        return NextResponse.json({ addresses: JSON.parse(savedAddresses) });
      } catch {}
    }
    return NextResponse.json({ addresses: MOCK_ADDRESSES });
  }

  // 2. Fallback to developer Admin API
  const isConfigured = !!env.shopUrl && !!env.clientId;
  if (!accessToken && isConfigured) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    if (accessToken && shop) {
      const client = new ShopifyAdminClient(shop, accessToken);
      // Fallback to mock addresses if no customer context is linked in dev OAuth admin mode
    }
  } catch (error) {
    console.error('Failed to fetch live addresses, falling back to mock:', error);
  }

  // Fallback to mock addresses
  const savedAddresses = cookieStore.get('mock_addresses')?.value;
  if (savedAddresses) {
    try {
      return NextResponse.json({ addresses: JSON.parse(savedAddresses) });
    } catch {}
  }

  return NextResponse.json({
    addresses: MOCK_ADDRESSES
  });
}

export async function POST(request: NextRequest) {
  const env = getEnvironment();
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customer_access_token')?.value;
  const accessToken = cookieStore.get('shopify_access_token')?.value;
  const shop = cookieStore.get('shopify_shop')?.value;

  try {
    const body = await request.json();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

    // 1. Storefront Customer Address Creation
    if (customerAccessToken && isStorefrontConfigured) {
      try {
        const client = new ShopifyStorefrontClient(env.shopUrl!, storefrontToken!);
        const names = (body.name || 'Arjun Mehta').split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';

        const createMutation = `
          mutation CreateCustomerAddress($customerAccessToken: String!, $address: MailingAddressInput!) {
            customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
              customerAddress {
                id
                address1
                address2
                city
                province
                country
                zip
                firstName
                lastName
              }
              customerUserErrors {
                field
                message
                code
              }
            }
          }
        `;

        const data = await client.request(createMutation, {
          customerAccessToken,
          address: {
            address1: body.address1 || '',
            address2: body.address2 || '',
            city: body.city || '',
            province: body.province || '',
            country: body.country || 'India',
            zip: body.zip || '',
            firstName,
            lastName
          }
        });

        const payload = data?.customerAddressCreate;
        if (payload?.customerUserErrors && payload.customerUserErrors.length > 0) {
          const errorMessage = payload.customerUserErrors.map((e: any) => e.message).join(', ');
          return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        const newAddressNode = payload?.customerAddress;

        // Set as default if requested
        if (body.default && newAddressNode?.id) {
          const defaultMutation = `
            mutation SetDefaultAddress($customerAccessToken: String!, $addressId: ID!) {
              customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
                customer {
                  id
                }
                customerUserErrors {
                  message
                }
              }
            }
          `;
          await client.request(defaultMutation, {
            customerAccessToken,
            addressId: newAddressNode.id
          });
        }

        // Fetch updated addresses list
        const listQuery = `
          query GetCustomerAddresses($customerAccessToken: String!) {
            customer(customerAccessToken: $customerAccessToken) {
              defaultAddress {
                id
              }
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
                    firstName
                    lastName
                  }
                }
              }
            }
          }
        `;
        const listData = await client.request(listQuery, { customerAccessToken });
        const defaultId = listData?.customer?.defaultAddress?.id;
        const mappedList = (listData?.customer?.addresses?.edges || []).map((edge: any) => {
          const node = edge.node;
          return {
            id: node.id,
            label: 'Address',
            name: `${node.firstName} ${node.lastName}`.trim(),
            address1: node.address1,
            address2: node.address2,
            city: node.city,
            province: node.province,
            country: node.country,
            zip: node.zip,
            default: node.id === defaultId
          };
        });

        return NextResponse.json({
          customerAddress: {
            id: newAddressNode.id,
            label: 'Address',
            name: `${newAddressNode.firstName} ${newAddressNode.lastName}`.trim(),
            address1: newAddressNode.address1,
            address2: newAddressNode.address2,
            city: newAddressNode.city,
            province: newAddressNode.province,
            country: newAddressNode.country,
            zip: newAddressNode.zip,
            default: body.default || false
          },
          addresses: mappedList,
          userErrors: []
        });

      } catch (err: any) {
        console.error('Failed to create storefront address, falling back to mock:', err);
      }
    }

    // Mock Fallback mode
    const isConfigured = !!env.shopUrl && !!env.clientId;
    if (!accessToken && isConfigured && !customerAccessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const savedAddressesCookie = cookieStore.get('mock_addresses')?.value;
    let addressesList = [];
    if (savedAddressesCookie) {
      try {
        addressesList = JSON.parse(savedAddressesCookie);
      } catch {
        addressesList = [...MOCK_ADDRESSES];
      }
    } else {
      addressesList = [...MOCK_ADDRESSES];
    }

    const newAddress = {
      id: `gid://shopify/MailingAddress/${Date.now()}`,
      label: body.label || 'Additional Address',
      name: body.name || 'Arjun Mehta',
      address1: body.address1 || '',
      address2: body.address2 || '',
      city: body.city || '',
      province: body.province || '',
      country: body.country || 'India',
      zip: body.zip || '',
      default: body.default || false,
    };

    if (newAddress.default) {
      addressesList.forEach((addr: any) => { addr.default = false; });
    }

    addressesList.push(newAddress);
    cookieStore.set('mock_addresses', JSON.stringify(addressesList), { path: '/' });

    return NextResponse.json({
      customerAddress: newAddress,
      addresses: addressesList,
      userErrors: []
    });

  } catch (error) {
    console.error('Create address error:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const env = getEnvironment();
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customer_access_token')?.value;

  try {
    const body = await request.json();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

    if (customerAccessToken && isStorefrontConfigured) {
      const client = new ShopifyStorefrontClient(env.shopUrl!, storefrontToken!);
      const names = (body.name || 'Arjun Mehta').split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const updateMutation = `
        mutation UpdateCustomerAddress($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
          customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
            customerAddress {
              id
            }
            customerUserErrors {
              message
            }
          }
        }
      `;

      const data = await client.request(updateMutation, {
        customerAccessToken,
        id: body.id,
        address: {
          address1: body.address1 || '',
          address2: body.address2 || '',
          city: body.city || '',
          province: body.province || '',
          country: body.country || 'India',
          zip: body.zip || '',
          firstName,
          lastName
        }
      });

      if (data?.customerAddressUpdate?.customerUserErrors?.length > 0) {
        return NextResponse.json({ error: data.customerAddressUpdate.customerUserErrors[0].message }, { status: 400 });
      }

      if (body.default) {
        const defaultMutation = `
          mutation SetDefaultAddress($customerAccessToken: String!, $addressId: ID!) {
            customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
              customer { id }
            }
          }
        `;
        await client.request(defaultMutation, { customerAccessToken, addressId: body.id });
      }

      return NextResponse.json({ success: true });
    }

    // Mock
    const savedAddressesCookie = cookieStore.get('mock_addresses')?.value;
    if (savedAddressesCookie) {
      let addressesList = JSON.parse(savedAddressesCookie);
      const idx = addressesList.findIndex((a: any) => a.id === body.id);
      if (idx !== -1) {
        if (body.default) addressesList.forEach((a: any) => a.default = false);
        addressesList[idx] = { ...addressesList[idx], ...body };
        cookieStore.set('mock_addresses', JSON.stringify(addressesList), { path: '/' });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const env = getEnvironment();
  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get('customer_access_token')?.value;

  try {
    const body = await request.json();
    const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const isStorefrontConfigured = !!env.shopUrl && !!storefrontToken && storefrontToken.trim() !== '';

    if (customerAccessToken && isStorefrontConfigured) {
      const client = new ShopifyStorefrontClient(env.shopUrl!, storefrontToken!);
      const deleteMutation = `
        mutation DeleteCustomerAddress($customerAccessToken: String!, $id: ID!) {
          customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
            deletedCustomerAddressId
            customerUserErrors { message }
          }
        }
      `;
      const data = await client.request(deleteMutation, { customerAccessToken, id: body.id });
      if (data?.customerAddressDelete?.customerUserErrors?.length > 0) {
        return NextResponse.json({ error: data.customerAddressDelete.customerUserErrors[0].message }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    // Mock
    const savedAddressesCookie = cookieStore.get('mock_addresses')?.value;
    if (savedAddressesCookie) {
      let addressesList = JSON.parse(savedAddressesCookie);
      addressesList = addressesList.filter((a: any) => a.id !== body.id);
      cookieStore.set('mock_addresses', JSON.stringify(addressesList), { path: '/' });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
