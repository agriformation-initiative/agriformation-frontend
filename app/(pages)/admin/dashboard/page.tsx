'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, UserCheck, Clock, FileText } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { DashboardStats, VolunteerApplication } from '@/types/indexes';
import { formatDate } from '@/lib/format';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { PageHeader, StatTile, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await adminService.getDashboardStats();
      setStats(res.data.stats);
      setRecent(res.data.recentApplications);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <DashboardSkeleton />;
  if (failed) return <ErrorState message="We could not load the dashboard." onRetry={load} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dashboard"
        description="A summary of volunteers and applications."
        action={<Button href="/admin/applications">Review applications</Button>}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Users} label="Total volunteers" value={stats?.totalVolunteers ?? 0} href="/admin/volunteers" />
        <StatTile icon={UserCheck} label="Approved volunteers" value={stats?.activeVolunteers ?? 0} href="/admin/volunteers" />
        <StatTile icon={FileText} label="Awaiting review" value={stats?.pendingApplications ?? 0} href="/admin/applications" />
        <StatTile icon={Clock} label="Hours contributed" value={`${stats?.totalHoursContributed ?? 0}h`} />
      </div>

      <section className="mt-8 overflow-hidden rounded-xl bg-white" aria-labelledby="recent-heading">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 id="recent-heading" className="font-sans text-lg font-semibold">Recent applications</h2>
          <Link href="/admin/applications" className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 hover:underline">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState icon={FileText} title="No applications yet" description="New volunteer applications will appear here." />
        ) : (
          <ul className="divide-y divide-stone-200">
            {recent.map((app) => (
              <li key={app._id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-stone-900">{app.fullName}</p>
                  <p className="truncate text-sm text-stone-600">{app.email}</p>
                  <p className="mt-1 text-sm text-stone-600">{app.preferredRole} · {formatDate(app.createdAt, 'short')}</p>
                </div>
                <StatusBadge status={app.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/admin/volunteer-calls/create" variant="secondary">New volunteer call</Button>
        <Button href="/admin/volunteers" variant="secondary">View volunteers</Button>
      </div>
    </div>
  );
}
