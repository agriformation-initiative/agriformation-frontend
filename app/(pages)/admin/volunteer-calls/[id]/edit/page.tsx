'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { volunteerCallService, AdminVolunteerCall } from '@/services/volunteerCallService';
import { ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';
import CallForm from '../../CallForm';

export default function EditVolunteerCallPage() {
  const { id } = useParams<{ id: string }>();
  const [call, setCall] = useState<AdminVolunteerCall | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setCall(await volunteerCallService.get(id));
    } catch {
      setFailed(true);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (failed) return <ErrorState message="We could not load this volunteer call." onRetry={load} />;
  if (!call) return <DashboardSkeleton />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/admin/volunteer-calls/${id}`} className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
        <ArrowLeft size={18} aria-hidden="true" /> Back to call
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Edit volunteer call</h1>
      <p className="mb-8 mt-1 text-stone-600">Changes show on the public page straight away if the call is published.</p>
      <CallForm call={call} />
    </div>
  );
}
