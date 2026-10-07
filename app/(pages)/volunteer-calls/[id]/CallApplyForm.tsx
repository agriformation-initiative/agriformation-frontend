'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { TextField, TextAreaField } from '@/components/ui/Field';
import api from '@/lib/auth';

type Values = { fullName: string; email: string; phoneNumber: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
const EMPTY: Values = { fullName: '', email: '', phoneNumber: '', message: '' };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.fullName.trim()) e.fullName = 'Enter your full name.';
  if (!v.email.trim()) e.email = 'Enter your email address.';
  else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email address, like name@example.com.';
  if (!v.phoneNumber.trim()) e.phoneNumber = 'Enter a phone number we can reach you on.';
  return e;
}

export default function CallApplyForm({ callId }: { callId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };
  const onBlur = (key: keyof Values) => () => {
    const msg = validate(values)[key];
    if (msg) setErrors((p) => ({ ...p, [key]: msg }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.post(`/volunteer-calls/${callId}/apply`, values);
      setDone(true);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setFormError(message || 'We could not send your application. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="text-center">
        <CheckCircle2 className="mx-auto text-brand-700" size={44} aria-hidden="true" />
        <h3 className="mt-4 text-xl font-semibold">Application received</h3>
        <p className="mt-2 text-stone-700">We will review it and be in touch soon.</p>
        <Link href="/volunteer" className="mt-5 inline-flex min-h-11 items-center font-semibold text-brand-700 hover:underline">
          See more opportunities
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-4">
      <TextField id="fullName" name="fullName" label="Full name" autoComplete="name" value={values.fullName}
        onChange={set('fullName')} onBlur={onBlur('fullName')} error={errors.fullName} />
      <TextField id="email" name="email" type="email" label="Email address" autoComplete="email" value={values.email}
        onChange={set('email')} onBlur={onBlur('email')} error={errors.email} />
      <TextField id="phoneNumber" name="phoneNumber" type="tel" label="Phone number" autoComplete="tel" value={values.phoneNumber}
        onChange={set('phoneNumber')} onBlur={onBlur('phoneNumber')} error={errors.phoneNumber} />
      <TextAreaField id="message" name="message" label="Why do you want to volunteer?" optional rows={3}
        value={values.message} onChange={set('message')} />
      {formError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{formError}</p>}
      <Button type="submit" fullWidth loading={submitting}>Send application</Button>
    </form>
  );
}
