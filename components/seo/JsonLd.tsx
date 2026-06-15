import React from 'react';

interface JsonLdProps {
  schema: any;
}

/**
 * Injects structured schema JSON-LD script block safely into the page
 */
export default function JsonLd({ schema }: JsonLdProps) {
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
