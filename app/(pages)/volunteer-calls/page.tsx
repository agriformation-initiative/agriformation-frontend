'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VolunteerCallsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/volunteer');
  }, [router]);
  return null;
}
