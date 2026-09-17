'use client';

import { api, useApi } from '@/components/api/api';
import Link from 'next/link';
import Image from 'next/image';
import { getShopifyImageUrl } from '@/lib/images/shopifyImage';

const DESIRED_ORDER = [
  'destination-collection',
  'wildlife-and-safari',
  'adventure-and-trekking-collections',
  'travel-quotes',
  'beach-vibes',
];

export default function CollectionsPage() {
  const { data, loading, error } = useApi(() => api.collections.list());

  const collections = data?.collections?.edges?.map((edge: any) => edge.node) || [];

  const sortedCollections = [...collections].sort((a, b) => {
    const indexA = DESIRED_ORDER.indexOf(a.handle);
    const indexB = DESIRED_ORDER.indexOf(b.handle);
    const valA = indexA === -1 ? 999 : indexA;
    const valB = indexB === -1 ? 999 : indexB;
    return valA - valB;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: "linear-gradient(#faf9f7a6, #faf9f7a6), url('/Map.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 'clamp(3rem, 5vw, 6rem) clamp(1.25rem, 3.5vw, 3.5rem)',
      }}
    >
      <div style={{ maxWidth: 'clamp(1400px, 92vw, 1720px)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'left', marginBottom: 'clamp(2rem, 3.5vw, 3.5rem)' }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#C1A886',
              marginBottom: '0.625rem',
            }}
          >
            Curated Series
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 4vw, 4.5rem)',
              fontWeight: 700,
              color: '#1E1E1E',
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              textAlign: 'left',
              margin: 0,
            }}
          >
            Discover by <br className="md:hidden" /> Collections
          </h1>
        </div>

        {/* Error State */}
        {error && (
          <div style={{ padding: '3rem', textAlign: 'center', fontFamily: "'Montserrat', sans-serif", color: '#1E1E1E' }}>
            <p style={{ fontSize: '1.125rem' }}>Failed to load collections. Please try again.</p>
          </div>
        )}

        {/* Collections Grid Enlarged for Bigger Screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10 2xl:gap-12">
          {loading && collections.length === 0
            ? [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1/1',
                    backgroundColor: 'rgba(235, 230, 222, 0.6)',
                    borderRadius: '12px',
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
              ))
            : sortedCollections.map((col: any) => (
                <Link
                  key={col.id || col.handle}
                  href={`/collections/${encodeURIComponent(col.handle)}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    className="img-hover-zoom"
                    style={{
                      position: 'relative',
                      aspectRatio: '1/1',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(30, 30, 30, 0.08)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {col.image?.url ? (
                      <Image
                        src={getShopifyImageUrl(col.image.url, 800)}
                        alt={col.title || 'Collection'}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#EAE6DF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            color: '#8C827A',
                            fontSize: '1.125rem',
                          }}
                        >
                          {col.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '1rem', padding: '0 0.5rem' }}>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.1rem, 1.35vw, 1.45rem)',
                        fontWeight: 600,
                        color: '#1E1E1E',
                        marginBottom: '0.35rem',
                        lineHeight: 1.25,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {col.title}
                    </h2>
                    {col.description ? (
                      <p
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 'clamp(0.8125rem, 0.95vw, 0.975rem)',
                          color: 'rgba(30, 30, 30, 0.65)',
                          lineHeight: '1.45',
                        }}
                      >
                        {col.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
