'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, ArrowLeft, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { galleryService } from '@/services/galleryService';
import { Gallery } from '@/types/indexes';

export default function GalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchGallery(params.id as string);
    }
  }, [params.id]);

  const fetchGallery = async (id: string) => {
    try {
      setLoading(true);
      const response = await galleryService.getGalleryById(id);
      setGallery(response.data.gallery);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = () => {
    if (gallery) {
      setCurrentPhotoIndex((prev) => (prev + 1) % gallery.photos.length);
    }
  };

  const prevPhoto = () => {
    if (gallery) {
      setCurrentPhotoIndex((prev) => (prev - 1 + gallery.photos.length) % gallery.photos.length);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, gallery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-12 h-12 animate-spin text-green-700" />
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-5">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Gallery not found</h2>
        <button
          onClick={() => router.push('/gallery')}
          className="px-6 py-3 bg-green-700 text-white rounded font-medium hover:bg-green-900 transition-colors"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <section className="lg:mt-0 mt-12 pt-20 pb-12 px-5 md:px-8 bg-gradient-to-br from-green-50/50 via-stone-50 to-amber-50/30 border-b border-stone-200">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/gallery')}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-green-700 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Gallery</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium border border-green-900/10">
                {gallery.category.replace('_', ' ')}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight tracking-tight">
                {gallery.title}
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed">
                {gallery.description}
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-green-700" />
                  <span>{formatDate(gallery.eventDate)}</span>
                </div>
                {gallery.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-green-700" />
                    <span>{gallery.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-700">{gallery.photoCount}</span>
                  <span>{gallery.photoCount === 1 ? 'photo' : 'photos'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-16 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          {gallery.photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.photos.map((photo, index) => (
                <div
                  key={photo._id}
                  onClick={() => openLightbox(index)}
                  className="group cursor-pointer relative aspect-[4/3] rounded-sm overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-200"
                >
                  <Image
                    src={photo.url}
                    width={600}
                    height={450}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {photo.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm font-medium">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">No photos in this gallery yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && gallery.photos.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevPhoto}
            className="absolute left-5 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextPhoto}
            className="absolute right-5 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Image */}
          <div className="max-w-6xl max-h-[90vh] mx-auto px-5">
            <div className="relative">
              <Image
                src={gallery.photos[currentPhotoIndex].url}
                width={1200}
                height={900}
                alt={gallery.photos[currentPhotoIndex].caption || `Photo ${currentPhotoIndex + 1}`}
                className="max-h-[85vh] w-auto object-contain mx-auto"
              />
              {gallery.photos[currentPhotoIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white text-center text-lg font-medium">
                    {gallery.photos[currentPhotoIndex].caption}
                  </p>
                </div>
              )}
            </div>
            <p className="text-white/70 text-center mt-4 text-sm">
              {currentPhotoIndex + 1} / {gallery.photos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}