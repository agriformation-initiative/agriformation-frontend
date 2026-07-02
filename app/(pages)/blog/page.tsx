'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Clock, Calendar, Loader2 } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: { url: string };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  viewCount: number;
  author: { fullName: string };
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'events', label: 'Events' },
  { value: 'community', label: 'Community' },
];

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/blog?limit=18`;
      if (category !== 'all') url += `&category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setPosts(data.data.posts);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/5 text-emerald-800 rounded text-sm font-medium mb-6 border border-emerald-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Our Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight tracking-tight mb-4">
              Stories from the Field
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Updates, insights, and stories from our work in agricultural education across Nigeria.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        {/* Search + Category Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  category === c.value
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-stone-300 text-stone-700 hover:border-emerald-500'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-emerald-700" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded p-12 text-center">
            <p className="text-stone-500 text-lg">No posts found</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-3 text-emerald-700 text-sm font-medium hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <article
                key={post._id}
                onClick={() => router.push(`/blog/${post.slug}`)}
                className="bg-white border border-stone-200 rounded overflow-hidden hover:shadow-md hover:border-stone-300 transition-all cursor-pointer group"
              >
                {/* Cover */}
                <div className={`relative bg-stone-100 ${i === 0 ? 'h-64' : 'h-48'}`}>
                  <Image
                    src={post.coverImage.url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-stone-700 rounded text-xs font-medium">
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="font-bold text-stone-900 text-lg leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime} min
                      </span>
                    </div>
                    <span className="font-medium text-stone-500">{post.author?.fullName}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
