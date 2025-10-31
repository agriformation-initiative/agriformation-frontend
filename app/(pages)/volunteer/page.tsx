'use client';
import React from 'react';
import Image from 'next/image';
import { ChevronRight, Send, Users, Leaf, Camera, Handshake, Award } from 'lucide-react';

export default function VolunteerPage() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              <button
                onClick={() => scrollTo('#volunteer-opportunities')}
                className="px-6 py-3 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                Get Involved <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1567497063796-7952e455a2a6?w=600&h=750&fit=crop"
                  alt="Volunteers working with students"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20 px-5 md:px-8 bg-white border-y border-stone-200" id="volunteer-opportunities">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Opportunities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Volunteer Roles
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
                className="p-8 bg-stone-50 border border-stone-200 rounded hover:shadow-md transition-shadow flex items-start gap-4"
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
      <section className="py-24 px-5 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Your Gain
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Benefits of Volunteering
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Gain valuable experience and skills while making a lasting impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Award size={32} />,
                title: 'Hands-on Experience',
                description: 'Access training and mentorship from agricultural experts.',
              },
              {
                icon: <Leaf size={32} />,
                title: 'Skill Development',
                description: 'Build your leadership and project management skills.',
              },
              {
                icon: <Users size={32} />,
                title: 'Networking',
                description: 'Connect with changemakers in agriculture and development.',
              },
              {
                icon: <Award size={32} />,
                title: 'Recognition',
                description: 'Receive certificates of service and recognition.',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="p-8 bg-white border border-stone-200 rounded hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-800 text-white rounded flex items-center justify-center">
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

      {/* Apply Form Section */}
      <section className="py-24 px-5 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Take Action
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Apply to Volunteer
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Fill out the form below to start your journey with us.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl border border-stone-200">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-emerald-700 transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-emerald-700 transition-colors"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Preferred Role"
                className="w-full px-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-emerald-700 transition-colors"
                required
              />
              <textarea
                placeholder="Tell Us About Yourself"
                rows={5}
                className="w-full px-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-emerald-700 transition-colors resize-none"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Apply Now <Send size={18} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      </section>

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
              onClick={() => scrollTo('#volunteer-opportunities')}
              className="px-6 py-3 bg-white text-emerald-900 rounded font-medium hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Explore Roles
            </button>
            <button
              onClick={() => scrollTo('#apply-form')}
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