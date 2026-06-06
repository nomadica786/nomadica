// app/api/checkout/route.ts
import { MockPaymentGateway } from '@/lib/payment/mock-gateway';
import { getEnvironment } from '@/utils/env';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const env = getEnvironment();

    // Use mock payment gateway if in development or if live Shopify config is missing
    if (env.isDev || !env.shopUrl) {
      const paymentResult = await MockPaymentGateway.processPayment({
        orderId: body.orderId || `MOCK_ORDER_${Date.now()}`,
        amount: body.totalPrice || body.amount || 0,
        currency: body.currency || 'INR',
        customerEmail: body.email || 'customer@example.com',
        cardNumber: body.cardNumber,
        expiry: body.expiry,
        cvv: body.cvv
      });

      if (paymentResult.success) {
        const orderNumber = `NMD-${Math.floor(1000 + Math.random() * 9000)}`;
        const orderId = `gid://shopify/Order/${Math.floor(100000 + Math.random() * 900000)}`;
        const cookieStore = await cookies();
        const customerEmail = cookieStore.get('customer_email')?.value;

        const newOrder = {
          node: {
            id: orderId,
            orderNumber,
            createdAt: new Date().toISOString(),
            email: customerEmail || body.email || 'arjun.mehta@email.com',
            totalPrice: {
              amount: String(body.totalPrice || 0),
              currencyCode: body.currency || 'INR'
            },
            status: body.paymentMethod === 'COD' ? 'Pending COD' : 'In Transit',
            lineItems: {
              edges: (body.lineItems || []).map((item: any, idx: number) => ({
                node: {
                  id: item.variantId || `l_${idx}`,
                  title: item.title,
                  quantity: item.quantity,
                  variant: {
                    price: {
                      amount: String(item.price || 0),
                      currencyCode: 'INR'
                    },
                    image: {
                      url: item.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=300&q=80'
                    }
                  }
                }
              }))
            }
          }
        };

        const existingCookie = cookieStore.get('mock_orders')?.value;
        let orders = [];
        if (existingCookie) {
          try {
            orders = JSON.parse(existingCookie);
          } catch {}
        }
        orders.unshift(newOrder);
        cookieStore.set('mock_orders', JSON.stringify(orders), {
          path: '/',
          maxAge: 60 * 60 * 24 * 30
        });

        return NextResponse.json({
          ...paymentResult,
          orderId,
          orderNumber
        });
      }

      return NextResponse.json(paymentResult);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Production payment processing not configured'
      }, { status: 501 });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
