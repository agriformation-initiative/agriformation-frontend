'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Eye, Clock, Loader2, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import toast from 'react-hot-toast';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: { url: string };
  category: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  readTime: number;
  viewCount: number;
  author: { fullName: string };
  createdAt: string;
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'events', label: 'Events' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' },
];

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/blog?`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setPosts(data.data.posts);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [statusFilter, categoryFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Post deleted');
      setPosts((p) => p.filter((post) => post._id !== id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <DashboardLayout role="admin">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Blog Posts</h1>
            <p className="text-stone-600 mt-1">Manage your blog content</p>
          </div>
          <Link
            href="/admin/blog/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors"
          >
            <Plus size={20} />
            New Post
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 mb-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-green-700" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
            <p className="text-stone-500 text-lg mb-4">No posts found</p>
            <Link href="/admin/blog/create" className="inline-flex items-center gap-2 text-green-700 font-medium hover:text-green-800">
              <Plus size={18} /> Create your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg border border-stone-200 p-4 flex gap-4 items-start hover:border-stone-300 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-stone-100">
                  <Image src={post.coverImage.url} alt={post.title} fill className="object-cover" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-stone-900 line-clamp-1">{post.title}</h3>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-stone-500 text-sm line-clamp-1 mt-0.5">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
                    <span>{post.category.charAt(0).toUpperCase() + post.category.slice(1)}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime} min read</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {post.viewCount}</span>
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    <span>{post.author?.fullName}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => router.push(`/admin/blog/${post._id}`)}
                    className="px-3 py-1.5 text-sm border border-stone-300 rounded text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id, post.title)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
