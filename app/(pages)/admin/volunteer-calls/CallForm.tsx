'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import { volunteerCallService, AdminVolunteerCall, CALL_CATEGORIES } from '@/services/volunteerCallService';
import Button from '@/components/ui/Button';
import { TextField, TextAreaField, SelectField } from '@/components/ui/Field';

interface CallFormProps {
  /** Present when editing an existing call. */
  call?: AdminVolunteerCall;
}

type Values = {
  title: string; description: string; requirements: string; eventDate: string;
  location: string; numberOfVolunteers: string; deadline: string; category: string;
};
type Errors = Partial<Record<keyof Values | 'designImage', string>>;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const toInputDate = (d: string) => new Date(d).toISOString().split('T')[0];

const initial = (call?: AdminVolunteerCall): Values => ({
  title: call?.title ?? '',
  description: call?.description ?? '',
  requirements: call?.requirements ?? '',
  eventDate: call ? toInputDate(call.eventDate) : '',
  location: call?.location ?? '',
  numberOfVolunteers: call ? String(call.numberOfVolunteers) : '',
  deadline: call ? toInputDate(call.deadline) : '',
  category: call?.category ?? 'farm_work',
});

/** Shared by the create and edit screens. */
export default function CallForm({ call }: CallFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<Values>(() => initial(call));
  const [errors, setErrors] = useState<Errors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(call?.designImage.url ?? null);
  const [saving, setSaving] = useState<'draft' | 'publish' | 'save' | null>(null);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErrors((p) => ({ ...p, designImage: 'Choose an image file (PNG, JPG or WebP).' }));
    if (file.size > MAX_IMAGE_BYTES) return setErrors((p) => ({ ...p, designImage: 'That image is over 5 MB. Choose a smaller one.' }));
    setErrors((p) => ({ ...p, designImage: undefined }));
    setImageFile(file);
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.title.trim()) e.title = 'Enter a title.';
    if (!values.description.trim()) e.description = 'Describe the opportunity.';
    if (!values.requirements.trim()) e.requirements = 'List what volunteers need.';
    if (!values.location.trim()) e.location = 'Enter the location.';
    if (!values.numberOfVolunteers || parseInt(values.numberOfVolunteers, 10) < 1) e.numberOfVolunteers = 'Enter at least 1 volunteer.';
    if (!values.eventDate) e.eventDate = 'Choose the event date.';
    if (!values.deadline) e.deadline = 'Choose the application deadline.';
    else if (values.eventDate && new Date(values.deadline) >= new Date(values.eventDate)) e.deadline = 'The deadline must be before the event date.';
    if (!call && !imageFile) e.designImage = 'Add a design image.';
    return e;
  };

  const submit = async (mode: 'draft' | 'publish' | 'save') => {
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      if (first === 'designImage') fileInput.current?.focus();
      else formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSaving(mode);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v));
      if (mode === 'publish') fd.append('isPublished', 'true');
      if (imageFile) fd.append('designImage', imageFile);

      if (call) {
        await volunteerCallService.update(call._id, fd);
        toast.success('Changes saved');
        router.push(`/admin/volunteer-calls/${call._id}`);
      } else {
        await volunteerCallService.create(fd);
        toast.success(mode === 'publish' ? 'Volunteer call published' : 'Draft saved');
        router.push('/admin/volunteer-calls');
      }
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'We could not save the volunteer call. Try again.');
      setSaving(null);
    }
  };

  const busy = saving !== null;

  return (
    <form ref={formRef} noValidate onSubmit={(e) => { e.preventDefault(); submit(call ? 'save' : 'draft'); }} className="space-y-5 rounded-xl bg-white p-6 md:p-8">
      <div>
        <p className="mb-1.5 text-sm font-medium text-stone-800">Design image</p>
        <input ref={fileInput} id="designImage" type="file" accept="image/*" onChange={onImage} className="sr-only" aria-describedby={errors.designImage ? 'image-error' : undefined} />
        {preview ? (
          <div className="relative aspect-2/1 overflow-hidden rounded-xl bg-stone-200">
            <Image src={preview} alt="Design preview" fill unoptimized={!!imageFile} sizes="720px" className="object-cover" />
            <label htmlFor="designImage" className="absolute bottom-3 right-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-white px-4 font-semibold text-stone-800 shadow-raised focus-within:outline-2">
              <Upload size={16} aria-hidden="true" /> Replace image
            </label>
            {imageFile && !call && (
              <button type="button" aria-label="Remove image" onClick={() => { setImageFile(null); setPreview(null); if (fileInput.current) fileInput.current.value = ''; }}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-800 shadow-raised">
                <X size={18} />
              </button>
            )}
          </div>
        ) : (
          <label htmlFor="designImage" className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center hover:border-brand-700 ${errors.designImage ? 'border-red-600' : 'border-stone-300'}`}>
            <Upload className="text-brand-700" size={26} aria-hidden="true" />
            <span className="font-medium text-stone-800">Choose a design image</span>
            <span className="text-sm text-stone-600">PNG, JPG or WebP, up to 5 MB</span>
          </label>
        )}
        {errors.designImage && <p id="image-error" role="alert" className="mt-1.5 text-sm text-red-700">{errors.designImage}</p>}
      </div>

      <TextField id="title" name="title" label="Title" placeholder="Volunteers needed for the farm harvest" value={values.title} onChange={set('title')} error={errors.title} />
      <TextAreaField id="description" name="description" label="Description" rows={4} value={values.description} onChange={set('description')} error={errors.description}
        hint="What volunteers will do and why their help matters." />
      <TextAreaField id="requirements" name="requirements" label="Requirements" rows={4} value={values.requirements} onChange={set('requirements')} error={errors.requirements}
        hint="Skills, age limits or anything volunteers should bring." />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="location" name="location" label="Location" value={values.location} onChange={set('location')} error={errors.location} />
        <SelectField id="category" name="category" label="Category" value={values.category} onChange={set('category')}>
          {CALL_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </SelectField>
        <TextField id="numberOfVolunteers" name="numberOfVolunteers" type="number" inputMode="numeric" min={1} label="Volunteers needed" value={values.numberOfVolunteers} onChange={set('numberOfVolunteers')} error={errors.numberOfVolunteers} />
        <TextField id="eventDate" name="eventDate" type="date" label="Event date" value={values.eventDate} onChange={set('eventDate')} error={errors.eventDate} />
      </div>
      <TextField id="deadline" name="deadline" type="date" label="Application deadline" value={values.deadline} onChange={set('deadline')} error={errors.deadline}
        hint="Applications close after this date." />

      <div className="flex flex-wrap gap-3 pt-2">
        {call ? (
          <Button type="submit" loading={saving === 'save'} disabled={busy}>Save changes</Button>
        ) : (
          <>
            <Button type="button" loading={saving === 'publish'} disabled={busy} onClick={() => submit('publish')}>Create and publish</Button>
            <Button type="submit" variant="secondary" loading={saving === 'draft'} disabled={busy}>Save as draft</Button>
          </>
        )}
        <Button variant="secondary" href={call ? `/admin/volunteer-calls/${call._id}` : '/admin/volunteer-calls'}>Cancel</Button>
      </div>
    </form>
  );
}
