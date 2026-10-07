import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const MIN_AMOUNT_NGN = 1000;
const MAX_AMOUNT_NGN = 10_000_000;

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { message: 'Online donations are not set up yet. Please contact us to give.' },
      { status: 503 }
    );
  }

  let body: { amount?: unknown; donationType?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  const amount = Number(body.amount);
  const monthly = body.donationType === 'monthly';
  if (!Number.isFinite(amount) || amount < MIN_AMOUNT_NGN || amount > MAX_AMOUNT_NGN) {
    return NextResponse.json(
      { message: `Enter an amount between ₦${MIN_AMOUNT_NGN.toLocaleString()} and ₦${MAX_AMOUNT_NGN.toLocaleString()}.` },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: monthly ? 'subscription' : 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'ngn',
            unit_amount: Math.round(amount * 100),
            product_data: { name: monthly ? 'Monthly donation to AgroNext' : 'Donation to AgroNext' },
            ...(monthly && { recurring: { interval: 'month' as const } }),
          },
        },
      ],
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ message: 'We could not start the payment. Please try again.' }, { status: 502 });
  }
}
