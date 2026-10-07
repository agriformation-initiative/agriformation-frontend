'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { Volunteer } from '@/types/indexes';
import StatusBadge from '@/components/ui/StatusBadge';
import { SelectField } from '@/components/ui/Field';
import { Table, Th, Td, rowClass } from '@/components/ui/table';
import { PageHeader, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await adminService.getAllVolunteers(statusFilter ? { status: statusFilter } : {});
      const data = res.data as unknown as { items?: Volunteer[]; volunteers?: Volunteer[] };
      setVolunteers(data.items ?? data.volunteers ?? []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  if (loading && volunteers.length === 0 && !statusFilter) return <DashboardSkeleton />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Volunteers"
        description="Manage volunteer profiles."
        action={
          <div className="w-48">
            <SelectField id="status-filter" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="on-hold">On hold</option>
              <option value="rejected">Rejected</option>
            </SelectField>
          </div>
        }
      />

      {failed ? (
        <ErrorState message="We could not load the volunteers." onRetry={load} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white" aria-busy={loading}>
          {volunteers.length === 0 ? (
            <EmptyState icon={Users} title="No volunteers found" description="Accepted applications become volunteers." />
          ) : (
            <Table caption="Volunteers">
              <thead>
                <tr>
                  <Th>Name</Th><Th>Role</Th><Th>Hours</Th><Th>Status</Th><Th><span className="sr-only">Actions</span></Th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => {
                  const user = typeof v.user === 'object' ? v.user : null;
                  return (
                    <tr key={v._id} className={rowClass}>
                      <Td>
                        <p className="font-medium text-stone-900">{user?.fullName || 'Unknown'}</p>
                        <p className="text-sm text-stone-600">{user?.email}</p>
                      </Td>
                      <Td>{v.preferredRole}</Td>
                      <Td className="tabular-nums">{v.hoursContributed}</Td>
                      <Td><StatusBadge status={v.status} /></Td>
                      <Td className="text-right">
                        <Link href={`/admin/volunteers/${v._id}`} className="inline-flex min-h-11 items-center font-semibold text-brand-700 hover:underline">
                          View<span className="sr-only"> {user?.fullName}</span>
                        </Link>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}
