import type { Metadata } from 'next';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { verifyPayment } from '@/lib/paystack';
import { SITE } from '@/lib/site';

export const metadata: Metadata = { title: 'Your donation' };

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference || params.trxref || '';
  // Reaching this page does not mean the payment worked, so ask Paystack
  const payment = await verifyPayment(reference);

  const view = {
    success: {
      Icon: CheckCircle2,
      tone: 'text-brand-700',
      title: 'Thank you for your donation!',
      text: 'Your gift will help students in Nigeria see agriculture as a career worth choosing. Paystack has emailed you a receipt.',
    },
    failed: {
      Icon: AlertCircle,
      tone: 'text-red-700',
      title: 'Your payment did not go through',
      text: 'You have not been charged for this attempt. You can try again, or use the bank transfer details on the donate page.',
    },
    pending: {
      Icon: Clock,
      tone: 'text-amber-700',
      title: 'Your payment is still being processed',
      text: 'It can take a few minutes. If it succeeds, Paystack will email you a receipt.',
    },
    unknown: {
      Icon: Clock,
      tone: 'text-stone-600',
      title: 'We could not confirm your payment yet',
      text: `If you were charged, Paystack will email you a receipt. Write to ${SITE.email} with your reference and we will check it for you.`,
    },
  }[payment.state];

  return (
    <div className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center md:p-12">
        <view.Icon size={48} className={`mx-auto ${view.tone}`} aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-semibold md:text-4xl">{view.title}</h1>
        <p className="mt-4 text-lg text-stone-700">{view.text}</p>

        {payment.state === 'success' && payment.amount && (
          <p className="mt-6 text-stone-700">
            Amount: <span className="font-semibold tabular-nums text-stone-900">₦{payment.amount.toLocaleString('en-NG')}</span>
          </p>
        )}
        {reference && (
          <p className="mt-3 break-all rounded-md bg-stone-100 p-3 text-sm text-stone-700">
            Reference: <span className="font-mono">{reference}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {payment.state === 'success' ? (
            <>
              <Button href="/">Back to home</Button>
              <Button href="/transparency" variant="secondary">See what gifts pay for</Button>
            </>
          ) : (
            <>
              <Button href="/donate">Back to donate</Button>
              <Button href="/contact" variant="secondary">Contact us</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
