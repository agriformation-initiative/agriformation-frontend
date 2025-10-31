'use client';
import React, { useState } from 'react';
import {  CheckCircle, Users, BookOpen, Sprout, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [5000, 10000, 25000, 50000, 100000, 250000];

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDonate = async () => {
  const rawAmount = customAmount || selectedAmount;

  if (!rawAmount) {
    alert('Please select or enter an amount of at least ₦1,000');
    return;
  }

  const amount = Number(rawAmount);

  if (isNaN(amount) || amount < 1000) {
    alert('Please enter a valid amount of at least ₦1,000');
    return;
  }

  setIsProcessing(true);

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, donationType }),
    });

    if (!response.ok) throw new Error('Network error');

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error(error);
    alert('Payment failed. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};
  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-5 md:px-8 bg-gradient-to-br from-amber-50/40 via-stone-50 to-emerald-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium border border-green-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                Support Our Mission
              </div>
              <h1 className="text-[2.75rem] md:text-6xl font-bold text-stone-900 leading-[1.08] tracking-tight">
                Transform Lives Through <span className="text-green-700 italic font-serif">Agriculture</span>
              </h1>
              <p className="text-[1.1rem] text-stone-600 leading-[1.7] font-light max-w-xl">
                Your donation helps us reshape how Nigerian students see agriculture — from punishment to purpose, from labor to innovation.
              </p>
              <button
                onClick={() => scrollTo('#donate-form')}
                className="px-6 py-3 bg-green-800 text-white rounded font-medium hover:bg-green-900 transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                Donate Now <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-200">
                <Image
                  src="/images/happy-students.jpg"
                  width={500}
                  height={700}
                  alt="Students learning at farm"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-20 px-5 md:px-8 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Your Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              How Your Donation Helps
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              See the tangible difference your contribution makes in students&apos; lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={32} />,
                title: 'Farm Excursions',
                description: '₦25,000 sponsors one student for a transformative farm visit',
              },
              {
                icon: <BookOpen size={32} />,
                title: 'Educational Materials',
                description: '₦50,000 provides learning resources for an entire classroom',
              },
              {
                icon: <Sprout size={32} />,
                title: 'School Gardens',
                description: '₦100,000 establishes a practical learning garden in a school',
              },
            ].map((area, index) => (
              <div
                key={index}
                className="p-8 bg-stone-50 border border-stone-200 rounded hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-green-800 text-white rounded flex items-center justify-center">
                  {area.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-1">{area.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-24 px-5 md:px-8 bg-stone-50" id="donate-form">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Make a Difference
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Make Your Donation
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Every contribution helps us reach more students and transform agricultural education.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl border border-stone-200">
            <div className="space-y-8">
              {/* Donation Type */}
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-4">Donation Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`px-6 py-3 rounded font-medium border transition-colors ${
                      donationType === 'one-time'
                        ? 'bg-green-800 text-white border-green-800'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-green-800'
                    }`}
                  >
                    One-Time
                  </button>
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`px-6 py-3 rounded font-medium border transition-colors ${
                      donationType === 'monthly'
                        ? 'bg-green-800 text-white border-green-800'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-green-800'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Preset Amounts */}
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-4">Select Amount (NGN)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`px-4 py-3 rounded font-medium border transition-colors ${
                        selectedAmount === amount
                          ? 'bg-green-800 text-white border-green-800'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-green-800'
                      }`}
                    >
                      ₦{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-bold text-stone-900 mb-4">Or Enter Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-500 font-medium text-lg">₦</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Enter amount"
                    className="w-full pl-12 pr-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-green-800 transition-colors text-stone-900 font-medium"
                    min="1000"
                  />
                </div>
                <p className="text-sm text-stone-500 mt-2">Minimum donation: ₦1,000</p>
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                disabled={isProcessing}
                className="w-full px-6 py-3 bg-green-800 text-white rounded font-medium hover:bg-green-900 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:bg-stone-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Continue to Payment'} 
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>

              <p className="text-sm text-stone-500 text-center">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-24 px-5 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Why Give
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Why Your Support Matters
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              In 2024, we took 83 students on a farm excursion that changed their perception of agriculture forever. With your help, we can reach thousands more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle size={32} />,
                title: 'Full Transparency',
                description: 'Every naira is accounted for and invested directly in programs',
              },
              {
                icon: <Users size={32} />,
                title: 'Direct Impact',
                description: 'Your donation reaches students in underserved communities',
              },
              {
                icon: <Sprout size={32} />,
                title: 'Long-term Change',
                description: 'Building a generation of agricultural innovators for Nigeria',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="p-8 bg-stone-50 border border-stone-200 rounded hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-green-800 text-white rounded flex items-center justify-center">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-1">{benefit.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-5 md:px-8 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-emerald-50 leading-relaxed max-w-2xl mx-auto">
            Your generosity can help turn agriculture from punishment to purpose in the hearts of Nigerian students.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => scrollTo('#donate-form')}
              className="px-6 py-3 bg-white text-green-900 rounded font-medium hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Donate Now
            </button>
            <a
              href="/programs"
              className="px-6 py-3 bg-transparent text-white rounded font-medium border-2 border-white hover:bg-white/10 transition-colors inline-block"
            >
              View Programs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}