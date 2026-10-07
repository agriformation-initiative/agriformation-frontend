'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Search, Eye, Clock, Trash2, BookOpen } from 'lucide-react';
import { blogService, apiErrorMessage, AdminBlogPost, BLOG_CATEGORIES } from '@/services/blogService';
import { formatDate, titleCase } from '@/lib/format';
import Button from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/Field';
import { PageHeader, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [deleting, setDeleting] = useState<AdminBlogPost | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setPosts(await blogService.list({
        status: status === 'all' ? undefined : status,
        category: category === 'all' ? undefined : category,
      }));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [status, category]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await blogService.remove(deleting._id);
      toast.success('Post deleted');
      setPosts((p) => p.filter((x) => x._id !== deleting._id));
      setDeleting(null);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'We could not delete the post. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  const q = query.trim().toLowerCase();
  const shown = q ? posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)) : posts;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Blog posts"
        description="Write and publish stories. Images also appear in the public gallery."
        action={<Button href="/admin/blog/create"><Plus size={18} aria-hidden="true" /> New post</Button>}
      />

      <div className="grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-3">
        <div>
          <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-stone-800">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={18} aria-hidden="true" />
            <input id="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-4 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/25" />
          </div>
        </div>
        <SelectField id="status" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </SelectField>
        <SelectField id="category" label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          {BLOG_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </SelectField>
      </div>

      <div className="mt-6">
        {failed ? (
          <ErrorState message="We could not load the posts." onRetry={load} />
        ) : shown.length === 0 ? (
          <div className="rounded-xl bg-white">
            <EmptyState icon={BookOpen} title="No posts found"
              description={q ? 'Try a different search or filter.' : 'Write your first post to share a story from the field.'}
              action={!q && <Button href="/admin/blog/create">New post</Button>} />
          </div>
        ) : (
          <ul className="space-y-3">
            {shown.map((post) => (
              <li key={post._id} className="flex flex-wrap items-start gap-4 rounded-xl bg-white p-4 sm:flex-nowrap">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-stone-200">
                  <Image src={post.coverImage.url} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="line-clamp-1 font-sans text-lg font-semibold">{post.title}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.status === 'published' ? 'bg-brand-100 text-brand-900' : 'bg-stone-100 text-stone-700'}`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-stone-600">{post.excerpt}</p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
                    <span>{titleCase(post.category)}</span>
                    <span className="flex items-center gap-1"><Clock size={13} aria-hidden="true" />{post.readTime} min</span>
                    <span className="flex items-center gap-1"><Eye size={13} aria-hidden="true" />{post.viewCount}</span>
                    <span>{formatDate(post.publishedAt || post.createdAt, 'short')}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/admin/blog/${post._id}`} className="inline-flex min-h-11 items-center rounded-md border border-stone-300 px-4 font-semibold text-stone-800 hover:bg-stone-50">
                    Edit<span className="sr-only"> {post.title}</span>
                  </Link>
                  <button type="button" onClick={() => setDeleting(post)} aria-label={`Delete ${post.title}`}
                    className="flex h-11 w-11 items-center justify-center rounded-md border border-red-300 text-red-700 hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {deleting && (
        <ConfirmDialog title={`Delete "${deleting.title}"?`}
          message="This removes the post, its images and the linked gallery album for good. This cannot be undone."
          confirmLabel="Delete post" loading={busy} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}
