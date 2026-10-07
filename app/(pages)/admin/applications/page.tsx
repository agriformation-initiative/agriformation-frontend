'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { VolunteerApplication } from '@/types/indexes';
import { formatDate } from '@/lib/format';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { SelectField, TextAreaField } from '@/components/ui/Field';
import { Table, Th, Td, rowClass } from '@/components/ui/table';
import { PageHeader, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<VolunteerApplication | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await adminService.getApplications(statusFilter ? { status: statusFilter } : {});
      const apps = res?.data?.applications;
      setApplications(Array.isArray(apps) ? (apps as VolunteerApplication[]) : []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const review = async (id: string, status: 'accepted' | 'rejected', notes?: string) => {
    try {
      await adminService.reviewApplication(id, { status, notes });
      toast.success(status === 'accepted' ? 'Application accepted' : 'Application rejected');
      setSelected(null);
      load();
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'We could not save that review. Try again.');
    }
  };

  if (loading && applications.length === 0 && !statusFilter) return <DashboardSkeleton />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Volunteer applications"
        description="Review and respond to incoming applications."
        action={
          <div className="w-48">
            <SelectField id="status-filter" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </SelectField>
          </div>
        }
      />

      {failed ? (
        <ErrorState message="We could not load the applications." onRetry={load} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white" aria-busy={loading}>
          {applications.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={statusFilter ? 'No applications with this status' : 'No applications yet'}
              description="Applications from the volunteer page will appear here."
            />
          ) : (
            <Table caption="Volunteer applications">
              <thead>
                <tr>
                  <Th>Name</Th><Th>Role</Th><Th>Applied</Th><Th>Status</Th><Th><span className="sr-only">Actions</span></Th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className={rowClass}>
                    <Td>
                      <p className="font-medium text-stone-900">{app.fullName}</p>
                      <p className="text-sm text-stone-600">{app.email}</p>
                    </Td>
                    <Td>{app.preferredRole}</Td>
                    <Td className="whitespace-nowrap">{formatDate(app.createdAt, 'short')}</Td>
                    <Td><StatusBadge status={app.status} /></Td>
                    <Td className="text-right">
                      <Button variant="secondary" className="!min-h-10 !py-1.5 text-sm" onClick={() => setSelected(app)}>
                        {app.status === 'pending' ? 'Review' : 'View'}
                        <span className="sr-only"> application from {app.fullName}</span>
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}

      {selected && <ApplicationModal application={selected} onClose={() => setSelected(null)} onReview={review} />}
    </div>
  );
}

function ApplicationModal({
  application,
  onClose,
  onReview,
}: {
  application: VolunteerApplication;
  onClose: () => void;
  onReview: (id: string, status: 'accepted' | 'rejected', notes?: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState<'accepted' | 'rejected' | null>(null);
  const pending = application.status === 'pending';

  const act = async (status: 'accepted' | 'rejected') => {
    setBusy(status);
    await onReview(application._id, status, notes.trim() || undefined);
    setBusy(null);
  };

  return (
    <Modal
      title={application.fullName}
      onClose={onClose}
      footer={
        pending ? (
          <>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="danger" loading={busy === 'rejected'} disabled={!!busy} onClick={() => act('rejected')}>Reject application</Button>
            <Button loading={busy === 'accepted'} disabled={!!busy} onClick={() => act('accepted')}>Accept application</Button>
          </>
        ) : (
          <Button variant="secondary" onClick={onClose}>Close</Button>
        )
      }
    >
      <dl className="space-y-5">
        <div><dt className="text-sm text-stone-600">Email</dt><dd className="font-medium text-stone-900">{application.email}</dd></div>
        <div><dt className="text-sm text-stone-600">Preferred role</dt><dd className="font-medium text-stone-900">{application.preferredRole}</dd></div>
        <div><dt className="text-sm text-stone-600">Status</dt><dd className="mt-1"><StatusBadge status={application.status} /></dd></div>
        <div>
          <dt className="text-sm text-stone-600">About them</dt>
          <dd className="mt-1 whitespace-pre-wrap rounded-md bg-stone-50 p-4 text-stone-800">{application.aboutYourself}</dd>
        </div>
      </dl>
      {pending && (
        <div className="mt-6">
          <TextAreaField id="notes" label="Review notes" optional rows={3} value={notes}
            onChange={(e) => setNotes(e.target.value)} hint="Only admins can see these notes." />
        </div>
      )}
    </Modal>
  );
}
