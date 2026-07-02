'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle, Loader2, Send } from 'lucide-react';

interface VolunteerCall {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  eventDate: string;
  deadline: string;
  numberOfVolunteers: number;
  category: string;
  designImage: { url: string };
}

interface FormState {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export default function VolunteerCallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [call, setCall] = useState<VolunteerCall | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormState>({ fullName: '', email: '', phoneNumber: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchCall = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteer-calls/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        if (data.success) setCall(data.data.call ?? data.data);
        else setNotFound(true);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCall();
  }, [id]);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const daysLeft = call ? Math.ceil((new Date(call.deadline).getTime() - Date.now()) / 86_400_000) : 0;
  const isExpired = daysLeft < 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !call) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteer-calls/${call._id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName, email: form.email, phoneNumber: form.phoneNumber, message: form.message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrors((p) => ({ ...p, fullName: message }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={40} />
      </div>
    );
  }

  if (notFound || !call) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <p className="text-stone-600 text-lg">This opportunity could not be found.</p>
        <Link href="/volunteer" className="text-emerald-700 font-medium hover:underline">
          Browse all opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Back nav */}
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-emerald-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to opportunities
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero image */}
            <div className="relative h-72 md:h-96 rounded-sm overflow-hidden border border-stone-200">
              <Image src={call.designImage.url} alt={call.title} fill className="object-cover" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded text-xs font-semibold ${isExpired ? 'bg-stone-700 text-white' : 'bg-emerald-700 text-white'}`}>
                  {isExpired ? 'Closed' : 'Open'}
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded text-xs font-medium tracking-wide uppercase">
                {call.category.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">{call.title}</h1>

            {/* Meta */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Calendar size={18} />, label: 'Event date', value: formatDate(call.eventDate) },
                { icon: <MapPin size={18} />, label: 'Location', value: call.location },
                { icon: <Users size={18} />, label: 'Volunteers needed', value: String(call.numberOfVolunteers) },
                { icon: <Clock size={18} />, label: 'Deadline', value: formatDate(call.deadline) },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-4 bg-white border border-stone-200 rounded">
                  <span className="text-emerald-700 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-xs text-stone-500">{label}</p>
                    <p className="text-sm font-medium text-stone-900 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-3">About this opportunity</h2>
              <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{call.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-3">Requirements</h2>
              <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{call.requirements}</p>
            </div>
          </div>

          {/* Right: apply form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white border border-stone-200 rounded p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto text-emerald-700 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Application submitted</h3>
                  <p className="text-stone-600 text-sm">We'll review your application and be in touch soon.</p>
                  <Link
                    href="/volunteer"
                    className="mt-6 inline-block text-emerald-700 text-sm font-medium hover:underline"
                  >
                    Browse more opportunities
                  </Link>
                </div>
              ) : isExpired ? (
                <div className="text-center py-8">
                  <p className="text-stone-600 font-medium">Applications for this opportunity are closed.</p>
                  <Link href="/volunteer" className="mt-4 inline-block text-emerald-700 text-sm font-medium hover:underline">
                    See other opportunities
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-stone-900 mb-1">Apply now</h3>
                  {daysLeft <= 7 && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4">
                      {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`} to apply
                    </p>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full name *"
                        value={form.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.fullName ? 'border-red-400' : 'border-stone-300'}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address *"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? 'border-red-400' : 'border-stone-300'}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone number *"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.phoneNumber ? 'border-red-400' : 'border-stone-300'}`}
                      />
                      {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                      <textarea
                        name="message"
                        placeholder="Why do you want to volunteer? (optional)"
                        rows={3}
                        value={form.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors disabled:opacity-50"
                    >
                      {submitting ? (
                        <><Loader2 className="animate-spin" size={18} /> Submitting...</>
                      ) : (
                        <><Send size={16} /> Submit Application</>
                      )}
                    </button>
                  </form>
                  <div className="mt-6 pt-5 border-t border-stone-200 space-y-1.5 text-sm text-stone-500">
                    <p>Free to participate</p>
                    <p>Make a real impact</p>
                    <p>Gain valuable experience</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
