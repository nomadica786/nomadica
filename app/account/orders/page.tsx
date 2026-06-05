'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoader } from '@/components/ui/PageLoader';

export default function OrdersPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account/profile?tab=orders');
  }, [router]);

  return <PageLoader />;
}
