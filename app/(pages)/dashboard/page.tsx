'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

/** Sends each signed-in user to the right dashboard. Waits for the stored session to load first. */
export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, hydrated, initAuth } = useAuthStore();

  useEffect(() => initAuth(), [initAuth]);
  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !user) router.replace('/auth');
    else router.replace(user.role === 'volunteer' ? '/volunteer/dashboard' : '/admin/dashboard');
  }, [hydrated, isAuthenticated, user, router]);

  return null;
}
