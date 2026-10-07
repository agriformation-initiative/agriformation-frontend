'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock, ScrollText, Sprout } from 'lucide-react';
import { volunteerService } from '@/services/volunteerService';
import { Volunteer } from '@/types/indexes';
import { formatDate } from '@/lib/format';
import StatusBadge from '@/components/ui/StatusBadge';
import { PageHeader, StatTile, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

export default function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await volunteerService.getProfile();
      setVolunteer(res.data.volunteer);
    } catch (err) {
      // A 404 means the application has not been approved into a volunteer profile yet
      setVolunteer(null);
      setFailed((err as { response?: { status?: number } }).response?.status !== 404);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <DashboardSkeleton />;
  if (failed) return <ErrorState message="We could not load your dashboard." onRetry={load} />;
  if (!volunteer) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl bg-white">
        <EmptyState
          icon={Sprout}
          title="Your volunteer profile is not ready yet"
          description="It appears here once your application has been approved."
        />
      </div>
    );
  }

  const activePrograms = volunteer.assignedPrograms?.filter((p) => p.status === 'active').length ?? 0;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={`Welcome back${volunteer.firstName ? `, ${volunteer.firstName}` : ''}`}
        description="Here is a summary of your volunteering."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatTile icon={Clock} label="Hours contributed" value={volunteer.hoursContributed} />
        <StatTile icon={Sprout} label="Active programs" value={activePrograms} />
        <StatTile icon={ScrollText} label="Certificates earned" value={volunteer.certificatesIssued?.length ?? 0} />
      </div>

      <section className="mt-8 rounded-xl bg-white p-6" aria-labelledby="status-heading">
        <h2 id="status-heading" className="font-sans text-lg font-semibold">Profile status</h2>
        <dl className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-stone-600">Application status</dt>
            <dd className="mt-1"><StatusBadge status={volunteer.status} /></dd>
          </div>
          <div>
            <dt className="text-sm text-stone-600">Preferred role</dt>
            <dd className="mt-1 font-medium capitalize text-stone-900">{volunteer.preferredRole.replace(/-/g, ' ')}</dd>
          </div>
        </dl>
      </section>

      {volunteer.assignedPrograms && volunteer.assignedPrograms.length > 0 && (
        <section className="mt-8 rounded-xl bg-white p-6" aria-labelledby="programs-heading">
          <h2 id="programs-heading" className="font-sans text-lg font-semibold">Your programs</h2>
          <ul className="mt-4 divide-y divide-stone-200">
            {volunteer.assignedPrograms.map((program) => (
              <li key={program.id} className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium text-stone-900">{program.programName}</p>
                  <p className="text-sm text-stone-600">Role: {program.role}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {formatDate(program.startDate, 'short')}
                    {program.endDate ? ` to ${formatDate(program.endDate, 'short')}` : ''}
                  </p>
                </div>
                <StatusBadge status={program.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
