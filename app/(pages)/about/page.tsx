'use client';
import React from 'react';
import { ArrowRight, Target, Rocket, Star, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="pt-20 mt-16 pb-24 px-5 md:px-8 bg-gradient-to-br from-amber-50/40 via-stone-50 to-emerald-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-700 rounded text-sm font-medium mb-6 border border-green-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-700"></span>
              Who We Are
            </div>
            <h1 className="text-[2.75rem] md:text-6xl font-bold text-stone-900 leading-[1.08] tracking-tight">
              About <span className="text-green-700 italic font-serif">Agriformation</span>
            </h1>
            <p className="text-[1.1rem] text-stone-600 leading-[1.7] font-light max-w-2xl mx-auto mt-6">
              A social enterprise dedicated to transforming agricultural education in Nigeria through practical learning and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-5 md:px-8 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-200">
                <Image
                  src="/images/student.jpg" 
                  width={500}
                  height={700}
                  alt="Founder teaching students"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  Origin Story
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
                  How It All Started
                </h2>
              </div>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Agriformation was born from a transformative experience. During her National Youth Service Corps (NYSC), our Founder, <strong>Ovieyi Chinedu-Obioha</strong>, taught Agricultural Science at Government Girls&apos; Secondary School Rumuokuta in Rivers State.
                </p>
                <p>
                  She observed that over <strong>98% of students dropped agriculture by SS2</strong>, associating it with punishment and labor. Determined to shift this mindset, Ovieyi organized an excursion for 83 students to <em>Ibiteinye Inye Integrated Farms</em>.
                </p>
                <p>
                  There, students explored poultry, aquaculture, greenhouses, orchards, and agro-processing machinery — realizing agriculture&apos;s potential as a career of <strong>innovation and dignity</strong>. This experience sparked the creation of Agriformation Initiative.
                </p>
              </div>
              <Link
                href="/gallery"
                className="text-green-800 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all group"
              >
                See the 2024 Excursion 
                <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-24 px-5 md:px-8 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-5">
              <div className="w-14 h-14 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold">Vision</h3>
              <p className="text-emerald-50 leading-relaxed">
                To reimagine agricultural education in Nigeria by raising a generation who see agriculture as innovation, sustainability, and national development.
              </p>
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Rocket size={28} />
              </div>
              <h3 className="text-2xl font-bold">Mission</h3>
              <p className="text-emerald-50 leading-relaxed">
                To transform how agriculture is taught through practical learning, partnerships, mentorship, and community engagement.
              </p>
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Star size={28} />
              </div>
              <h3 className="text-2xl font-bold">Core Values</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {['Innovation', 'Collaboration', 'Dignity', 'Sustainability', 'Excellence'].map((value) => (
                  <div
                    key={value}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-3 py-2 text-emerald-50 font-medium"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-5 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <User size={16} />
              Leadership
            </div>
            <h2 className="text-4xl md:text-5xl font-bold textopause-stone-900 mb-5 leading-tight tracking-tight">
              Meet Our Founder
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Leading the transformation of agricultural education
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-xl border border-stone-200 overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2">
                <div className="aspect-[3/4] md:h-full overflow-hidden bg-stone-200">
                  <Image
                    src="/images/ovieyi.jpg"
                    width={500}
                    height={700}
                    alt="Ovieyi Chinedu-Obioha"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-3 p-8 md:p-12 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-stone-900">Ovieyi Chinedu-Obioha</h3>
                  <p className="text-green-700 font-bold text-lg mt-1">
                    Founder & Lead Program Manager
                  </p>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  With a background in <strong>Agricultural Economics</strong> and over three years in grassroots development, Ovieyi is passionate about transforming agricultural education. Her experience teaching during NYSC revealed critical gaps, inspiring her to organize a farm excursion that reshaped students&apos; perceptions of agriculture.
                </p>
                <div className="border-l-4 border-green-700 pl-6 py-4 bg-green-50/50 rounded-r">
                  <p className="text-stone-800 italic font-medium leading-relaxed">
                    “If we don’t inspire today’s students to see agriculture differently, Nigeria risks a food crisis tomorrow. But if we act now, we can raise a generation of innovators who will feed the nation.”
                  </p>
                </div>
              </div>
            </div>
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
            Ready to Join the Movement?
          </h2>
          <p className="text-lg text-emerald-50 leading-relaxed max-w-2xl mx-auto">
            Discover our programs, partner with us, or volunteer to help reshape how Nigeria’s next generation sees agriculture.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/programs"
              className="px-6 py-3 bg-white text-emerald-900 rounded font-medium hover:bg-emerald-50 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              Explore Programs <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-transparent text-white rounded font-medium border-2 border-white hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}