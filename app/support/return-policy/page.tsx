'use client';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Return Policy</h1>
        
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">30-Day Return Guarantee</h2>
            <p>
              We want you to be completely satisfied with your purchase. If for any reason you&apos;re not, you can return most items within 30 days of receipt for a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Return Conditions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Items must be in original condition with all tags attached</li>
              <li>Items must not show signs of wear or damage</li>
              <li>Return shipping is free on all returns</li>
              <li>Refunds are processed within 5-7 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Non-Returnable Items</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clearance or final sale items</li>
              <li>Custom or personalized items</li>
              <li>Items without original tags</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How to Return</h2>
            <p>
              Contact our support team to initiate a return. We&apos;ll provide you with a prepaid shipping label and return instructions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
