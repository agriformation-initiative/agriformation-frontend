'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Users } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { User } from '@/types/indexes';
import { formatDate, titleCase } from '@/lib/format';
import Button from '@/components/ui/Button';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { TextField } from '@/components/ui/Field';
import { Table, Th, Td, rowClass } from '@/components/ui/table';
import { PageHeader, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const errorMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toggling, setToggling] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      const res = await adminService.getAllUsers();
      const list = res?.data?.items || res?.data?.users || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmToggle = async () => {
    if (!toggling) return;
    setBusy(true);
    try {
      await adminService.toggleUserStatus(toggling.id);
      toast.success(toggling.isActive ? 'User deactivated' : 'User activated');
      setToggling(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err, 'We could not change that account. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="System users"
        description="Everyone who can sign in to AgroNext."
        action={<Button onClick={() => setCreating(true)}><UserPlus size={18} aria-hidden="true" /> Create admin</Button>}
      />

      {failed ? (
        <ErrorState message="We could not load the users." onRetry={load} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white">
          {users.length === 0 ? (
            <EmptyState icon={Users} title="No users yet" />
          ) : (
            <Table caption="System users">
              <thead>
                <tr>
                  <Th>Name</Th><Th>Role</Th><Th>Status</Th><Th>Created</Th><Th><span className="sr-only">Actions</span></Th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={rowClass}>
                    <Td>
                      <p className="font-medium text-stone-900">{user.fullName}</p>
                      <p className="text-sm text-stone-600">{user.email}</p>
                    </Td>
                    <Td>{titleCase(user.role)}</Td>
                    <Td>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${user.isActive ? 'bg-brand-50 text-brand-800' : 'bg-stone-100 text-stone-700'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap">{formatDate(user.createdAt, 'short')}</Td>
                    <Td className="text-right">
                      {user.role !== 'superadmin' && (
                        <Button variant="secondary" className="!min-h-10 !py-1.5 text-sm" onClick={() => setToggling(user)}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                          <span className="sr-only"> {user.fullName}</span>
                        </Button>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}

      {creating && <CreateAdminModal onClose={() => setCreating(false)} onSuccess={() => { setCreating(false); load(); }} />}

      {toggling && (
        <ConfirmDialog
          title={toggling.isActive ? `Deactivate ${toggling.fullName}?` : `Activate ${toggling.fullName}?`}
          message={
            toggling.isActive
              ? `${toggling.fullName} will no longer be able to sign in. You can activate the account again later.`
              : `${toggling.fullName} will be able to sign in again.`
          }
          confirmLabel={toggling.isActive ? 'Deactivate account' : 'Activate account'}
          loading={busy}
          onConfirm={confirmToggle}
          onCancel={() => setToggling(null)}
        />
      )}
    </div>
  );
}

function CreateAdminModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.createAdmin(form);
      toast.success('Admin account created');
      onSuccess();
    } catch (err) {
      toast.error(errorMessage(err, 'We could not create the account. Try again.'));
      setLoading(false);
    }
  };

  return (
    <Modal
      size="sm"
      title="Create admin"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="admin-form" loading={loading}>Create admin</Button>
        </>
      }
    >
      <form id="admin-form" onSubmit={submit} className="space-y-4">
        <TextField id="fullName" label="Full name" autoComplete="off" required value={form.fullName} onChange={set('fullName')} />
        <TextField id="email" type="email" label="Email address" autoComplete="off" required value={form.email} onChange={set('email')} />
        <TextField id="password" type="password" label="Temporary password" autoComplete="new-password" minLength={6} required
          hint="At least 6 characters." value={form.password} onChange={set('password')} />
        <TextField id="phoneNumber" type="tel" label="Phone number" optional autoComplete="off" value={form.phoneNumber} onChange={set('phoneNumber')} />
      </form>
    </Modal>
  );
}
