'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    } else if (user?.role === 'volunteer') {
      router.replace('/volunteer/dashboard');
    } else {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return null;
}
