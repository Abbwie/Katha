'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const isProvider = localStorage.getItem('is_provider');
    console.log('is_provider from storage:', isProvider);  // Debug
    
    if (isProvider === 'true') {
      router.push('/dashboard/provider');
    } else {
      router.push('/dashboard/user');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-foreground">Redirecting...</p>
    </div>
  );
}