'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';

const PRESETS = [5000, 10000, 25000, 50000, 100000, 250000];
const MIN_AMOUNT = 1000;
const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export default function DonateForm() {
  const [type, setType] = useState<'one-time' | 'monthly'>('one-time');
  const [preset, setPreset] = useState<number | null>(10000);
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = custom ? Number(custom) : preset;

  const choice = (active: boolean) =>
    `min-h-12 rounded-md border px-4 py-2.5 font-semibold transition-colors ${
      active
        ? 'border-brand-700 bg-brand-700 text-white'
        : 'border-stone-300 bg-white text-stone-800 hover:border-brand-700'
    }`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !Number.isFinite(amount) || amount < MIN_AMOUNT) {
      setError(`Choose or enter an amount of at least ${naira(MIN_AMOUNT)}.`);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, donationType: type }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message || 'We could not start the payment. Please try again.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not start the payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-8 rounded-xl bg-white p-6 md:p-10">
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-stone-800">How often</legend>
        <div className="grid grid-cols-2 gap-3">
          {(['one-time', 'monthly'] as const).map((t) => (
            <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={choice(type === t)}>
              {t === 'one-time' ? 'One time' : 'Monthly'}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-stone-800">Amount</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={!custom && preset === p}
              onClick={() => { setPreset(p); setCustom(''); setError(''); }}
              className={`${choice(!custom && preset === p)} tabular-nums`}
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
            onChange={(e) => { setCustom(e.target.value); setError(''); }}
            aria-invalid={!!error}
            aria-describedby="amount-help"
            className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-9 pr-4 tabular-nums focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/25"
          />
        </div>
        <p id="amount-help" className={`mt-1.5 text-sm ${error ? 'text-red-700' : 'text-stone-600'}`} role={error ? 'alert' : undefined}>
          {error || `Minimum donation is ${naira(MIN_AMOUNT)}.`}
        </p>
      </div>

      <div>
        <Button type="submit" fullWidth loading={loading}>
          {amount && Number.isFinite(amount) && amount >= MIN_AMOUNT
            ? `Give ${naira(amount)}${type === 'monthly' ? ' each month' : ''}`
            : 'Continue to payment'}
        </Button>
        <p className="mt-3 text-center text-sm text-stone-600">You will pay on a secure page hosted by Stripe.</p>
      </div>
    </form>
  );
}
