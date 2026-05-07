'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isProvider = localStorage.getItem('is_provider') === 'true';
    
    if (isProvider) {
      router.push('/dashboard/profile/provider');
    } else {
      router.push('/dashboard/profile/user');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center">Redirecting...</div>;
  }

  return null;
}