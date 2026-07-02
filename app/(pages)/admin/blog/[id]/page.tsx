/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Save, Send, Loader2, Upload, X, Eye, EyeOff, Trash2, Image as ImageIcon,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import toast from 'react-hot-toast';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: { url: string };
  contentImages: Array<{ _id: string; url: string; caption?: string }>;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
  readTime: number;
  viewCount: number;
  gallery?: { _id: string; title: string; isPublished: boolean; photos: any[] };
}

const CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'events', label: 'Events' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' },
];

export default function BlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'other', tags: '' });
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const token = () => localStorage.getItem('token') || '';

  const fetchPost = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      const p: BlogPost = data.data.post;
      setPost(p);
      setForm({
        title: p.title,
        excerpt: p.excerpt,
        content: p.content || '',
        category: p.category,
        tags: p.tags?.join(', ') || '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPost(); }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const savePost = async () => {
    if (!form.title.trim() || !form.excerpt.trim()) {
      toast.error('Title and excerpt are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          category: form.category,
          tags: form.tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPost(data.data.post);
      toast.success('Saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    setPublishing(true);
    try {
      // Auto-save first
      await savePost();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}/publish`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPost(data.data.post);
      toast.success(data.data.post.status === 'published' ? 'Post published!' : 'Post unpublished');
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle publish');
    } finally {
      setPublishing(false);
    }
  };

  // Insert image URL at cursor in the content textarea
  const insertImageAtCursor = (url: string) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? form.content.length;
    const end = ta.selectionEnd ?? form.content.length;
    const imgHtml = `\n<img src="${url}" alt="" style="max-width:100%;border-radius:4px;margin:12px 0;" />\n`;
    const newContent = form.content.slice(0, start) + imgHtml + form.content.slice(end);
    setForm((p) => ({ ...p, content: newContent }));
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + imgHtml.length;
    }, 0);
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      insertImageAtCursor(data.data.url);
      // Update local post contentImages list
      setPost((p) => p ? { ...p, contentImages: [...p.contentImages, { _id: data.data.imageId, url: data.data.url }] } : p);
      toast.success('Image uploaded and inserted');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
      if (imageUploadRef.current) imageUploadRef.current.value = '';
    }
  };

  const deleteContentImage = async (imageId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}/images/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error('Failed to delete image');
      setPost((p) => p ? { ...p, contentImages: p.contentImages.filter((i) => i._id !== imageId) } : p);
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete image');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-green-700" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center py-16">
          <p className="text-stone-500 mb-4">Post not found</p>
          <Link href="/admin/blog" className="text-green-700 font-medium hover:underline">Back to Blog</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-5xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-stone-600 hover:text-green-700 transition-colors">
            <ArrowLeft size={20} /> <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded text-xs font-medium ${
              post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
            }`}>
              {post.status === 'published' ? 'Published' : 'Draft'}
            </span>

            <button onClick={savePost} disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-md font-medium hover:bg-stone-50 transition-colors disabled:opacity-50 text-sm">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save
            </button>

            <button onClick={togglePublish} disabled={publishing || saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors disabled:opacity-50 text-sm">
              {publishing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              {post.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor — left 2 columns */}
          <div className="lg:col-span-2 space-y-5">
            {/* Cover image preview */}
            <div className="relative h-52 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
              <Image src={post.coverImage.url} alt={post.title} fill className="object-cover" />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Title</label>
              <input
                type="text" name="title" value={form.title} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Excerpt</label>
              <textarea
                name="excerpt" value={form.excerpt} onChange={handleChange} rows={2}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
              />
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">Content (HTML)</label>
                <div className="flex items-center gap-2">
                  {/* Image upload trigger */}
                  <input ref={imageUploadRef} type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" />
                  <button type="button" onClick={() => imageUploadRef.current?.click()} disabled={uploadingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-stone-300 rounded text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50">
                    {uploadingImage ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                    Insert Image
                  </button>
                  <button type="button" onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-stone-300 rounded text-stone-700 hover:bg-stone-50 transition-colors">
                    {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div
                  className="blog-content min-h-[400px] px-5 py-4 border border-stone-300 rounded-md bg-white"
                  dangerouslySetInnerHTML={{ __html: form.content || '<p style="color:#a8a29e">Nothing to preview yet.</p>' }}
                />
              ) : (
                <textarea
                  ref={contentRef}
                  name="content" value={form.content} onChange={handleChange}
                  rows={20}
                  placeholder="Write your blog content in HTML. Use <h2>, <p>, <strong>, <em>, <ul>, <li>, <a>, and <img> tags. Click 'Insert Image' to upload and embed images."
                  className="w-full px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y font-mono text-sm leading-relaxed"
                />
              )}
              <p className="text-xs text-stone-400 mt-1">
                Read time: ~{Math.max(1, Math.ceil(form.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length / 200))} min
              </p>
            </div>
          </div>

          {/* Sidebar — right column */}
          <div className="space-y-5">
            {/* Post Settings */}
            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Post Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text" name="tags" value={form.tags} onChange={handleChange}
                    placeholder="farming, youth, education"
                    className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="pt-2 border-t border-stone-100 space-y-1 text-xs text-stone-500">
                  <p>Slug: <span className="font-mono text-stone-700">/{post.slug}</span></p>
                  <p>Views: {post.viewCount}</p>
                  {post.publishedAt && <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>}
                </div>
              </div>
            </div>

            {/* Gallery link */}
            {post.gallery && (
              <div className="bg-white border border-stone-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-stone-900 mb-3">Auto-linked Gallery</h3>
                <p className="text-xs text-stone-500 mb-3">
                  Images from this post are automatically synced to this gallery.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-700 line-clamp-1">{post.gallery.title}</p>
                    <p className="text-xs text-stone-400">{post.gallery.photos?.length || 0} photos</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    post.gallery.isPublished ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {post.gallery.isPublished ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            )}

            {/* Content Images */}
            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">
                Content Images
                <span className="ml-2 text-xs text-stone-400 font-normal">({post.contentImages.length})</span>
              </h3>
              {post.contentImages.length === 0 ? (
                <p className="text-xs text-stone-400">No content images yet. Click &quot;Insert Image&quot; in the editor to upload.</p>
              ) : (
                <div className="space-y-2">
                  {post.contentImages.map((img) => (
                    <div key={img._id} className="flex items-center gap-2 group">
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                        <Image src={img.url} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-stone-500 truncate font-mono">{img.url.split('/').pop()}</p>
                        {img.caption && <p className="text-xs text-stone-400 truncate">{img.caption}</p>}
                      </div>
                      <button onClick={() => deleteContentImage(img._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-600 transition-all rounded flex-shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delete post */}
            <div className="bg-white border border-red-100 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-stone-900 mb-2">Danger Zone</h3>
              <p className="text-xs text-stone-500 mb-3">Deletes the post, all images, and the linked gallery.</p>
              <button
                onClick={async () => {
                  if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog/${id}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token()}` },
                    });
                    if (!res.ok) throw new Error('Delete failed');
                    toast.success('Post deleted');
                    router.push('/admin/blog');
                  } catch {
                    toast.error('Failed to delete post');
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} /> Delete Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
