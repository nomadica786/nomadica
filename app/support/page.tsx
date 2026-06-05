'use client';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Support & Help</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">Get in touch with our support team</p>
            <a href="/support/contact" className="text-black font-semibold hover:underline">
              Contact Support →
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">FAQ</h2>
            <p className="text-gray-600 mb-4">Find answers to common questions</p>
            <a href="/support/faq" className="text-black font-semibold hover:underline">
              View FAQ →
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Shipping Policy</h2>
            <p className="text-gray-600 mb-4">Learn about our shipping terms</p>
            <a href="/support/shipping-policy" className="text-black font-semibold hover:underline">
              Shipping Policy →
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Return Policy</h2>
            <p className="text-gray-600 mb-4">Understand our return process</p>
            <a href="/support/return-policy" className="text-black font-semibold hover:underline">
              Return Policy →
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
            <p className="text-gray-600 mb-4">Our privacy and data protection</p>
            <a href="/support/privacy-policy" className="text-black font-semibold hover:underline">
              Privacy Policy →
            </a>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Terms</h2>
            <p className="text-gray-600 mb-4">Terms of service and use</p>
            <a href="/support/terms" className="text-black font-semibold hover:underline">
              Terms →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
