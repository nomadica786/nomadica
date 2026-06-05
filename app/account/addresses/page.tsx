'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/ui/PageLoader';

export default function AddressesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account/profile?tab=addresses');
  }, [router]);

  return <PageLoader />;
}
