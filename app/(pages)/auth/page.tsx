/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      setAuth(response.data.user, response.data.token);
      toast.success('Login successful!');

      if (response.data.user.role === 'volunteer') {
        router.push('/volunteer/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero-style Header */}
      <section className="pt-32 pb-20 px-5 md:px-8 bg-gradient-to-br from-amber-50/40 via-stone-50 to-emerald-50/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-2 border border-emerald-900/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-700"></span>
            Agriformation Admin & Volunteer Portal
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-stone-900 leading-tight tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-xl text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Sign in to manage programs, track impact, and continue transforming agricultural education in Nigeria.
          </p>
        </div>
      </section>

      {/* Login Form Card */}
      <section className="px-5 md:px-8 -mt-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-sm shadow-xl border border-stone-200 overflow-hidden">
              <div className="p-4 md:p-6 space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Sign In</h2>
                  <p className="mt-2 text-stone-600">Access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 transition-all outline-none text-stone-900 placeholder-stone-400"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded border border-stone-300 focus:border-green-700 focus:ring-2 focus:ring-green-700/20 transition-all outline-none text-stone-900 placeholder-stone-400"
                      placeholder="Enter your password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-2 bg-green-700 text-white rounded font-medium hover:bg-green-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      'Signing in...'
                    ) : (
                      <>
                        Sign In <ArrowRight size={18} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <Link
                    href="/"
                    className="text-sm text-green-700 hover:text-green-800 font-medium inline-flex items-center gap-2 group"
                  >
                    <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Subtle bottom accent */}
              <div className="h-2 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600"></div>
            </div>

            {/* Optional: Small footer note */}
            <p className="text-center mt-8 text-sm text-stone-500">
              Protecting the future of Nigerian agriculture, one login at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Extra bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}