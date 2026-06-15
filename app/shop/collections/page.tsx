'use client';

import { api, useApi } from '@/components/api/api';
import { PageLoader } from '@/components/ui/PageLoader';
import Link from 'next/link';
import Image from 'next/image';
import { getShopifyImageUrl } from '@/lib/images/shopifyImage';

export default function CollectionsPage() {
  const { data, loading, error } = useApi(() => api.collections.list());

  if (loading) return <PageLoader />;
  if (error) return <div style={{ padding: '64px', textAlign: 'center', backgroundColor: '#FFFFFF', minHeight: '100vh', fontFamily: 'Montserrat' }}>Error loading collections</div>;

  const collections = data?.collections?.edges?.map((edge: any) => edge.node) || [];

  return (
    <div style={{ paddingTop: '64px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
          Curated
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, color: '#1E1E1E', marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
          Our Collections
        </h1>
        
        {collections.length === 0 ? (
          <p style={{ fontFamily: 'Montserrat', color: 'rgba(30,30,30,0.5)' }}>No collections found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {collections.map((collection: any) => (
              <Link
                key={collection.id}
                href={`/shop?category=${encodeURIComponent(collection.handle)}`}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(30,30,30,0.08)',
                  boxShadow: '0 12px 32px rgba(30,30,30,0.06)',
                  transition: 'transform 0.2s ease',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#FFFFFF', position: 'relative' }}>
                  <Image
                    src={getShopifyImageUrl(collection.image?.url, 600) || 'https://images.unsplash.com/photo-1594938298603-c8148c4b4266?w=600&q=80'}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{ margin: 0, fontFamily: "'Playfair Display', sans-serif", fontSize: '1.25rem', color: '#1E1E1E', marginBottom: '0.5rem' }}>
                    {collection.title}
                  </h2>
                  <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(30,30,30,0.6)' }}>
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
