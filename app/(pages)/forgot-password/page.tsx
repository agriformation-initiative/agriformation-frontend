'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address, like name@example.com.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch {
      setError('We could not send the email. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-5 py-16 md:py-24">
      <div className="w-full max-w-md rounded-xl bg-white p-8 md:p-10">
        {sent ? (
          <div role="status" className="text-center">
            <MailCheck className="mx-auto text-brand-700" size={44} aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold">Check your email</h1>
            <p className="mt-2 text-stone-700">
              If an account exists for {email.trim()}, we have sent a link to choose a new password. It works for 1 hour.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-semibold">Forgot your password?</h1>
            <p className="mt-2 text-stone-600">Enter your email and we will send you a link to choose a new one.</p>
            <form onSubmit={submit} noValidate className="mt-8 space-y-5">
              <TextField id="email" name="email" type="email" label="Email address" autoComplete="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }} error={error} />
              <Button type="submit" fullWidth loading={loading}>Send reset link</Button>
            </form>
          </>
        )}
        <Link href="/auth" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-brand-700 hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
