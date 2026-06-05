'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all items in original condition with receipt.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping available for 2-3 business days.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 150 countries. International shipping costs vary by location.'
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking link sent to your email after shipment.'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full p-4 text-left font-semibold hover:bg-gray-50 flex justify-between items-center"
              >
                {faq.question}
                <span>{expandedIndex === index ? '−' : '+'}</span>
              </button>
              {expandedIndex === index && (
                <div className="p-4 bg-gray-50 border-t text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
