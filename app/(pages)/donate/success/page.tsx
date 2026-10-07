import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Thank you' };

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center md:p-12">
        <CheckCircle2 size={48} className="mx-auto text-brand-700" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-semibold md:text-4xl">Thank you for your donation!</h1>
        <p className="mt-4 text-lg text-stone-700">
          Your gift will help students in Nigeria see agriculture as a career worth choosing. A receipt will be
          sent to the email you used at checkout.
        </p>

        {sessionId && (
          <p className="mt-6 break-all rounded-md bg-stone-100 p-3 text-sm text-stone-700">
            Reference: <span className="font-mono">{sessionId}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/">Back to home</Button>
          <Button href="/programs" variant="secondary">See the programs</Button>
        </div>

        <p className="mt-8 text-sm text-stone-600">
          Questions about your donation? Write to{' '}
          <a href={`mailto:${SITE.email}`} className="text-brand-700 underline underline-offset-4">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
