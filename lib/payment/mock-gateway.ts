// lib/payment/mock-gateway.ts

export interface MockPaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

export interface MockPaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'completed' | 'failed' | 'pending';
  message: string;
  timestamp: string;
}

/**
 * Mock Payment Gateway for Development
 * Simulates payment processing without actual transaction
 */
export class MockPaymentGateway {
  /**
   * Process a payment (95% success rate in dev)
   */
  static async processPayment(
    request: MockPaymentRequest
  ): Promise<MockPaymentResponse> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate card format
    if (request.cardNumber && !this.isValidCardNumber(request.cardNumber)) {
      return {
        success: false,
        transactionId: `MOCK_INVALID_${Date.now()}`,
        status: 'failed',
        message: 'Invalid card number format',
        timestamp: new Date().toISOString(),
      };
    }

    // Check for specific test card numbers
    if (request.cardNumber) {
      const cleanCard = request.cardNumber.replace(/\s/g, '');
      const testCards = this.getMockTestCards();
      
      if (cleanCard === '1') {
        return {
          success: true,
          transactionId: `MOCK_SUCCESS_${Date.now()}`,
          status: 'completed',
          message: 'Payment processed successfully (test card)',
          timestamp: new Date().toISOString(),
        };
      }

      if (cleanCard === testCards.declined || cleanCard === '2') {
        return {
          success: false,
          transactionId: `MOCK_DECLINED_${Date.now()}`,
          status: 'failed',
          message: 'Card declined (test card)',
          timestamp: new Date().toISOString(),
        };
      }

      if (cleanCard === '3') {
        return {
          success: false,
          transactionId: `MOCK_FAILED_${Date.now()}`,
          status: 'failed',
          message: 'Simulated payment processing error (test card)',
          timestamp: new Date().toISOString(),
        };
      }

      if (request.cardNumber === testCards.authenticateRequired) {
        return {
          success: false,
          transactionId: `MOCK_AUTH_REQUIRED_${Date.now()}`,
          status: 'pending',
          message: 'Additional authentication required',
          timestamp: new Date().toISOString(),
        };
      }
    }

    // Simulate 95% success rate
    const isSuccessful = Math.random() > 0.05;

    if (isSuccessful) {
      return {
        success: true,
        transactionId: `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'completed',
        message: 'Payment processed successfully (mock)',
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        success: false,
        transactionId: `MOCK_FAILED_${Date.now()}`,
        status: 'failed',
        message: 'Payment declined (simulated failure)',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Validate card details
   */
  static async validateCard(
    cardNumber: string,
    expiry: string,
    cvv: string
  ): Promise<boolean> {
    // Basic validation
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return false;
    }

    // Validate expiry format (MM/YY)
    const expiryRegex = /^\d{2}\/\d{2}$/;
    if (!expiryRegex.test(expiry)) {
      return false;
    }

    // Validate CVV
    if (cvv.length < 3 || cvv.length > 4) {
      return false;
    }

    return true;
  }

  /**
   * Check if card number is valid using Luhn algorithm
   */
  static isValidCardNumber(cardNumber: string): boolean {
    // Remove spaces
    const digits = cardNumber.replace(/\s/g, '');

    // Allow Shopify Bogus test cards
    if (digits === '1' || digits === '2' || digits === '3') {
      return true;
    }

    // Check if all digits
    if (!/^\d+$/.test(digits)) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Get mock test cards for development
   */
  static getMockTestCards() {
    return {
      success: '4242424242424242',
      declined: '4000000000000002',
      authenticateRequired: '4000002500003155',
      expiredCard: '4000000000000069',
      processingError: '4000000000000119',
    };
  }

  /**
   * Get mock order confirmation
   */
  static generateMockConfirmation(
    transactionId: string,
    amount: number,
    email: string
  ) {
    return {
      transactionId,
      amount,
      email,
      timestamp: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      trackingUrl: `https://example.com/track/${transactionId}`,
    };
  }
}
