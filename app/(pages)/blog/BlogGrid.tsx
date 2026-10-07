'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import MediaCard from '@/components/shared/MediaCard';
import { formatDate, titleCase } from '@/lib/format';
import type { BlogPostSummary } from '@/types/indexes';

export default function BlogGrid({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = q
    ? posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    : posts;

  return (
    <>
      <div className="relative max-w-md">
        <label htmlFor="blog-search" className="sr-only">Search posts</label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={18} aria-hidden="true" />
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts"
          className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-4 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/25"
        />
      </div>

      {shown.length === 0 ? (
        <div className="mt-10 rounded-xl bg-white p-10 text-center">
          <p className="text-lg text-stone-700">No posts match your search.</p>
          <button type="button" onClick={() => setQuery('')} className="mt-3 min-h-11 font-semibold text-brand-700 hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((post) => (
            <MediaCard
              key={post._id}
              href={`/blog/${post.slug}`}
              image={post.coverImage?.url}
              imageAlt={`Cover image for ${post.title}`}
              eyebrow={titleCase(post.category)}
              title={post.title}
              description={post.excerpt}
              footer={
                <span>
                  {formatDate(post.publishedAt, 'short')} · {post.readTime} min read
                  {post.author?.fullName ? ` · ${post.author.fullName}` : ''}
                </span>
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
