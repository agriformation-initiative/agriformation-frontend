import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import FilterChips from '@/components/shared/FilterChips';
import BlogGrid from './BlogGrid';
import { apiGet } from '@/lib/api-server';
import type { BlogPostSummary } from '@/types/indexes';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Updates, insights and stories from AgroNext agricultural education work across Nigeria.',
};

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'events', label: 'Events' },
  { value: 'community', label: 'Community' },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = 'all' } = await searchParams;
  const active = CATEGORIES.some((c) => c.value === category) ? category : 'all';
  const data = await apiGet<{ posts: BlogPostSummary[] }>(
    `/blog?limit=18${active !== 'all' ? `&category=${active}` : ''}`
  );

  return (
    <>
      <PageHero
        eyebrow="Our blog"
        title="Stories from the field"
        description="Updates, insights and stories from our work in agricultural education across Nigeria."
      />
      <section className="px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <FilterChips basePath="/blog" param="category" options={CATEGORIES} active={active} label="Filter posts by category" />
          <div className="mt-6">
            {data === null ? (
              <p role="alert" className="rounded-xl bg-white p-10 text-center text-stone-700">
                We could not load the posts just now. Please refresh the page in a moment.
              </p>
            ) : data.posts.length === 0 ? (
              <p className="rounded-xl bg-white p-10 text-center text-lg text-stone-700">
                No posts in this category yet.
              </p>
            ) : (
              <BlogGrid posts={data.posts} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
