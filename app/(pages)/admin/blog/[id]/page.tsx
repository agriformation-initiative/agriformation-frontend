'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Eye, EyeOff, Trash2, ImagePlus } from 'lucide-react';
import { blogService, apiErrorMessage, AdminBlogPost, BLOG_CATEGORIES } from '@/services/blogService';
import { formatDate } from '@/lib/format';
import Button from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Modal';
import { TextField, TextAreaField, SelectField } from '@/components/ui/Field';
import { ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const toForm = (p: AdminBlogPost) => ({
  title: p.title,
  excerpt: p.excerpt,
  content: p.content || '',
  category: p.category,
  tags: p.tags?.join(', ') || '',
});

export default function BlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const [post, setPost] = useState<AdminBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'other', tags: '' });

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const p = await blogService.get(id);
      setPost(p);
      setForm(toForm(p));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const save = async (): Promise<boolean> => {
    if (!form.title.trim() || !form.excerpt.trim()) {
      toast.error('Add a title and an excerpt before saving.');
      return false;
    }
    try {
      setPost(await blogService.update(id, form));
      return true;
    } catch (err) {
      toast.error(apiErrorMessage(err, 'We could not save the post. Try again.'));
      return false;
    }
  };

  const onSave = async () => {
    setSaving(true);
    if (await save()) toast.success('Saved');
    setSaving(false);
  };

  const onTogglePublish = async () => {
    setPublishing(true);
    // Save first, and stop if that fails so nothing goes live half-edited
    if (await save()) {
      try {
        const updated = await blogService.togglePublish(id);
        setPost(updated);
        toast.success(updated.status === 'published' ? 'Post published' : 'Post unpublished');
      } catch (err) {
        toast.error(apiErrorMessage(err, 'We could not change the publish status. Try again.'));
      }
    }
    setPublishing(false);
  };

  const insertImage = (url: string) => {
    const ta = contentRef.current;
    const start = ta?.selectionStart ?? form.content.length;
    const end = ta?.selectionEnd ?? form.content.length;
    const tag = `\n<img src="${url}" alt="" />\n`;
    setForm((p) => ({ ...p, content: p.content.slice(0, start) + tag + p.content.slice(end) }));
    requestAnimationFrame(() => {
      ta?.focus();
      if (ta) ta.selectionStart = ta.selectionEnd = start + tag.length;
    });
  };

  const onUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, imageId } = await blogService.uploadContentImage(id, file);
      insertImage(url);
      setPost((p) => (p ? { ...p, contentImages: [...p.contentImages, { _id: imageId, url }] } : p));
      toast.success('Image uploaded and added to the content');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'We could not upload the image. Check the file type and size.'));
    } finally {
      setUploading(false);
      if (imageInput.current) imageInput.current.value = '';
    }
  };

  const onDeleteImage = async (imageId: string) => {
    try {
      await blogService.deleteContentImage(id, imageId);
      setPost((p) => (p ? { ...p, contentImages: p.contentImages.filter((i) => i._id !== imageId) } : p));
      toast.success('Image deleted');
    } catch {
      toast.error('We could not delete the image. Try again.');
    }
  };

  const onDeletePost = async () => {
    setBusy(true);
    try {
      await blogService.remove(id);
      toast.success('Post deleted');
      router.push('/admin/blog');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'We could not delete the post. Try again.'));
      setBusy(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (failed || !post) return <ErrorState message="We could not load this post." onRetry={load} />;

  const words = form.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const published = post.status === 'published';

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/blog" className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
          <ArrowLeft size={18} aria-hidden="true" /> All posts
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${published ? 'bg-brand-100 text-brand-900' : 'bg-stone-100 text-stone-700'}`}>
            {published ? 'Published' : 'Draft'}
          </span>
          <Button variant="secondary" loading={saving} onClick={onSave}><Save size={16} aria-hidden="true" /> Save</Button>
          <Button loading={publishing} disabled={saving} onClick={onTogglePublish}>{published ? 'Unpublish' : 'Publish'}</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="relative aspect-2/1 overflow-hidden rounded-xl bg-stone-200">
            <Image src={post.coverImage.url} alt={`Cover image for ${post.title}`} fill sizes="720px" className="object-cover" />
          </div>
          <TextField id="title" label="Title" value={form.title} onChange={set('title')} />
          <TextAreaField id="excerpt" label="Excerpt" rows={2} maxLength={500} value={form.excerpt} onChange={set('excerpt')} />

          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="content" className="text-sm font-medium text-stone-800">Content (HTML)</label>
              <div className="flex gap-2">
                <input ref={imageInput} type="file" accept="image/*" onChange={onUploadImage} className="sr-only" tabIndex={-1} aria-hidden="true" />
                <Button variant="secondary" className="!min-h-10 !py-1.5 text-sm" loading={uploading} onClick={() => imageInput.current?.click()}>
                  <ImagePlus size={16} aria-hidden="true" /> Insert image
                </Button>
                <Button variant="secondary" className="!min-h-10 !py-1.5 text-sm" onClick={() => setPreview((v) => !v)}>
                  {preview ? <><EyeOff size={16} aria-hidden="true" /> Edit</> : <><Eye size={16} aria-hidden="true" /> Preview</>}
                </Button>
              </div>
            </div>
            {preview ? (
              <div className="blog-content min-h-96 rounded-md border border-stone-300 bg-white px-5 py-4"
                dangerouslySetInnerHTML={{ __html: form.content || '<p>Nothing to preview yet.</p>' }} />
            ) : (
              <textarea id="content" ref={contentRef} value={form.content} onChange={set('content')} rows={20}
                placeholder="Write the post in HTML. Use h2, p, strong, em, ul, li, a and img tags."
                className="w-full resize-y rounded-md border border-stone-300 bg-white px-4 py-3 font-mono text-sm leading-relaxed focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/25" />
            )}
            <p className="mt-1.5 text-sm text-stone-600">About {Math.max(1, Math.ceil(words / 200))} min read</p>
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl bg-white p-5" aria-labelledby="settings">
            <h2 id="settings" className="font-sans text-base font-semibold">Post settings</h2>
            <div className="mt-4 space-y-4">
              <SelectField id="category" label="Category" value={form.category} onChange={set('category')}>
                {BLOG_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </SelectField>
              <TextField id="tags" label="Tags" hint="Separate with commas." value={form.tags} onChange={set('tags')} />
              <dl className="space-y-1 border-t border-stone-200 pt-4 text-sm text-stone-600">
                <div className="flex justify-between gap-2"><dt>Address</dt><dd className="truncate font-mono text-stone-800">/blog/{post.slug}</dd></div>
                <div className="flex justify-between gap-2"><dt>Views</dt><dd className="tabular-nums text-stone-800">{post.viewCount}</dd></div>
                {post.publishedAt && <div className="flex justify-between gap-2"><dt>Published</dt><dd className="text-stone-800">{formatDate(post.publishedAt, 'short')}</dd></div>}
              </dl>
            </div>
          </section>

          {post.gallery && (
            <section className="rounded-xl bg-white p-5" aria-labelledby="gallery-link">
              <h2 id="gallery-link" className="font-sans text-base font-semibold">Linked gallery album</h2>
              <p className="mt-1 text-sm text-stone-600">Images in this post are added to this album automatically.</p>
              <p className="mt-3 line-clamp-1 font-medium text-stone-800">{post.gallery.title}</p>
              <p className="text-sm text-stone-600">
                {post.gallery.photos?.length || 0} photos · {post.gallery.isPublished ? 'Public' : 'Not public'}
              </p>
            </section>
          )}

          <section className="rounded-xl bg-white p-5" aria-labelledby="content-images">
            <h2 id="content-images" className="font-sans text-base font-semibold">Content images ({post.contentImages.length})</h2>
            {post.contentImages.length === 0 ? (
              <p className="mt-2 text-sm text-stone-600">No images yet. Use Insert image to add one.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {post.contentImages.map((img) => (
                  <li key={img._id} className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-stone-200">
                      <Image src={img.url} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-stone-600">{img.url.split('/').pop()}</span>
                    <button type="button" onClick={() => onDeleteImage(img._id)} aria-label="Delete image"
                      className="flex h-11 w-11 items-center justify-center rounded-md text-stone-600 hover:bg-red-50 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl bg-white p-5" aria-labelledby="danger">
            <h2 id="danger" className="font-sans text-base font-semibold">Delete post</h2>
            <p className="mt-1 text-sm text-stone-600">Removes the post, its images and the linked gallery album.</p>
            <Button variant="danger" className="mt-3" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={16} aria-hidden="true" /> Delete post
            </Button>
          </section>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog title={`Delete "${post.title}"?`}
          message="This removes the post, its images and the linked gallery album for good. This cannot be undone."
          confirmLabel="Delete post" loading={busy} onConfirm={onDeletePost} onCancel={() => setConfirmDelete(false)} />
      )}
    </div>
  );
}
