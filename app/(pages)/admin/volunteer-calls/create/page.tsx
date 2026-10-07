import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CallForm from '../CallForm';

export default function CreateVolunteerCallPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/volunteer-calls" className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
        <ArrowLeft size={18} aria-hidden="true" /> All volunteer calls
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Create volunteer call</h1>
      <p className="mb-8 mt-1 text-stone-600">Add a poster and the details volunteers need to decide whether to apply.</p>
      <CallForm />
    </div>
  );
}
