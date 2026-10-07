'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, MapPin, Users, Eye, Pencil, Trash2, Globe, EyeOff, Clock } from 'lucide-react';
import { volunteerCallService, AdminVolunteerCall } from '@/services/volunteerCallService';
import { formatDate, titleCase } from '@/lib/format';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/Field';
import { StatTile, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const errorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

export default function VolunteerCallDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [call, setCall] = useState<AdminVolunteerCall | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'details' | 'applications'>('details');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setCall(await volunteerCallService.get(id));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const act = async (action: () => Promise<AdminVolunteerCall | void>, success: string, failure: string) => {
    setBusy(true);
    try {
      const updated = await action();
      if (updated) setCall(updated);
      toast.success(success);
      return true;
    } catch (err) {
      toast.error(errorMessage(err, failure));
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (failed || !call) return <ErrorState message="We could not load this volunteer call." onRetry={load} />;

  const count = (s: string) => call.applications.filter((a) => a.status === s).length;

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/volunteer-calls" className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
        <ArrowLeft size={18} aria-hidden="true" /> All volunteer calls
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">{call.title}</h1>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <Button
          variant={call.isPublished ? 'secondary' : 'primary'}
          loading={busy}
          onClick={() => act(() => volunteerCallService.togglePublish(call._id), call.isPublished ? 'Call unpublished' : 'Call published', 'We could not change the publish status. Try again.')}
        >
          {call.isPublished ? <><EyeOff size={16} aria-hidden="true" /> Unpublish</> : <><Globe size={16} aria-hidden="true" /> Publish</>}
        </Button>
        <div className="w-40">
          <SelectField id="call-status" label="Status" value={call.status} disabled={busy}
            onChange={(e) => act(() => volunteerCallService.updateStatus(call._id, e.target.value), 'Status updated', 'We could not update the status. Try again.')}>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </SelectField>
        </div>
        <Button href={`/admin/volunteer-calls/${call._id}/edit`} variant="secondary"><Pencil size={16} aria-hidden="true" /> Edit</Button>
        <Button variant="danger" onClick={() => setConfirmDelete(true)}><Trash2 size={16} aria-hidden="true" /> Delete</Button>
      </div>

      <div role="tablist" aria-label="Volunteer call sections" className="mt-8 flex gap-6 border-b border-stone-200">
        {(['details', 'applications'] as const).map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} id={`tab-${t}`} aria-controls={`panel-${t}`} onClick={() => setTab(t)}
            className={`min-h-11 border-b-2 px-1 font-semibold ${tab === t ? 'border-brand-700 text-brand-800' : 'border-transparent text-stone-600 hover:text-stone-900'}`}>
            {t === 'details' ? 'Details' : `Applications (${call.applications.length})`}
          </button>
        ))}
      </div>

      {tab === 'details' && (
        <div role="tabpanel" id="panel-details" aria-labelledby="tab-details" className="mt-6 space-y-6">
          <div className="relative aspect-2/1 overflow-hidden rounded-xl bg-stone-200">
            <Image src={call.designImage.url} alt={`Poster for ${call.title}`} fill sizes="(min-width: 1152px) 1100px, 100vw" className="object-cover" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile icon={Users} label="Applications" value={call.applications.length} />
            <StatTile icon={Eye} label="Views" value={call.viewCount} />
            <StatTile icon={Users} label="Accepted" value={count('accepted')} />
            <StatTile icon={Clock} label="Pending" value={count('pending')} />
          </div>

          <section className="rounded-xl bg-white p-6">
            <dl className="grid gap-5 sm:grid-cols-2">
              <Fact icon={Calendar} label="Event date" value={formatDate(call.eventDate)} />
              <Fact icon={Calendar} label="Application deadline" value={formatDate(call.deadline)} />
              <Fact icon={MapPin} label="Location" value={call.location} />
              <Fact icon={Users} label="Volunteers needed" value={String(call.numberOfVolunteers)} />
            </dl>
            <h2 className="mt-8 font-sans text-base font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-stone-700">{call.description}</p>
            <h2 className="mt-6 font-sans text-base font-semibold">Requirements</h2>
            <p className="mt-2 whitespace-pre-wrap text-stone-700">{call.requirements}</p>
            <p className="mt-6 text-sm text-stone-600">Category: {titleCase(call.category)}</p>
          </section>
        </div>
      )}

      {tab === 'applications' && (
        <div role="tabpanel" id="panel-applications" aria-labelledby="tab-applications" className="mt-6">
          {call.applications.length === 0 ? (
            <div className="rounded-xl bg-white">
              <EmptyState icon={Users} title="No applications yet" description="Applications appear here once volunteers apply." />
            </div>
          ) : (
            <>
              <p className="mb-4 text-stone-700">
                {count('pending')} pending · {count('accepted')} accepted · {count('rejected')} rejected
              </p>
              <ul className="space-y-4">
                {call.applications.map((app) => (
                  <li key={app._id} className="rounded-xl bg-white p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-sans text-lg font-semibold">{app.fullName}</h3>
                        <p className="text-sm text-stone-600">Applied {formatDate(app.appliedAt, 'short')}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <a href={`mailto:${app.email}`} className="text-brand-700 underline-offset-4 hover:underline">{app.email}</a>
                      <a href={`tel:${app.phoneNumber}`} className="text-brand-700 underline-offset-4 hover:underline">{app.phoneNumber}</a>
                    </p>
                    {app.message && <p className="mt-3 rounded-md bg-stone-50 p-3 text-stone-700">{app.message}</p>}
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-200 pt-4">
                      {app.status !== 'accepted' && (
                        <Button className="!min-h-10 !py-1.5 text-sm" disabled={busy}
                          onClick={() => act(() => volunteerCallService.updateApplicationStatus(call._id, app._id, 'accepted'), 'Application accepted', 'We could not update the application. Try again.')}>
                          Accept<span className="sr-only"> {app.fullName}</span>
                        </Button>
                      )}
                      {app.status !== 'rejected' && (
                        <Button variant="danger" className="!min-h-10 !py-1.5 text-sm" disabled={busy}
                          onClick={() => act(() => volunteerCallService.updateApplicationStatus(call._id, app._id, 'rejected'), 'Application rejected', 'We could not update the application. Try again.')}>
                          Reject<span className="sr-only"> {app.fullName}</span>
                        </Button>
                      )}
                      {app.status !== 'pending' && (
                        <Button variant="secondary" className="!min-h-10 !py-1.5 text-sm" disabled={busy}
                          onClick={() => act(() => volunteerCallService.updateApplicationStatus(call._id, app._id, 'pending'), 'Moved back to pending', 'We could not update the application. Try again.')}>
                          Move to pending<span className="sr-only"> {app.fullName}</span>
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete "${call.title}"?`}
          message={`This removes the call and its ${call.applications.length} ${call.applications.length === 1 ? 'application' : 'applications'} for good. This cannot be undone.`}
          confirmLabel="Delete call"
          loading={busy}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            if (await act(() => volunteerCallService.remove(call._id), 'Volunteer call deleted', 'We could not delete the call. Try again.')) {
              router.push('/admin/volunteer-calls');
            } else {
              setConfirmDelete(false);
            }
          }}
        />
      )}
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={20} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />
      <div>
        <dt className="text-sm text-stone-600">{label}</dt>
        <dd className="font-medium text-stone-900">{value}</dd>
      </div>
    </div>
  );
}
