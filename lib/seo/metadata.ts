import { Metadata } from 'next';
import { getCanonicalUrl } from './canonical';

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
}

/**
 * Reusable utility to build standard Next.js Metadata objects dynamically
 */
export function constructMetadata({
  title,
  description,
  path,
  ogImage = '/opengraph-image.jpg',
  noIndex = false,
  type = 'website',
}: MetadataOptions): Metadata {
  const canonical = getCanonicalUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Nomadica',
      type,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
