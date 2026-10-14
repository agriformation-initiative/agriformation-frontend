'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { authService } from '@/services/authService';

function ResetForm() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const welcome = params.get('welcome') === '1';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div role="alert">
        <h1 className="text-2xl font-semibold">This link is not complete</h1>
        <p className="mt-2 text-stone-700">Open the link from your email again, or request a new one.</p>
        <Link href="/forgot-password" className="mt-4 inline-flex min-h-11 items-center font-semibold text-brand-700 hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div role="status" className="text-center">
        <CheckCircle2 className="mx-auto text-brand-700" size={44} aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">Password saved</h1>
        <p className="mt-2 text-stone-700">You can now sign in with your new password.</p>
        <Button href="/auth" className="mt-6">Go to sign in</Button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError('Use at least 6 characters.');
    if (password !== confirm) return setError('The two passwords do not match.');
    setLoading(true);
    setError('');
    setFormError('');
    try {
      await authService.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setFormError(message || 'We could not save your password. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-semibold">{welcome ? 'Welcome to AgroNext' : 'Choose a new password'}</h1>
      <p className="mt-2 text-stone-600">
        {welcome ? 'Choose a password to open your volunteer account.' : 'Pick a password you have not used elsewhere.'}
      </p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <TextField id="password" name="password" type="password" label="New password" autoComplete="new-password" hint="At least 6 characters."
          value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} />
        <TextField id="confirm" name="confirm" type="password" label="Confirm password" autoComplete="new-password"
          value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(''); }} error={error} />
        {formError && (
          <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {formError}{' '}
            <Link href="/forgot-password" className="font-semibold underline underline-offset-4">Request a new link</Link>
          </p>
        )}
        <Button type="submit" fullWidth loading={loading}>Save password</Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center px-5 py-16 md:py-24">
      <div className="w-full max-w-md rounded-xl bg-white p-8 md:p-10">
        <Suspense fallback={null}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
