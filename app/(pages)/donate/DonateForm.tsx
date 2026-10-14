'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';

const PRESETS = [5000, 10000, 25000, 50000, 100000, 250000];
const MIN_AMOUNT = 1000;
const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

type Errors = Partial<Record<'amount' | 'email', string>>;

export default function DonateForm() {
  const [preset, setPreset] = useState<number | null>(10000);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = custom ? Number(custom) : preset;
  const validAmount = !!amount && Number.isFinite(amount) && amount >= MIN_AMOUNT;

  const choice = (active: boolean) =>
    `min-h-12 rounded-md border px-4 py-2.5 font-semibold tabular-nums transition-colors ${
      active
        ? 'border-brand-700 bg-brand-700 text-white'
        : 'border-stone-300 bg-white text-stone-800 hover:border-brand-700'
    }`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    if (!validAmount) found.amount = `Choose or enter an amount of at least ${naira(MIN_AMOUNT)}.`;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = 'Enter a valid email address, like name@example.com. Your receipt goes here.';
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(found.amount ? 'custom-amount' : 'donor-email')?.focus();
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, email: email.trim(), name: name.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message || 'We could not start the payment. Please try again.');
      window.location.href = data.url;
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'We could not start the payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-8 rounded-xl bg-white p-6 md:p-10">
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-stone-800">Amount</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={!custom && preset === p}
              onClick={() => { setPreset(p); setCustom(''); setErrors((x) => ({ ...x, amount: undefined })); }}
              className={choice(!custom && preset === p)}
            >
              {naira(p)}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="custom-amount" className="mb-1.5 block text-sm font-medium text-stone-800">
          Or enter another amount
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" aria-hidden="true">₦</span>
          <input
            id="custom-amount"
            type="number"
            inputMode="numeric"
            min={MIN_AMOUNT}
            step={500}
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setErrors((x) => ({ ...x, amount: undefined })); }}
            aria-invalid={!!errors.amount}
            aria-describedby="amount-help"
            className={`w-full rounded-md border bg-white py-2.5 pl-9 pr-4 tabular-nums focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/25 ${errors.amount ? 'border-red-600' : 'border-stone-300'}`}
          />
        </div>
        <p id="amount-help" className={`mt-1.5 text-sm ${errors.amount ? 'text-red-700' : 'text-stone-600'}`} role={errors.amount ? 'alert' : undefined}>
          {errors.amount || `Minimum donation is ${naira(MIN_AMOUNT)}.`}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField id="donor-name" label="Your name" optional autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField id="donor-email" type="email" label="Email for your receipt" autoComplete="email" value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }} error={errors.email} />
      </div>

      {formError && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{formError}</p>}

      <div>
        <Button type="submit" fullWidth loading={loading}>
          {validAmount ? `Give ${naira(amount as number)}` : 'Continue to payment'}
        </Button>
        <p className="mt-3 text-center text-sm text-stone-600">You will pay by card, bank or transfer on a secure page run by Paystack.</p>
      </div>
    </form>
  );
}
