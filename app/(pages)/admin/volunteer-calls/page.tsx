'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Eye, Users, Calendar, MapPin, Megaphone } from 'lucide-react';
import { volunteerCallService, AdminVolunteerCall, CALL_CATEGORIES } from '@/services/volunteerCallService';
import { formatDate, titleCase } from '@/lib/format';
import Button from '@/components/ui/Button';
import { SelectField } from '@/components/ui/Field';
import { PageHeader, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-700',
  open: 'bg-brand-100 text-brand-900',
  closed: 'bg-red-50 text-red-800',
  cancelled: 'bg-stone-200 text-stone-700',
};

function CallStatus({ call }: { call: AdminVolunteerCall }) {
  const expired = call.status === 'open' && new Date() > new Date(call.deadline);
  const status = expired ? 'closed' : call.status;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
      {titleCase(status)}{expired ? ' (deadline passed)' : ''}
    </span>
  );
}

export default function VolunteerCallsPage() {
  const [calls, setCalls] = useState<AdminVolunteerCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setCalls(await volunteerCallService.list({
        status: status === 'all' ? undefined : status,
        category: category === 'all' ? undefined : category,
      }));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [status, category]);

  useEffect(() => { load(); }, [load]);

  const q = query.trim().toLowerCase();
  const shown = q ? calls.filter((c) => c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)) : calls;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Volunteer calls"
        description="Opportunities volunteers can apply to."
        action={<Button href="/admin/volunteer-calls/create"><Plus size={18} aria-hidden="true" /> Create call</Button>}
      />

      <div className="grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-3">
        <div>
          <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-stone-800">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={18} aria-hidden="true" />
            <input id="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Title or location"
              className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-4 placeholder:text-stone-500 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/25" />
          </div>
        </div>
        <SelectField id="status" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </SelectField>
        <SelectField id="category" label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          {CALL_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </SelectField>
      </div>

      <div className="mt-6">
        {failed ? (
          <ErrorState message="We could not load the volunteer calls." onRetry={load} />
        ) : shown.length === 0 ? (
          <div className="rounded-xl bg-white">
            <EmptyState icon={Megaphone} title="No volunteer calls found"
              description={q ? 'Try a different search or filter.' : 'Create a call to let volunteers apply to an event or program.'}
              action={!q && <Button href="/admin/volunteer-calls/create">Create call</Button>} />
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((call) => (
              <li key={call._id}>
                <Link href={`/admin/volunteer-calls/${call._id}`} className="group flex h-full flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-raised">
                  <div className="relative aspect-3/2 bg-stone-200">
                    <Image src={call.designImage.url} alt="" fill sizes="(min-width: 1024px) 360px, 50vw" className="object-cover" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <CallStatus call={call} />
                      {!call.isPublished && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">Not published</span>}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="line-clamp-2 font-sans text-lg font-semibold group-hover:text-brand-800">{call.title}</h2>
                    <ul className="mt-3 space-y-1.5 text-sm text-stone-600">
                      <li className="flex items-center gap-2"><Calendar size={15} aria-hidden="true" />{formatDate(call.eventDate, 'short')}</li>
                      <li className="flex items-center gap-2"><MapPin size={15} aria-hidden="true" /><span className="line-clamp-1">{call.location}</span></li>
                      <li className="flex items-center gap-2"><Users size={15} aria-hidden="true" />{call.numberOfVolunteers} volunteers needed</li>
                    </ul>
                    <p className="mt-auto flex gap-4 pt-4 text-sm text-stone-600">
                      <span>{call.applications?.length ?? 0} applicants</span>
                      <span className="flex items-center gap-1"><Eye size={14} aria-hidden="true" />{call.viewCount}</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
