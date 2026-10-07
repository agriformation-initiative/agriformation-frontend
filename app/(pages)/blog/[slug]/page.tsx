import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { apiGet } from '@/lib/api-server';
import { formatDate, titleCase } from '@/lib/format';
import type { BlogPostFull, BlogPostSummary } from '@/types/indexes';

type Params = { params: Promise<{ slug: string }> };
type PostData = { post: BlogPostFull; related: BlogPostSummary[] };

const getPost = (slug: string) => apiGet<PostData>(`/blog/${encodeURIComponent(slug)}`);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await getPost((await params).slug);
  if (!data) return { title: 'Post not found' };
  return {
    title: data.post.title,
    description: data.post.excerpt,
    openGraph: { images: [data.post.coverImage.url] },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const data = await getPost((await params).slug);
  if (!data) notFound();
  const { post, related } = data;

  return (
    <div className="px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800"
        >
          <ArrowLeft size={18} aria-hidden="true" /> All posts
        </Link>

        <div className="mt-4 grid gap-12 lg:grid-cols-3">
          <article className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">{titleCase(post.category)}</p>
            <h1 className="mt-3 text-3xl font-semibold md:text-5xl">{post.title}</h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-stone-600">
              {post.author?.fullName && <span className="font-medium text-stone-800">{post.author.fullName}</span>}
              <span className="flex items-center gap-1.5">
                <Calendar size={15} aria-hidden="true" /> {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} aria-hidden="true" /> {post.readTime} min read
              </span>
            </p>

            <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-stone-200">
              <Image
                src={post.coverImage.url}
                alt={`Cover image for ${post.title}`}
                fill
                priority
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>

            {/* Admin-authored HTML, styled by .blog-content */}
            <div className="blog-content mt-10" dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.tags && post.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2 border-t border-stone-200 pt-6">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </article>

          {related.length > 0 && (
            <aside aria-label="Related posts">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-widest text-stone-600">Related posts</h2>
              <ul className="mt-4 space-y-5">
                {related.map((r) => (
                  <li key={r._id}>
                    <Link href={`/blog/${r.slug}`} className="group flex gap-4">
                      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-stone-200">
                        <Image src={r.coverImage.url} alt="" fill sizes="80px" className="object-cover" />
                      </span>
                      <span>
                        <span className="line-clamp-2 font-medium text-stone-900 group-hover:text-brand-800">{r.title}</span>
                        <span className="mt-1 block text-sm text-stone-600">{r.readTime} min read</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
