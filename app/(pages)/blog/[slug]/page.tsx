'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye, Loader2 } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: { url: string };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  viewCount: number;
  author: { fullName: string };
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: { url: string };
  publishedAt: string;
  readTime: number;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        if (data.success) {
          setPost(data.data.post);
          setRelated(data.data.related || []);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [slug]);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={40} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <p className="text-stone-600 text-lg">This post could not be found.</p>
        <Link href="/blog" className="text-emerald-700 font-medium hover:underline">Browse all posts</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Back nav */}
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-emerald-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to blog
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Article */}
          <article className="lg:col-span-2">
            {/* Category */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded text-xs font-medium uppercase tracking-wide">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mb-6 pb-6 border-b border-stone-200">
              <span className="font-medium text-stone-700">{post.author?.fullName}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {post.viewCount} views</span>
            </div>

            {/* Cover image */}
            <div className="relative h-72 md:h-96 rounded overflow-hidden border border-stone-200 mb-8">
              <Image src={post.coverImage.url} alt={post.title} fill className="object-cover" />
            </div>

            {/* Content */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-stone-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Author card */}
            <div className="bg-white border border-stone-200 rounded p-5">
              <div className="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-lg mb-3">
                {post.author?.fullName?.charAt(0)}
              </div>
              <p className="font-semibold text-stone-900">{post.author?.fullName}</p>
              <p className="text-xs text-stone-500 mt-1">Agriformation Team</p>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r._id} href={`/blog/${r.slug}`} className="flex gap-3 group">
                      <div className="relative w-16 h-14 flex-shrink-0 rounded overflow-hidden bg-stone-100">
                        <Image src={r.coverImage.url} alt={r.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                          {r.title}
                        </p>
                        <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                          <Clock size={11} /> {r.readTime} min
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to blog */}
            <Link
              href="/blog"
              className="block w-full text-center px-4 py-2.5 border border-stone-300 text-stone-700 rounded text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              ← All Posts
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
