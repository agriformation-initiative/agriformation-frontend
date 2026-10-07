'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { TextField, TextAreaField } from '@/components/ui/Field';
import { inquiryService, InquiryType } from '@/services/inquiryService';

interface InquiryFormProps {
  type: InquiryType;
  submitLabel: string;
  messageLabel: string;
  messageHint?: string;
  successTitle: string;
  successText: string;
}

type Values = {
  name: string; email: string; phone: string; organization: string;
  location: string; studentCount: string; subject: string; message: string; website: string;
};
type Errors = Partial<Record<keyof Values | 'consent', string>>;

const EMPTY: Values = {
  name: '', email: '', phone: '', organization: '', location: '', studentCount: '', subject: '', message: '', website: '',
};

const LABELS = {
  contact: { name: 'Full name', organization: '' },
  school: { name: 'Your name', organization: 'School name' },
  partner: { name: 'Your name', organization: 'Organisation' },
} as const;

/** One form for general messages, school requests and partnership enquiries. */
export default function InquiryForm({ type, submitLabel, messageLabel, messageHint, successTitle, successText }: InquiryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const needsOrg = type !== 'contact';

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.name.trim()) e.name = 'Enter your name.';
    if (!values.email.trim()) e.email = 'Enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Enter a valid email address, like name@example.com.';
    if (needsOrg && !values.organization.trim()) e.organization = `Enter the ${type === 'school' ? 'school' : 'organisation'} name.`;
    if (type === 'school' && !values.location.trim()) e.location = 'Enter the town and state.';
    if (type === 'contact' && !values.subject.trim()) e.subject = 'Enter a subject.';
    if (values.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.';
    if (!consent) e.consent = 'Please agree so we can use your details to reply.';
    return e;
  };

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };
  const onBlur = (key: keyof Values) => () => {
    const msg = validate()[key];
    if (msg) setErrors((p) => ({ ...p, [key]: msg }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSending(true);
    setFormError('');
    try {
      await inquiryService.send({
        type,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        organization: values.organization.trim(),
        location: values.location.trim(),
        studentCount: values.studentCount.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website,
      });
      setDone(true);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setFormError(message || 'We could not send your message. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="rounded-xl bg-brand-50 p-8 text-center">
        <CheckCircle2 className="mx-auto text-brand-700" size={44} aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">{successTitle}</h3>
        <p className="mt-2 text-stone-700">{successText}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-5 rounded-xl bg-white p-6 md:p-10">
      {/* Honeypot: hidden from people, tempting to bots */}
      <div className="absolute -left-2500 h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField id="name" name="name" label={LABELS[type].name} autoComplete="name" value={values.name} onChange={set('name')} onBlur={onBlur('name')} error={errors.name} />
        <TextField id="email" name="email" type="email" label="Email address" autoComplete="email" value={values.email} onChange={set('email')} onBlur={onBlur('email')} error={errors.email} />
      </div>

      {needsOrg && (
        <div className="grid gap-5 md:grid-cols-2">
          <TextField id="organization" name="organization" label={LABELS[type].organization} autoComplete="organization" value={values.organization} onChange={set('organization')} onBlur={onBlur('organization')} error={errors.organization} />
          <TextField id="phone" name="phone" type="tel" label="Phone number" optional autoComplete="tel" value={values.phone} onChange={set('phone')} />
        </div>
      )}

      {type === 'school' && (
        <div className="grid gap-5 md:grid-cols-2">
          <TextField id="location" name="location" label="Town and state" placeholder="Port Harcourt, Rivers" value={values.location} onChange={set('location')} onBlur={onBlur('location')} error={errors.location} />
          <TextField id="studentCount" name="studentCount" label="Number of students" optional inputMode="numeric" hint="A rough number is fine." value={values.studentCount} onChange={set('studentCount')} />
        </div>
      )}

      {type === 'contact' && (
        <TextField id="subject" name="subject" label="Subject" value={values.subject} onChange={set('subject')} onBlur={onBlur('subject')} error={errors.subject} />
      )}

      <TextAreaField id="message" name="message" label={messageLabel} rows={6} hint={messageHint} value={values.message} onChange={set('message')} onBlur={onBlur('message')} error={errors.message} />

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setErrors((p) => ({ ...p, consent: undefined })); }}
            aria-invalid={!!errors.consent}
            className="mt-0.5 h-5 w-5 shrink-0 accent-brand-700"
          />
          <span>
            I agree that AgroNext may use these details to reply to me, as described in the{' '}
            <Link href="/privacy" className="font-medium text-brand-700 underline underline-offset-4">privacy policy</Link>.
          </span>
        </label>
        {errors.consent && <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.consent}</p>}
      </div>

      {formError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{formError}</p>}
      <Button type="submit" fullWidth loading={sending}>{submitLabel}</Button>
    </form>
  );
}
