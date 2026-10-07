'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { TextField, TextAreaField, SelectField } from '@/components/ui/Field';
import { ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';
import { adminService } from '@/services/adminService';
import { formatDate } from '@/lib/format';
import { Volunteer } from '@/types/indexes';

const errorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

export default function VolunteerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [modal, setModal] = useState<'status' | 'assign' | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await adminService.getVolunteerDetails(id);
      setVolunteer(res.data.volunteer);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading && !volunteer) return <DashboardSkeleton />;
  if (failed || !volunteer) return <ErrorState message="We could not load this volunteer." onRetry={load} />;

  const user = typeof volunteer.user === 'object' ? volunteer.user : null;
  const done = () => { setModal(null); load(); };

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/volunteers" className="inline-flex min-h-11 items-center gap-2 font-medium text-stone-700 hover:text-brand-800">
        <ArrowLeft size={18} aria-hidden="true" /> All volunteers
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{user?.fullName ?? 'Volunteer'}</h1>
          <p className="mt-1 text-stone-600">{user?.email}</p>
          {user?.phoneNumber && <p className="text-stone-600">{user.phoneNumber}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setModal('status')}>Update status</Button>
          <Button onClick={() => setModal('assign')}>Assign to program</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl bg-white p-6" aria-labelledby="info">
          <h2 id="info" className="font-sans text-lg font-semibold">Volunteer information</h2>
          <dl className="mt-4 divide-y divide-stone-200">
            <Row label="Preferred role" value={volunteer.preferredRole} />
            <Row label="Status" value={<StatusBadge status={volunteer.status} />} />
            <Row label="Availability" value={volunteer.availability || 'Not given'} />
            <Row label="Location" value={volunteer.location ? `${volunteer.location.state}, ${volunteer.location.lga}` : 'Not given'} />
            <Row label="Hours contributed" value={<span className="tabular-nums">{volunteer.hoursContributed}</span>} />
          </dl>
        </section>
        <section className="rounded-xl bg-white p-6" aria-labelledby="about">
          <h2 id="about" className="font-sans text-lg font-semibold">About</h2>
          <p className="mt-4 whitespace-pre-wrap text-stone-700">{volunteer.aboutYourself}</p>
        </section>
      </div>

      {volunteer.assignedPrograms && volunteer.assignedPrograms.length > 0 && (
        <section className="mt-6 rounded-xl bg-white p-6" aria-labelledby="programs">
          <h2 id="programs" className="font-sans text-lg font-semibold">Assigned programs</h2>
          <ul className="mt-4 divide-y divide-stone-200">
            {volunteer.assignedPrograms.map((p, i) => (
              <li key={p.id ?? i} className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium text-stone-900">{p.programName}</p>
                  <p className="text-sm text-stone-600">{p.role}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {formatDate(p.startDate, 'short')}{p.endDate ? ` to ${formatDate(p.endDate, 'short')}` : ''}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {volunteer.reviewNotes && (
        <section className="mt-6 rounded-xl bg-white p-6" aria-labelledby="notes">
          <h2 id="notes" className="font-sans text-lg font-semibold">Review notes</h2>
          <p className="mt-4 whitespace-pre-wrap text-stone-700">{volunteer.reviewNotes}</p>
        </section>
      )}

      {modal === 'status' && <StatusModal volunteer={volunteer} onClose={() => setModal(null)} onSuccess={done} />}
      {modal === 'assign' && <AssignModal volunteer={volunteer} onClose={() => setModal(null)} onSuccess={done} />}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <dt className="text-stone-600">{label}</dt>
      <dd className="text-right font-medium text-stone-900">{value}</dd>
    </div>
  );
}

type VolunteerStatus = 'pending' | 'approved' | 'on-hold' | 'rejected';

function StatusModal({ volunteer, onClose, onSuccess }: { volunteer: Volunteer; onClose: () => void; onSuccess: () => void }) {
  const [status, setStatus] = useState<VolunteerStatus>(volunteer.status as VolunteerStatus);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.updateVolunteerStatus(volunteer._id, { status, notes });
      toast.success('Status updated');
      onSuccess();
    } catch (err) {
      toast.error(errorMessage(err, 'We could not update the status. Try again.'));
      setLoading(false);
    }
  };

  return (
    <Modal
      size="sm"
      title="Update status"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="status-form" loading={loading}>Save status</Button>
        </>
      }
    >
      <form id="status-form" onSubmit={submit} className="space-y-4">
        <SelectField id="status" label="Status" value={status} onChange={(e) => setStatus(e.target.value as VolunteerStatus)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="on-hold">On hold</option>
          <option value="rejected">Rejected</option>
        </SelectField>
        <TextAreaField id="notes" label="Notes" optional rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </form>
    </Modal>
  );
}

function AssignModal({ volunteer, onClose, onSuccess }: { volunteer: Volunteer; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ programName: '', role: '', startDate: '', endDate: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.assignToProgram(volunteer._id, form);
      toast.success('Volunteer assigned to program');
      onSuccess();
    } catch (err) {
      toast.error(errorMessage(err, 'We could not assign the volunteer. Try again.'));
      setLoading(false);
    }
  };

  return (
    <Modal
      size="sm"
      title="Assign to program"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="assign-form" loading={loading}>Assign volunteer</Button>
        </>
      }
    >
      <form id="assign-form" onSubmit={submit} className="space-y-4">
        <TextField id="programName" label="Program name" required value={form.programName} onChange={set('programName')} />
        <TextField id="role" label="Role" required value={form.role} onChange={set('role')} />
        <TextField id="startDate" type="date" label="Start date" required value={form.startDate} onChange={set('startDate')} />
        <TextField id="endDate" type="date" label="End date" optional value={form.endDate} onChange={set('endDate')} />
      </form>
    </Modal>
  );
}
