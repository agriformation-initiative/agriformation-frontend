export interface PaymentCheck {
  state: 'success' | 'failed' | 'pending' | 'unknown';
  amount?: number;
  reference?: string;
}

/**
 * Ask Paystack what happened to a payment. Server-side only: it uses the secret key, and the
 * redirect back from checkout alone proves nothing, so the thank-you page relies on this.
 */
export async function verifyPayment(reference: string): Promise<PaymentCheck> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || !reference) return { state: 'unknown' };

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: 'no-store',
    });
    if (!res.ok) return { state: 'unknown' };
    const body = await res.json();
    const status = body?.data?.status as string | undefined;
    if (status === 'success') {
      return { state: 'success', amount: Number(body.data.amount) / 100, reference };
    }
    if (status === 'failed' || status === 'abandoned' || status === 'reversed') return { state: 'failed', reference };
    return { state: 'pending', reference };
  } catch {
    return { state: 'unknown' };
  }
}
