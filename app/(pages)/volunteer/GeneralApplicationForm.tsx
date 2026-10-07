'use client';
import { useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { TextField, TextAreaField, SelectField } from '@/components/ui/Field';
import { volunteerService } from '@/services/volunteerService';

const ROLES = [
  'School Gardens Assistant',
  'Agri-Club Facilitator',
  'Media & Comms',
  'Fundraising & Partnerships',
  'Program Coordinator',
  'Other',
];
const MIN_ABOUT = 50;

type Values = { fullName: string; email: string; preferredRole: string; aboutYourself: string };
type Errors = Partial<Record<keyof Values, string>>;
const EMPTY: Values = { fullName: '', email: '', preferredRole: '', aboutYourself: '' };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.fullName.trim()) e.fullName = 'Enter your full name.';
  if (!v.email.trim()) e.email = 'Enter your email address.';
  else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email address, like name@example.com.';
  if (!v.preferredRole) e.preferredRole = 'Choose the role you would like to help with.';
  if (v.aboutYourself.trim().length < MIN_ABOUT)
    e.aboutYourself = `Tell us a little more. Write at least ${MIN_ABOUT} characters.`;
  return e;
}

export default function GeneralApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      await volunteerService.submitApplication({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        preferredRole: values.preferredRole,
        aboutYourself: values.aboutYourself.trim(),
      });
      setDone(true);
      setValues(EMPTY);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setFormError(message || 'We could not send your application. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="rounded-xl bg-brand-50 p-8 text-center">
        <CheckCircle2 className="mx-auto text-brand-700" size={44} aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">Application received</h3>
        <p className="mt-2 text-stone-700">We will review it and get back to you by email.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-5 rounded-xl bg-white p-6 md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField id="fullName" name="fullName" label="Full name" autoComplete="name" value={values.fullName}
          onChange={set('fullName')} onBlur={onBlur('fullName')} error={errors.fullName} />
        <TextField id="email" name="email" type="email" label="Email address" autoComplete="email" value={values.email}
          onChange={set('email')} onBlur={onBlur('email')} error={errors.email} />
      </div>
      <SelectField id="preferredRole" name="preferredRole" label="Preferred role" value={values.preferredRole}
        onChange={set('preferredRole')} onBlur={onBlur('preferredRole')} error={errors.preferredRole}>
        <option value="">Choose a role</option>
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </SelectField>
      <TextAreaField id="aboutYourself" name="aboutYourself" label="About you" rows={6} value={values.aboutYourself}
        onChange={set('aboutYourself')} onBlur={onBlur('aboutYourself')} error={errors.aboutYourself}
        hint={`Your background and why you want to help. ${values.aboutYourself.trim().length} of ${MIN_ABOUT} characters minimum.`} />
      {formError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{formError}</p>}
      <Button type="submit" fullWidth loading={submitting}>Send application</Button>
    </form>
  );
}
