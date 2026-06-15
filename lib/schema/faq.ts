interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Builds the FAQPage schema for structured JSON-LD data
 */
export function getFaqSchema(items: FaqItem[]) {
  if (!items || items.length === 0) return null;

  const mainEntity = items.map((item) => ({
    '@type': 'Question',
    'name': item.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': item.answer
    }
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': mainEntity
  };
}
