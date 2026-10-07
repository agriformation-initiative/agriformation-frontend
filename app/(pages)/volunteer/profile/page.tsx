'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { volunteerService } from '@/services/volunteerService';
import { Volunteer } from '@/types/indexes';
import Button from '@/components/ui/Button';
import ChangePasswordForm from '@/components/shared/ChangePasswordForm';
import { TextField, TextAreaField } from '@/components/ui/Field';
import { PageHeader, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const ROLES = [
  'School Gardens Assistant',
  'Agri-Club Facilitator',
  'Media & Comms',
  'Fundraising & Partnerships',
  'Program Coordinator',
  'Other',
];

const AVAILABILITY = [
  { value: 'weekdays', label: 'Weekdays only' },
  { value: 'weekends', label: 'Weekends only' },
  { value: 'both', label: 'Weekdays and weekends' },
  { value: 'flexible', label: 'Flexible, any time' },
];

const MIN_ABOUT = 50;

function RadioGroup({
  legend, name, options, value, onChange,
}: {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="rounded-xl bg-white p-6">
      <legend className="float-left mb-4 w-full font-sans text-lg font-semibold">{legend}</legend>
      <div className="clear-both grid gap-3 md:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600 ${
              value === o.value ? 'border-brand-700 bg-brand-50' : 'border-stone-300 hover:border-stone-400'
            }`}
          >
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="h-5 w-5 accent-brand-700" />
            <span className="font-medium text-stone-800">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function VolunteerProfile() {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aboutError, setAboutError] = useState('');
  const [form, setForm] = useState({
    preferredRole: '',
    aboutYourself: '',
    skills: [] as string[],
    availability: '',
    location: { state: '', lga: '' },
  });

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const v: Volunteer = (await volunteerService.getProfile()).data.volunteer;
      setForm({
        preferredRole: v.preferredRole || '',
        aboutYourself: v.aboutYourself || '',
        skills: v.skills || [],
        availability: v.availability || '',
        location: v.location || { state: '', lga: '' },
      });
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.aboutYourself.trim().length < MIN_ABOUT) {
      setAboutError(`Write at least ${MIN_ABOUT} characters about yourself.`);
      document.getElementById('aboutYourself')?.focus();
      return;
    }
    setSaving(true);
    try {
      // An empty availability would fail the server's allowed-values check, so leave it out
      const { availability, ...rest } = form;
      await volunteerService.updateProfile({ ...rest, ...(availability && { availability }) } as Partial<Volunteer>);
      toast.success('Profile saved');
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'We could not save your profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (failed) return <ErrorState message="We could not load your profile." onRetry={load} />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="My profile" description="Help us match you with the right role." />

      <form onSubmit={submit} noValidate className="space-y-6">
        <RadioGroup legend="Preferred role" name="preferredRole" options={ROLES.map((r) => ({ value: r, label: r }))}
          value={form.preferredRole} onChange={(v) => setForm((p) => ({ ...p, preferredRole: v }))} />

        <section className="rounded-xl bg-white p-6">
          <TextAreaField id="aboutYourself" name="aboutYourself" label="About you" rows={6} value={form.aboutYourself} error={aboutError}
            onChange={(e) => { setForm((p) => ({ ...p, aboutYourself: e.target.value })); setAboutError(''); }}
            hint={`Why you want to volunteer and what you bring. ${form.aboutYourself.trim().length} of ${MIN_ABOUT} characters minimum.`} />
        </section>

        <RadioGroup legend="When are you available?" name="availability" options={AVAILABILITY}
          value={form.availability} onChange={(v) => setForm((p) => ({ ...p, availability: v }))} />

        <section className="rounded-xl bg-white p-6">
          <h2 className="font-sans text-lg font-semibold">Your location</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <TextField id="state" label="State" placeholder="Rivers State" autoComplete="address-level1" value={form.location.state}
              onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, state: e.target.value } }))} />
            <TextField id="lga" label="Local government area" placeholder="Obio/Akpor" autoComplete="address-level2" value={form.location.lga}
              onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, lga: e.target.value } }))} />
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>Save profile</Button>
        </div>
      </form>

      <section className="mt-10 rounded-xl bg-white p-6" aria-labelledby="password-heading">
        <h2 id="password-heading" className="mb-5 font-sans text-lg font-semibold">Change password</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
