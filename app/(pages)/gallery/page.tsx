import type { Metadata } from 'next';
import { ImageOff } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import MediaCard from '@/components/shared/MediaCard';
import FilterChips from '@/components/shared/FilterChips';
import { apiGet } from '@/lib/api-server';
import { formatDate, titleCase } from '@/lib/format';
import type { Gallery } from '@/types/indexes';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from AgroNext farm excursions, workshops, training sessions and community events.',
};

const CATEGORIES = [
  { value: 'all', label: 'All albums' },
  { value: 'farm_excursion', label: 'Farm excursions' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'community_event', label: 'Community events' },
  { value: 'training', label: 'Training' },
  { value: 'blog_post', label: 'From the blog' },
  { value: 'other', label: 'Other' },
];

const QUOTES = [
  { quote: 'I never knew agriculture could be this modern. I saw computers controlling greenhouses.', who: 'Student, SS2' },
  { quote: 'This trip changed my mind about farming. I want to study Agribusiness now.', who: 'Student, SS1' },
  { quote: "Agriculture is not about punishment anymore. It's about innovation and technology.", who: 'Student, SS2' },
];

function AlbumCard({ g }: { g: Gallery }) {
  return (
    <MediaCard
      href={`/gallery/${g._id}`}
      image={g.coverImage?.url}
      imageAlt={`Cover photo for ${g.title}`}
      eyebrow={`${titleCase(g.category)} · ${formatDate(g.eventDate, 'short')}`}
      title={g.title}
      description={g.description}
      footer={
        <span>
          {g.photoCount} {g.photoCount === 1 ? 'photo' : 'photos'}
          {g.location ? ` · ${g.location}` : ''}
        </span>
      }
    />
  );
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = 'all' } = await searchParams;
  const active = CATEGORIES.some((c) => c.value === category) ? category : 'all';

  const [featured, all] = await Promise.all([
    apiGet<{ galleries: Gallery[] }>('/galleries/public/featured'),
    apiGet<{ galleries: Gallery[] }>(`/galleries/public${active !== 'all' ? `?category=${active}` : ''}`),
  ]);
  const featuredList = featured?.galleries.slice(0, 3) ?? [];
  const albums = all?.galleries ?? [];

  return (
    <>
      <PageHero
        eyebrow="Photo gallery"
        title="Our journey in pictures"
        description="Moments of curiosity, learning and growth from our programs across Nigeria."
      />

      {active === 'all' && featuredList.length > 0 && (
        <section className="bg-white px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="Featured" title="Recent highlights" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredList.map((g) => <AlbumCard key={g._id} g={g} />)}
            </div>
          </div>
        </section>
      )}

      <section id="albums" className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="All albums" title="Explore our albums" />
          <div className="mt-8">
            <FilterChips basePath="/gallery" param="category" options={CATEGORIES} active={active} label="Filter albums by category" />
          </div>

          {all === null ? (
            <p role="alert" className="mt-12 rounded-xl bg-white p-10 text-center text-stone-700">
              We could not load the albums just now. Please refresh the page in a moment.
            </p>
          ) : albums.length === 0 ? (
            <div className="mt-12 rounded-xl bg-white p-10 text-center">
              <ImageOff className="mx-auto text-stone-400" size={40} aria-hidden="true" />
              <p className="mt-4 text-lg text-stone-700">No albums in this category yet.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((g) => <AlbumCard key={g._id} g={g} />)}
            </div>
          )}
        </div>
      </section>

      <section className="bg-brand-50 px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Student voices" title="What students said" />
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {QUOTES.map((q) => (
              <li key={q.quote}>
                <blockquote>
                  <p className="font-display text-xl leading-snug text-brand-900">&ldquo;{q.quote}&rdquo;</p>
                  <footer className="mt-3 text-sm font-medium text-stone-600">{q.who}</footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
