'use client';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
        
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Shipping Methods</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Standard Shipping:</strong> 5-7 business days - Free on orders over $50</li>
              <li><strong>Express Shipping:</strong> 2-3 business days - $15.00</li>
              <li><strong>Overnight Shipping:</strong> Next business day - $25.00</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Processing Time</h2>
            <p>
              Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">International Shipping</h2>
            <p>
              We ship to over 150 countries. International customers are responsible for any import duties or customs fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Tracking</h2>
            <p>
              All orders include tracking information that will be sent to your email upon shipment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
