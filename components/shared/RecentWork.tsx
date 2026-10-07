import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import MediaCard from '@/components/shared/MediaCard';
import { apiGet } from '@/lib/api-server';
import { formatDate, titleCase } from '@/lib/format';
import type { BlogPostSummary, Gallery } from '@/types/indexes';

/**
 * What we have been doing lately, taken from the newest published gallery albums and blog posts.
 * Publishing in the admin is all it takes to keep this current. Renders nothing when there is nothing yet.
 */
export default async function RecentWork({ heading = 'Recent work' }: { heading?: string }) {
  const [albums, posts] = await Promise.all([
    apiGet<{ galleries: Gallery[] }>('/galleries/public?limit=3', 60),
    apiGet<{ posts: BlogPostSummary[] }>('/blog?limit=3', 60),
  ]);
  const albumList = albums?.galleries ?? [];
  const postList = posts?.posts ?? [];
  if (albumList.length === 0 && postList.length === 0) return null;

  return (
    <section className="px-5 py-20 md:px-8 md:py-24" aria-labelledby="recent-work">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div id="recent-work">
            <SectionHeader eyebrow="Out in the field" title={heading} description="The latest from our work with schools and communities." />
          </div>
          <Link href="/gallery" className="group inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 hover:text-brand-900">
            See the full gallery
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {albumList.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {albumList.map((g) => (
              <MediaCard
                key={g._id}
                href={`/gallery/${g._id}`}
                image={g.coverImage?.url}
                imageAlt={`Cover photo for ${g.title}`}
                eyebrow={`${titleCase(g.category)} · ${formatDate(g.eventDate, 'short')}`}
                title={g.title}
                description={g.description}
                footer={<span>{g.photoCount} {g.photoCount === 1 ? 'photo' : 'photos'}{g.location ? ` · ${g.location}` : ''}</span>}
              />
            ))}
          </div>
        )}

        {postList.length > 0 && (
          <>
            <h3 className="mt-14 text-2xl font-semibold">From the blog</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {postList.map((post) => (
                <MediaCard
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  image={post.coverImage?.url}
                  imageAlt={`Cover image for ${post.title}`}
                  eyebrow={titleCase(post.category)}
                  title={post.title}
                  description={post.excerpt}
                  footer={<span>{formatDate(post.publishedAt, 'short')} · {post.readTime} min read</span>}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
