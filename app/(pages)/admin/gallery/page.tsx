'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Plus, Search, Calendar, MapPin, Eye, EyeOff, Trash2, Images } from 'lucide-react';
import { galleryService } from '@/services/galleryService';
import { Gallery } from '@/types/indexes';
import { formatDate } from '@/lib/format';
import Button from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/Field';
import { PageHeader, StatTile, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const CATEGORIES = [
  { value: 'all', label: 'All categories' },
  { value: 'farm_excursion', label: 'Farm excursions' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'community_event', label: 'Community events' },
  { value: 'training', label: 'Training sessions' },
  { value: 'other', label: 'Other' },
];

const EMPTY_STATS = { totalGalleries: 0, publishedGalleries: 0, totalPhotos: 0, totalViews: 0 };

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [published, setPublished] = useState('all');
  const [deleting, setDeleting] = useState<Gallery | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const params: { category?: string; isPublished?: boolean } = {};
      if (category !== 'all') params.category = category;
      if (published !== 'all') params.isPublished = published === 'published';
      // Albums and stats are independent, so fetch them together
      const [list, statRes] = await Promise.all([
        galleryService.getAllGalleries(params),
        galleryService.getGalleryStats().catch(() => null),
      ]);
      setGalleries(list.data.galleries);
      if (statRes) setStats(statRes.data.stats);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [category, published]);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (g: Gallery) => {
    try {
      await galleryService.togglePublishStatus(g._id);
      toast.success(g.isPublished ? 'Album unpublished' : 'Album published');
      load();
    } catch {
      toast.error('We could not change the publish status. Try again.');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await galleryService.deleteGallery(deleting._id);
      toast.success('Album deleted');
      setDeleting(null);
      load();
    } catch {
      toast.error('We could not delete the album. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const q = query.trim().toLowerCase();
  const shown = q
    ? galleries.filter((g) => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q))
    : galleries;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Photo galleries"
        description="Create albums and choose what appears on the public gallery."
        action={<Button href="/admin/gallery/create"><Plus size={18} aria-hidden="true" /> Create album</Button>}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Images} label="Albums" value={stats.totalGalleries} />
        <StatTile icon={Eye} label="Published" value={stats.publishedGalleries} />
        <StatTile icon={Images} label="Photos" value={stats.totalPhotos} />
        <StatTile icon={Eye} label="Views" value={stats.totalViews} />
      </div>

      <div className="mt-8 grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-3">
        <div>
          <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-stone-800">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={18} aria-hidden="true" />
            <input id="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-4 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/25" />
          </div>
        </div>
        <SelectField id="category" label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </SelectField>
        <SelectField id="published" label="Status" value={published} onChange={(e) => setPublished(e.target.value)}>
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </SelectField>
      </div>

      <div className="mt-6">
        {failed ? (
          <ErrorState message="We could not load the albums." onRetry={load} />
        ) : shown.length === 0 ? (
          <div className="rounded-xl bg-white">
            <EmptyState
              icon={Images}
              title="No albums found"
              description={q ? 'Try a different search or filter.' : 'Create your first album to start the public gallery.'}
              action={!q && <Button href="/admin/gallery/create">Create album</Button>}
            />
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((g) => (
              <li key={g._id} className="flex flex-col overflow-hidden rounded-xl bg-white">
                <div className="relative aspect-3/2 bg-stone-200">
                  {g.coverImage?.url ? (
                    <Image src={g.coverImage.url} alt="" fill sizes="(min-width: 1024px) 360px, 50vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Images className="text-stone-400" size={40} aria-hidden="true" /></div>
                  )}
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${g.isPublished ? 'bg-brand-100 text-brand-900' : 'bg-white text-stone-700'}`}>
                    {g.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-2 font-sans text-lg font-semibold">{g.title}</h2>
                  <p className="mt-1 line-clamp-2 text-stone-600">{g.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
                    <li className="flex items-center gap-1.5"><Calendar size={14} aria-hidden="true" />{formatDate(g.eventDate, 'short')}</li>
                    {g.location && <li className="flex min-w-0 items-center gap-1.5"><MapPin size={14} aria-hidden="true" /><span className="truncate">{g.location}</span></li>}
                  </ul>
                  <p className="mt-2 text-sm text-stone-600">{g.photoCount} {g.photoCount === 1 ? 'photo' : 'photos'} · {g.viewCount} views</p>
                  <div className="mt-auto flex gap-2 pt-4">
                    <Link href={`/admin/gallery/${g._id}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-brand-700 px-4 font-semibold text-white hover:bg-brand-800">
                      Manage<span className="sr-only"> {g.title}</span>
                    </Link>
                    <button type="button" onClick={() => togglePublish(g)} aria-label={`${g.isPublished ? 'Unpublish' : 'Publish'} ${g.title}`}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50">
                      {g.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button type="button" onClick={() => setDeleting(g)} aria-label={`Delete ${g.title}`}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-red-300 text-red-700 hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {deleting && (
        <ConfirmDialog
          title={`Delete "${deleting.title}"?`}
          message={`This removes the album and its ${deleting.photoCount} ${deleting.photoCount === 1 ? 'photo' : 'photos'} for good. This cannot be undone.`}
          confirmLabel="Delete album"
          loading={busy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
