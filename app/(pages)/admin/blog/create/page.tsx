'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'education', label: 'Education' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'events', label: 'Events' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' },
];

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', category: 'other', tags: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((p) => ({ ...p, coverImage: 'Please select an image file' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, coverImage: 'Image must be less than 5MB' }));
      return;
    }
    setImageFile(file);
    setErrors((p) => ({ ...p, coverImage: '' }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.excerpt.trim()) e.excerpt = 'Excerpt is required';
    if (!imageFile) e.coverImage = 'Cover image is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('excerpt', form.excerpt);
      fd.append('category', form.category);
      fd.append('tags', form.tags);
      if (imageFile) fd.append('coverImage', imageFile);

      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blog`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Post created as draft');
      router.push(`/admin/blog/${data.data.post._id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-2xl">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-stone-600 hover:text-green-700 mb-6 transition-colors">
          <ArrowLeft size={20} /> <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900 mb-1">New Blog Post</h1>
            <p className="text-stone-500 text-sm">Fill in the basics — you&apos;ll write the content in the next step.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Cover Image <span className="text-red-500">*</span>
              </label>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input type="file" id="coverImage" accept="image/*" onChange={handleImage} className="hidden" />
                  <label htmlFor="coverImage" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                      <Upload className="text-green-700" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700">Click to upload cover image</p>
                      <p className="text-xs text-stone-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-stone-200">
                  <Image src={imagePreview} alt="Preview" width={800} height={400} className="w-full h-52 object-cover" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              )}
              {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text" id="title" name="title" value={form.title} onChange={handleChange}
                placeholder="e.g., How School Gardens Are Transforming Agricultural Education"
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.title ? 'border-red-400' : 'border-stone-300'}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-stone-700 mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} rows={3}
                placeholder="A short preview of the post shown on listing pages (max 500 characters)..."
                maxLength={500}
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${errors.excerpt ? 'border-red-400' : 'border-stone-300'}`}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-stone-500">{form.excerpt.length}/500</p>
                {errors.excerpt && <p className="text-red-500 text-xs">{errors.excerpt}</p>}
              </div>
            </div>

            {/* Category & Tags */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-2">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-stone-700 mb-2">Tags</label>
                <input
                  type="text" id="tags" name="tags" value={form.tags} onChange={handleChange}
                  placeholder="e.g., farming, youth, education"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-stone-500 mt-1">Comma-separated</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-md font-medium hover:bg-green-800 transition-colors disabled:opacity-50">
                {loading ? <><Loader2 className="animate-spin" size={18} /> Creating...</> : 'Create & Continue to Editor'}
              </button>
              <button type="button" onClick={() => router.back()} disabled={loading}
                className="px-6 py-3 border border-stone-300 text-stone-700 rounded-md font-medium hover:bg-stone-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
