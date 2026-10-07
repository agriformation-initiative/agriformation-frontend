import { NextResponse } from 'next/server';

const MIN_AMOUNT_NGN = 1000;
const MAX_AMOUNT_NGN = 10_000_000;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

/** Starts a one-time Paystack payment and returns the hosted checkout URL. */
export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { message: 'Online donations are not set up yet. Please use the bank transfer details or contact us to give.' },
      { status: 503 }
    );
  }

  let body: { amount?: unknown; email?: unknown; name?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  const amount = Number(body.amount);
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ message: 'Enter a valid email address so we can send your receipt.' }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount < MIN_AMOUNT_NGN || amount > MAX_AMOUNT_NGN) {
    return NextResponse.json(
      { message: `Enter an amount between ₦${MIN_AMOUNT_NGN.toLocaleString('en-NG')} and ₦${MAX_AMOUNT_NGN.toLocaleString('en-NG')}.` },
      { status: 400 }
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack counts in kobo
        currency: 'NGN',
        callback_url: `${origin}/donate/success`,
        metadata: { purpose: 'donation', donor_name: name },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.status || !data.data?.authorization_url) {
      console.error('Paystack initialize failed:', data?.message);
      return NextResponse.json({ message: 'We could not start the payment. Please try again.' }, { status: 502 });
    }
    return NextResponse.json({ url: data.data.authorization_url });
  } catch (error) {
    console.error('Paystack initialize error:', error);
    return NextResponse.json({ message: 'We could not start the payment. Please try again.' }, { status: 502 });
  }
}
