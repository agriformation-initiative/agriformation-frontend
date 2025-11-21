/*eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import { ChevronRight, Send, Users, Leaf, Camera, Handshake, Award, Calendar, MapPin, Clock, X, Loader2, CheckCircle, Search } from 'lucide-react';
import Image from 'next/image';

const ROLES = [
  'School Gardens Assistant',
  'Agri-Club Facilitator',
  'Media & Comms',
  'Fundraising & Partnerships',
  'Program Coordinator',
  'Other',
];

const CATEGORIES = [
  { value: 'all', label: 'All Opportunities' },
  { value: 'farm_work', label: 'Farm Work' },
  { value: 'event_support', label: 'Event Support' },
  { value: 'community_outreach', label: 'Community Outreach' },
  { value: 'training', label: 'Training' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'other', label: 'Other' },
];

// Type definitions
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
  designImage: {
    url: string;
  };
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  preferredRole: string;
  aboutYourself: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  preferredRole?: string;
  aboutYourself?: string;
}

export default function UnifiedVolunteerPage() {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [selectedCall, setSelectedCall] = useState<VolunteerCall | null>(null);
  const [calls, setCalls] = useState<VolunteerCall[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredRole: '',
    aboutYourself: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchVolunteerCalls();
  }, [categoryFilter]);

  const fetchVolunteerCalls = async () => {
  try {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (categoryFilter !== 'all') {
      queryParams.append('category', categoryFilter);
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/volunteer-calls${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('Fetching from:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.success && data.data && Array.isArray(data.data.calls)) {
      setCalls(data.data.calls);
    } else {
      console.error('Unexpected data structure:', data);
      setCalls([]);
    }
  } catch (error) {
    console.error('Error fetching volunteer calls:', error);
    setCalls([]);
  } finally {
    setLoading(false);
  }
};

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (isSpecificCall: boolean) => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (isSpecificCall) {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
    } else {
      if (!formData.preferredRole) {
        newErrors.preferredRole = 'Please select a role';
      }
      if (!formData.aboutYourself.trim()) {
        newErrors.aboutYourself = 'Please tell us about yourself';
      } else if (formData.aboutYourself.length < 50) {
        newErrors.aboutYourself = 'Please provide at least 50 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isSpecificCall = !!selectedCall;

    if (!validateForm(isSpecificCall)) return;

    setSubmitting(true);
    try {
      const url = isSpecificCall
        ? `${process.env.NEXT_PUBLIC_API_URL}/volunteer-calls/${selectedCall._id}/apply`
        : `${process.env.NEXT_PUBLIC_API_URL}/volunteer/apply`;

      const payload = isSpecificCall
        ? {
            fullName: formData.fullName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            message: formData.message,
          }
        : {
            fullName: formData.fullName,
            email: formData.email,
            preferredRole: formData.preferredRole,
            aboutYourself: formData.aboutYourself,
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSelectedCall(null);
        setSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          preferredRole: '',
          aboutYourself: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const daysUntilDeadline = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredCalls = calls.filter((call) =>
    call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-5 md:px-8 bg-gradient-to-br from-amber-50/40 via-stone-50 to-emerald-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium border border-emerald-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Volunteer With Us
              </div>
              <h1 className="text-[2.75rem] md:text-6xl font-bold text-stone-900 leading-[1.08] tracking-tight">
                Join the <span className="text-emerald-700 italic font-serif">Movement</span>
              </h1>
              <p className="text-[1.1rem] text-stone-600 leading-[1.7] font-light max-w-xl">
                Become part of a passionate community transforming agricultural education in Nigeria. Your time and skills can inspire the next generation.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo('#active-opportunities')}
                  className="px-6 py-3 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  Browse Opportunities <ChevronRight size={18} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => scrollTo('#apply-section')}
                  className="px-6 py-3 bg-white text-emerald-800 border-2 border-emerald-800 rounded font-medium hover:bg-emerald-50 transition-colors"
                >
                  General Application
                </button>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1567497063796-7952e455a2a6?w=600&h=750&fit=crop"
                  alt="Volunteers working with students"
                  className="w-full h-full object-cover"
                  layout="fill"
                  width={600}
                  height={750}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Opportunities Section */}
      <section className="py-20 px-5 md:px-8 bg-white border-y border-stone-200" id="active-opportunities">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Current Openings
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Active Volunteer Calls
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Join us for specific events and programs. Apply directly to opportunities that match your interests.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Opportunities Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-emerald-700" size={40} />
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="bg-stone-50 rounded-lg border border-stone-200 p-12 text-center">
              <Users className="mx-auto text-stone-300 mb-4" size={48} />
              <p className="text-stone-500 text-lg mb-2">No active opportunities right now</p>
              <p className="text-stone-400 text-sm mb-6">Check back soon or submit a general application below</p>
              <button
                onClick={() => scrollTo('#apply-section')}
                className="px-6 py-2 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors"
              >
                General Application
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCalls.map((call) => {
                const daysLeft = daysUntilDeadline(call.deadline);
                const isExpired = daysLeft < 0;
                
                return (
                  <div
                    key={call._id}
                    onClick={() => !isExpired && setSelectedCall(call)}
                    className={`bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden transition-all ${
                      isExpired ? 'opacity-60' : 'hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    <div className="relative h-48 bg-stone-100">
                      <Image
                        src={call.designImage.url}
                        alt={call.title}
                        className="w-full h-full object-cover"
                        layout="fill"
                        width={600}
                        height={750}
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isExpired ? 'bg-stone-500 text-white' : 'bg-emerald-700 text-white'
                        }`}>
                          {isExpired ? 'Closed' : 'Open'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-stone-900 mb-2 line-clamp-2">
                        {call.title}
                      </h3>

                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                        {call.description}
                      </p>

                      <div className="space-y-2 text-sm text-stone-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-stone-400" />
                          <span>{formatDate(call.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-stone-400" />
                          <span className="line-clamp-1">{call.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-stone-400" />
                          <span>{call.numberOfVolunteers} needed</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-200">
                        {isExpired ? (
                          <p className="text-xs text-stone-500">Applications closed</p>
                        ) : (
                          <p className="text-xs text-stone-600">
                            <span className="font-medium text-emerald-700">{daysLeft}</span> {daysLeft === 1 ? 'day' : 'days'} left
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="py-20 px-5 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              General Roles
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Ways to Contribute
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Explore the various ways you can contribute your skills and passion to our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Leaf size={32} />,
                title: 'School Gardens Assistant',
                description: 'Help set up and support gardens in schools, fostering hands-on learning.',
              },
              {
                icon: <Users size={32} />,
                title: 'Agri-Club Facilitator',
                description: 'Run student activities, mini-lectures, and competitions to engage young minds.',
              },
              {
                icon: <Camera size={32} />,
                title: 'Media & Comms',
                description: 'Document and share our stories to spread awareness about our work.',
              },
              {
                icon: <Handshake size={32} />,
                title: 'Fundraising & Partnerships',
                description: 'Support resource mobilization and build partnerships with stakeholders.',
              },
            ].map((role, index) => (
              <div
                key={index}
                className="p-8 bg-white border border-stone-200 rounded hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-800 text-white rounded flex items-center justify-center">
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-1">{role.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-5 md:px-8 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Your Gain
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Benefits of Volunteering
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Award size={28} />, title: 'Hands-on Experience', description: 'Training and mentorship from experts' },
              { icon: <Leaf size={28} />, title: 'Skill Development', description: 'Build leadership and project management skills' },
              { icon: <Users size={28} />, title: 'Networking', description: 'Connect with changemakers in agriculture' },
              { icon: <Award size={28} />, title: 'Recognition', description: 'Receive certificates and recognition' },
            ].map((benefit, index) => (
              <div key={index} className="p-6 bg-stone-50 border border-stone-200 rounded text-center">
                <div className="w-14 h-14 bg-emerald-800 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{benefit.title}</h3>
                <p className="text-stone-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Application Form */}
      <section className="py-24 px-5 md:px-8 bg-stone-50" id="apply-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Join Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              General Volunteer Application
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Not finding a specific opportunity? Submit a general application and we&apos;ll reach out when something matches your interests.
            </p>
          </div>

          {submitted && !selectedCall ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
              <CheckCircle className="mx-auto text-emerald-700 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">Application Submitted!</h3>
              <p className="text-emerald-700">We&apos;ll review your application and get back to you soon.</p>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl border border-stone-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name *"
                      className={`w-full px-5 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.fullName ? 'border-red-500' : 'border-stone-300'
                      }`}
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      className={`w-full px-5 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-stone-300'
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <select
                    name="preferredRole"
                    className={`w-full px-5 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      errors.preferredRole ? 'border-red-500' : 'border-stone-300'
                    }`}
                    value={formData.preferredRole}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Preferred Role *</option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.preferredRole && <p className="text-red-500 text-xs mt-1">{errors.preferredRole}</p>}
                </div>
                <div>
                  <textarea
                    name="aboutYourself"
                    placeholder="Tell Us About Yourself * (minimum 50 characters)"
                    rows={6}
                    className={`w-full px-5 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none ${
                      errors.aboutYourself ? 'border-red-500' : 'border-stone-300'
                    }`}
                    value={formData.aboutYourself}
                    onChange={handleChange}
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-stone-500">
                      {formData.aboutYourself.length}/50 characters minimum
                    </p>
                    {errors.aboutYourself && <p className="text-red-500 text-xs">{errors.aboutYourself}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <Send size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Call Details Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCall(null)}
              className="sticky top-4 right-4 float-right w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-stone-100 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-emerald-700 mb-4" size={64} />
                  <h3 className="text-3xl font-bold text-stone-900 mb-3">Application Submitted!</h3>
                  <p className="text-stone-600 mb-6">
                    Thank you for your interest. We&apos;ll review your application and contact you soon.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCall(null);
                      setSubmitted(false);
                    }}
                    className="px-6 py-2 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Image */}
                  <div className="relative h-64 rounded-lg overflow-hidden mb-8">
                    <Image
                      src={selectedCall.designImage.url}
                      alt={selectedCall.title}
                      className="w-full h-full object-cover"
                      layout="fill"
                      width={600}
                      height={750}
                    />
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Details */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold text-stone-900 mb-4">{selectedCall.title}</h2>
                        
                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <Calendar className="text-emerald-700" size={20} />
                            <div>
                              <p className="text-xs text-stone-500">Event Date</p>
                              <p className="font-medium text-stone-900">{selectedCall.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="text-emerald-700" size={20} />
                            <div>
                              <p className="text-xs text-stone-500">Volunteers Needed</p>
                              <p className="font-medium text-stone-900">{selectedCall.numberOfVolunteers}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="text-emerald-700" size={20} />
                            <div>
                              <p className="text-xs text-stone-500">Deadline</p>
                              <p className="font-medium text-stone-900">{formatDate(selectedCall.deadline)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-stone-900 mb-3">About This Opportunity</h3>
                        <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                          {selectedCall.description}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-stone-900 mb-3">Requirements</h3>
                        <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                          {selectedCall.requirements}
                        </p>
                      </div>

                      <div>
                        <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm font-medium">
                          {selectedCall.category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                      </div>
                    </div>

                    {/* Application Form */}
                    <div className="lg:col-span-1">
                      <div className="bg-stone-50 rounded-lg p-6 sticky top-6">
                        <h3 className="text-xl font-semibold text-stone-900 mb-4">Apply Now</h3>
                        
                        {daysUntilDeadline(selectedCall.deadline) > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-yellow-800 text-center">
                              <span className="font-semibold">{daysUntilDeadline(selectedCall.deadline)}</span> {daysUntilDeadline(selectedCall.deadline) === 1 ? 'day' : 'days'} left
                            </p>
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <input
                              type="text"
                              name="fullName"
                              placeholder="Full Name *"
                              className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                                errors.fullName ? 'border-red-500' : 'border-stone-300'
                              }`}
                              value={formData.fullName}
                              onChange={handleChange}
                              required
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                          </div>

                          <div>
                            <input
                              type="email"
                              name="email"
                              placeholder="Email *"
                              className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                                errors.email ? 'border-red-500' : 'border-stone-300'
                              }`}
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                          </div>

                          <div>
                            <input
                              type="tel"
                              name="phoneNumber"
                              placeholder="Phone Number *"
                              className={`w-full px-4 py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                                errors.phoneNumber ? 'border-red-500' : 'border-stone-300'
                              }`}
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              required
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                          </div>

                          <div>
                            <textarea
                              name="message"
                              placeholder="Why do you want to volunteer? (Optional)"
                              rows={3}
                              className="w-full px-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                              value={formData.message}
                              onChange={handleChange}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full px-4 py-3 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin" size={18} />
                                Submitting...
                              </span>
                            ) : (
                              'Submit Application'
                            )}
                          </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-stone-300">
                          <h4 className="text-sm font-semibold text-stone-900 mb-3">Quick Info</h4>
                          <div className="space-y-2 text-sm text-stone-600">
                            <p>✓ Free to participate</p>
                            <p>✓ Make a real impact</p>
                            <p>✓ Meet like-minded people</p>
                            <p>✓ Gain valuable experience</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-24 px-5 md:px-8 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Ready to Inspire Change?
          </h2>
          <p className="text-lg text-emerald-50 leading-relaxed max-w-2xl mx-auto">
            Your passion can help turn agriculture from punishment to purpose in the hearts of Nigerian students.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => scrollTo('#active-opportunities')}
              className="px-6 py-3 bg-white text-emerald-900 rounded font-medium hover:bg-emerald-50 transition-colors shadow-lg"
            >
              View Opportunities
            </button>
            <button
              onClick={() => scrollTo('#apply-section')}
              className="px-6 py-3 bg-transparent text-white rounded font-medium border-2 border-white hover:bg-white/10 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}