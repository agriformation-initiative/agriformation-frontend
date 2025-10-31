// app/donate/success/page.tsx
'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('session_id');
    setSessionId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-5 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl border border-stone-200 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-green-700" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
              Thank You for Your Donation!
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-lg mx-auto">
              Your generosity will help transform agricultural education and inspire the next generation of farmers and innovators in Nigeria.
            </p>
          </div>

          {/* Session ID (optional) */}
          {sessionId && (
            <div className="bg-stone-50 border border-stone-200 rounded p-4">
              <p className="text-sm text-stone-500">Transaction ID</p>
              <p className="text-xs font-mono text-stone-700 break-all">{sessionId}</p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="pt-6 space-y-4 text-left border-t border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 text-center">What Happens Next?</h2>
            <ul className="space-y-3 text-stone-600">
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-700 flex-shrink-0 mt-0.5" />
                <span>You&apos;ll receive a confirmation email with your receipt within a few minutes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-700 flex-shrink-0 mt-0.5" />
                <span>Your donation will be put to work immediately in our programs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-700 flex-shrink-0 mt-0.5" />
                <span>We&apos;ll keep you updated on the impact your contribution is making</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 bg-green-800 text-white rounded font-medium hover:bg-green-900 transition-colors flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Return Home
            </button>
            <button
              onClick={() => router.push('/programs')}
              className="flex-1 px-6 py-3 bg-white text-green-800 rounded font-medium border-2 border-green-800 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              View Programs
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Social Share (Optional) */}
          <div className="pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-600 mb-4">
              Help us reach more people by sharing our mission
            </p>
            <div className="flex justify-center gap-3">
              <button className="px-4 py-2 bg-stone-100 text-stone-700 rounded font-medium hover:bg-stone-200 transition-colors text-sm">
                Share on Twitter
              </button>
              <button className="px-4 py-2 bg-stone-100 text-stone-700 rounded font-medium hover:bg-stone-200 transition-colors text-sm">
                Share on Facebook
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-stone-500 mt-6">
          Questions about your donation? Contact us at{' '}
          <a href="mailto:donations@example.com" className="text-green-700 hover:underline">
            donations@example.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-600">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}