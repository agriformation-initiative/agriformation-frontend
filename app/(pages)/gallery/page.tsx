'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight, Calendar, Users, Loader2, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import { galleryService } from '@/services/galleryService';
import { Gallery } from '@/types/indexes';
import { useRouter } from 'next/navigation';

export default function GalleryPage() {
  const router = useRouter();
  const [featuredGalleries, setFeaturedGalleries] = useState<Gallery[]>([]);
  const [allGalleries, setAllGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Programs' },
    { value: 'farm_excursion', label: 'Farm Excursions' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'community_event', label: 'Community Events' },
    { value: 'training', label: 'Training Sessions' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchGalleries();
  }, [selectedCategory]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      
      // Fetch featured galleries
      const featuredRes = await galleryService.getFeaturedGalleries();
      setFeaturedGalleries(featuredRes.data.galleries);

      // Fetch all galleries with optional category filter
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const allRes = await galleryService.getPublishedGalleries(params);
      setAllGalleries(allRes.data.items);
    } catch (error) {
      console.error('Error fetching galleries:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

      {/* Featured Galleries */}
      {featuredGalleries.length > 0 && (
        <section className="py-20 px-5 md:px-8 bg-white border-y border-stone-200">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                Featured
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
                Recent Highlights
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGalleries.slice(0, 3).map((gallery) => (
                <div
                  key={gallery._id}
                  onClick={() => router.push(`/gallery/${gallery._id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-200 mb-4">
                    <Image
                      src={gallery.coverImage?.url || '/images/placeholder.jpg'}
                      width={600}
                      height={450}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-green-700 font-medium">
                      <Calendar size={14} />
                      <span>{formatDate(gallery.eventDate)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-green-700 transition-colors">
                      {gallery.title}
                    </h3>
                    <p className="text-sm text-stone-600 line-clamp-2">
                      {gallery.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span>{gallery.photoCount} photos</span>
                      {gallery.location && <span>• {gallery.location}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Gallery Section */}
      <section className="py-20 px-5 md:px-8 bg-stone-50" id="gallery">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <FolderOpen size={16} />
              All Albums
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Explore Our Albums
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              Browse through our collection of program highlights and memorable moments.
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-green-700 text-white shadow-md'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-green-700 hover:text-green-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
          ) : allGalleries.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allGalleries.map((gallery) => (
                <div
                  key={gallery._id}
                  onClick={() => router.push(`/gallery/${gallery._id}`)}
                  className="group cursor-pointer bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-200"
                >
                  <div className="aspect-video overflow-hidden bg-stone-200">
                    <Image
                      src={gallery.coverImage?.url || '/images/placeholder.jpg'}
                      width={600}
                      height={400}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-medium border border-green-100">
                        {gallery.category.replace('_', ' ')}
                      </span>
                      <span className="text-stone-500">{formatDate(gallery.eventDate)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-green-700 transition-colors line-clamp-2">
                      {gallery.title}
                    </h3>
                    <p className="text-sm text-stone-600 line-clamp-2">
                      {gallery.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <span className="text-xs text-stone-500">
                        {gallery.photoCount} {gallery.photoCount === 1 ? 'photo' : 'photos'}
                      </span>
                      {gallery.location && (
                        <span className="text-xs text-stone-500 truncate max-w-[150px]">
                          {gallery.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FolderOpen className="w-16 h-16 mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500 text-lg">No galleries found in this category.</p>
            </div>
          )}
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
                emoji: "🤩",
              },
              {
                quote: "This trip changed my mind about farming. I want to study Agribusiness now.",
                student: "Student, SS1",
                emoji: "💡",
              },
              {
                quote: "Agriculture is not about punishment anymore. It's about innovation and technology.",
                student: "Student, SS2",
                emoji: "🚀",
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