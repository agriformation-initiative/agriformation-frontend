'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { blogService, apiErrorMessage, BLOG_CATEGORIES } from '@/services/blogService';
import Button from '@/components/ui/Button';
import { TextField, TextAreaField, SelectField } from '@/components/ui/Field';

type Errors = Partial<Record<'title' | 'excerpt' | 'coverImage', string>>;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function CreateBlogPostPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ title: '', excerpt: '', category: 'other', tags: '' });

  // Object URLs are cheaper than data URLs and must be released
  useEffect(() => {
    if (!imageFile) return setPreview(null);
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (key in errors) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErrors((p) => ({ ...p, coverImage: 'Choose an image file (PNG, JPG or WebP).' }));
    if (file.size > MAX_IMAGE_BYTES) return setErrors((p) => ({ ...p, coverImage: 'That image is over 5 MB. Choose a smaller one.' }));
    setErrors((p) => ({ ...p, coverImage: undefined }));
    setImageFile(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    if (!form.title.trim()) found.title = 'Enter a title.';
    if (!form.excerpt.trim()) found.excerpt = 'Write a short excerpt for the listing page.';
    if (!imageFile) found.coverImage = 'Add a cover image.';
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      if (first === 'coverImage') fileInput.current?.focus();
      else formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('coverImage', imageFile as File);
      const post = await blogService.create(fd);
      toast.success('Draft created');
      router.push(`/admin/blog/${post._id}`);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'We could not create the post. Try again.'));
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/blog" className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
        <ArrowLeft size={18} aria-hidden="true" /> All posts
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">New blog post</h1>
      <p className="mt-1 text-stone-600">Start with the basics. You will write the body in the next step.</p>

      <form ref={formRef} onSubmit={submit} noValidate className="mt-8 space-y-5 rounded-xl bg-white p-6 md:p-8">
        <div>
          <p className="mb-1.5 text-sm font-medium text-stone-800">Cover image</p>
          <input ref={fileInput} id="coverImage" type="file" accept="image/*" onChange={onImage} className="sr-only" aria-describedby={errors.coverImage ? 'cover-error' : undefined} />
          {preview ? (
            <div className="relative aspect-2/1 overflow-hidden rounded-xl bg-stone-200">
              <Image src={preview} alt="Cover preview" fill unoptimized className="object-cover" />
              <button type="button" onClick={() => { setImageFile(null); if (fileInput.current) fileInput.current.value = ''; }}
                aria-label="Remove cover image" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-800 shadow-raised">
                <X size={18} />
              </button>
            </div>
          ) : (
            <label htmlFor="coverImage" className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center hover:border-brand-700 focus-within:border-brand-700 ${errors.coverImage ? 'border-red-600' : 'border-stone-300'}`}>
              <Upload className="text-brand-700" size={26} aria-hidden="true" />
              <span className="font-medium text-stone-800">Choose a cover image</span>
              <span className="text-sm text-stone-600">PNG, JPG or WebP, up to 5 MB</span>
            </label>
          )}
          {errors.coverImage && <p id="cover-error" role="alert" className="mt-1.5 text-sm text-red-700">{errors.coverImage}</p>}
        </div>

        <TextField id="title" name="title" label="Title" value={form.title} onChange={set('title')} error={errors.title} />
        <TextAreaField id="excerpt" name="excerpt" label="Excerpt" rows={3} maxLength={500} value={form.excerpt} onChange={set('excerpt')} error={errors.excerpt}
          hint={`Shown on the blog page. ${form.excerpt.length} of 500 characters.`} />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField id="category" name="category" label="Category" value={form.category} onChange={set('category')}>
            {BLOG_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </SelectField>
          <TextField id="tags" name="tags" label="Tags" optional hint="Separate with commas." value={form.tags} onChange={set('tags')} />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" loading={loading}>Create draft and continue</Button>
          <Button href="/admin/blog" variant="secondary">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
