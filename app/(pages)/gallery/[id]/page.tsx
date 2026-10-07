import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import PhotoGrid from './PhotoGrid';
import { apiGet } from '@/lib/api-server';
import { formatDate, titleCase } from '@/lib/format';
import type { Gallery } from '@/types/indexes';

type Params = { params: Promise<{ id: string }> };

const getGallery = async (id: string) => (await apiGet<{ gallery: Gallery }>(`/galleries/public/${id}`))?.gallery ?? null;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const gallery = await getGallery((await params).id);
  return gallery
    ? { title: gallery.title, description: gallery.description }
    : { title: 'Album not found' };
}

export default async function GalleryDetailPage({ params }: Params) {
  const gallery = await getGallery((await params).id);
  if (!gallery) notFound();

  return (
    <>
      <section className="bg-brand-50 px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/gallery"
            className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800"
          >
            <ArrowLeft size={18} aria-hidden="true" /> All albums
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-700">
            {titleCase(gallery.category)}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold md:text-5xl">{gallery.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-stone-700">{gallery.description}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-stone-700">
            <li className="flex items-center gap-2">
              <Calendar size={16} className="text-brand-700" aria-hidden="true" />
              {formatDate(gallery.eventDate)}
            </li>
            {gallery.location && (
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-700" aria-hidden="true" />
                {gallery.location}
              </li>
            )}
            <li>
              {gallery.photos.length} {gallery.photos.length === 1 ? 'photo' : 'photos'}
            </li>
          </ul>
        </div>
      </section>

      <section className="px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          {gallery.photos.length > 0 ? (
            <PhotoGrid photos={gallery.photos} title={gallery.title} />
          ) : (
            <p className="rounded-xl bg-white p-10 text-center text-lg text-stone-700">
              There are no photos in this album yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
