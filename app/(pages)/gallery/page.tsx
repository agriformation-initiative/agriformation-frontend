'use client';
import React from 'react';
import { ChevronRight, Calendar, Users } from 'lucide-react';
import Image from 'next/image';

export default function GalleryPage() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="lg:mt-0 mt-12 pt-20 pb-24 px-5 md:px-8 bg-gradient-to-br from-amber-50/40 via-stone-50 to-green-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-3 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium border border-green-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                Photo Gallery
              </div>
              <h1 className="text-[2.75rem] md:text-6xl font-bold text-stone-900 leading-[1.08] tracking-tight">
                Our Journey in <span className="text-green-700 italic font-serif">Pictures</span>
              </h1>
              <p className="text-[1.1rem] text-stone-600 leading-[1.7] font-light max-w-xl">
                Relive the moments of inspiration, learning, and growth from our programs across Nigeria. See the impact of your support in action!
              </p>
              <button
                onClick={() => scrollTo('#gallery')}
                className="px-6 py-3 bg-green-700 text-white rounded font-medium hover:bg-green-900 transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                View Gallery <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
            <div className="lg:col-span-2">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-200">
                <Image
                  src="/images/student.jpg"
                  width={500}
                  height={600}
                  alt="Gallery overview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-20 px-5 md:px-8 bg-white border-y border-stone-200" id="gallery">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Our Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Program Highlights
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              A visual journey through our 2025-2026 programs, capturing the essence of agricultural education transformation.
            </p>
          </div>

          {/* Masonry-style Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[200px]">
            {[
              {
                src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=800&fit=crop',
                caption: 'School Gardens - Hands-on planting session',
                program: 'School Gardens & Agri-Clubs',
                span: 'lg:col-span-2 lg:row-span-2',
              },
              {
                src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
                caption: 'Agri Awareness Week - Student exhibition',
                program: 'Agri Awareness Week',
              },
              {
                src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
                caption: 'Excursion - Visiting a modern farm',
                program: 'Farm Excursions',
              },
              {
                src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=800&fit=crop',
                caption: 'Summer Internship - Fieldwork experience',
                program: 'Summer Internships',
                span: 'lg:row-span-2',
              },
              {
                src: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop',
                caption: 'School Gardens - Harvest celebration',
                program: 'School Gardens',
              },
              {
                src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
                caption: 'Agri Awareness Week - Teacher training',
                program: 'Teacher Training',
              },
              {
                src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
                caption: 'Excursion - Youth workshop session',
                program: 'Youth Workshops',
              },
              {
                src: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&h=800&fit=crop',
                caption: 'Summer Internship - Mentorship moment',
                program: 'Mentorship',
                span: 'lg:col-span-2',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer overflow-hidden rounded-sm border border-stone-200 hover:shadow-md transition-shadow ${item.span || ''}`}
              >
                <div className="h-full bg-stone-200">
                  <Image
                    src={item.src}
                    alt={item.caption}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 text-white">
                  <span className="text-xs font-medium uppercase tracking-wider text-green-300 mb-1">
                    {item.program}
                  </span>
                  <p className="text-sm font-semibold leading-tight">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2024 Excursion Highlight */}
      <section className="py-24 px-5 md:px-8 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <Calendar size={16} />
              Past Event
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              2024 Farm Excursion
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              On June 28, 2024, Agriformation Initiative sponsored 83 SS1-SS2 students from Government Girls&apos; Secondary School Rumuokuta, Rivers State, on an excursion to Ibiteinye Integrated Farms, Elelewon.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[200px]">
            {[
              { src: '/images/ex.jpg', caption: 'Poultry unit tour' },
              { src: '/images/group.jpg', caption: 'Aquaculture exploration' },
              { src: '/images/excursion.jpg', caption: 'Agro-processing demo' },
              { src: '/images/excursion1.jpg', caption: 'Agro-processing demo' },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative rounded-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-200"
              >
                <div className="aspect-[4/3] bg-stone-200">
                  <Image
                    src={item.src}
                    width={500}
                    height={500}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/90 to-transparent p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="font-medium text-sm">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-24 px-5 md:px-8 bg-gradient-to-br from-green-50/50 via-stone-50 to-amber-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <Users size={16} />
              Student Voices
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              What Students Said
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I never knew agriculture could be this modern. I saw computers controlling greenhouses!",
                student: "Student, SS2",
                emoji: "amazed",
              },
              {
                quote: "This trip changed my mind about farming. I want to study Agribusiness now.",
                student: "Student, SS1",
                emoji: "lightbulb",
              },
              {
                quote: "Agriculture is not about punishment anymore. It's about innovation and technology.",
                student: "Student, SS2",
                emoji: "rocket",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 relative overflow-hidden"
              >
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-700 rounded-sm flex items-center justify-center text-3xl shadow-lg transform rotate-12">
                  {testimonial.emoji}
                </div>
                <p className="text-stone-700 text-base leading-relaxed mb-5 mt-6 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="text-green-700 font-semibold text-sm">
                  — {testimonial.student}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}