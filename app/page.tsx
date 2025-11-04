'use client';
import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-5 md:px-8 bg-gradient-to-br from-amber-50/40 via-stone-50 to-emerald-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-6 pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-700"></span>
                Transforming Agricultural Education in Nigeria
              </div>
              <h1 className="text-[2.75rem] md:text-6xl font-bold text-stone-900 leading-[1.08] mb-6 tracking-tight">
                Make Agriculture <span className="text-green-700 italic font-serif">Innovation</span>
              </h1>
              <p className="text-[1.1rem] text-stone-600 mb-9 leading-[1.7] font-light">
                We bridge the gap between theory and practice, showing Nigerian students that agriculture is a field of dignity, opportunity, and national development.
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Link href='/programs'
                  className="px-6 py-3 bg-green-700 text-white rounded font-medium hover:bg-emerald-900 transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  Explore Programs <ChevronRight size={18} strokeWidth={2.5} />
                </Link>
                <Link href='/volunteer'
                  className="px-6 py-3 bg-stone-100 text-stone-800 rounded font-medium hover:bg-stone-200 transition-colors border border-stone-300"
                >
                  Partner With Us
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative mt-8 lg:mt-0">
              <div className="relative">
                <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-200">
                  <Image 
                    src="/images/excursion1.jpg" 
                    width={500}
                    height={500}
                    alt="Students learning agriculture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-sm overflow-hidden shadow-xl border-4 border-white">
                  <Image
                    width={500}
                    height={500} 
                    src="https://images.unsplash.com/photo-1727099079513-952d40de9d78?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGlubm92YXRpdmUlMjBmYXJtaW5nJTIwaW4lMjBuaWdlcmlhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" 
                    alt="Students in garden"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-4 -left-4 w-36 h-36 rounded-sm overflow-hidden shadow-lg border-4 border-white">
                  <Image width={500} height={500}
                    src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=600&fit=crop" 
                    alt="Modern farming"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-5 md:px-8 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-12 md:gap-16">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-green-700 tracking-tight">83</div>
              <p className="text-stone-900 font-semibold text-[1.05rem]">Students Impacted</p>
              <p className="text-sm text-stone-500 leading-relaxed">Farm excursion participants during the 2024 pilot program</p>
            </div>
            <div className="space-y-2 sm:border-l sm:border-stone-200 sm:pl-12 md:pl-16">
              <div className="text-5xl font-bold text-green-700 tracking-tight">10</div>
              <p className="text-stone-900 font-semibold text-[1.05rem]">School Gardens</p>
              <p className="text-sm text-stone-500 leading-relaxed">Demonstration plots planned for 2025-2026 cycle</p>
            </div>
            <div className="space-y-2 sm:border-l sm:border-stone-200 sm:pl-12 md:pl-16">
              <div className="text-5xl font-bold text-green-700 tracking-tight">500+</div>
              <p className="text-stone-900 font-semibold text-[1.05rem]">Youth to Train</p>
              <p className="text-sm text-stone-500 leading-relaxed">Students for agricultural workshop program</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Preview */}
      <section className="py-24 px-5 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-4">Origin Story</div>
                <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">How It All Started</h2>
              </div>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  During NYSC service year, our founder taught Agricultural Science at Government Girls&apos; Secondary School Rumuokuta. By SS2, over 98% of students dropped agriculture because they saw it as punishment.
                </p>
                <p>
                  Determined to change this mindset, she organized an excursion for 83 students to see modern agriculture in action at Ibiteinye Inye Integrated Farms. The transformation was immediate—students realized agriculture could be a career of dignity and innovation.
                </p>
              </div>
              <Link href='/about'
                className="text-green-700 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all group pt-2"
              >
                Read Our Full Story 
                <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[5/4] rounded-sm overflow-hidden shadow-2xl shadow-stone-900/15 border border-stone-200">
                <Image width={500} height={500}
                  src="https://images.unsplash.com/photo-1665586510291-ae722d1d1f00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlnZXJpYSUyMHNlY29uZGFyeSUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" 
                  alt="Students at farm"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-24 px-5 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-4">2025-2026 Program Cycle</div>
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">Strategic Programs</h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                Four comprehensive initiatives designed to transform how agriculture is taught and experienced in Nigerian schools
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: '🌱',
                title: 'School Gardens & Agri-Clubs',
                description: 'Establishing demonstration gardens in 10 schools with diverse crops, running Agri-Clubs with hands-on activities, mini-lectures, and competitions.',
                timeline: 'Sept–Dec 2025',
                color: 'emerald'
              },
              {
                icon: '🎓',
                title: 'Teacher Training & Awareness',
                description: 'Training teachers as Agri-Champions, hosting Agri Awareness Week with debates and exhibitions, engaging parents and community as allies.',
                timeline: 'Jan–Apr 2026',
                color: 'amber'
              },
              {
                icon: '🚌',
                title: 'Farm Excursions & Workshops',
                description: 'Taking 500 students to modern farms, teaching agri-business skills, sustainability practices, and connecting classroom to real-world agriculture.',
                timeline: 'Apr–Jul 2026',
                color: 'teal'
              },
              {
                icon: '🤝',
                title: 'Summer Internship Linkages',
                description: 'Matching students with farms and agribusinesses for practical experience, mentorship, and exposure to agricultural technology and entrepreneurship.',
                timeline: 'Aug 2026',
                color: 'green'
              }
            ].map((program, index) => (
              <div key={index} className="grid md:grid-cols-12 gap-6 md:gap-8 items-start p-8 border border-stone-200 rounded hover:shadow-md transition-shadow bg-stone-50/50">
                <div className="md:col-span-1">
                  <div className="text-4xl">{program.icon}</div>
                </div>
                <div className="md:col-span-7 space-y-2">
                  <h3 className="text-2xl font-bold text-stone-900">{program.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{program.description}</p>
                </div>
                <div className="md:col-span-4 md:text-right">
                  <span className="inline-block px-3 py-1.5 bg-emerald-900/5 text-green-700 text-sm font-medium border border-emerald-900/10 rounded">
                    {program.timeline}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link href='/programs'
              className="px-6 py-3 bg-green-700 text-white rounded font-medium hover:bg-green-900 transition-colors shadow-sm"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="mt-24 bg-green-900 text-white rounded-sm p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-5 leading-tight tracking-tight">Want to Support Our Programs?</h3>
              <p className="text-lg text-emerald-50 mb-8 leading-relaxed">
                Partner with us to bring these transformative programs to more schools across Nigeria
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Link href='/volunteer'
                  className="px-6 py-3 bg-white text-emerald-900 rounded font-medium hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Volunteer
                </Link>
                <Link href='/partner'
                  className="px-6 py-3 bg-transparent text-white rounded font-medium border-2 border-white hover:bg-white/10 transition-colors"
                >
                  Become a Partner
                </Link>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}