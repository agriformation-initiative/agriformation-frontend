'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Star, Trash2, Pencil, Eye, EyeOff, Calendar, MapPin } from 'lucide-react';
import { galleryService } from '@/services/galleryService';
import { Gallery, Photo } from '@/types/indexes';
import { formatDate, titleCase } from '@/lib/format';
import Button from '@/components/ui/Button';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { TextField, TextAreaField, SelectField } from '@/components/ui/Field';
import { ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const CATEGORIES = [
  { value: 'farm_excursion', label: 'Farm excursion' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'community_event', label: 'Community event' },
  { value: 'training', label: 'Training session' },
  { value: 'other', label: 'Other' },
];

const toForm = (g: Gallery) => ({
  title: g.title,
  description: g.description || '',
  eventDate: g.eventDate ? new Date(g.eventDate).toISOString().split('T')[0] : '',
  location: g.location || '',
  category: g.category,
});

export default function ManageGalleryPage() {
  const { id } = useParams<{ id: string }>();
  const fileInput = useRef<HTMLInputElement>(null);

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [captionFor, setCaptionFor] = useState<Photo | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const res = await galleryService.getGalleryDetails(id);
      setGallery(res.data.gallery);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const run = async (action: () => Promise<unknown>, success: string, failure: string) => {
    try {
      await action();
      toast.success(success);
      await load();
      return true;
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || failure);
      return false;
    }
  };

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    await run(() => galleryService.uploadPhotos(id, files), `${files.length} ${files.length === 1 ? 'photo' : 'photos'} uploaded`, 'We could not upload the photos. Check the file size and type, then try again.');
    if (fileInput.current) fileInput.current.value = '';
    setUploading(false);
  };

  const confirmDeletePhoto = async () => {
    if (!deletingPhoto) return;
    setBusy(true);
    await run(() => galleryService.deletePhoto(id, deletingPhoto._id), 'Photo deleted', 'We could not delete the photo. Try again.');
    setBusy(false);
    setDeletingPhoto(null);
  };

  if (loading) return <DashboardSkeleton />;
  if (failed || !gallery) return <ErrorState message="We could not load this album." onRetry={load} />;

  const iconBtn = 'flex h-11 w-11 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-700 hover:bg-stone-50';

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/gallery" className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
        <ArrowLeft size={18} aria-hidden="true" /> All albums
      </Link>

      <section className="mt-2 rounded-xl bg-white p-6" aria-labelledby="album-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 id="album-title" className="text-3xl font-semibold">{gallery.title}</h1>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${gallery.isPublished ? 'bg-brand-100 text-brand-900' : 'bg-stone-100 text-stone-700'}`}>
                {gallery.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            {gallery.description && <p className="mt-2 text-stone-700">{gallery.description}</p>}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-600">
              <li className="flex items-center gap-1.5"><Calendar size={15} aria-hidden="true" />{formatDate(gallery.eventDate)}</li>
              {gallery.location && <li className="flex items-center gap-1.5"><MapPin size={15} aria-hidden="true" />{gallery.location}</li>}
              <li>{titleCase(gallery.category)}</li>
              <li>{gallery.photoCount} photos</li>
              <li>{gallery.viewCount} views</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setEditingDetails(true)}><Pencil size={16} aria-hidden="true" /> Edit details</Button>
            <Button
              variant={gallery.isPublished ? 'secondary' : 'primary'}
              onClick={() => run(() => galleryService.togglePublishStatus(id), gallery.isPublished ? 'Album unpublished' : 'Album published', 'We could not change the publish status. Try again.')}
            >
              {gallery.isPublished ? <><EyeOff size={16} aria-hidden="true" /> Unpublish</> : <><Eye size={16} aria-hidden="true" /> Publish</>}
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-white p-6" aria-labelledby="upload-heading">
        <h2 id="upload-heading" className="font-sans text-lg font-semibold">Upload photos</h2>
        <p className="mt-1 text-sm text-stone-600">JPEG, PNG or WebP. Up to 5 MB each, 20 at a time.</p>
        <input ref={fileInput} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={onFiles} className="sr-only" id="photo-input" tabIndex={-1} />
        <Button className="mt-4" loading={uploading} onClick={() => fileInput.current?.click()}>
          <Upload size={18} aria-hidden="true" /> {uploading ? 'Uploading' : 'Choose photos'}
        </Button>
      </section>

      <section className="mt-6 rounded-xl bg-white p-6" aria-labelledby="photos-heading">
        <h2 id="photos-heading" className="font-sans text-lg font-semibold">Photos ({gallery.photoCount})</h2>
        {gallery.photos.length === 0 ? (
          <p className="py-10 text-center text-stone-600">No photos yet. Choose some above to get started.</p>
        ) : (
          <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.photos.map((photo) => {
              const isCover = gallery.coverImage?.publicId === photo.publicId;
              return (
                <li key={photo._id} className="overflow-hidden rounded-xl border border-stone-200">
                  <div className="relative aspect-4/3 bg-stone-200">
                    <Image src={photo.url} alt={photo.caption || 'Album photo'} fill sizes="(min-width: 1024px) 320px, 50vw" className="object-cover" />
                    {isCover && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-stone-900">
                        <Star size={12} aria-hidden="true" /> Cover
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 min-h-12 text-sm text-stone-700">{photo.caption || 'No caption'}</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" className={iconBtn} aria-label="Set as cover photo" disabled={isCover}
                        onClick={() => run(() => galleryService.setCoverImage(id, photo._id), 'Cover photo updated', 'We could not set the cover photo. Try again.')}>
                        <Star size={18} />
                      </button>
                      <button type="button" className={iconBtn} aria-label="Edit caption" onClick={() => setCaptionFor(photo)}>
                        <Pencil size={18} />
                      </button>
                      <button type="button" className={`${iconBtn} !border-red-300 !text-red-700 hover:!bg-red-50`} aria-label="Delete photo" onClick={() => setDeletingPhoto(photo)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {editingDetails && (
        <DetailsModal gallery={gallery} onClose={() => setEditingDetails(false)}
          onSave={async (data) => {
            const ok = await run(() => galleryService.updateGallery(id, data), 'Album details saved', 'We could not save the details. Try again.');
            if (ok) setEditingDetails(false);
          }} />
      )}

      {captionFor && (
        <CaptionModal photo={captionFor} onClose={() => setCaptionFor(null)}
          onSave={async (text) => {
            const ok = await run(() => galleryService.updatePhotoCaption(id, captionFor._id, text), 'Caption saved', 'We could not save the caption. Try again.');
            if (ok) setCaptionFor(null);
          }} />
      )}

      {deletingPhoto && (
        <ConfirmDialog title="Delete this photo?" message={deletingPhoto.caption ? `"${deletingPhoto.caption}" will be removed from the album for good.` : 'This photo will be removed from the album for good.'}
          confirmLabel="Delete photo" loading={busy} onConfirm={confirmDeletePhoto} onCancel={() => setDeletingPhoto(null)} />
      )}
    </div>
  );
}

function DetailsModal({ gallery, onClose, onSave }: { gallery: Gallery; onClose: () => void; onSave: (d: ReturnType<typeof toForm>) => Promise<void> }) {
  const [form, setForm] = useState(toForm(gallery));
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }) as typeof form);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <Modal title="Edit album details" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="details-form" loading={saving}>Save changes</Button></>}>
      <form id="details-form" onSubmit={submit} className="space-y-4">
        <TextField id="title" label="Title" required value={form.title} onChange={set('title')} />
        <TextAreaField id="description" label="Description" rows={3} value={form.description} onChange={set('description')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="eventDate" type="date" label="Event date" required value={form.eventDate} onChange={set('eventDate')} />
          <SelectField id="category" label="Category" value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </SelectField>
        </div>
        <TextField id="location" label="Location" optional value={form.location} onChange={set('location')} />
      </form>
    </Modal>
  );
}

function CaptionModal({ photo, onClose, onSave }: { photo: Photo; onClose: () => void; onSave: (text: string) => Promise<void> }) {
  const [text, setText] = useState(photo.caption || '');
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(text.trim());
    setSaving(false);
  };

  return (
    <Modal size="sm" title="Edit caption" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="caption-form" loading={saving}>Save caption</Button></>}>
      <form id="caption-form" onSubmit={submit}>
        <TextField id="caption" label="Caption" value={text} onChange={(e) => setText(e.target.value)} />
      </form>
    </Modal>
  );
}
