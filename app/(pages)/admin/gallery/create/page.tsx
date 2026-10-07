'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { galleryService } from '@/services/galleryService';
import { CreateGalleryData } from '@/types/indexes';
import Button from '@/components/ui/Button';
import { TextField, TextAreaField, SelectField } from '@/components/ui/Field';

const CATEGORIES = [
  { value: 'farm_excursion', label: 'Farm excursion' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'community_event', label: 'Community event' },
  { value: 'training', label: 'Training session' },
  { value: 'other', label: 'Other' },
];

type Errors = Partial<Record<'title' | 'description' | 'eventDate', string>>;

export default function CreateGalleryPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<Required<CreateGalleryData>>({
    title: '', description: '', eventDate: '', location: '', category: 'farm_excursion',
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (key in errors) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    if (!form.title.trim()) found.title = 'Enter a title for the album.';
    if (!form.description.trim()) found.description = 'Write a short description.';
    if (!form.eventDate) found.eventDate = 'Choose the date of the event.';
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setLoading(true);
    try {
      const res = await galleryService.createGallery(form);
      toast.success('Album created. Add photos next.');
      router.push(`/admin/gallery/${res.data.gallery._id}`);
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'We could not create the album. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/gallery" className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
        <ArrowLeft size={18} aria-hidden="true" /> All albums
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Create album</h1>
      <p className="mt-1 text-stone-600">Add the details first. You can upload photos once the album exists.</p>

      <form ref={formRef} onSubmit={submit} noValidate className="mt-8 space-y-5 rounded-xl bg-white p-6 md:p-8">
        <TextField id="title" name="title" label="Album title" placeholder="Farm excursion, March 2024" value={form.title} onChange={set('title')} error={errors.title} />
        <TextAreaField id="description" name="description" label="Description" rows={4} value={form.description} onChange={set('description')} error={errors.description}
          hint="What happened, and what will visitors see?" />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="eventDate" name="eventDate" type="date" label="Event date" value={form.eventDate} onChange={set('eventDate')} error={errors.eventDate} />
          <SelectField id="category" name="category" label="Category" value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </SelectField>
        </div>
        <TextField id="location" name="location" label="Location" optional placeholder="Ibiteinye Integrated Farms, Elelewon" value={form.location} onChange={set('location')} />
        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" loading={loading}>Create album</Button>
          <Button href="/admin/gallery" variant="secondary">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
