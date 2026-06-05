// app/api/checkout/route.ts
import { MockPaymentGateway } from '@/lib/payment/mock-gateway';
import { getEnvironment } from '@/utils/env';
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
