'use client';
import { useRef, useState } from 'react';
import { Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import { TextField, TextAreaField } from '@/components/ui/Field';
import { SITE } from '@/lib/site';

type Values = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: '', email: '', subject: '', message: '' };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Enter your name.';
  if (!v.email.trim()) e.email = 'Enter your email address.';
  else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email address, like name@example.com.';
  if (!v.subject.trim()) e.subject = 'Enter a subject.';
  if (v.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.';
  return e;
}

/**
 * There is no mail service behind this site, so the form hands the message to the
 * visitor's own email app addressed to the team instead of silently dropping it.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const checkField = (key: keyof Values) => () => {
    const message = validate(values)[key];
    if (message) setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstKey = (Object.keys(found) as (keyof Values)[])[0];
    if (firstKey) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    const body = `${values.message}\n\nFrom: ${values.name} <${values.email}>`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="rounded-xl bg-brand-50 p-8">
        <h3 className="text-2xl font-semibold">Your email app should be open</h3>
        <p className="mt-2 text-stone-700">
          Send the message there and it will reach us at {SITE.email}. If nothing opened, write to that address
          directly.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => { setSent(false); setValues(EMPTY); }}>
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5 rounded-xl bg-white p-6 md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField id="name" name="name" label="Full name" autoComplete="name" value={values.name}
          onChange={set('name')} onBlur={checkField('name')} error={errors.name} />
        <TextField id="email" name="email" type="email" label="Email address" autoComplete="email"
          value={values.email} onChange={set('email')} onBlur={checkField('email')} error={errors.email} />
      </div>
      <TextField id="subject" name="subject" label="Subject" value={values.subject}
        onChange={set('subject')} onBlur={checkField('subject')} error={errors.subject} />
      <TextAreaField id="message" name="message" label="Message" rows={6} value={values.message}
        onChange={set('message')} onBlur={checkField('message')} error={errors.message} />
      <Button type="submit" fullWidth>
        <Send size={18} aria-hidden="true" /> Send by email
      </Button>
    </form>
  );
}
