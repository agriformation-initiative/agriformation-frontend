'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';

const homeFor = (role: string) => (role === 'volunteer' ? '/volunteer/dashboard' : '/admin/dashboard');

function SignInForm() {
  const router = useRouter();
  const expired = useSearchParams().get('expired') === '1';
  const { setAuth, initAuth, hydrated, isAuthenticated, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => initAuth(), [initAuth]);
  useEffect(() => {
    if (hydrated && isAuthenticated && user) router.replace(homeFor(user.role));
  }, [hydrated, isAuthenticated, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(email.trim(), password);
      setAuth(res.data.user, res.data.token);
      toast.success('Signed in');
      router.push(homeFor(res.data.user.role));
    } catch (err) {
      const status = (err as { response?: { status?: number } }).response?.status;
      setError(
        status === 401
          ? 'That email and password do not match. Check them and try again.'
          : 'We could not sign you in. Check your connection and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      {expired && !error && (
        <p role="status" className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          Your session ended. Sign in again to continue.
        </p>
      )}
      <TextField id="email" name="email" type="email" label="Email address" autoComplete="email" required
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField id="password" name="password" type="password" label="Password" autoComplete="current-password" required
        value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <Button type="submit" fullWidth loading={loading}>Sign in</Button>
      <Link href="/forgot-password" className="inline-flex min-h-11 items-center text-sm font-medium text-brand-700 hover:underline">
        Forgot your password?
      </Link>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center px-5 py-16 md:py-24">
      <div className="w-full max-w-md rounded-xl bg-white p-8 md:p-10">
        <Logo />
        <h1 className="mt-8 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-stone-600">For AgroNext volunteers and administrators.</p>
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-brand-700 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
